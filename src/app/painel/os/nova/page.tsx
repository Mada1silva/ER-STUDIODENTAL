import Link from "next/link";
import { listarDentistas } from "@/lib/os/dados";
import { FormularioOS } from "@/components/os/formulario-os";
import { AvisoDemo } from "@/components/painel/aviso-demo";
import { hojeISO, somarDiasUteis } from "@/lib/datas";
import { site } from "@/lib/config/site";

export const metadata = { title: "Nova OS" };
export const dynamic = "force-dynamic";

export default async function NovaOS() {
  const { dentistas, demo } = await listarDentistas();
  const hoje = hojeISO();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/painel/os" className="text-sm text-grafite-600 hover:underline">← Voltar para a produção</Link>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Nova ordem de serviço</h1>
        <p className="text-sm text-grafite-600">O trabalho entra na coluna “Recebido”. Prazo padrão: {site.prazoPadraoDiasUteis} dias úteis.</p>
      </div>
      {demo && <AvisoDemo />}
      {dentistas.length === 0 && !demo && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Cadastre pelo menos um dentista antes de criar uma OS.</p>
      )}
      <FormularioOS dentistas={dentistas} hoje={hoje} prazoPadrao={somarDiasUteis(hoje, site.prazoPadraoDiasUteis)} />
    </div>
  );
}
