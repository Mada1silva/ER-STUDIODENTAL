import type { EtapaBancada, HistoricoStatus, StatusOS } from "@/types/database";
import { INFO_STATUS, NOME_BANCADA, STATUS_OS, indiceStatus } from "@/lib/os/constantes";
import { quando } from "@/lib/datas";

/** Selo colorido da etapa ("Chegou", "Em andamento"...). */
export function SeloEtapa({ status, grande = false }: { status: StatusOS; grande?: boolean }) {
  const s = INFO_STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold ${grande ? "text-sm" : "text-xs"}`}
      style={{ background: s.fundo, color: s.texto, boxShadow: `inset 0 0 0 1px ${s.cor}55` }}
    >
      <span className="size-2 rounded-full" style={{ background: s.cor }} />
      {s.nome}
    </span>
  );
}

/** Legenda com as 5 cores, para a equipe e os dentistas aprenderem rápido. */
export function LegendaEtapas() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-prata-500">Cores:</span>
      {STATUS_OS.map((s) => (
        <SeloEtapa key={s.codigo} status={s.codigo} />
      ))}
    </div>
  );
}

/** Barra de 5 segmentos, cada um na cor da sua etapa. */
export function TrilhaEtapas({ status, rotulos = false }: { status: StatusOS; rotulos?: boolean }) {
  const i = indiceStatus(status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label={`Etapa ${i + 1} de 5: ${INFO_STATUS[status].nome}`}>
      {STATUS_OS.map((s, k) => (
        <li key={s.codigo} className="space-y-1">
          <div className="h-2 rounded-full" style={{ background: k <= i ? s.cor : "#dcdcd9" }} />
          {rotulos && (
            <p className={`text-[11px] leading-tight ${k === i ? "font-semibold" : "text-prata-500"}`} style={k === i ? { color: s.texto } : undefined}>
              {s.nome}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Linha do tempo vertical com data e hora de cada etapa. `interno` mostra também a bancada. */
export function LinhaDoTempo({ status, historico, interno = false }: { status: StatusOS; historico: HistoricoStatus[]; interno?: boolean }) {
  const i = indiceStatus(status);
  // Usa a última vez que entrou em cada etapa (se voltou uma etapa, vale a mais recente).
  const entrouEm = (s: StatusOS) => [...historico].reverse().find((h) => h.status_novo === s && h.status_anterior !== s)?.alterado_em;
  const bancada = historico.filter((h) => h.status_novo === "em_andamento" && h.etapa_bancada) as (HistoricoStatus & { etapa_bancada: EtapaBancada })[];

  return (
    <ol>
      {STATUS_OS.map((s, k) => {
        const feito = k <= i;
        const atual = k === i;
        const em = feito ? entrouEm(s.codigo) : undefined;
        return (
          <li key={s.codigo} className="relative flex gap-3 pb-5 last:pb-0">
            {k < STATUS_OS.length - 1 && (
              <span className="absolute top-6 left-[11px] h-[calc(100%-20px)] w-0.5" style={{ background: k < i ? STATUS_OS[k + 1].cor : "#dcdcd9" }} />
            )}
            <span
              className="relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
              style={{ background: feito ? s.cor : "#fff", boxShadow: `inset 0 0 0 2px ${feito ? s.cor : "#dcdcd9"}` }}
            >
              {feito && !atual ? "✓" : ""}
            </span>
            <div className="min-w-0">
              <p className={`text-sm ${atual ? "font-semibold" : feito ? "font-medium text-grafite-900" : "text-prata-500"}`} style={atual ? { color: s.texto } : undefined}>
                {s.nome}
                {atual && <span className="ml-2 rounded bg-grafite-800 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">agora</span>}
              </p>
              <p className="text-xs text-prata-500">{em ? quando(em) : feito ? "—" : "Aguardando"}</p>
              {interno && s.codigo === "em_andamento" &&
                bancada.map((h) => (
                  <p key={h.id} className="text-xs text-grafite-600">
                    · {NOME_BANCADA[h.etapa_bancada]} <span className="text-prata-500">{quando(h.alterado_em)}</span>
                  </p>
                ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
