import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { MenuLateral } from "@/components/painel/menu-lateral";
import { sair } from "@/lib/os/acoes";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import { obterPerfil } from "@/lib/os/dados";

export const metadata = { title: "Painel do laboratório" };

/** Layout padrão da área interna do laboratório. */
export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  // Dentista que entrar aqui por engano vai para o portal dele.
  const perfil = await obterPerfil();
  if (!perfil.demo && perfil.papel !== "laboratorio") redirect("/portal");

  return (
    <div className="min-h-dvh md:flex">
      <aside className="flex flex-col gap-4 bg-grafite-800 p-4 md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:gap-8 md:p-5">
        <Logo href="/painel/os" subtitulo="Painel" />
        <MenuLateral />
        <div className="hidden flex-1 md:block" />
        <div className="hidden space-y-2 text-xs md:block">
          <Link href="/" className="block text-prata-500 hover:text-prata-200">
            Ver site
          </Link>
          {supabaseConfigurado && (
            <form action={sair}>
              <button className="text-prata-500 hover:text-prata-200">Sair</button>
            </form>
          )}
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
