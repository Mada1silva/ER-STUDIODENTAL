"use client";

import { useMemo, useState, useTransition } from "react";
import type { OrdemComDentista, StatusOS } from "@/types/database";
import { NOME_STATUS, NOME_TIPO, STATUS_OS, formatarNumeroOS } from "@/lib/os/constantes";
import { marcarEntregue, moverOrdem } from "@/lib/os/acoes";
import { diasAte } from "@/lib/datas";
import { CartaoOS } from "./cartao-os";

type Props = { ordensIniciais: OrdemComDentista[]; demo: boolean };

function normalizar(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Quadro Kanban de produção: arraste os cartões ou use os botões para avançar as etapas. */
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

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return ordens;
    return ordens.filter((o) =>
      normalizar(
        [formatarNumeroOS(o.numero), o.paciente_nome, o.dentista?.nome, o.dentista?.clinica, NOME_TIPO[o.tipo_trabalho]].join(" "),
      ).includes(termo),
    );
  }, [ordens, busca]);

  const atrasadas = ordens.filter((o) => o.status !== "pronto" && o.data_prevista && diasAte(o.data_prevista) < 0).length;
  const urgentes = ordens.filter((o) => o.prioridade === "urgente" && o.status !== "pronto").length;

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
    const statusAntigo = ordem.status;

    // Atualiza na tela na hora; se o banco recusar, desfaz.
    setOrdens((lista) => lista.map((o) => (o.id === id ? { ...o, status: novoStatus } : o)));
    marcarOcupado(id, true);
    iniciarTransicao(async () => {
      const r = await moverOrdem(id, novoStatus);
      marcarOcupado(id, false);
      if (!r.ok) {
        setOrdens((lista) => lista.map((o) => (o.id === id ? { ...o, status: statusAntigo } : o)));
        setMensagem({ tipo: "erro", texto: r.erro });
      } else {
        setMensagem({ tipo: "ok", texto: `${formatarNumeroOS(ordem.numero)} movida para ${NOME_STATUS[novoStatus]}.` });
      }
    });
  }

  function entregar(id: string) {
    const ordem = ordens.find((o) => o.id === id);
    if (!ordem) return;
    setOrdens((lista) => lista.filter((o) => o.id !== id));
    iniciarTransicao(async () => {
      const r = await marcarEntregue(id);
      if (!r.ok) {
        setOrdens((lista) => [...lista, ordem]);
        setMensagem({ tipo: "erro", texto: r.erro });
      } else {
        setMensagem({ tipo: "ok", texto: `${formatarNumeroOS(ordem.numero)} entregue ao dentista.` });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por paciente, dentista, nº da OS…"
          className="campo sm:max-w-sm"
          aria-label="Buscar ordens de serviço"
        />
        <div className="flex gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 text-grafite-700 shadow-sm">{ordens.length} em produção</span>
          {urgentes > 0 && <span className="rounded-full bg-red-50 px-3 py-1 text-red-800">{urgentes} urgente{urgentes > 1 ? "s" : ""}</span>}
          {atrasadas > 0 && <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-900">{atrasadas} atrasada{atrasadas > 1 ? "s" : ""}</span>}
        </div>
      </div>

      {mensagem && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${mensagem.tipo === "erro" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}
        >
          {mensagem.texto}
          {demo && mensagem.tipo === "ok" && " (demonstração: não foi salvo)"}
        </p>
      )}

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
        {STATUS_OS.map((coluna) => {
          const itens = filtradas.filter((o) => o.status === coluna.codigo);
          const destacada = colunaAlvo === coluna.codigo && arrastando;
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
              className={`flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border bg-prata-100/70 sm:w-72 ${
                destacada ? "border-grafite-600 ring-2 ring-grafite-600/20" : "border-transparent"
              }`}
            >
              <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2" title={coluna.dica}>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-grafite-800">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: coluna.cor }} />
                  {coluna.nome}
                </h2>
                <span className="rounded-full bg-white px-2 text-xs font-medium text-grafite-600">{itens.length}</span>
              </header>
              <div className="flex min-h-32 flex-1 flex-col gap-2 p-2 pt-0">
                {itens.map((o) => (
                  <CartaoOS
                    key={o.id}
                    ordem={o}
                    ocupado={ocupados.has(o.id)}
                    aoMover={mover}
                    aoEntregar={entregar}
                    aoArrastar={setArrastando}
                  />
                ))}
                {itens.length === 0 && (
                  <p className="rounded-xl border border-dashed border-prata-300 p-4 text-center text-xs text-prata-500">
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
