import Link from "next/link";
import type { OrdemComDentista } from "@/types/database";
import { listarMinhasOrdens } from "@/lib/os/dados";
import { INFO_STATUS, NOME_TIPO, formatarNumeroOS } from "@/lib/os/constantes";
import { formatarData, quando } from "@/lib/datas";
import { LegendaEtapas, SeloEtapa, TrilhaEtapas } from "@/components/os/etapas";
import { CURTO_ITEM, itensFaltando } from "@/lib/os/itens";

export const dynamic = "force-dynamic";

function CartaoPortal({ o }: { o: OrdemComDentista }) {
  const s = INFO_STATUS[o.status];
  const faltou = itensFaltando(o.itens);
  return (
    <Link href={`/portal/os/${o.id}`} className="block overflow-hidden rounded-xl bg-white transition hover:shadow-md" style={{ boxShadow: `inset 0 0 0 1px ${s.cor}55` }}>
      <div className="h-1.5" style={{ background: s.cor }} />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-grafite-600">{formatarNumeroOS(o.numero)}</span>
          <SeloEtapa status={o.status} />
        </div>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-grafite-900">
              {NOME_TIPO[o.tipo_trabalho]} <span className="font-normal text-grafite-600">· {o.paciente_nome}</span>
            </p>
            <p className="text-xs text-prata-500">{[o.elementos && `Dentes ${o.elementos}`, o.cor && `Cor ${o.cor}`].filter(Boolean).join(" · ")}</p>
            {faltou.length > 0 && (
              <p className="mt-1 text-xs">
                <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-800">Faltou: {faltou.map((c) => CURTO_ITEM[c]).join(", ")}</span>
              </p>
            )}
          </div>
          {o.foto_saida_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={o.foto_saida_url} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
          )}
        </div>
        <TrilhaEtapas status={o.status} />
        <div className="grid gap-0.5 text-xs text-grafite-700">
          <p><span className="text-prata-500">Chegou ao laboratório:</span> {quando(o.created_at)}</p>
          <p><span className="text-prata-500">Última atualização:</span> {s.frase.toLowerCase()} {quando(o.status_desde)}</p>
          {(o.status === "recebido" || o.status === "em_andamento") && o.data_prevista && (
            <p><span className="text-prata-500">Entrega prevista:</span> {formatarData(o.data_prevista)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function MeusTrabalhos({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams;
  const { ordens, dentista, demo } = await listarMinhasOrdens();

  if (!dentista) {
    return <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Seu acesso ainda não foi ligado ao seu cadastro de dentista. Fale com o laboratório pelo WhatsApp.</p>;
  }

  const prontos = ordens.filter((o) => o.status === "finalizado" || o.status === "saindo_entrega");
  const noLab = ordens.filter((o) => o.status === "recebido" || o.status === "em_andamento");
  const entregues = ordens.filter((o) => o.status === "entregue").slice(0, 10);

  const grupos: [string, OrdemComDentista[], string][] = [
    ["A caminho ou prontos", prontos, "Nenhum trabalho pronto agora. Você recebe um aviso aqui quando ficar pronto e quando sair para entrega."],
    ["No laboratório", noLab, "Nenhum trabalho seu está no laboratório agora."],
    ["Entregues recentemente", entregues, ""],
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Meus trabalhos</h1>
          <p className="text-sm text-grafite-600">Veja na hora se o trabalho chegou e em que etapa está, sem precisar ligar.</p>
        </div>
        <Link href="/portal/pedido" className="rounded-full bg-grafite-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-grafite-700">+ Pedir novo trabalho</Link>
      </div>
      {demo && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Modo demonstração.</strong> Você está vendo o portal como {dentista.nome}, com dados fictícios.
        </p>
      )}
      {pedido === "ok" && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Pedido enviado ao laboratório.</p>}
      <LegendaEtapas />

      {noLab
        .filter((o) => itensFaltando(o.itens).length)
        .map((o) => (
          <div key={`faltou-${o.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-300 ring-inset">
            <p>
              <strong>Faltou material na {formatarNumeroOS(o.numero)}:</strong> {itensFaltando(o.itens).map((c) => CURTO_ITEM[c]).join(", ")}. Envie para o laboratório seguir com o trabalho.
            </p>
            <Link href={`/portal/os/${o.id}`} className="font-medium underline underline-offset-2">Ver trabalho</Link>
          </div>
        ))}

      {prontos.map((o) => {
        const s = INFO_STATUS[o.status];
        return (
          <div key={o.id} className="rounded-xl px-4 py-3 text-sm" style={{ background: s.fundo, color: s.texto, boxShadow: `inset 0 0 0 1px ${s.cor}66` }}>
            <strong>{formatarNumeroOS(o.numero)} {o.status === "finalizado" ? "ficou pronto!" : "saiu para entrega"}</strong>{" "}
            {o.status === "finalizado" ? "Vamos combinar a entrega com você." : "e está a caminho do consultório."} <span className="opacity-70">({quando(o.status_desde)})</span>
          </div>
        );
      })}

      {grupos
        .filter(([, lista, vazio]) => lista.length || vazio)
        .map(([titulo, lista, vazio]) => (
          <section key={titulo} className="space-y-3">
            <h2 className="font-serif text-2xl">
              {titulo} <span className="font-sans text-sm text-prata-500">({lista.length})</span>
            </h2>
            {lista.length ? (
              <div className="grid gap-3 md:grid-cols-2">{lista.map((o) => <CartaoPortal key={o.id} o={o} />)}</div>
            ) : (
              <p className="rounded-xl border border-dashed border-prata-300 p-4 text-sm text-prata-500">{vazio}</p>
            )}
          </section>
        ))}
    </div>
  );
}
