"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { EtapaBancada, OrdemComDentista, StatusOS } from "@/types/database";
import { INFO_STATUS, NOME_BANCADA, NOME_STATUS, NOME_TIPO, STATUS_OS, formatarNumeroOS, indiceStatus, normalizar } from "@/lib/os/constantes";
import { moverBancada, moverOrdem } from "@/lib/os/acoes";
import { diasAte, quando } from "@/lib/datas";
import { CartaoOS } from "./cartao-os";
import { LegendaEtapas, SeloEtapa } from "./etapas";

type Props = { ordensIniciais: OrdemComDentista[]; demo: boolean };

const textoBusca = (o: OrdemComDentista) =>
  normalizar([formatarNumeroOS(o.numero), String(o.numero), o.paciente_nome, o.dentista?.nome, o.dentista?.clinica, NOME_TIPO[o.tipo_trabalho]].join(" "));

/** Quadro de produção por cores + busca rápida "onde está o trabalho?". */
export function QuadroKanban({ ordensIniciais, demo }: Props) {
  const [ordens, setOrdens] = useState(ordensIniciais);
  // Quando o servidor manda dados novos (após salvar), atualiza o quadro.
  const [ordensDoServidor, setOrdensDoServidor] = useState(ordensIniciais);
  if (ordensDoServidor !== ordensIniciais) {
    setOrdensDoServidor(ordensIniciais);
    setOrdens(ordensIniciais);
  }
  const [busca, setBusca] = useState("");
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<StatusOS | null>(null);
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(null);
  const [, iniciarTransicao] = useTransition();

  const termo = normalizar(busca.trim());
  const filtradas = useMemo(() => (termo ? ordens.filter((o) => textoBusca(o).includes(termo)) : ordens), [ordens, termo]);

  const abertas = ordens.filter((o) => o.status !== "entregue");
  const naBancada = (o: OrdemComDentista) => o.status === "recebido" || o.status === "em_andamento";
  const atrasadas = abertas.filter((o) => naBancada(o) && o.data_prevista && diasAte(o.data_prevista) < 0).length;
  const urgentes = abertas.filter((o) => naBancada(o) && o.prioridade === "urgente").length;

  function marcarOcupado(id: string, sim: boolean) {
    setOcupados((atual) => {
      const novo = new Set(atual);
      if (sim) novo.add(id);
      else novo.delete(id);
      return novo;
    });
  }

  function mover(id: string, novoStatus: StatusOS) {
    const ordem = ordens.find((o) => o.id === id);
    if (!ordem || ordem.status === novoStatus) return;
    const antes = ordem;
    const agora = new Date().toISOString();

    // Atualiza na tela na hora; se o banco recusar, desfaz.
    setOrdens((lista) =>
      lista.map((o) =>
        o.id === id
          ? {
              ...o,
              status: novoStatus,
              status_desde: agora,
              etapa_bancada: novoStatus === "em_andamento" ? (o.etapa_bancada ?? "modelagem") : null,
              data_entrega: novoStatus === "entregue" ? agora : null,
            }
          : o,
      ),
    );
    marcarOcupado(id, true);
    iniciarTransicao(async () => {
      const r = await moverOrdem(id, novoStatus);
      marcarOcupado(id, false);
      if (!r.ok) {
        setOrdens((lista) => lista.map((o) => (o.id === id ? antes : o)));
        setMensagem({ tipo: "erro", texto: r.erro });
      } else {
        const aviso = indiceStatus(novoStatus) > indiceStatus(antes.status) ? " O dentista já vê isso no portal." : "";
        setMensagem({ tipo: "ok", texto: `${formatarNumeroOS(ordem.numero)} agora está em “${NOME_STATUS[novoStatus]}”.${aviso}` });
      }
    });
  }

  function mudarBancada(id: string, etapa: EtapaBancada) {
    const ordem = ordens.find((o) => o.id === id);
    if (!ordem) return;
    const antes = ordem.etapa_bancada;
    setOrdens((lista) => lista.map((o) => (o.id === id ? { ...o, etapa_bancada: etapa } : o)));
    marcarOcupado(id, true);
    iniciarTransicao(async () => {
      const r = await moverBancada(id, etapa);
      marcarOcupado(id, false);
      if (!r.ok) {
        setOrdens((lista) => lista.map((o) => (o.id === id ? { ...o, etapa_bancada: antes } : o)));
        setMensagem({ tipo: "erro", texto: r.erro });
      } else {
        setMensagem({ tipo: "ok", texto: `${formatarNumeroOS(ordem.numero)} passou para ${NOME_BANCADA[etapa]}.` });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl border border-prata-200 bg-white p-4">
        <label htmlFor="busca" className="block font-serif text-2xl">
          Onde está o trabalho?
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o paciente, o dentista ou o nº da OS"
            className="campo sm:max-w-md"
            autoComplete="off"
          />
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white px-3 py-1 text-grafite-700 shadow-sm">{abertas.length} no laboratório</span>
            {urgentes > 0 && <span className="rounded-full bg-red-50 px-3 py-1 text-red-800">{urgentes} urgente{urgentes > 1 ? "s" : ""}</span>}
            {atrasadas > 0 && <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-900">{atrasadas} atrasada{atrasadas > 1 ? "s" : ""}</span>}
          </div>
        </div>

        {termo &&
          (filtradas.length === 0 ? (
            <p className="rounded-xl border border-dashed border-prata-300 p-4 text-sm text-grafite-600">
              Nenhum trabalho encontrado para “{busca}”. Confira o nome do paciente ou do dentista.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-prata-200">
              <p className="border-b border-prata-100 px-4 py-2 text-xs font-medium tracking-wide text-prata-500 uppercase">
                {filtradas.length} encontrado{filtradas.length > 1 ? "s" : ""}
              </p>
              <ul className="divide-y divide-prata-100">
                {filtradas.map((o) => (
                  <li key={o.id}>
                    <Link href={`/painel/os/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-prata-50">
                      <span className="font-mono text-xs font-semibold text-grafite-600">{formatarNumeroOS(o.numero)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="font-medium">{o.paciente_nome}</span>{" "}
                        <span className="text-sm text-grafite-600">
                          · {NOME_TIPO[o.tipo_trabalho]} · {o.dentista?.nome}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <SeloEtapa status={o.status} grande />
                        <span className="text-xs text-prata-500">{quando(o.status_desde)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        <LegendaEtapas />
      </div>

      {mensagem && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${mensagem.tipo === "erro" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
          {mensagem.texto}
          {demo && mensagem.tipo === "ok" && " (demonstração: não foi salvo)"}
        </p>
      )}

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
        {STATUS_OS.map((coluna) => {
          const itens = filtradas.filter((o) => o.status === coluna.codigo);
          const destacada = colunaAlvo === coluna.codigo && arrastando;
          const info = INFO_STATUS[coluna.codigo];
          return (
            <section
              key={coluna.codigo}
              aria-label={coluna.nome}
              onDragOver={(e) => {
                e.preventDefault();
                setColunaAlvo(coluna.codigo);
              }}
              onDragLeave={() => setColunaAlvo((c) => (c === coluna.codigo ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain") || arrastando;
                if (id) mover(id, coluna.codigo);
                setArrastando(null);
                setColunaAlvo(null);
              }}
              className="flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl sm:w-72"
              style={{ background: info.fundo, boxShadow: destacada ? `0 0 0 2px ${info.cor}` : undefined }}
            >
              <header className="flex items-center justify-between gap-2 rounded-t-2xl px-3 py-2.5" style={{ background: info.cor }} title={info.dica}>
                <h2 className="text-sm font-semibold text-white">
                  {coluna.nome}
                  {coluna.codigo === "entregue" && <span className="font-normal opacity-80"> · últimos 7 dias</span>}
                </h2>
                <span className="rounded-full bg-white/90 px-2 text-xs font-semibold" style={{ color: info.texto }}>
                  {itens.length}
                </span>
              </header>
              <div className="flex min-h-32 flex-1 flex-col gap-2 p-2">
                {itens.map((o) => (
                  <CartaoOS key={o.id} ordem={o} ocupado={ocupados.has(o.id)} aoMover={mover} aoMoverBancada={mudarBancada} aoArrastar={setArrastando} />
                ))}
                {itens.length === 0 && (
                  <p className="rounded-xl border border-dashed p-4 text-center text-xs" style={{ borderColor: `${info.cor}55`, color: info.texto }}>
                    Nenhum trabalho aqui
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
