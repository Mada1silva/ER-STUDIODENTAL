"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import type { ItemEnviado } from "@/types/database";
import { ehBancadaValida, ehStatusValido, ehTipoValido } from "./constantes";
import { dentesValidos, parseElementos } from "./dentes";
import { ehItemValido } from "./itens";

export type ResultadoAcao = { ok: true; demo?: boolean } | { ok: false; erro: string };

/** Move uma OS para outra coluna do Kanban. */
export async function moverOrdem(id: string, novoStatus: string): Promise<ResultadoAcao> {
  if (!ehStatusValido(novoStatus)) return { ok: false, erro: "Status inválido." };
  if (!supabaseConfigurado) return { ok: true, demo: true };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("ordens_servico").update({ status: novoStatus }).eq("id", id);
  if (error) return { ok: false, erro: "Não foi possível mudar o status. Tente de novo." };

  revalidatePath("/painel/os");
  revalidatePath(`/painel/os/${id}`);
  revalidatePath("/portal");
  return { ok: true };
}

/** Avança a etapa interna da bancada (Modelagem, CAD, Fresagem/Cerâmica, Acabamento). */
export async function moverBancada(id: string, etapa: string): Promise<ResultadoAcao> {
  if (!ehBancadaValida(etapa)) return { ok: false, erro: "Etapa inválida." };
  if (!supabaseConfigurado) return { ok: true, demo: true };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("ordens_servico").update({ etapa_bancada: etapa }).eq("id", id).eq("status", "em_andamento");
  if (error) return { ok: false, erro: "Não foi possível mudar a etapa da bancada." };

  revalidatePath("/painel/os");
  revalidatePath(`/painel/os/${id}`);
  return { ok: true };
}

/**
 * Conferência na chegada: marca um item como "chegou" (true) ou "faltou" (false).
 * Quando todos os itens estão conferidos, grava a hora. Se faltou algo, o portal do dentista mostra o aviso.
 */
export async function conferirItem(id: string, codigo: string, chegou: boolean): Promise<ResultadoAcao> {
  if (!ehItemValido(codigo)) return { ok: false, erro: "Item inválido." };
  if (!supabaseConfigurado) return { ok: true, demo: true };

  const supabase = await criarClienteServidor();
  const { data: ordem, error: erroLeitura } = await supabase.from("ordens_servico").select("itens, conferido_em").eq("id", id).single();
  if (erroLeitura || !ordem) return { ok: false, erro: "OS não encontrada." };

  const itens = ((ordem.itens ?? []) as ItemEnviado[]).map((i) => (i.c === codigo ? { ...i, conf: chegou } : i));
  if (!itens.some((i) => i.c === codigo)) itens.push({ c: codigo, conf: chegou });
  const pendente = itens.some((i) => i.conf == null);
  const conferido_em = pendente ? null : (ordem.conferido_em ?? new Date().toISOString());

  const { error } = await supabase.from("ordens_servico").update({ itens, conferido_em }).eq("id", id);
  if (error) return { ok: false, erro: "Não foi possível salvar a conferência." };

  revalidatePath(`/painel/os/${id}`);
  revalidatePath("/painel/os");
  revalidatePath("/portal");
  return { ok: true };
}

