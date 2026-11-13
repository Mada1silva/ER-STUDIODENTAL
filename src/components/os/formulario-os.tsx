"use client";

import { useActionState } from "react";
import type { Dentista } from "@/types/database";
import { criarOrdem, type EstadoFormOS } from "@/lib/os/acoes";
import { CORES_VITA_CLASSICAL, ESCALAS_COR, PRIORIDADES, TIPOS_TRABALHO } from "@/lib/os/constantes";

type Props = { dentistas: Pick<Dentista, "id" | "nome" | "clinica">[]; prazoPadrao: string };

export function FormularioOS({ dentistas, prazoPadrao }: Props) {
  const [estado, enviar, enviando] = useActionState<EstadoFormOS, FormData>(criarOrdem, {});

  return (
    <form action={enviar} className="grid gap-5 rounded-2xl border border-prata-200 bg-white p-5 sm:grid-cols-2 md:p-8">
      <fieldset className="contents">
        <legend className="col-span-full font-serif text-2xl">Dentista e paciente</legend>
        <div>
          <label htmlFor="dentista_id" className="rotulo">Dentista *</label>
          <select id="dentista_id" name="dentista_id" required className="campo" defaultValue="">
            <option value="" disabled>Selecione…</option>
            {dentistas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}{d.clinica ? ` · ${d.clinica}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="paciente_nome" className="rotulo">Paciente *</label>
          <input id="paciente_nome" name="paciente_nome" required className="campo" placeholder="Nome ou iniciais" />
        </div>
      </fieldset>

      <fieldset className="contents">
        <legend className="col-span-full mt-2 font-serif text-2xl">Trabalho</legend>
        <div>
          <label htmlFor="tipo_trabalho" className="rotulo">Tipo de trabalho *</label>
          <select id="tipo_trabalho" name="tipo_trabalho" required className="campo" defaultValue="">
            <option value="" disabled>Selecione…</option>
            {TIPOS_TRABALHO.map((t) => (
              <option key={t.codigo} value={t.codigo}>{t.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="elementos" className="rotulo">Dentes / elementos</label>
          <input id="elementos" name="elementos" className="campo" placeholder="Ex.: 11, 21 ou arcada superior" />
        </div>
        <div>
          <label htmlFor="material" className="rotulo">Material</label>
          <input id="material" name="material" className="campo" placeholder="Ex.: zircônia multicamada, E-max" />
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
            <input id="cor" name="cor" list="cores" className="campo" placeholder="Ex.: A2" />
            <datalist id="cores">
              {CORES_VITA_CLASSICAL.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>
        <div className="col-span-full">
          <label htmlFor="descricao" className="rotulo">Descrição / instruções do dentista</label>
          <textarea id="descricao" name="descricao" rows={3} className="campo" />
        </div>
      </fieldset>

      <fieldset className="contents">
        <legend className="col-span-full mt-2 font-serif text-2xl">Prazo e valor</legend>
        <div>
          <label htmlFor="data_prevista" className="rotulo">Entrega prevista</label>
          <input id="data_prevista" name="data_prevista" type="date" defaultValue={prazoPadrao} className="campo" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prioridade" className="rotulo">Prioridade</label>
            <select id="prioridade" name="prioridade" className="campo" defaultValue="normal">
              {PRIORIDADES.map((p) => <option key={p.codigo} value={p.codigo}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="valor" className="rotulo">Valor (R$)</label>
            <input id="valor" name="valor" inputMode="decimal" className="campo" placeholder="0,00" />
          </div>
        </div>
        <div className="col-span-full">
          <label htmlFor="observacoes" className="rotulo">Observações internas</label>
          <textarea id="observacoes" name="observacoes" rows={2} className="campo" />
        </div>
      </fieldset>

      {estado.erro && (
        <p className={`col-span-full rounded-lg px-3 py-2 text-sm ${estado.demo ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-800"}`}>
          {estado.erro}
        </p>
      )}

      <div className="col-span-full flex justify-end">
        <button disabled={enviando} className="rounded-full bg-grafite-800 px-6 py-2.5 font-medium text-white hover:bg-grafite-700 disabled:opacity-60">
          {enviando ? "Salvando…" : "Salvar OS"}
        </button>
      </div>
    </form>
  );
}
