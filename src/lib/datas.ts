/** Utilidades de data no fuso de Brasília. Datas do banco vêm como "AAAA-MM-DD". */

const FUSO = "America/Sao_Paulo";

export function hojeISO(): string {
  // en-CA formata como AAAA-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date());
}

export function somarDiasUteis(dataISO: string, dias: number): string {
  const d = new Date(`${dataISO}T12:00:00Z`);
  let restantes = dias;
  while (restantes > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const diaSemana = d.getUTCDay();
    if (diaSemana !== 0 && diaSemana !== 6) restantes--;
  }
  return d.toISOString().slice(0, 10);
}

export function somarDias(dataISO: string, dias: number): string {
  const d = new Date(`${dataISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Diferença em dias corridos entre uma data e hoje (negativo = atrasado). */
export function diasAte(dataISO: string): number {
  const alvo = Date.parse(`${dataISO}T12:00:00Z`);
  const hoje = Date.parse(`${hojeISO()}T12:00:00Z`);
  return Math.round((alvo - hoje) / 86_400_000);
}

export function formatarData(dataISO: string | null): string {
  if (!dataISO) return "—";
  const [a, m, d] = dataISO.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

export function formatarDataHora(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

export function formatarMoeda(valor: number | null): string {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "hoje às 09:12", "ontem às 17:40" ou "10/11 às 08:05". */
export function quando(iso: string): string {
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(d);
  const hora = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" }).format(d);
  const dif = diasAte(dia);
  if (dif === 0) return `hoje às ${hora}`;
  if (dif === -1) return `ontem às ${hora}`;
  return `${formatarData(dia).slice(0, 5)} às ${hora}`;
}

/** Mês no formato AAAA-MM, no fuso de Brasília. */
export function mesDe(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date(iso)).slice(0, 7);
}

const NOMES_MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function nomeMes(mes: string): string {
  const [a, m] = mes.split("-");
  return `${NOMES_MES[Number(m) - 1]} de ${a}`;
}

/** Primeiro instante do mês (AAAA-MM) e do mês seguinte, em UTC, considerando o fuso de Brasília (UTC-3). */
export function limitesDoMes(mes: string): { inicio: string; fim: string } {
  const [a, m] = mes.split("-").map(Number);
  const inicio = new Date(Date.UTC(a, m - 1, 1, 3));
  const fim = new Date(Date.UTC(a, m, 1, 3));
  return { inicio: inicio.toISOString(), fim: fim.toISOString() };
}
