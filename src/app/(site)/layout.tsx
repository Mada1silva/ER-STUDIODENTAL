import { Cabecalho } from "@/components/site/cabecalho";
import { Rodape } from "@/components/site/rodape";
import { WhatsAppFlutuante } from "@/components/site/whatsapp-flutuante";

/** Layout padrão do site institucional (público). */
export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-grafite-800 text-prata-200">
      <Cabecalho />
      <main className="flex-1">{children}</main>
      <Rodape />
      <WhatsAppFlutuante />
    </div>
  );
}
