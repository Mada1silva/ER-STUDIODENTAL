import Link from "next/link";
import { listarOrdens } from "@/lib/os/dados";
import { QuadroKanban } from "@/components/os/quadro-kanban";
import { AvisoDemo } from "@/components/painel/aviso-demo";

export const metadata = { title: "Ordens de Serviço" };
export const dynamic = "force-dynamic";

export default async function PaginaOS() {
  const { ordens, demo, erro } = await listarOrdens();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Produção</h1>
          <p className="text-sm text-grafite-600">Arraste os cartões entre as etapas ou use o botão de cada trabalho.</p>
        </div>
        <Link href="/painel/os/nova" className="rounded-full bg-grafite-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-grafite-700">
          + Nova OS
        </Link>
      </div>
      {demo && <AvisoDemo />}
      {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">Erro ao carregar as ordens: {erro}</p>}
      <QuadroKanban ordensIniciais={ordens} demo={demo} />
    </div>
  );
}
