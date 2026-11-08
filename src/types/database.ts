/**
 * Tipos das tabelas do Supabase (espelham supabase/migrations/0001_schema_inicial.sql).
 * Quando o projeto Supabase existir, dá para gerar automaticamente com:
 *   npx supabase gen types typescript --project-id SEU_ID > src/types/supabase.ts
 */

export type StatusOS =
  | "recebido"
  | "modelagem"
  | "cad"
  | "fresagem_ceramica"
  | "acabamento"
  | "pronto";

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
  prioridade: PrioridadeOS;
  data_entrada: string; // AAAA-MM-DD
  data_prevista: string | null; // AAAA-MM-DD
  data_entrega: string | null;
  valor: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

/** OS com o nome do dentista já junto, como o Kanban usa. */
export interface OrdemComDentista extends OrdemServico {
  dentista: Pick<Dentista, "id" | "nome" | "clinica"> | null;
}

export interface HistoricoStatus {
  id: number;
  ordem_id: string;
  status_anterior: StatusOS | null;
  status_novo: StatusOS;
  alterado_em: string;
}
