import type { EtapaBancada, PrioridadeOS, StatusOS, TipoTrabalho } from "@/types/database";

export interface InfoStatus {
  codigo: StatusOS;
  nome: string;
  /** Cor principal da etapa (barra, cabeçalho da coluna). */
  cor: string;
  /** Fundo claro e texto escuro da mesma cor, para selos legíveis. */
  fundo: string;
  texto: string;
  dica: string;
  /** Frase usada na linha do tempo: "Chegou ao laboratório hoje às 09:12". */
  frase: string;
}

/** As 5 etapas, na ordem. Iguais à tabela os_status do banco. */
export const STATUS_OS: InfoStatus[] = [
  { codigo: "recebido", nome: "Chegou", cor: "#2563eb", fundo: "#eff6ff", texto: "#1e40af", dica: "O trabalho chegou ao laboratório", frase: "Chegou ao laboratório" },
  { codigo: "em_andamento", nome: "Em andamento", cor: "#d97706", fundo: "#fffbeb", texto: "#92400e", dica: "Em produção na bancada", frase: "Entrou em produção" },
  { codigo: "finalizado", nome: "Finalizado", cor: "#16a34a", fundo: "#f0fdf4", texto: "#166534", dica: "Pronto, aguardando a entrega", frase: "Ficou pronto" },
  { codigo: "saindo_entrega", nome: "Saindo para entrega", cor: "#7c3aed", fundo: "#f5f3ff", texto: "#5b21b6", dica: "A caminho do consultório", frase: "Saiu para entrega" },
  { codigo: "entregue", nome: "Entregue", cor: "#475569", fundo: "#f1f5f9", texto: "#1e293b", dica: "Recebido pelo consultório", frase: "Entregue no consultório" },
];

export const INFO_STATUS = Object.fromEntries(STATUS_OS.map((s) => [s.codigo, s])) as Record<StatusOS, InfoStatus>;
export const NOME_STATUS = Object.fromEntries(STATUS_OS.map((s) => [s.codigo, s.nome])) as Record<StatusOS, string>;

/** Texto do botão que leva para a próxima etapa. */
export const ACAO_PROXIMA: Partial<Record<StatusOS, string>> = {
  recebido: "Iniciar produção",
  em_andamento: "Finalizar",
  finalizado: "Saiu para entrega",
  saindo_entrega: "Confirmar entrega",
};

export function indiceStatus(s: StatusOS) {
  return STATUS_OS.findIndex((x) => x.codigo === s);
}

export function proximoStatus(atual: StatusOS): StatusOS | null {
  return STATUS_OS[indiceStatus(atual) + 1]?.codigo ?? null;
}

export function statusAnterior(atual: StatusOS): StatusOS | null {
  const i = indiceStatus(atual);
  return i > 0 ? STATUS_OS[i - 1].codigo : null;
}

export function ehStatusValido(valor: unknown): valor is StatusOS {
  return STATUS_OS.some((s) => s.codigo === valor);
}

/** Etapas internas da bancada (só para a equipe, dentro de "Em andamento"). */
export const ETAPAS_BANCADA: { codigo: EtapaBancada; nome: string }[] = [
  { codigo: "modelagem", nome: "Modelagem" },
  { codigo: "cad", nome: "CAD" },
  { codigo: "fresagem_ceramica", nome: "Fresagem/Cerâmica" },
  { codigo: "acabamento", nome: "Acabamento" },
];

export const NOME_BANCADA = Object.fromEntries(ETAPAS_BANCADA.map((e) => [e.codigo, e.nome])) as Record<EtapaBancada, string>;

export function proximaBancada(atual: EtapaBancada | null) {
  const i = ETAPAS_BANCADA.findIndex((e) => e.codigo === atual);
  return ETAPAS_BANCADA[i + 1] ?? null;
}

export function ehBancadaValida(valor: unknown): valor is EtapaBancada {
  return ETAPAS_BANCADA.some((e) => e.codigo === valor);
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

export const FORMAS_ENVIO = [
  "Escaneamento digital (arquivo STL)",
  "Moldagem física (laboratório busca no consultório)",
  "Moldagem física (entrego no laboratório)",
];

export function formatarNumeroOS(numero: number) {
  return `OS-${String(numero).padStart(4, "0")}`;
}

/** Busca sem acento e sem maiúsculas. */
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
