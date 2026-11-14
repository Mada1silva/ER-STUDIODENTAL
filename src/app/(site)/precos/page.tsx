import { redirect } from "next/navigation";
import { TABELA_PRECOS_PUBLICA } from "@/lib/config/tabela-precos";
import { TabelaPrecos } from "@/components/precos/tabela-precos";

export const metadata = {
  title: "Tabela de preços",
  description: "Valores de próteses em zircônia, E-max, metalocerâmica, protocolos, prótese total e PPR do Edmar Reis Studio Dental.",
};

/** Enquanto a tabela for só para dentistas parceiros, quem abrir /precos vai para o portal (pede login). */
export default function Precos() {
  if (!TABELA_PRECOS_PUBLICA) redirect("/portal/precos");
  return <TabelaPrecos />;
}
