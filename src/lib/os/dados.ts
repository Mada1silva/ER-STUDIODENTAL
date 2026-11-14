import "server-only";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { hojeISO, limitesDoMes } from "@/lib/datas";
import type { AcompanhamentoPublico, Dentista, HistoricoStatus, OrdemComDentista } from "@/types/database";
import { iniciais } from "./acompanhamento";
import { itensFaltando } from "./itens";
import { DENTISTA_DEMO_PORTAL, dentistasDemo, ordensDemo } from "./demo";

/**
 * Camada de leitura de dados. Se o Supabase estiver configurado, lê do banco;
 * se não, devolve os dados de demonstração (e avisa com demo = true).
 * Quem pode ver o quê é garantido pelo banco (Row Level Security).
 */

const CAMPOS_OS = "*, dentista:dentistas(id, nome, clinica, whatsapp, cro, cro_uf)";
const SETE_DIAS = 7 * 864e5;

function semHistorico(o: ReturnType<typeof ordensDemo>[number]): OrdemComDentista {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { historico, ...resto } = o;
  return resto;
}

/** Quadro de produção: tudo que não foi entregue + o que foi entregue nos últimos 7 dias. */
export async function listarOrdens(): Promise<{ ordens: OrdemComDentista[]; demo: boolean; erro?: string }> {
  if (!supabaseConfigurado) {
    const ordens = ordensDemo().filter((o) => !o.data_entrega || Date.now() - Date.parse(o.data_entrega) < SETE_DIAS);
    return { ordens: ordens.map(semHistorico), demo: true };
  }

  const supabase = await criarClienteServidor();
  const limite = new Date(Date.now() - SETE_DIAS).toISOString();
  const { data, error } = await supabase
    .from("ordens_servico")
    .select(CAMPOS_OS)
    .or(`data_entrega.is.null,data_entrega.gte.${limite}`)
    .order("prioridade", { ascending: false })
    .order("data_prevista", { ascending: true, nullsFirst: false });

  if (error) return { ordens: [], demo: false, erro: error.message };
  return { ordens: (data ?? []) as OrdemComDentista[], demo: false };
}

export async function buscarOrdem(
  id: string,
): Promise<{ ordem: OrdemComDentista | null; historico: HistoricoStatus[]; demo: boolean }> {
  if (!supabaseConfigurado) {
    const o = ordensDemo().find((x) => x.id === id);
    return { ordem: o ? semHistorico(o) : null, historico: o?.historico ?? [], demo: true };
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

/**
 * Financeiro: trabalhos ENTREGUES no mês (base da fatura) e os que ainda estão no laboratório.
 * `mes` no formato AAAA-MM.
 */
export async function listarFatura(mes: string): Promise<{ entregues: OrdemComDentista[]; abertos: OrdemComDentista[]; demo: boolean; erro?: string }> {
  const { inicio, fim } = limitesDoMes(mes);
  const mesAtual = mes === hojeISO().slice(0, 7);

  if (!supabaseConfigurado) {
    const todas = ordensDemo().map(semHistorico);
    return {
      entregues: todas.filter((o) => o.data_entrega && o.data_entrega >= inicio && o.data_entrega < fim),
      abertos: mesAtual ? todas.filter((o) => !o.data_entrega) : [],
      demo: true,
    };
  }

  const supabase = await criarClienteServidor();
  const [entregues, abertos] = await Promise.all([
    supabase.from("ordens_servico").select(CAMPOS_OS).gte("data_entrega", inicio).lt("data_entrega", fim).order("data_entrega"),
    mesAtual ? supabase.from("ordens_servico").select(CAMPOS_OS).is("data_entrega", null) : Promise.resolve({ data: [], error: null }),
  ]);
  const erro = entregues.error?.message ?? abertos.error?.message;
  return { entregues: (entregues.data ?? []) as OrdemComDentista[], abertos: (abertos.data ?? []) as OrdemComDentista[], demo: false, erro };
}

/** Quem está logado e qual o papel (laboratório ou dentista). */
export async function obterPerfil(): Promise<{ papel: "laboratorio" | "dentista" | null; dentistaId: string | null; demo: boolean }> {
  if (!supabaseConfigurado) return { papel: null, dentistaId: DENTISTA_DEMO_PORTAL, demo: true };
  const supabase = await criarClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { papel: null, dentistaId: null, demo: false };
  const { data } = await supabase.from("perfis").select("papel, dentista_id").eq("id", user.id).maybeSingle();
  return { papel: data?.papel ?? null, dentistaId: data?.dentista_id ?? null, demo: false };
}

/** Portal do Dentista: os trabalhos do dentista logado (o banco só devolve os dele). */
export async function listarMinhasOrdens(): Promise<{ ordens: OrdemComDentista[]; dentista: Pick<Dentista, "id" | "nome" | "clinica"> | null; demo: boolean }> {
  if (!supabaseConfigurado) {
    const d = dentistasDemo.find((x) => x.id === DENTISTA_DEMO_PORTAL)!;
    return { ordens: ordensDemo().filter((o) => o.dentista_id === d.id).map(semHistorico), dentista: d, demo: true };
  }
  const perfil = await obterPerfil();
  if (!perfil.dentistaId) return { ordens: [], dentista: null, demo: false };
  const supabase = await criarClienteServidor();
  const [{ data: ordens }, { data: dentista }] = await Promise.all([
    supabase.from("ordens_servico").select(CAMPOS_OS).eq("dentista_id", perfil.dentistaId).order("status_desde", { ascending: false }),
    supabase.from("dentistas").select("id, nome, clinica").eq("id", perfil.dentistaId).maybeSingle(),
  ]);
  return { ordens: (ordens ?? []) as OrdemComDentista[], dentista: dentista ?? null, demo: false };
}

/**
 * Página pública de acompanhamento (sem login): busca pelo token do link.
 * No banco, quem responde é a função acompanhar_os, que devolve só o necessário.
 */
export async function buscarAcompanhamento(token: string): Promise<{ dados: AcompanhamentoPublico | null; demo: boolean }> {
  if (!/^[a-z0-9]{10,64}$/i.test(token)) return { dados: null, demo: !supabaseConfigurado };

  if (!supabaseConfigurado) {
    const o = ordensDemo().find((x) => x.token_publico === token);
    if (!o) return { dados: null, demo: true };
    const d = dentistasDemo.find((x) => x.id === o.dentista_id)!;
    return {
      demo: true,
      dados: {
        numero: o.numero, tipo_trabalho: o.tipo_trabalho, elementos: o.elementos, dentes: o.dentes, material: o.material,
        escala_cor: o.escala_cor, cor: o.cor, status: o.status, status_desde: o.status_desde, data_prevista: o.data_prevista,
        foto_saida_url: o.foto_saida_url, token_publico: o.token_publico, paciente_iniciais: iniciais(o.paciente_nome),
        itens_faltando: itensFaltando(o.itens), dentista: { nome: d.nome, cro: d.cro, cro_uf: d.cro_uf },
        historico: o.historico.filter((h) => h.status_anterior !== h.status_novo),
      },
    };
  }

  const supabase = await criarClienteServidor();
  const { data } = await supabase.rpc("acompanhar_os", { p_token: token });
  return { dados: (data as AcompanhamentoPublico | null) ?? null, demo: false };
}
