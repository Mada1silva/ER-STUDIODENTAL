/**
 * Tipos das tabelas do Supabase (espelham supabase/migrations/0001_schema_inicial.sql).
 * Quando o projeto Supabase existir, dá para gerar automaticamente com:
 *   npx supabase gen types typescript --project-id SEU_ID > src/types/supabase.ts
 */

/** As 5 etapas que o dentista e a equipe enxergam. */
export type StatusOS = "recebido" | "em_andamento" | "finalizado" | "saindo_entrega" | "entregue";

/** Detalhe interno da bancada, só enquanto a OS está "Em andamento". */
export type EtapaBancada = "modelagem" | "cad" | "fresagem_ceramica" | "acabamento";

export type TipoTrabalho =
  | "coroa_zirconia"
  | "coroa_emax"
  | "faceta_lente"
  | "metalo_ceramica"
  | "protese_total"
  | "ppr"
  | "protocolo_implante"
  | "coroa_sobre_implante"
  | "provisorio"
  | "placa_miorrelaxante"
  | "outro";

export type PrioridadeOS = "normal" | "urgente";

export type CodigoItem =
  | "escaneamento"
  | "moldagem"
  | "modelo"
  | "antagonista"
  | "mordida"
  | "analogo"
  | "transferente"
  | "componentes"
  | "guia"
  | "fotos"
  | "tomada_cor";

/** Item que acompanha o trabalho. conf: null = ainda não conferido, true = chegou, false = faltou. */
export interface ItemEnviado {
  c: CodigoItem;
  conf: boolean | null;
}

export interface Dentista {
  id: string;
  nome: string;
  cro: string | null;
  cro_uf: string | null;
  clinica: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  ativo: boolean;
}

export interface OrdemServico {
  id: string;
  numero: number;
  dentista_id: string;
  paciente_nome: string;
  tipo_trabalho: TipoTrabalho;
  descricao: string | null;
  elementos: string | null;
  material: string | null;
  escala_cor: string | null;
  cor: string | null;
  status: StatusOS;
  etapa_bancada: EtapaBancada | null;
  status_desde: string; // quando entrou na etapa atual
  prioridade: PrioridadeOS;
  data_entrada: string; // AAAA-MM-DD
  data_prevista: string | null; // AAAA-MM-DD
  data_entrega: string | null; // preenchida quando vira "Entregue"
  valor: number | null;
  observacoes: string | null;
  /** Dentes marcados no odontograma (numeração FDI). */
  dentes: number[];
  /** O que acompanha o trabalho e a conferência na chegada. */
  itens: ItemEnviado[];
  conferido_em: string | null;
  foto_saida_url: string | null;
  foto_saida_em: string | null;
  /** Link de acompanhamento sem senha: /acompanhar/<token>. */
  token_publico: string;
  created_at: string;
  updated_at: string;
}

/** OS com o nome do dentista já junto, como o Kanban usa. */
export interface OrdemComDentista extends OrdemServico {
  dentista: Pick<Dentista, "id" | "nome" | "clinica" | "whatsapp" | "cro" | "cro_uf"> | null;
}

export interface HistoricoStatus {
  id: number;
  ordem_id: string;
  status_anterior: StatusOS | null;
  status_novo: StatusOS;
  etapa_bancada: EtapaBancada | null;
  alterado_em: string;
}

/** O que a página pública de acompanhamento recebe (função acompanhar_os no banco). */
export interface AcompanhamentoPublico {
  numero: number;
  tipo_trabalho: TipoTrabalho;
  elementos: string | null;
  dentes: number[];
  material: string | null;
  escala_cor: string | null;
  cor: string | null;
  status: StatusOS;
  status_desde: string;
  data_prevista: string | null;
  foto_saida_url: string | null;
  token_publico: string;
  paciente_iniciais: string | null;
  itens_faltando: CodigoItem[];
  dentista: { nome: string; cro: string | null; cro_uf: string | null };
  historico: Pick<HistoricoStatus, "status_anterior" | "status_novo" | "alterado_em">[];
}
