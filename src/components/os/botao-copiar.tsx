"use client";

import { useState } from "react";

/** Copia um texto (ex.: o link de acompanhamento) e confirma na tela. */
export function BotaoCopiar({ texto, rotulo = "Copiar link", className = "" }: { texto: string; rotulo?: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(texto)
          .then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
          })
          .catch(() => window.prompt("Copie o link:", texto));
      }}
      className={`rounded-full border border-prata-300 bg-white px-4 py-2 text-sm text-grafite-700 hover:bg-prata-50 ${className}`}
    >
      {copiado ? "Link copiado!" : rotulo}
    </button>
  );
}
