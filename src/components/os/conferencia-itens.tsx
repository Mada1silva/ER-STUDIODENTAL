"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CodigoItem, ItemEnviado } from "@/types/database";
import { conferirItem } from "@/lib/os/acoes";
import { CURTO_ITEM, NOME_ITEM, conferenciaPendente, itensFaltando } from "@/lib/os/itens";
import { quando } from "@/lib/datas";

type Props = {
  id: string;
  itensIniciais: ItemEnviado[];
  conferidoEm: string | null;
  /** true no painel (botões Chegou/Faltou); false no portal (só mostra). */
  laboratorio: boolean;
  demo?: boolean;
  /** Link pronto do WhatsApp do dentista (só no painel). */
  linkWhatsApp?: string | null;
};

/** Conferência na chegada: item por item do que acompanha o trabalho. */
export function ConferenciaItens({ id, itensIniciais, conferidoEm, laboratorio, demo = false, linkWhatsApp }: Props) {
  const [itens, setItens] = useState(itensIniciais);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

  function marcar(c: CodigoItem, chegou: boolean) {
    const antes = itens;
    setItens((lista) => lista.map((i) => (i.c === c ? { ...i, conf: chegou } : i)));
    iniciar(async () => {
      const r = await conferirItem(id, c, chegou);
      if (!r.ok) {
        setItens(antes);
        setErro(r.erro);
      } else {
        setErro(null);
        if (!demo) router.refresh();
      }
    });
  }

  const faltou = itensFaltando(itens);
  const aguardando = conferenciaPendente(itens);

  return (
    <section className="rounded-2xl border border-prata-200 bg-white p-6">
      <h2 className="font-serif text-2xl">{laboratorio ? "Conferência na chegada" : "O que você enviou"}</h2>
      <p className="text-sm text-grafite-600">
        {laboratorio ? "Confira item por item. Se faltar algo, o dentista é avisado no portal na hora." : "O laboratório confere cada item quando o trabalho chega."}
      </p>

      {itens.length ? (
        <ul className="mt-3 divide-y divide-prata-100">
          {itens.map((i) => (
            <li key={i.c} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="text-sm text-grafite-900">{NOME_ITEM[i.c]}</span>
              {laboratorio ? (
                <span className="flex gap-1.5">
                  {([true, false] as const).map((v) => {
                    const ativo = i.conf === v;
                    return (
                      <button
                        key={String(v)}
                        type="button"
                        disabled={pendente}
                        aria-pressed={ativo}
                        onClick={() => marcar(i.c, v)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-60 ${
                          ativo ? (v ? "bg-emerald-600 text-white" : "bg-red-600 text-white") : "border border-prata-200 text-grafite-600 hover:bg-prata-50"
                        }`}
                      >
                        {v ? "Chegou" : "Faltou"}
                      </button>
                    );
                  })}
                </span>
              ) : i.conf === true ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">Chegou</span>
              ) : i.conf === false ? (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Faltou</span>
              ) : (
                <span className="rounded-full bg-prata-100 px-2 py-0.5 text-xs text-grafite-600">Aguardando conferência</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-prata-500">Nenhum item informado.</p>
      )}

      {itens.length > 0 &&
        (aguardando ? (
          laboratorio && <p className="mt-3 text-xs text-prata-500">Marque todos os itens para concluir a conferência.</p>
        ) : faltou.length ? (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            <strong>Faltou: {faltou.map((c) => CURTO_ITEM[c]).join(", ")}.</strong>{" "}
            {laboratorio ? "O dentista já vê o aviso no portal." : "Envie para o laboratório seguir com o trabalho."}
            {laboratorio && linkWhatsApp && (
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit rounded-full bg-whatsapp px-3 py-1.5 text-xs font-medium text-white hover:brightness-110">
                Avisar também no WhatsApp
              </a>
            )}
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
            Tudo conferido{conferidoEm ? ` ${quando(conferidoEm)}` : ""}. Nada faltando.
          </p>
        ))}
      {erro && <p role="alert" className="mt-2 text-sm text-red-700">{erro}</p>}
      {demo && laboratorio && <p className="mt-2 text-xs text-prata-500">Demonstração: a conferência não é salva.</p>}
    </section>
  );
}
