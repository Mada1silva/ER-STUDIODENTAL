import { condicoesPagamento, tabelaPrecos } from "@/lib/config/tabela-precos";
import { linkWhatsApp, site } from "@/lib/config/site";
import { formatarMoeda } from "@/lib/datas";
import { IconeWhatsApp } from "@/components/site/icones";

/** Tabela de preços (fundo grafite). Usada no Portal do Dentista e, se a tabela for pública, no site. */
export function TabelaPrecos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-prata-400">Para dentistas parceiros</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-prata-100">Tabela de preços</h1>
      <p className="mt-4 max-w-2xl text-prata-300">
        Valores por elemento. Itens marcados como “sob consulta” dependem do material escolhido: fale com o laboratório.
      </p>

      <dl className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-grafite-900 p-5">
          <dt className="text-xs uppercase tracking-wider text-prata-500">Prazo de entrega</dt>
          <dd className="mt-2 font-serif text-2xl text-prata-100">{condicoesPagamento.prazo}</dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-grafite-900 p-5">
          <dt className="text-xs uppercase tracking-wider text-prata-500">Pagamento</dt>
          <dd className="mt-2 space-y-1 text-sm text-prata-200">
            {condicoesPagamento.pagamento.map((p) => <p key={p}>{p}</p>)}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-grafite-900 p-5">
          <dt className="text-xs uppercase tracking-wider text-prata-500">Fora do horário</dt>
          <dd className="mt-2 text-sm text-prata-200">{condicoesPagamento.aposAs19h}</dd>
        </div>
      </dl>

      <div className="mt-12 columns-1 gap-6 md:columns-2">
        {tabelaPrecos.map((g) => (
          <section key={g.grupo} className="mb-6 break-inside-avoid rounded-2xl border border-white/5 bg-grafite-900 p-5">
            <h2 className="font-serif text-2xl text-prata-100">{g.grupo}</h2>
            <ul className="mt-3 divide-y divide-white/5">
              {g.itens.map((i) => (
                <li key={i.nome} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <span className="text-prata-300">{i.nome}</span>
                  <span className={`shrink-0 tabular-nums ${i.valor == null ? "text-prata-500 italic" : "font-medium text-prata-100"}`}>
                    {i.valor == null ? "sob consulta" : formatarMoeda(i.valor)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-grafite-900 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-prata-300">Responsável técnico: {site.responsavelTecnico}, {site.cro}. Dúvidas sobre algum item?</p>
        <a href={linkWhatsApp("Olá! Vi a tabela de preços no site e gostaria de tirar uma dúvida.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 font-medium text-white hover:brightness-110">
          <IconeWhatsApp /> Consultar no WhatsApp
        </a>
      </div>
    </div>
  );
}
