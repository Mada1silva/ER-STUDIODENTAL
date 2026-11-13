import Link from "next/link";
import { Logo } from "./logo";
import { linkWhatsApp } from "@/lib/config/site";
import { IconeWhatsApp } from "./icones";

const links = [
  { href: "/#sobre", rotulo: "O Studio" },
  { href: "/#diferenciais", rotulo: "Diferenciais" },
  { href: "/#tecnologia", rotulo: "Para o dentista" },
  { href: "/#galeria", rotulo: "Casos" },
  { href: "/precos", rotulo: "Preços" },
  { href: "/#contato", rotulo: "Contato" },
];

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-grafite-800/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-prata-300 md:flex" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.rotulo}
            </a>
          ))}
          <Link href="/portal" className="transition hover:text-white">
            Portal do Dentista
          </Link>
        </nav>
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-prata-100 px-4 py-2 text-sm font-medium text-grafite-900 transition hover:bg-white"
        >
          <IconeWhatsApp className="size-4" />
          <span className="hidden sm:inline">Fale conosco</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
