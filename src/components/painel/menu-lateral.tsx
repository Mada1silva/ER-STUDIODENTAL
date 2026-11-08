"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/painel/os", rotulo: "Ordens de Serviço", pronto: true },
  { href: "/painel/dentistas", rotulo: "Dentistas", pronto: true },
  { href: "/painel/financeiro", rotulo: "Financeiro", pronto: false },
];

export function MenuLateral() {
  const caminho = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Painel">
      {itens.map((i) => {
        const ativo = caminho.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${
              ativo ? "bg-white/10 text-white" : "text-prata-400 hover:bg-white/5 hover:text-prata-100"
            }`}
          >
            {i.rotulo}
            {!i.pronto && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">em breve</span>}
          </Link>
        );
      })}
    </nav>
  );
}
