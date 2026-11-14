"use client";

import { useActionState } from "react";
import { pedirTrabalho, type EstadoFormOS } from "@/lib/os/acoes";
import { FORMAS_ENVIO } from "@/lib/os/constantes";
import { CamposTrabalho } from "@/components/os/campos-trabalho";

export function FormularioPedido({ prazoPadrao }: { prazoPadrao: string }) {
  const [estado, enviar, enviando] = useActionState<EstadoFormOS, FormData>(pedirTrabalho, {});

  return (
    <form action={enviar} className="grid gap-5 rounded-2xl border border-prata-200 bg-white p-5 sm:grid-cols-2 md:p-8">
      <div>
        <label htmlFor="paciente_nome" className="rotulo">Paciente *</label>
        <input id="paciente_nome" name="paciente_nome" required className="campo" placeholder="Nome ou iniciais" />
      </div>
      <div>
        <label htmlFor="envio" className="rotulo">Como vai enviar o material</label>
        <select id="envio" name="envio" className="campo">
          {FORMAS_ENVIO.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="data_prevista" className="rotulo">Para quando precisa</label>
        <input id="data_prevista" name="data_prevista" type="date" defaultValue={prazoPadrao} className="campo" />
      </div>
      <CamposTrabalho quem="dentista" />
      <div className="col-span-full">
        <label htmlFor="descricao" className="rotulo">Instruções para o laboratório</label>
        <textarea id="descricao" name="descricao" rows={3} className="campo" placeholder="Ex.: preparo para coroa total, término em chanfro, paciente com bruxismo" />
      </div>
      <div className="col-span-full flex items-center gap-2">
        <input id="urgente" name="urgente" type="checkbox" className="size-4" />
        <label htmlFor="urgente" className="text-sm text-grafite-700">Preciso com urgência (sujeito a confirmação do laboratório)</label>
      </div>
      {estado.erro && (
        <p className={`col-span-full rounded-lg px-3 py-2 text-sm ${estado.demo ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-800"}`}>{estado.erro}</p>
      )}
      <div className="col-span-full flex justify-end">
        <button disabled={enviando} className="rounded-full bg-grafite-800 px-6 py-2.5 font-medium text-white hover:bg-grafite-700 disabled:opacity-60">
          {enviando ? "Enviando…" : "Enviar pedido"}
        </button>
      </div>
    </form>
  );
}
