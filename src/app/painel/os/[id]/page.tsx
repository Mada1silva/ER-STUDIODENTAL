import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarOrdem } from "@/lib/os/dados";
import { NOME_BANCADA, NOME_TIPO, formatarNumeroOS } from "@/lib/os/constantes";
import { formatarData, formatarMoeda } from "@/lib/datas";
import { SeloPrazo } from "@/components/os/cartao-os";
import { LinhaDoTempo, SeloEtapa, TrilhaEtapas } from "@/components/os/etapas";
import { BotaoAvancar } from "@/components/os/botao-avancar";
import { AvisoDemo } from "@/components/painel/aviso-demo";
import { AvisoDentista, BlocoDentes } from "@/components/os/blocos-os";
import { ConferenciaItens } from "@/components/os/conferencia-itens";
import { FotoSaida } from "@/components/os/foto-saida";
import { indiceStatus } from "@/lib/os/constantes";
import { caminhoAcompanhar, linkWhatsAppDentista, mensagemAvisoDentista } from "@/lib/os/acompanhamento";
import { urlDoSiteAtual } from "@/lib/os/origem";

export const dynamic = "force-dynamic";

export default async function DetalheOS({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ordem, historico, demo } = await buscarOrdem(id);
  if (!ordem) notFound();
  const urlSite = await urlDoSiteAtual();
  const wppFaltou = linkWhatsAppDentista(ordem.dentista?.whatsapp, mensagemAvisoDentista(ordem, urlSite + caminhoAcompanhar(ordem.token_publico)));

  const campos: [string, string][] = [
    ["Dentista", ordem.dentista ? `${ordem.dentista.nome}${ordem.dentista.clinica ? ` · ${ordem.dentista.clinica}` : ""}` : "—"],
    ["Paciente", ordem.paciente_nome],
    ["Tipo de trabalho", NOME_TIPO[ordem.tipo_trabalho]],
    ["Dentes / elementos", ordem.elementos ?? "—"],
    ["Material", ordem.material ?? "—"],
    ["Cor", ordem.cor ? `${ordem.cor}${ordem.escala_cor ? ` (${ordem.escala_cor})` : ""}` : "—"],
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
        <SeloEtapa status={ordem.status} grande />
        {ordem.status === "em_andamento" && ordem.etapa_bancada && (
          <span className="text-sm text-grafite-600">
            Bancada: <strong>{NOME_BANCADA[ordem.etapa_bancada]}</strong>
          </span>
        )}
        <SeloPrazo ordem={ordem} />
      </header>

      <div className="space-y-4 rounded-2xl border border-prata-200 bg-white p-5">
        <TrilhaEtapas status={ordem.status} rotulos />
        <BotaoAvancar id={ordem.id} status={ordem.status} demo={demo} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <dl className="grid content-start gap-x-6 gap-y-4 rounded-2xl border border-prata-200 bg-white p-6 sm:grid-cols-2 md:col-span-2">
          {campos.map(([rotulo, valor]) => (
            <div key={rotulo} className="min-w-0">
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
          <h2 className="mb-4 font-serif text-2xl">Linha do tempo</h2>
          <LinhaDoTempo status={ordem.status} historico={historico} interno />
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDentes ordem={ordem} />
        <ConferenciaItens key={JSON.stringify(ordem.itens)} id={ordem.id} itensIniciais={ordem.itens} conferidoEm={ordem.conferido_em} laboratorio demo={demo} linkWhatsApp={wppFaltou} />
        <FotoSaida id={ordem.id} token={ordem.token_publico} fotoInicial={ordem.foto_saida_url} pronto={indiceStatus(ordem.status) >= indiceStatus("finalizado")} demo={demo} />
        <AvisoDentista ordem={ordem} urlSite={urlSite} />
      </div>
    </div>
  );
}
