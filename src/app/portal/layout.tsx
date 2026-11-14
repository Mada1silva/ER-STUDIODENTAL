import { Logo } from "@/components/site/logo";
import { AbasPortal } from "@/components/portal/abas-portal";
import { listarMinhasOrdens } from "@/lib/os/dados";
import { sair } from "@/lib/os/acoes";
import { site } from "@/lib/config/site";
import { supabaseConfigurado } from "@/lib/supabase/config";

export const metadata = { title: "Portal do Dentista" };

/** Layout da área do dentista parceiro. */
export default async function LayoutPortal({ children }: { children: React.ReactNode }) {
  const { dentista } = await listarMinhasOrdens();
  return (
    <div className="flex min-h-dvh flex-col bg-prata-50">
      <header className="bg-grafite-800">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Logo href="/portal" subtitulo="Portal do Dentista" />
          <div className="flex items-center gap-3 text-sm">
            {dentista && (
              <span className="leading-tight text-prata-300">
                <span className="block font-medium text-prata-100">{dentista.nome}</span>
                <span className="block text-xs text-prata-500">{dentista.clinica}</span>
              </span>
            )}
            {supabaseConfigurado && (
              <form action={sair}>
                <button className="rounded-full border border-prata-500/50 px-3 py-1.5 text-xs text-prata-200 hover:border-prata-200">Sair</button>
              </form>
            )}
          </div>
        </div>
        <AbasPortal />
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-prata-200 px-4 py-6 text-center text-xs text-prata-500">
        Dúvidas sobre um trabalho? WhatsApp do laboratório: {site.telefone} · {site.horario}
      </footer>
    </div>
  );
}
