import Image from "next/image";
import Link from "next/link";
import { buscarAcompanhamento } from "@/lib/os/dados";
import { NOME_TIPO, formatarNumeroOS, indiceStatus } from "@/lib/os/constantes";
import { caminhoAcompanhar } from "@/lib/os/acompanhamento";
import { urlDoSiteAtual } from "@/lib/os/origem";
import { formatarData } from "@/lib/datas";
import { site } from "@/lib/config/site";
import { QrCode } from "@/components/os/qr-code";
import { BotaoImprimir } from "./botao-imprimir";

export const dynamic = "force-dynamic";

export default async function Certificado({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { dados: o } = await buscarAcompanhamento(token);
  const pronto = o && indiceStatus(o.status) >= indiceStatus("finalizado");

  if (!o || !pronto) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-serif text-3xl">Certificado ainda não disponível</h1>
        <p className="mt-2 text-grafite-600">O certificado fica disponível quando o trabalho estiver pronto.</p>
        {o && (
          <Link href={caminhoAcompanhar(o.token_publico)} className="mt-4 inline-block text-sm underline">
            Ver o andamento
          </Link>
        )}
      </main>
    );
  }

  const link = (await urlDoSiteAtual()) + caminhoAcompanhar(o.token_publico);
  const concluido = [...o.historico].reverse().find((h) => h.status_novo === "finalizado")?.alterado_em;
  const dados: [string, string][] = [
    ["Ordem de serviço", formatarNumeroOS(o.numero)],
    ["Trabalho", NOME_TIPO[o.tipo_trabalho]],
    ["Dentes", o.elementos ?? "—"],
    ["Material", o.material ?? "—"],
    ["Cor", o.cor ? `${o.cor}${o.escala_cor ? ` (${o.escala_cor})` : ""}` : "—"],
    ["Dentista", [o.dentista.nome, o.dentista.cro && `CRO ${o.dentista.cro}${o.dentista.cro_uf ? `/${o.dentista.cro_uf}` : ""}`].filter(Boolean).join(" · ")],
    ["Paciente", o.paciente_iniciais ?? "—"],
    ["Concluído em", concluido ? formatarData(concluido.slice(0, 10)) : "—"],
  ];

  return (
    <main className="flex-1 bg-prata-200 px-4 py-8 print:bg-white print:p-0">
      <div data-nao-imprimir className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-2">
        <Link href={caminhoAcompanhar(o.token_publico)} className="text-sm text-grafite-700 hover:underline">← Acompanhamento</Link>
        <BotaoImprimir />
      </div>
      <article className="certificado mx-auto max-w-3xl rounded-2xl bg-grafite-800 p-3 text-prata-300 shadow-xl">
        <div className="rounded-xl border border-prata-500/30 px-6 py-10 sm:px-12">
          <div className="flex flex-col items-center text-center">
            <Image src="/img/monograma-er.png" alt="" width={72} height={72} className="rounded-lg" />
            <p className="mt-3 font-serif text-xl font-semibold tracking-[0.14em] text-prata-100">EDMAR REIS</p>
            <p className="text-[10px] tracking-[0.4em] text-prata-400 uppercase">Studio Dental · desde {site.desde}</p>
            <div className="my-6 h-px w-16 bg-prata-500/60" />
            <h1 className="texto-prata font-serif text-4xl leading-tight font-semibold sm:text-5xl">Certificado de Autenticidade</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed">
              Certificamos que o trabalho abaixo foi planejado e confeccionado no {site.nome}, com controle de qualidade em cada etapa, do recebimento à entrega.
            </p>
          </div>
          <dl className="mt-8 grid gap-x-8 gap-y-3 border-y border-prata-500/20 py-6 sm:grid-cols-2">
            {dados.map(([rotulo, valor]) => (
              <div key={rotulo} className="flex items-baseline justify-between gap-4 sm:block">
                <dt className="text-[11px] tracking-[0.2em] text-prata-500 uppercase">{rotulo}</dt>
                <dd className="text-right font-medium text-prata-100 sm:mt-0.5 sm:text-left">{valor}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="font-serif text-3xl text-prata-100 italic">{site.responsavelTecnico}</p>
              <div className="mt-1 h-px w-56 bg-prata-500/50" />
              <p className="mt-2 text-xs">Ceramista dental · Responsável técnico · {site.cro}</p>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-white p-2">
                <QrCode texto={link} className="size-28" />
              </div>
              <p className="mt-2 max-w-40 text-[10px] leading-tight text-prata-400">Escaneie para conferir o histórico deste trabalho</p>
            </div>
          </div>
          <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-prata-500 uppercase">Código de verificação {o.token_publico.slice(0, 10).toUpperCase()}</p>
        </div>
      </article>
    </main>
  );
}
