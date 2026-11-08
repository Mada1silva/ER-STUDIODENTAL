"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { ehStatusValido, ehTipoValido } from "./constantes";

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
  return { ok: true };
}

/** Marca a OS como entregue ao dentista (sai do quadro). */
export async function marcarEntregue(id: string): Promise<ResultadoAcao> {
  if (!supabaseConfigurado) return { ok: true, demo: true };

  const supabase = await criarClienteServidor();
  const { error } = await supabase
    .from("ordens_servico")
    .update({ data_entrega: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pronto");
  if (error) return { ok: false, erro: "Não foi possível marcar como entregue." };

  revalidatePath("/painel/os");
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
      data_entrada: texto(form, "data_entrada") ?? undefined,
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

export async function sair() {
  if (supabaseConfigurado) {
    const supabase = await criarClienteServidor();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
