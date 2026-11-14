"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Dentista, OrdemComDentista } from "@/types/database";
import { NOME_TIPO, formatarNumeroOS, normalizar } from "@/lib/os/constantes";
import { formatarData, formatarMoeda, nomeMes } from "@/lib/datas";
import { site } from "@/lib/config/site";
import { SeloEtapa } from "@/components/os/etapas";

type Props = {
  mes: string;
  meses: string[];
  dentistas: Dentista[];
  entregues: OrdemComDentista[];
  abertos: OrdemComDentista[];
  buscaInicial: string;
};

const soma = (lista: OrdemComDentista[]) => lista.reduce((s, o) => s + (o.valor ?? 0), 0);
const dataEntrega = (o: OrdemComDentista) => formatarData(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(o.data_entrega!)));

/** Fatura por dentista/clínica: busca, lista de trabalhos, total e resumo para o WhatsApp. */
export function PainelFatura({ mes, meses, dentistas, entregues, abertos, buscaInicial }: Props) {
  const router = useRouter();
  const [busca, setBusca] = useState(buscaInicial);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  const termo = normalizar(busca.trim());
  const achados = useMemo(
    () => (termo ? dentistas.filter((d) => normalizar(`${d.nome} ${d.clinica ?? ""}`).includes(termo)) : []),
    [dentistas, termo],
  );
  const selecionadoId = escolhido ?? (achados.length === 1 ? achados[0].id : null);
  const selecionado = dentistas.find((d) => d.id === selecionadoId) ?? null;

  const porDentista = dentistas.map((d) => {
    const fatura = entregues.filter((o) => o.dentista_id === d.id);
    const emAberto = abertos.filter((o) => o.dentista_id === d.id);
    return { d, fatura, emAberto, total: soma(fatura) };
  });
  const totalMes = soma(entregues);
  const atual = porDentista.find((x) => x.d.id === selecionadoId);

  const resumo =
    selecionado && atual
      ? [
          `*${site.nome}*`,
          `Fatura de ${nomeMes(mes)} · ${selecionado.nome}${selecionado.clinica ? ` (${selecionado.clinica})` : ""}`,
          "",
          ...atual.fatura.map((o) => `${dataEntrega(o)} · ${formatarNumeroOS(o.numero)} · ${NOME_TIPO[o.tipo_trabalho]} · ${o.paciente_nome} · ${formatarMoeda(o.valor)}`),
          "",
          `Total: ${formatarMoeda(atual.total)}`,
          `À vista (5% de desconto): ${formatarMoeda(atual.total * 0.95)}`,
          `Ou 3x de ${formatarMoeda(atual.total / 3)}`,
          "Pagamento até o dia 10.",
        ].join("\n")
      : "";

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resumo);
      setCopiado("Resumo copiado. É só colar no WhatsApp.");
    } catch {
      (document.getElementById("texto-fatura") as HTMLTextAreaElement | null)?.select();
      setCopiado("Texto selecionado: use Ctrl+C para copiar.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-prata-200 bg-white p-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="busca-fin" className="rotulo">Dentista ou clínica</label>
          <input
            id="busca-fin"
            type="search"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setEscolhido(null);
            }}
            placeholder="Ex.: Ana, Odonto, Instituto"
            className="campo"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="mes-fin" className="rotulo">Mês da fatura</label>
          <select
            id="mes-fin"
            value={mes}
            onChange={(e) => router.push(`/painel/financeiro?mes=${e.target.value}${busca ? `&q=${encodeURIComponent(busca)}` : ""}`)}
            className="campo"
          >
            {meses.map((m) => (
              <option key={m} value={m}>{nomeMes(m)}</option>
            ))}
          </select>
        </div>
        {termo && (
          <div className="col-span-full flex flex-wrap gap-2">
            {achados.length === 0 && <p className="text-sm text-prata-500">Nenhum dentista ou clínica com esse nome.</p>}
            {achados.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setEscolhido(d.id)}
                className={`rounded-full border px-3 py-1.5 text-sm ${d.id === selecionadoId ? "border-grafite-800 bg-grafite-800 text-white" : "border-prata-200 hover:bg-prata-50"}`}
              >
                {d.nome}{d.clinica ? ` · ${d.clinica}` : ""}
              </button>
            ))}
          </div>
        )}
      </div>

      {selecionado && atual && (
        <section className="space-y-4 rounded-2xl border border-prata-200 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-prata-500">Fatura de {nomeMes(mes)}</p>
              <h2 className="font-serif text-3xl">{selecionado.nome}</h2>
              <p className="text-sm text-grafite-600">{selecionado.clinica}{selecionado.cro ? ` · CRO ${selecionado.cro}/${selecionado.cro_uf ?? ""}` : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-prata-500">Total entregue no mês</p>
              <p className="font-serif text-4xl tabular-nums">{formatarMoeda(atual.total)}</p>
              <p className="text-xs text-grafite-600">
                À vista (−5%): <strong className="tabular-nums">{formatarMoeda(atual.total * 0.95)}</strong> · ou 3x de{" "}
                <strong className="tabular-nums">{formatarMoeda(atual.total / 3)}</strong>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-prata-500">
                <tr><th className="py-2 pr-3">Entregue em</th><th className="py-2 pr-3">OS</th><th className="py-2 pr-3">Trabalho</th><th className="py-2 pr-3">Paciente</th><th className="py-2 text-right">Valor</th></tr>
              </thead>
              <tbody className="divide-y divide-prata-100">
                {atual.fatura.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 pr-3 tabular-nums">{dataEntrega(o)}</td>
                    <td className="py-2 pr-3"><Link href={`/painel/os/${o.id}`} className="font-mono text-xs font-semibold hover:underline">{formatarNumeroOS(o.numero)}</Link></td>
                    <td className="py-2 pr-3">{NOME_TIPO[o.tipo_trabalho]}{o.elementos && <span className="text-prata-500"> ({o.elementos})</span>}</td>
                    <td className="py-2 pr-3">{o.paciente_nome}</td>
                    <td className="py-2 text-right tabular-nums">{formatarMoeda(o.valor)}</td>
                  </tr>
                ))}
                {atual.fatura.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-prata-500">Nenhum trabalho entregue em {nomeMes(mes)}.</td></tr>
                )}
              </tbody>
              {atual.fatura.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-grafite-800 font-semibold">
                    <td colSpan={4} className="py-2">{atual.fatura.length} trabalho{atual.fatura.length > 1 ? "s" : ""}</td>
                    <td className="py-2 text-right tabular-nums">{formatarMoeda(atual.total)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {atual.emAberto.length > 0 && (
            <div className="rounded-xl bg-prata-50 p-4">
              <p className="text-sm font-medium">Ainda não entregues ({atual.emAberto.length}) · {formatarMoeda(soma(atual.emAberto))}</p>
              <p className="text-xs text-grafite-600">Entram na fatura do mês em que forem entregues.</p>
              <ul className="mt-2 space-y-1 text-sm">
                {atual.emAberto.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center gap-2">
                    <Link href={`/painel/os/${o.id}`} className="font-mono text-xs font-semibold hover:underline">{formatarNumeroOS(o.numero)}</Link>
                    {NOME_TIPO[o.tipo_trabalho]} · {o.paciente_nome} <SeloEtapa status={o.status} />
                    <span className="ml-auto tabular-nums">{formatarMoeda(o.valor)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="texto-fatura" className="rotulo">Resumo para enviar ao dentista</label>
            <textarea id="texto-fatura" rows={10} readOnly value={resumo} className="campo font-mono text-xs" />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={copiar} className="rounded-full bg-grafite-800 px-5 py-2 text-sm font-medium text-white hover:bg-grafite-700">
                Copiar resumo
              </button>
              {copiado && <span className="text-sm text-emerald-700" role="status">{copiado}</span>}
            </div>
          </div>
        </section>
      )}

      <section className="overflow-x-auto rounded-2xl border border-prata-200 bg-white">
        <table className="w-full text-left text-sm">
          <caption className="px-4 pt-4 text-left font-serif text-2xl">Todos os clientes em {nomeMes(mes)}</caption>
          <thead className="text-xs uppercase tracking-wide text-prata-500">
            <tr><th className="px-4 py-3">Dentista / clínica</th><th className="px-4 py-3 text-right">Entregues</th><th className="px-4 py-3 text-right">Fatura</th><th className="px-4 py-3 text-right">Em produção</th></tr>
          </thead>
          <tbody className="divide-y divide-prata-100">
            {porDentista.map(({ d, fatura, emAberto, total }) => (
              <tr key={d.id} onClick={() => setEscolhido(d.id)} className={`cursor-pointer hover:bg-prata-50 ${d.id === selecionadoId ? "bg-prata-50" : ""}`}>
                <td className="px-4 py-3">
                  <button type="button" className="text-left" onClick={() => setEscolhido(d.id)}>
                    <span className="font-medium">{d.nome}</span> <span className="text-prata-500">· {d.clinica}</span>
                  </button>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{fatura.length}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{formatarMoeda(total)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-grafite-600">{emAberto.length ? `${emAberto.length} · ${formatarMoeda(soma(emAberto))}` : "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-grafite-800 font-semibold">
              <td className="px-4 py-3" colSpan={2}>Total do mês</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatarMoeda(totalMes)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  );
}
