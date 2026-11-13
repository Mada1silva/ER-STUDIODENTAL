import "server-only";
import { headers } from "next/headers";
import { urlDoSite } from "./acompanhamento";

/** Endereço do site para montar links (NEXT_PUBLIC_SITE_URL ou o endereço da própria requisição). */
export async function urlDoSiteAtual() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocolo = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return urlDoSite(host ? `${protocolo}://${host}` : null);
}
