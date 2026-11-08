import type { PrioridadeOS, StatusOS, TipoTrabalho } from "@/types/database";

/** Colunas do Kanban, na ordem da produção. Igual à tabela os_status do banco. */
export const STATUS_OS: { codigo: StatusOS; nome: string; cor: string; dica: string }[] = [
  { codigo: "recebido", nome: "Recebido", cor: "#64748b", dica: "Moldagem/escaneamento chegou ao laboratório" },
  { codigo: "modelagem", nome: "Em Modelagem", cor: "#d97706", dica: "Gesso, modelos e montagem em articulador" },
  { codigo: "cad", nome: "CAD", cor: "#0284c7", dica: "Desenho digital do trabalho" },
  { codigo: "fresagem_ceramica", nome: "Fresagem/Cerâmica", cor: "#7c3aed", dica: "Fresagem, sinterização e aplicação de cerâmica" },
  { codigo: "acabamento", nome: "Acabamento", cor: "#db2777", dica: "Ajustes finais, glaze e polimento" },
  { codigo: "pronto", nome: "Pronto", cor: "#059669", dica: "Pronto para entrega ao dentista" },
];

export const NOME_STATUS = Object.fromEntries(STATUS_OS.map((s) => [s.codigo, s.nome])) as Record<StatusOS, string>;

export function proximoStatus(atual: StatusOS): StatusOS | null {
  const i = STATUS_OS.findIndex((s) => s.codigo === atual);
  return STATUS_OS[i + 1]?.codigo ?? null;
}

export function statusAnterior(atual: StatusOS): StatusOS | null {
  const i = STATUS_OS.findIndex((s) => s.codigo === atual);
  return i > 0 ? STATUS_OS[i - 1].codigo : null;
}

export function ehStatusValido(valor: unknown): valor is StatusOS {
  return STATUS_OS.some((s) => s.codigo === valor);
}

export const TIPOS_TRABALHO: { codigo: TipoTrabalho; nome: string }[] = [
  { codigo: "coroa_zirconia", nome: "Coroa de zircônia" },
  { codigo: "coroa_emax", nome: "Coroa de E-max" },
  { codigo: "faceta_lente", nome: "Faceta / lente de contato" },
  { codigo: "metalo_ceramica", nome: "Metalocerâmica" },
  { codigo: "protese_total", nome: "Prótese total" },
  { codigo: "ppr", nome: "PPR (prótese parcial removível)" },
  { codigo: "protocolo_implante", nome: "Protocolo sobre implante" },
  { codigo: "coroa_sobre_implante", nome: "Coroa sobre implante" },
  { codigo: "provisorio", nome: "Provisório" },
  { codigo: "placa_miorrelaxante", nome: "Placa miorrelaxante" },
  { codigo: "outro", nome: "Outro" },
];

export const NOME_TIPO = Object.fromEntries(TIPOS_TRABALHO.map((t) => [t.codigo, t.nome])) as Record<TipoTrabalho, string>;

export function ehTipoValido(valor: unknown): valor is TipoTrabalho {
  return TIPOS_TRABALHO.some((t) => t.codigo === valor);
}

export const PRIORIDADES: { codigo: PrioridadeOS; nome: string }[] = [
  { codigo: "normal", nome: "Normal" },
  { codigo: "urgente", nome: "Urgente" },
];

export const ESCALAS_COR = ["Vita Classical", "Vita 3D-Master", "Ivoclar Chromascop", "Outra"];

export const CORES_VITA_CLASSICAL = [
  "A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D2", "D3", "D4", "BL1", "BL2", "BL3", "BL4",
];

export function formatarNumeroOS(numero: number) {
  return `OS-${String(numero).padStart(4, "0")}`;
}
