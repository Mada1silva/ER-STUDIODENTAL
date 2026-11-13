import Link from "next/link";
import { redirect } from "next/navigation";
import type { OrdemComDentista } from "@/types/database";
import { listarOrdens, obterPerfil } from "@/lib/os/dados";
import { NOME_BANCADA, NOME_TIPO, STATUS_OS, formatarNumeroOS } from "@/lib/os/constantes";
import { CURTO_ITEM, itensFaltando } from "@/lib/os/itens";
import { diasAte, hojeISO } from "@/lib/datas";
import { SeloPrazo } from "@/components/os/cartao-os";
import { Logo } from "@/components/site/logo";
import { AtualizarSozinho, Relogio } from "./atualizar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produção · Modo TV" };

const naBancada = (o: OrdemComDentista) => o.status === "recebido" || o.status === "em_andamento";
const atrasada = (o: OrdemComDentista) => naBancada(o) && !!o.data_prevista && diasAte(o.data_prevista) < 0;

/** Modo TV: a produção numa TV da bancada, letras grandes, atualiza sozinho. */
export default async function ModoTV() {
  const perfil = await obterPerfil();
  if (!perfil.demo && perfil.papel !== "laboratorio") redirect("/portal");

  const { ordens } = await listarOrdens();
  const abertas = ordens.filter((o) => o.status !== "entregue");
  const hoje = hojeISO();
  const diaEmBrasilia = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(iso));
  const entreguesHoje = ordens.filter((o) => o.status === "entregue" && o.data_entrega && diaEmBrasilia(o.data_entrega) === hoje).length;
  const ordem = (a: OrdemComDentista, b: OrdemComDentista) =>
    Number(b.prioridade === "urgente") - Number(a.prioridade === "urgente") || String(a.data_prevista).localeCompare(String(b.data_prevista));

  const numeros: [number, string, string][] = [
    [abertas.length, "no laboratório", "text-prata-100"],
    [abertas.filter((o) => naBancada(o) && o.prioridade === "urgente").length, "urgentes", "text-red-300"],
    [abertas.filter(atrasada).length, "atrasadas", "text-red-300"],
    [entreguesHoje, "entregues hoje", "text-emerald-300"],
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-grafite-950 p-4 text-prata-200 lg:p-6">
      <AtualizarSozinho segundos={30} />
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Logo href="/painel/os" subtitulo="Produção agora" />
        <div className="flex flex-wrap gap-2">
          {numeros.map(([n, rotulo, cor]) => (
            <div key={rotulo} className="rounded-xl bg-grafite-900 px-4 py-2 text-center">
              <p className={`font-serif text-3xl leading-none font-semibold ${cor}`}>{n}</p>
              <p className="text-[11px] tracking-wider text-prata-500 uppercase">{rotulo}</p>
            </div>
          ))}
        </div>
        <Relogio />
      </header>

      <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_OS.slice(0, 4).map((c) => {
          const itens = abertas.filter((o) => o.status === c.codigo).sort(ordem);
          return (
            <section key={c.codigo} className="flex flex-col overflow-hidden rounded-2xl bg-grafite-900">
              <header className="flex items-center justify-between px-4 py-3" style={{ background: c.cor }}>
                <h2 className="text-lg font-semibold text-white">{c.nome}</h2>
                <span className="rounded-full bg-white/90 px-3 text-lg font-bold" style={{ color: c.texto }}>{itens.length}</span>
              </header>
              <div className="flex flex-1 flex-col gap-2 p-3">
                {itens.length === 0 && <p className="p-4 text-center text-sm text-prata-500">Nada aqui agora</p>}
                {itens.map((o) => {
                  const urgente = o.prioridade === "urgente";
                  const faltou = itensFaltando(o.itens);
                  return (
                    <article
                      key={o.id}
                      className="rounded-xl bg-grafite-800 p-3"
                      style={{ boxShadow: `inset 4px 0 0 ${c.cor}${urgente || atrasada(o) ? ", 0 0 0 2px #ef4444" : ""}` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-prata-300">{formatarNumeroOS(o.numero)}</span>
                        {urgente && <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white uppercase">Urgente</span>}
                      </div>
                      <p className="mt-1 text-lg leading-snug font-medium text-prata-100">{NOME_TIPO[o.tipo_trabalho]}</p>
                      <p className="text-sm text-prata-400">
                        {o.paciente_nome} · {o.dentista?.nome}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                        {o.status === "em_andamento" && o.etapa_bancada && (
                          <span className="rounded px-1.5 py-0.5 font-medium" style={{ background: c.fundo, color: c.texto }}>{NOME_BANCADA[o.etapa_bancada]}</span>
                        )}
                        <SeloPrazo ordem={o} />
                        {faltou.length > 0 && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-800">Faltou: {faltou.map((x) => CURTO_ITEM[x]).join(", ")}</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-3 flex justify-between gap-4 text-xs text-prata-500">
        <span>Atualiza sozinho a cada 30 segundos. Deixe aberto na TV da bancada.</span>
        <Link href="/painel/os" className="hover:text-prata-200">Sair do modo TV</Link>
      </footer>
    </div>
  );
}
