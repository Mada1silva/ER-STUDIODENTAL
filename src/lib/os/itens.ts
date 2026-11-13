import type { CodigoItem, ItemEnviado, TipoTrabalho } from "@/types/database";

/** O que pode acompanhar um trabalho. [código, nome, nome curto] */
export const ITENS: { codigo: CodigoItem; nome: string; curto: string }[] = [
  { codigo: "escaneamento", nome: "Escaneamento (arquivo STL)", curto: "escaneamento" },
  { codigo: "moldagem", nome: "Moldagem", curto: "moldagem" },
  { codigo: "modelo", nome: "Modelo de gesso", curto: "modelo" },
  { codigo: "antagonista", nome: "Antagonista", curto: "antagonista" },
  { codigo: "mordida", nome: "Registro de mordida", curto: "mordida" },
  { codigo: "analogo", nome: "Análogo", curto: "análogo" },
  { codigo: "transferente", nome: "Transferente", curto: "transferente" },
  { codigo: "componentes", nome: "Componentes do implante (pilar, parafuso)", curto: "componentes" },
  { codigo: "guia", nome: "Guia ou prótese antiga", curto: "guia" },
  { codigo: "fotos", nome: "Fotos do sorriso", curto: "fotos" },
  { codigo: "tomada_cor", nome: "Foto com a escala de cor", curto: "foto da cor" },
];

export const NOME_ITEM = Object.fromEntries(ITENS.map((i) => [i.codigo, i.nome])) as Record<CodigoItem, string>;
export const CURTO_ITEM = Object.fromEntries(ITENS.map((i) => [i.codigo, i.curto])) as Record<CodigoItem, string>;
const CODIGOS = new Set<string>(ITENS.map((i) => i.codigo));
export const ehItemValido = (c: unknown): c is CodigoItem => typeof c === "string" && CODIGOS.has(c);

/** O que costuma acompanhar cada tipo de trabalho (vem marcado no formulário). */
export const ITENS_POR_TIPO: Record<TipoTrabalho, CodigoItem[]> = {
  coroa_zirconia: ["moldagem", "antagonista", "mordida"],
  coroa_emax: ["moldagem", "antagonista", "mordida", "tomada_cor"],
  faceta_lente: ["moldagem", "antagonista", "mordida", "fotos", "tomada_cor"],
  metalo_ceramica: ["moldagem", "antagonista", "mordida"],
  protese_total: ["moldagem", "modelo", "mordida", "guia"],
  ppr: ["moldagem", "modelo", "antagonista", "mordida"],
  protocolo_implante: ["moldagem", "transferente", "analogo", "componentes", "antagonista", "mordida", "guia"],
  coroa_sobre_implante: ["moldagem", "transferente", "analogo", "componentes", "antagonista", "mordida"],
  provisorio: ["moldagem", "antagonista"],
  placa_miorrelaxante: ["moldagem", "antagonista", "mordida"],
  outro: [],
};

/** Sugestões de material por tipo de trabalho (botões no formulário). */
export const MATERIAIS_POR_TIPO: Partial<Record<TipoTrabalho, string[]>> = {
  coroa_zirconia: ["Zircônia multicamada", "Zircônia monolítica"],
  coroa_emax: ["E-max", "E-max estratificado"],
  faceta_lente: ["E-max", "Porcelana feldspática"],
  metalo_ceramica: ["Metalocerâmica"],
  protese_total: ["Dentes New Ace", "Dentes Trilux", "Dentes Vita"],
  ppr: ["Cromo-cobalto"],
  protocolo_implante: ["Resina + dente Delara", "Zircônia", "Dento-gengival estratificado"],
  coroa_sobre_implante: ["Zircônia", "Metalocerâmica"],
  provisorio: ["Resina", "PMMA fresado"],
  placa_miorrelaxante: ["Acrílico", "Silicone"],
};
export const MATERIAIS_GERAIS = ["Zircônia multicamada", "E-max", "Metalocerâmica", "Resina"];

/** Tons aproximados da escala Vita Classical, só para orientar o olho. */
export const TOM_COR: Record<string, string> = {
  A1: "#f3e8d2", A2: "#eedcb6", A3: "#e6cea0", "A3.5": "#ddc08d", A4: "#d2b17a",
  B1: "#f5eed8", B2: "#efe1b5", B3: "#e5cc92", B4: "#dbbf83",
  C1: "#e7dcc3", C2: "#ddcfae", C3: "#d1c09a", C4: "#c0ac85",
  D2: "#e8dbc2", D3: "#ddcca9", D4: "#d6c49c",
  BL1: "#fcfaf3", BL2: "#f9f4e7", BL3: "#f6efdc", BL4: "#f2e8d0",
};

export const itensFaltando = (itens: ItemEnviado[]) => itens.filter((i) => i.conf === false).map((i) => i.c);
export const conferenciaPendente = (itens: ItemEnviado[]) => itens.some((i) => i.conf == null);
