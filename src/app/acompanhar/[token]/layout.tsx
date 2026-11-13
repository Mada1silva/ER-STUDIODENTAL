import type { Metadata } from "next";
import { Logo } from "@/components/site/logo";
import { IconeWhatsApp } from "@/components/site/icones";
import { linkWhatsApp } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Acompanhamento do trabalho",
  // Link pessoal de cada trabalho: não deve aparecer no Google.
  robots: { index: false, follow: false },
};

/** Página pública (sem senha) que o dentista abre pelo link do WhatsApp. */
export default function LayoutAcompanhar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-prata-50 text-grafite-900">
      <header data-nao-imprimir className="bg-grafite-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-prata-100 px-3 py-1.5 text-xs font-medium text-grafite-900 hover:bg-white"
          >
            <IconeWhatsApp className="size-4" /> Falar com o laboratório
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
