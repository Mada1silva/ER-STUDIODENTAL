"use client";

import Link from "next/link";
import type { EtapaBancada, OrdemComDentista, StatusOS } from "@/types/database";
import { ACAO_PROXIMA, INFO_STATUS, NOME_BANCADA, NOME_STATUS, NOME_TIPO, formatarNumeroOS, proximaBancada, proximoStatus, statusAnterior } from "@/lib/os/constantes";
import { diasAte, formatarData, quando } from "@/lib/datas";
import { CURTO_ITEM, conferenciaPendente, itensFaltando } from "@/lib/os/itens";

/** Avisos do cartão: material que faltou, conferência pendente, foto da saída. */
function SelosExtras({ ordem }: { ordem: OrdemComDentista }) {
  const faltou = itensFaltando(ordem.itens);
  const pronto = ordem.status === "finalizado" || ordem.status === "saindo_entrega";
  return (
    <>
      {faltou.length > 0 ? (
        <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-800">Faltou: {faltou.map((c) => CURTO_ITEM[c]).join(", ")}</span>
      ) : (
        ordem.status === "recebido" &&
        conferenciaPendente(ordem.itens) && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">
            Conferir {ordem.itens.length} ite{ordem.itens.length > 1 ? "ns" : "m"}
          </span>
        )
      )}
      {pronto &&
        (ordem.foto_saida_url ? (
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800">Com foto</span>
        ) : (
          <span className="rounded bg-prata-100 px-1.5 py-0.5 text-grafite-600">Sem foto da saída</span>
        ))}
    </>
  );
}

export function SeloPrazo({ ordem }: { ordem: Pick<OrdemComDentista, "data_prevista" | "status"> }) {
  if (!ordem.data_prevista || !["recebido", "em_andamento"].includes(ordem.status)) return null;
  const dias = diasAte(ordem.data_prevista);
  const [texto, estilo] =
    dias < 0
      ? [`Atrasado ${-dias} dia${dias === -1 ? "" : "s"}`, "bg-red-100 text-red-800"]
      : dias === 0
        ? ["Entrega hoje", "bg-amber-100 text-amber-900"]
        : dias === 1
          ? ["Entrega amanhã", "bg-amber-50 text-amber-800"]
          : [`Prazo ${formatarData(ordem.data_prevista)}`, "bg-prata-100 text-grafite-600"];
  return <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${estilo}`}>{texto}</span>;
}

type Props = {
  ordem: OrdemComDentista;
  ocupado: boolean;
  aoMover: (id: string, status: StatusOS) => void;
  aoMoverBancada: (id: string, etapa: EtapaBancada) => void;
  aoArrastar: (id: string) => void;
};

export function CartaoOS({ ordem, ocupado, aoMover, aoMoverBancada, aoArrastar }: Props) {
  const s = INFO_STATUS[ordem.status];
  const anterior = statusAnterior(ordem.status);
  const proximo = proximoStatus(ordem.status);
  const bancada = ordem.status === "em_andamento" ? proximaBancada(ordem.etapa_bancada) : null;
  const urgente = ordem.prioridade === "urgente";

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", ordem.id);
        e.dataTransfer.effectAllowed = "move";
        aoArrastar(ordem.id);
      }}
      className={`cursor-grab overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md active:cursor-grabbing ${ocupado ? "opacity-60" : ""}`}
      style={{ boxShadow: `inset 0 0 0 1px ${urgente ? "#fca5a5" : s.cor + "40"}` }}
    >
      <div className="h-1.5" style={{ background: s.cor }} />
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/painel/os/${ordem.id}`} className="font-mono text-xs font-semibold text-grafite-600 hover:underline">
            {formatarNumeroOS(ordem.numero)}
          </Link>
          {urgente && <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">Urgente</span>}
        </div>

        <Link href={`/painel/os/${ordem.id}`} className="mt-1 block">
          <h3 className="font-medium leading-snug text-grafite-900">{NOME_TIPO[ordem.tipo_trabalho]}</h3>
          <p className="text-sm text-grafite-600">{ordem.paciente_nome}</p>
          <p className="text-xs text-prata-500">{ordem.dentista?.nome ?? "Dentista não informado"}</p>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          {ordem.status === "em_andamento" && ordem.etapa_bancada && (
            <span className="rounded px-1.5 py-0.5 font-medium" style={{ background: s.fundo, color: s.texto }}>
              Bancada: {NOME_BANCADA[ordem.etapa_bancada]}
            </span>
          )}
          {ordem.elementos && <span className="rounded bg-prata-100 px-1.5 py-0.5 text-grafite-700">Dentes {ordem.elementos}</span>}
          {ordem.cor && (
            <span className="rounded bg-prata-100 px-1.5 py-0.5 text-grafite-700" title={ordem.escala_cor ?? undefined}>
              Cor {ordem.cor}
            </span>
          )}
          <SeloPrazo ordem={ordem} />
          <SelosExtras ordem={ordem} />
        </div>
        <p className="mt-2 text-[11px] text-prata-500">
          {s.frase} {quando(ordem.status_desde)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {anterior && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => aoMover(ordem.id, anterior)}
              className="rounded-md border border-prata-200 px-2 py-1 text-xs text-grafite-600 hover:bg-prata-50 disabled:opacity-50"
              title={`Voltar para ${NOME_STATUS[anterior]}`}
              aria-label={`Voltar para ${NOME_STATUS[anterior]}`}
            >
              {proximo ? "←" : "← Desfazer entrega"}
            </button>
          )}
          {bancada && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => aoMoverBancada(ordem.id, bancada.codigo)}
              className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-prata-50 disabled:opacity-50"
              style={{ borderColor: `${s.cor}66`, color: s.texto }}
              title="Avançar a etapa da bancada"
            >
              {bancada.nome}
            </button>
          )}
          {proximo && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => aoMover(ordem.id, proximo)}
              className="flex-1 rounded-md px-2 py-1 text-xs font-medium text-white hover:brightness-110 disabled:opacity-50"
              style={{ background: INFO_STATUS[proximo].cor }}
            >
              {ACAO_PROXIMA[ordem.status]} →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