/** Foto da saída: o arquivo já foi enviado ao Storage pelo navegador; aqui só guardamos o endereço. */
export async function salvarFotoSaida(id: string, url: string | null): Promise<ResultadoAcao> {
  if (url !== null && !/^https?:\/\/[^\s]+\/storage\/v1\/object\/public\/fotos-saida\//.test(url)) return { ok: false, erro: "Endereço da foto inválido." };
  if (!supabaseConfigurado) return { ok: true, demo: true };

  const supabase = await criarClienteServidor();
  const { error } = await supabase
    .from("ordens_servico")
    .update({ foto_saida_url: url, foto_saida_em: url ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { ok: false, erro: "Não foi possível salvar a foto." };

  revalidatePath(`/painel/os/${id}`);
  revalidatePath("/portal");
  return { ok: true };
}

export type EstadoFormOS = { erro?: string; demo?: boolean };

function texto(form: FormData, campo: string): string | null {
  const v = String(form.get(campo) ?? "").trim();
  return v === "" ? null : v;
}

/** Campos do bloco "Trabalho" (odontograma, cor, o que acompanha), iguais nos dois formulários. */
function camposTrabalho(form: FormData) {
  const elementos = texto(form, "elementos");
  const marcados = String(form.get("dentes") ?? "").split(",").filter(Boolean);
  const dentes = dentesValidos(marcados.length ? marcados : parseElementos(elementos));
  const itens: ItemEnviado[] = [...new Set(form.getAll("itens").map(String))].filter(ehItemValido).map((c) => ({ c, conf: null }));
  return {
    elementos,
    dentes,
    material: texto(form, "material"),
    escala_cor: texto(form, "escala_cor"),
    cor: texto(form, "cor_texto") ?? texto(form, "cor"),
    itens,
  };
}

/** Cria uma nova OS a partir do formulário "Nova OS". */
export async function criarOrdem(_estado: EstadoFormOS, form: FormData): Promise<EstadoFormOS> {
  const dentistaId = texto(form, "dentista_id");
  const paciente = texto(form, "paciente_nome");
  const tipo = texto(form, "tipo_trabalho");
  if (!dentistaId) return { erro: "Escolha o dentista." };
  if (!paciente) return { erro: "Informe o nome do paciente." };
  if (!ehTipoValido(tipo)) return { erro: "Escolha o tipo de trabalho." };

  const valorTexto = texto(form, "valor");
  const valor = valorTexto ? Number(valorTexto.replace(/\./g, "").replace(",", ".")) : null;
  if (valor != null && Number.isNaN(valor)) return { erro: "Valor inválido. Use, por exemplo, 1600,00." };

  if (!supabaseConfigurado) {
    return { demo: true, erro: "Modo demonstração: para salvar de verdade, conecte o Supabase (veja o README)." };
  }

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("ordens_servico")
    .insert({
      dentista_id: dentistaId,
      paciente_nome: paciente,
      tipo_trabalho: tipo,
      ...camposTrabalho(form),
      prioridade: form.get("prioridade") === "urgente" ? "urgente" : "normal",
      data_prevista: texto(form, "data_prevista"),
      valor,
      descricao: texto(form, "descricao"),
      observacoes: texto(form, "observacoes"),
    })
    .select("id")
    .single();

  if (error) return { erro: "Não foi possível salvar a OS. Verifique os dados e tente de novo." };

  revalidatePath("/painel/os");
  redirect(`/painel/os/${data.id}`);
}

/** Portal do Dentista: o dentista pede um trabalho novo (entra como "Chegou" no painel do laboratório). */
export async function pedirTrabalho(_estado: EstadoFormOS, form: FormData): Promise<EstadoFormOS> {
  const paciente = texto(form, "paciente_nome");
  const tipo = texto(form, "tipo_trabalho");
  if (!paciente) return { erro: "Informe o nome ou as iniciais do paciente." };
  if (!ehTipoValido(tipo)) return { erro: "Escolha o tipo de trabalho." };

  if (!supabaseConfigurado) {
    return { demo: true, erro: "Modo demonstração: o pedido não foi enviado. Com o Supabase ligado, ele aparece na hora no painel do laboratório." };
  }

  const supabase = await criarClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: perfil } = await supabase.from("perfis").select("dentista_id").eq("id", user?.id ?? "").maybeSingle();
  if (!perfil?.dentista_id) return { erro: "Seu acesso ainda não foi ligado a um cadastro de dentista. Fale com o laboratório." };

  const envio = texto(form, "envio");
  const instrucoes = texto(form, "descricao");
  const { error } = await supabase.from("ordens_servico").insert({
    dentista_id: perfil.dentista_id,
    paciente_nome: paciente,
    tipo_trabalho: tipo,
    ...camposTrabalho(form),
    prioridade: form.get("urgente") ? "urgente" : "normal",
    data_prevista: texto(form, "data_prevista"),
    descricao: [instrucoes, envio ? `Envio do material: ${envio}` : null].filter(Boolean).join("\n") || null,
  });
  if (error) return { erro: "Não foi possível enviar o pedido. Tente de novo ou fale pelo WhatsApp." };

  revalidatePath("/portal");
  revalidatePath("/painel/os");
  redirect("/portal?pedido=ok");
}

export async function sair() {
  if (supabaseConfigurado) {
    const supabase = await criarClienteServidor();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
