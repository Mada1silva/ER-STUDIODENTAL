import { FormularioPedido } from "@/components/portal/formulario-pedido";
import { hojeISO, somarDiasUteis } from "@/lib/datas";
import { site } from "@/lib/config/site";

export const metadata = { title: "Pedir novo trabalho" };
export const dynamic = "force-dynamic";

export default function PedirTrabalho() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-semibold">Pedir novo trabalho</h1>
        <p className="text-sm text-grafite-600">
          O pedido chega na hora ao painel do laboratório. Prazo padrão: {site.prazoPadraoDiasUteis} dias úteis a partir do recebimento do material.
        </p>
      </div>
      <FormularioPedido prazoPadrao={somarDiasUteis(hojeISO(), site.prazoPadraoDiasUteis)} />
    </div>
  );
}
