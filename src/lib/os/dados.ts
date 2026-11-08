import "server-only";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import type { Dentista, HistoricoStatus, OrdemComDentista } from "@/types/database";
import { dentistasDemo, historicoDemo, ordensDemo } from "./demo";

/**
 * Camada de leitura de dados. Se o Supabase estiver configurado, lê do banco;
 * se não, devolve os dados de demonstração (e avisa com demo = true).
 */

const CAMPOS_OS = "*, dentista:dentistas(id, nome, clinica)";

export async function listarOrdens(): Promise<{ ordens: OrdemComDentista[]; demo: boolean; erro?: string }> {
  if (!supabaseConfigurado) return { ordens: ordensDemo(), demo: true };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("ordens_servico")
    .select(CAMPOS_OS)
    .is("data_entrega", null) // entregues saem do quadro
    .order("prioridade", { ascending: false })
    .order("data_prevista", { ascending: true, nullsFirst: false });

  if (error) return { ordens: [], demo: false, erro: error.message };
  return { ordens: (data ?? []) as OrdemComDentista[], demo: false };
}

export async function buscarOrdem(
  id: string,
): Promise<{ ordem: OrdemComDentista | null; historico: HistoricoStatus[]; demo: boolean }> {
  if (!supabaseConfigurado) {
    const ordem = ordensDemo().find((o) => o.id === id) ?? null;
    return { ordem, historico: ordem ? historicoDemo(ordem) : [], demo: true };
  }

  const supabase = await criarClienteServidor();
  const [{ data: ordem }, { data: historico }] = await Promise.all([
    supabase.from("ordens_servico").select(CAMPOS_OS).eq("id", id).maybeSingle(),
    supabase.from("os_historico_status").select("*").eq("ordem_id", id).order("alterado_em", { ascending: true }),
  ]);
  return { ordem: (ordem as OrdemComDentista) ?? null, historico: (historico ?? []) as HistoricoStatus[], demo: false };
}

export async function listarDentistas(): Promise<{ dentistas: Dentista[]; demo: boolean; erro?: string }> {
  if (!supabaseConfigurado) return { dentistas: dentistasDemo, demo: true };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.from("dentistas").select("*").eq("ativo", true).order("nome");
  if (error) return { dentistas: [], demo: false, erro: error.message };
  return { dentistas: (data ?? []) as Dentista[], demo: false };
}
