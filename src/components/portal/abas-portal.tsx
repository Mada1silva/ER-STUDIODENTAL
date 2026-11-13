"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const abas = [
  { href: "/portal", rotulo: "Meus trabalhos" },
  { href: "/portal/pedido", rotulo: "Pedir novo trabalho" },
];

export function AbasPortal() {
  const caminho = usePathname();
  return (
    <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4" aria-label="Portal">
      {abas.map((a) => {
        const ativa = a.href === "/portal" ? caminho === "/portal" || caminho.startsWith("/portal/os") : caminho.startsWith(a.href);
        return (
          <Link
            key={a.href}
            href={a.href}
            className={`shrink-0 rounded-t-lg px-4 py-2 text-sm transition ${ativa ? "bg-prata-50 font-medium text-grafite-900" : "text-prata-400 hover:text-prata-100"}`}
          >
            {a.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
