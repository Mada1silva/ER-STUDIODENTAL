"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { ehBancadaValida, ehStatusValido, ehTipoValido } from "./constantes";

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

export type EstadoFormOS = { erro?: string; demo?: boolean };

function texto(form: FormData, campo: string): string | null {
  const v = String(form.get(campo) ?? "").trim();
  return v === "" ? null : v;
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
      elementos: texto(form, "elementos"),
      material: texto(form, "material"),
      escala_cor: texto(form, "escala_cor"),
      cor: texto(form, "cor"),
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
    elementos: texto(form, "elementos"),
    material: texto(form, "material"),
    escala_cor: texto(form, "escala_cor"),
    cor: texto(form, "cor"),
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
