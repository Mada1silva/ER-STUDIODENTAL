"use client";

import { useActionState } from "react";
import { pedirTrabalho, type EstadoFormOS } from "@/lib/os/acoes";
import { CORES_VITA_CLASSICAL, ESCALAS_COR, FORMAS_ENVIO, TIPOS_TRABALHO } from "@/lib/os/constantes";

export function FormularioPedido({ prazoPadrao }: { prazoPadrao: string }) {
  const [estado, enviar, enviando] = useActionState<EstadoFormOS, FormData>(pedirTrabalho, {});

  return (
    <form action={enviar} className="grid gap-5 rounded-2xl border border-prata-200 bg-white p-5 sm:grid-cols-2 md:p-8">
      <div>
        <label htmlFor="paciente_nome" className="rotulo">Paciente *</label>
        <input id="paciente_nome" name="paciente_nome" required className="campo" placeholder="Nome ou iniciais" />
      </div>
      <div>
        <label htmlFor="tipo_trabalho" className="rotulo">Tipo de trabalho *</label>
        <select id="tipo_trabalho" name="tipo_trabalho" required className="campo" defaultValue="">
          <option value="" disabled>Selecione…</option>
          {TIPOS_TRABALHO.map((t) => <option key={t.codigo} value={t.codigo}>{t.nome}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="elementos" className="rotulo">Dentes / elementos</label>
        <input id="elementos" name="elementos" className="campo" placeholder="Ex.: 11, 21 ou arcada superior" />
      </div>
      <div>
        <label htmlFor="material" className="rotulo">Material desejado</label>
        <input id="material" name="material" className="campo" placeholder="Ex.: zircônia, E-max" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="escala_cor" className="rotulo">Escala de cor</label>
          <select id="escala_cor" name="escala_cor" className="campo" defaultValue="Vita Classical">
            {ESCALAS_COR.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cor" className="rotulo">Cor</label>
          <input id="cor" name="cor" list="cores-pedido" className="campo" placeholder="Ex.: A2" />
          <datalist id="cores-pedido">{CORES_VITA_CLASSICAL.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
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
