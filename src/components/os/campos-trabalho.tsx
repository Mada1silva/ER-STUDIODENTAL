"use client";

import { useState } from "react";
import type { CodigoItem, TipoTrabalho } from "@/types/database";
import { CORES_VITA_CLASSICAL, ESCALAS_COR, TIPOS_TRABALHO } from "@/lib/os/constantes";
import { ARCADA_INFERIOR, ARCADA_SUPERIOR, formatarDentes, parseElementos } from "@/lib/os/dentes";
import { ITENS, ITENS_POR_TIPO, MATERIAIS_GERAIS, MATERIAIS_POR_TIPO } from "@/lib/os/itens";
import { Odontograma } from "./odontograma";
import { AmostraCor, IconeTrabalho } from "./icones-trabalho";

/**
 * Bloco "Trabalho" usado na Nova OS (laboratório) e no pedido do Portal do Dentista:
 * biblioteca visual de trabalhos, odontograma, material, cor e o que vai junto.
 */
export function CamposTrabalho({ quem }: { quem: "laboratorio" | "dentista" }) {
  const [tipo, setTipo] = useState<TipoTrabalho | null>(null);
  const [elementos, setElementos] = useState("");
  const [material, setMaterial] = useState("");
  const [itens, setItens] = useState<Set<CodigoItem>>(new Set());
  const dentes = parseElementos(elementos);

  function escolherTipo(t: TipoTrabalho) {
    setTipo(t);
    setItens(new Set(ITENS_POR_TIPO[t]));
  }

  function alternarDente(d: number) {
    const s = new Set(dentes);
    if (s.has(d)) s.delete(d);
    else s.add(d);
    setElementos(formatarDentes([...s]));
  }

  function arcada(qual: "sup" | "inf" | "limpar") {
    if (qual === "limpar") return setElementos("");
    const alvo = qual === "sup" ? ARCADA_SUPERIOR : ARCADA_INFERIOR;
    const s = new Set(dentes);
    const ligar = !alvo.every((d) => s.has(d));
    alvo.forEach((d) => (ligar ? s.add(d) : s.delete(d)));
    setElementos(formatarDentes([...s]));
  }

  function alternarItem(c: CodigoItem) {
    setItens((atual) => {
      const novo = new Set(atual);
      if (novo.has(c)) novo.delete(c);
      else novo.add(c);
      return novo;
    });
  }

  const sugestoes = (tipo && MATERIAIS_POR_TIPO[tipo]) || MATERIAIS_GERAIS;

  return (
    <>
      <fieldset className="col-span-full">
        <legend className="rotulo">Tipo de trabalho *</legend>
        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {TIPOS_TRABALHO.map((t) => (
            <label
              key={t.codigo}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-prata-200 bg-white px-2 py-3 text-center text-xs font-medium text-grafite-700 transition hover:border-prata-400 has-checked:border-grafite-800 has-checked:bg-grafite-800 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-prata-400"
            >
              <input type="radio" name="tipo_trabalho" value={t.codigo} required className="sr-only" onChange={() => escolherTipo(t.codigo)} />
              <IconeTrabalho tipo={t.codigo} className="size-10" />
              <span className="leading-tight">{t.nome}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="col-span-full grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-prata-200 bg-prata-50 p-4">
          <p className="rotulo">Dentes / elementos</p>
          <p className="text-xs text-prata-500">Toque nos dentes. Vista de frente: D é o lado direito do paciente.</p>
          <div className="mt-2">
            <Odontograma selecionados={dentes} aoAlternar={alternarDente} />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {([["sup", "Arcada superior"], ["inf", "Arcada inferior"], ["limpar", "Limpar"]] as const).map(([a, rotulo]) => (
              <button key={a} type="button" onClick={() => arcada(a)} className="rounded-full border border-prata-300 bg-white px-3 py-1 text-xs text-grafite-700 hover:border-grafite-700">
                {rotulo}
              </button>
            ))}
          </div>
          <label htmlFor="elementos" className="sr-only">Dentes / elementos</label>
          <input
            id="elementos"
            name="elementos"
            value={elementos}
            onChange={(e) => setElementos(e.target.value)}
            className="campo mt-3"
            placeholder="Ou escreva: 11, 21 · 13 a 23 · arcada superior"
            autoComplete="off"
          />
          <input type="hidden" name="dentes" value={dentes.join(",")} />
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="material" className="rotulo">Material</label>
            <input id="material" name="material" value={material} onChange={(e) => setMaterial(e.target.value)} className="campo" placeholder="Toque em uma sugestão ou escreva" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sugestoes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMaterial(m)}
                  className={`rounded-full border bg-white px-3 py-1 text-xs text-grafite-700 transition hover:border-grafite-700 ${material === m ? "border-grafite-800" : "border-prata-200"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="escala_cor" className="rotulo">Escala de cor</label>
            <select id="escala_cor" name="escala_cor" className="campo" defaultValue="Vita Classical">
              {ESCALAS_COR.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="rotulo">
              Cor <span className="font-normal text-prata-500">(tons de referência da Vita Classical)</span>
            </legend>
            <div className="mt-1 grid grid-cols-5 gap-1 sm:grid-cols-10">
              {CORES_VITA_CLASSICAL.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer flex-col items-center rounded-lg py-1 text-[10px] font-medium text-grafite-600 transition hover:bg-prata-100 has-checked:bg-grafite-800 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-prata-400"
                >
                  <input type="radio" name="cor" value={c} className="sr-only" />
                  <AmostraCor cor={c} />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="cor_texto" className="rotulo">Outra cor ou detalhe de cor</label>
            <input id="cor_texto" name="cor_texto" className="campo" placeholder="Ex.: 2M2, cervical A3 e incisal A2" />
          </div>
        </div>
      </div>

      <fieldset className="col-span-full">
        <legend className="rotulo">{quem === "dentista" ? "O que você vai enviar junto" : "O que veio junto com o trabalho"}</legend>
        <p className="mb-2 text-xs text-prata-500">
          Ao escolher o tipo de trabalho, marcamos o que costuma acompanhar. Na chegada, o laboratório confere item por item
          {quem === "dentista" ? " e avisa você se faltar algo" : ""}.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ITENS.map((i) => (
            <label
              key={i.codigo}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-prata-200 bg-white px-3 py-2 text-sm text-grafite-700 transition has-checked:border-grafite-700 has-checked:bg-prata-50 has-checked:font-medium"
            >
              <input type="checkbox" name="itens" value={i.codigo} checked={itens.has(i.codigo)} onChange={() => alternarItem(i.codigo)} className="size-4 accent-grafite-800" />
              {i.nome}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
