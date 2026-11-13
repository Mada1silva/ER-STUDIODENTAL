import type { OrdemComDentista, StatusOS } from "@/types/database";
import { site } from "@/lib/config/site";
import { NOME_TIPO, formatarNumeroOS } from "./constantes";
import { CURTO_ITEM, itensFaltando } from "./itens";

/**
 * Endereço público do site, usado nos links de acompanhamento enviados por WhatsApp.
 * Configure NEXT_PUBLIC_SITE_URL na Vercel (ex.: https://erstudiodental.com.br).
 */
export function urlDoSite(origemDaRequisicao?: string | null) {
  return (process.env.NEXT_PUBLIC_SITE_URL || origemDaRequisicao || "http://localhost:3000").replace(/\/$/, "");
}

export const caminhoAcompanhar = (token: string) => `/acompanhar/${token}`;
export const caminhoCertificado = (token: string) => `/acompanhar/${token}/certificado`;

/** "Paciente Maria da Silva" -> "M. S." (a página pública não mostra o nome inteiro). */
export function iniciais(nome: string) {
  return nome
    .replace(/^paciente\s+/i, "")
    .split(/\s+/)
    .filter((p) => p && !["da", "de", "do", "das", "dos", "e"].includes(p.toLowerCase()))
    .map((p) => p[0].toUpperCase() + ".")
    .join(" ");
}

const FRASE_AVISO: Record<StatusOS, string> = {
  recebido: "chegou ao laboratório",
  em_andamento: "está em produção",
  finalizado: "ficou pronto",
  saindo_entrega: "saiu para entrega e está a caminho do consultório",
  entregue: "foi entregue",
};

/** Mensagem pronta para o WhatsApp do dentista, com o link de acompanhamento. */
export function mensagemAvisoDentista(o: OrdemComDentista, link: string) {
  const tratamento = (o.dentista?.nome ?? "").split(" ").slice(0, 2).join(" ") || "doutor(a)";
  const faltou = itensFaltando(o.itens).map((c) => CURTO_ITEM[c]);
  return (
    `Olá, ${tratamento}! Aqui é do ${site.nome}. O trabalho ${formatarNumeroOS(o.numero)} (${NOME_TIPO[o.tipo_trabalho]}, ${o.paciente_nome}) ${FRASE_AVISO[o.status]}.` +
    (faltou.length ? ` Atenção: faltou ${faltou.join(", ")}. Pode nos enviar?` : "") +
    `\n\nAcompanhe por aqui, sem precisar de senha:\n${link}`
  );
}

/** Link wa.me para o número do dentista (ou null se não tiver WhatsApp cadastrado). */
export function linkWhatsAppDentista(whatsapp: string | null | undefined, mensagem: string) {
  const numero = (whatsapp ?? "").replace(/\D/g, "");
  if (numero.length < 10) return null;
  const comPais = numero.startsWith("55") && numero.length >= 12 ? numero : `55${numero}`;
  return `https://wa.me/${comPais}?text=${encodeURIComponent(mensagem)}`;
}
