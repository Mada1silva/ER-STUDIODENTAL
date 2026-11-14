"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StatusOS } from "@/types/database";
import { ACAO_PROXIMA, INFO_STATUS, proximoStatus } from "@/lib/os/constantes";
import { moverOrdem } from "@/lib/os/acoes";

/** Botão grande "próxima etapa" na página da OS. */
export function BotaoAvancar({ id, status, demo }: { id: string; status: StatusOS; demo: boolean }) {
  const proximo = proximoStatus(status);
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);
  if (!proximo) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {aviso && <span className="text-sm text-grafite-600" role="status">{aviso}</span>}
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            const r = await moverOrdem(id, proximo);
            if (!r.ok) setAviso(r.erro);
            else if (demo) setAviso("Demonstração: a mudança não foi salva.");
            else router.refresh();
          })
        }
        className="rounded-full px-5 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
        style={{ background: INFO_STATUS[proximo].cor }}
      >
        {pendente ? "Salvando…" : `${ACAO_PROXIMA[status]} →`}
      </button>
    </div>
  );
}
