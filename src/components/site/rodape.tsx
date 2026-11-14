import Link from "next/link";
import { site } from "@/lib/config/site";
import { Logo } from "./logo";

export function Rodape() {
  return (
    <footer className="border-t border-white/5 bg-grafite-950 text-sm text-prata-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p>Laboratório de prótese dentária desde {site.desde}.</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-prata-200">Atendimento</p>
          <p>{site.localizacao}</p>
          <p>{site.regiaoAtendida.join(" · ")}</p>
          <p>{site.horario}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-prata-200">Contato</p>
          <p>WhatsApp {site.telefone}</p>
          <p>{site.email}</p>
          <p>@{site.instagram}</p>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nome}. Responsável técnico: {site.responsavelTecnico}, {site.cro}.
          </p>
          <Link href="/painel" className="text-prata-500 hover:text-prata-200">
            Área do laboratório
          </Link>
        </div>
      </div>
    </footer>
  );
}
