import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarOrdem } from "@/lib/os/dados";
import { NOME_STATUS, NOME_TIPO, STATUS_OS, formatarNumeroOS } from "@/lib/os/constantes";
import { formatarData, formatarDataHora, formatarMoeda } from "@/lib/datas";
import { SeloPrazo } from "@/components/os/cartao-os";
import { AvisoDemo } from "@/components/painel/aviso-demo";

export const dynamic = "force-dynamic";

export default async function DetalheOS({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ordem, historico, demo } = await buscarOrdem(id);
  if (!ordem) notFound();

  const etapaAtual = STATUS_OS.findIndex((s) => s.codigo === ordem.status);
  const campos: [string, string][] = [
    ["Dentista", ordem.dentista ? `${ordem.dentista.nome}${ordem.dentista.clinica ? ` · ${ordem.dentista.clinica}` : ""}` : "—"],
    ["Paciente", ordem.paciente_nome],
    ["Tipo de trabalho", NOME_TIPO[ordem.tipo_trabalho]],
    ["Dentes / elementos", ordem.elementos ?? "—"],
    ["Material", ordem.material ?? "—"],
    ["Cor", ordem.cor ? `${ordem.cor}${ordem.escala_cor ? ` (${ordem.escala_cor})` : ""}` : "—"],
    ["Entrada", formatarData(ordem.data_entrada)],
    ["Entrega prevista", formatarData(ordem.data_prevista)],
    ["Valor", formatarMoeda(ordem.valor)],
    ["Prioridade", ordem.prioridade === "urgente" ? "Urgente" : "Normal"],
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/painel/os" className="text-sm text-grafite-600 hover:underline">← Voltar para a produção</Link>
      {demo && <AvisoDemo />}

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl font-semibold">{formatarNumeroOS(ordem.numero)}</h1>
        <span className="rounded-full px-3 py-1 text-sm font-medium text-white" style={{ backgroundColor: STATUS_OS[etapaAtual]?.cor }}>
          {NOME_STATUS[ordem.status]}
        </span>
        <SeloPrazo data={ordem.data_prevista} pronto={ordem.status === "pronto"} />
      </header>

      {/* Linha do tempo das etapas */}
      <ol className="grid grid-cols-6 gap-1" aria-label="Etapas da produção">
        {STATUS_OS.map((s, i) => (
          <li key={s.codigo} className="space-y-1">
            <div className={`h-1.5 rounded-full ${i <= etapaAtual ? "bg-grafite-800" : "bg-prata-200"}`} />
            <p className={`text-[11px] leading-tight ${i === etapaAtual ? "font-semibold text-grafite-900" : "text-prata-500"}`}>{s.nome}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 md:grid-cols-3">
        <dl className="grid gap-x-6 gap-y-4 rounded-2xl border border-prata-200 bg-white p-6 sm:grid-cols-2 md:col-span-2">
          {campos.map(([rotulo, valor]) => (
            <div key={rotulo}>
              <dt className="text-xs uppercase tracking-wide text-prata-500">{rotulo}</dt>
              <dd className="mt-0.5 text-grafite-900">{valor}</dd>
            </div>
          ))}
          {ordem.descricao && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-prata-500">Descrição</dt>
              <dd className="mt-0.5 whitespace-pre-line">{ordem.descricao}</dd>
            </div>
          )}
          {ordem.observacoes && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-prata-500">Observações internas</dt>
              <dd className="mt-0.5 whitespace-pre-line">{ordem.observacoes}</dd>
            </div>
          )}
        </dl>

        <section className="rounded-2xl border border-prata-200 bg-white p-6">
          <h2 className="font-serif text-2xl">Histórico</h2>
          <ol className="mt-4 space-y-3 border-l border-prata-200 pl-4 text-sm">
            {historico.map((h) => (
              <li key={h.id}>
                <p className="font-medium">{NOME_STATUS[h.status_novo]}</p>
                <p className="text-xs text-prata-500">{formatarDataHora(h.alterado_em)}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
