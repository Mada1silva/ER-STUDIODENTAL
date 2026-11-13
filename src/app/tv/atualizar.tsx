"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Pede dados novos ao servidor de tempos em tempos (a TV fica aberta o dia todo). */
export function AtualizarSozinho({ segundos }: { segundos: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), segundos * 1000);
    return () => clearInterval(t);
  }, [router, segundos]);
  return null;
}

const fuso = { timeZone: "America/Sao_Paulo" } as const;

/** Relógio grande no canto da TV. */
export function Relogio() {
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => {
    setAgora(new Date());
    const t = setInterval(() => setAgora(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right" suppressHydrationWarning>
      <p className="font-serif text-5xl leading-none text-prata-100 tabular-nums">
        {agora ? new Intl.DateTimeFormat("pt-BR", { ...fuso, hour: "2-digit", minute: "2-digit" }).format(agora) : "--:--"}
      </p>
      <p className="text-xs text-prata-500">{agora ? new Intl.DateTimeFormat("pt-BR", { ...fuso, weekday: "long", day: "numeric", month: "long" }).format(agora) : ""}</p>
    </div>
  );
}
