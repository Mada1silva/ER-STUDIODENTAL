import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarOrdem, obterPerfil } from "@/lib/os/dados";
import { INFO_STATUS, NOME_TIPO, formatarNumeroOS } from "@/lib/os/constantes";
import { formatarData, formatarMoeda, quando } from "@/lib/datas";
import { linkWhatsApp } from "@/lib/config/site";
import { LinhaDoTempo, SeloEtapa, TrilhaEtapas } from "@/components/os/etapas";
import { IconeWhatsApp } from "@/components/site/icones";

export const dynamic = "force-dynamic";

export default async function TrabalhoDoDentista({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ ordem, historico }, perfil] = await Promise.all([buscarOrdem(id), obterPerfil()]);
  // O banco já impede ver trabalho de outro dentista; aqui só conferimos de novo.
  if (!ordem || ordem.dentista_id !== perfil.dentistaId) notFound();

  const s = INFO_STATUS[ordem.status];
  // A bancada é detalhe interno: o dentista vê só as 5 etapas.
  const historicoDentista = historico.filter((h) => h.status_anterior !== h.status_novo);
  const campos: [string, string][] = [
    ["Paciente", ordem.paciente_nome],
    ["Tipo de trabalho", NOME_TIPO[ordem.tipo_trabalho]],
    ["Dentes / elementos", ordem.elementos ?? "—"],
    ["Material", ordem.material ?? "—"],
    ["Cor", ordem.cor ? `${ordem.cor}${ordem.escala_cor ? ` (${ordem.escala_cor})` : ""}` : "—"],
    ["Entrega prevista", formatarData(ordem.data_prevista)],
    ["Valor", formatarMoeda(ordem.valor)],
  ];

  return (
    <div className="space-y-6">
      <Link href="/portal" className="text-sm text-grafite-600 hover:underline">← Meus trabalhos</Link>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl font-semibold">{formatarNumeroOS(ordem.numero)}</h1>
        <SeloEtapa status={ordem.status} grande />
      </header>
      <div className="rounded-2xl p-5" style={{ background: s.fundo, boxShadow: `inset 0 0 0 1px ${s.cor}55` }}>
        <p className="font-serif text-2xl" style={{ color: s.texto }}>
          {s.frase} {quando(ordem.status_desde)}.
        </p>
        <div className="mt-4">
          <TrilhaEtapas status={ordem.status} rotulos />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-prata-200 bg-white p-6 md:order-2">
          <h2 className="mb-4 font-serif text-2xl">Linha do tempo</h2>
          <LinhaDoTempo status={ordem.status} historico={historicoDentista} />
        </section>
        <dl className="grid content-start gap-x-6 gap-y-4 rounded-2xl border border-prata-200 bg-white p-6 sm:grid-cols-2 md:order-1 md:col-span-2">
          {campos.map(([r, v]) => (
            <div key={r} className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-prata-500">{r}</dt>
              <dd className="mt-0.5 text-grafite-900">{v}</dd>
            </div>
          ))}
          {ordem.descricao && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-prata-500">Suas instruções</dt>
              <dd className="mt-0.5 whitespace-pre-line">{ordem.descricao}</dd>
            </div>
          )}
        </dl>
      </div>
      <a
        href={linkWhatsApp(`Olá! Tenho uma dúvida sobre a ${formatarNumeroOS(ordem.numero)} (${ordem.paciente_nome}).`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
      >
        <IconeWhatsApp className="size-4" /> Falar sobre este trabalho
      </a>
    </div>
  );
}
