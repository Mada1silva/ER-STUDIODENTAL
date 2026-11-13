import Link from "next/link";
import { buscarAcompanhamento } from "@/lib/os/dados";
import { INFO_STATUS, NOME_TIPO, formatarNumeroOS, indiceStatus } from "@/lib/os/constantes";
import { NOME_ITEM } from "@/lib/os/itens";
import { caminhoCertificado } from "@/lib/os/acompanhamento";
import { formatarData, quando } from "@/lib/datas";
import { linkWhatsApp, site } from "@/lib/config/site";
import { LinhaDoTempo, SeloEtapa, TrilhaEtapas } from "@/components/os/etapas";
import { IconeWhatsApp } from "@/components/site/icones";

export const dynamic = "force-dynamic";

export default async function Acompanhar({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { dados: o, demo } = await buscarAcompanhamento(token);

  if (!o) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-serif text-3xl">Link não encontrado</h1>
        <p className="mt-2 text-grafite-600">Confira se o link foi copiado inteiro ou fale com o laboratório pelo WhatsApp.</p>
      </main>
    );
  }

  const s = INFO_STATUS[o.status];
  const pronto = indiceStatus(o.status) >= indiceStatus("finalizado");
  const naBancada = o.status === "recebido" || o.status === "em_andamento";

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-5 px-4 py-8">
        {demo && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <strong>Modo demonstração.</strong> Dados fictícios.
          </p>
        )}
        <div>
          <p className="text-xs tracking-[0.3em] text-prata-500 uppercase">Acompanhamento do trabalho</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold">
            {formatarNumeroOS(o.numero)} · {NOME_TIPO[o.tipo_trabalho]}
          </h1>
          <p className="text-sm text-grafite-600">
            {[o.paciente_iniciais && `Paciente ${o.paciente_iniciais}`, o.dentista.nome, o.elementos && `Dentes ${o.elementos}`].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="rounded-2xl p-5" style={{ background: s.fundo, boxShadow: `inset 0 0 0 1px ${s.cor}55` }}>
          <div className="flex flex-wrap items-center gap-2">
            <SeloEtapa status={o.status} grande />
            <span className="text-xs" style={{ color: s.texto }}>atualizado {quando(o.status_desde)}</span>
          </div>
          <p className="mt-2 font-serif text-2xl" style={{ color: s.texto }}>
            {s.frase} {quando(o.status_desde)}.
          </p>
          <div className="mt-4">
            <TrilhaEtapas status={o.status} rotulos />
          </div>
          {naBancada && o.data_prevista && (
            <p className="mt-3 text-sm" style={{ color: s.texto }}>
              Previsão de entrega: <strong>{formatarData(o.data_prevista)}</strong>
            </p>
          )}
        </div>

        {o.itens_faltando.length > 0 && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
            <strong>Faltou material:</strong> {o.itens_faltando.map((c) => NOME_ITEM[c]).join(", ")}. Envie para o laboratório seguir com o trabalho.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {o.foto_saida_url && (
            <section className="rounded-2xl border border-prata-200 bg-white p-5">
              <h2 className="font-serif text-2xl">Foto da saída</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.foto_saida_url} alt={`Foto do trabalho ${formatarNumeroOS(o.numero)}`} className="mt-3 aspect-[4/3] w-full rounded-xl object-cover" />
            </section>
          )}
          <section className="rounded-2xl border border-prata-200 bg-white p-5">
            <h2 className="mb-4 font-serif text-2xl">Linha do tempo</h2>
            <LinhaDoTempo status={o.status} historico={o.historico} />
          </section>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={linkWhatsApp(`Olá! Tenho uma dúvida sobre a ${formatarNumeroOS(o.numero)}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            <IconeWhatsApp className="size-4" /> Dúvidas sobre este trabalho
          </a>
          {pronto && (
            <Link href={caminhoCertificado(o.token_publico)} className="rounded-full border border-prata-300 bg-white px-5 py-2.5 text-sm text-grafite-700 hover:bg-prata-50">
              Ver certificado
            </Link>
          )}
        </div>
      </main>
      <footer className="border-t border-prata-200 px-4 py-6 text-center text-xs text-prata-500">
        Esta página se atualiza a cada mudança de etapa. Não precisa de senha: guarde o link. · {site.nome}, {site.cro}
      </footer>
    </>
  );
}
