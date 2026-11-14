import { listarDentistas, listarFatura } from "@/lib/os/dados";
import { AvisoDemo } from "@/components/painel/aviso-demo";
import { PainelFatura } from "@/components/financeiro/painel-fatura";
import { hojeISO } from "@/lib/datas";

export const metadata = { title: "Financeiro" };
export const dynamic = "force-dynamic";

/** Últimos 12 meses no formato AAAA-MM, do mais recente para o mais antigo. */
function ultimosMeses(qtd = 12) {
  const [a, m] = hojeISO().split("-").map(Number);
  return Array.from({ length: qtd }, (_, k) => {
    const d = new Date(Date.UTC(a, m - 1 - k, 1));
    return d.toISOString().slice(0, 7);
  });
}

export default async function Financeiro({ searchParams }: { searchParams: Promise<{ mes?: string; q?: string }> }) {
  const params = await searchParams;
  const meses = ultimosMeses();
  const mes = params.mes && meses.includes(params.mes) ? params.mes : meses[0];
  const [{ entregues, abertos, demo, erro }, { dentistas }] = await Promise.all([listarFatura(mes), listarDentistas()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-semibold">Financeiro</h1>
        <p className="text-sm text-grafite-600">A fatura fecha no fim do mês. Digite o dentista ou a clínica para ver os trabalhos entregues e o total.</p>
      </div>
      {demo && <AvisoDemo />}
      {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">Erro ao carregar: {erro}</p>}
      <PainelFatura mes={mes} meses={meses} dentistas={dentistas} entregues={entregues} abertos={abertos} buscaInicial={params.q ?? ""} />
    </div>
  );
}
