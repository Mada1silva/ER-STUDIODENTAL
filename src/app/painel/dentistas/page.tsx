import { listarDentistas } from "@/lib/os/dados";
import { AvisoDemo } from "@/components/painel/aviso-demo";

export const metadata = { title: "Dentistas" };
export const dynamic = "force-dynamic";

export default async function Dentistas() {
  const { dentistas, demo, erro } = await listarDentistas();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-semibold">Dentistas parceiros</h1>
        <p className="text-sm text-grafite-600">{dentistas.length} cadastrados. O cadastro pela tela vem no próximo passo.</p>
      </div>
      {demo && <AvisoDemo />}
      {erro && <p className="text-sm text-red-700">Erro ao carregar: {erro}</p>}
      <div className="overflow-x-auto rounded-xl border border-prata-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-prata-100 text-xs uppercase tracking-wide text-grafite-600">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CRO</th>
              <th className="px-4 py-3">Clínica</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-prata-100">
            {dentistas.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium">{d.nome}</td>
                <td className="px-4 py-3">{d.cro ? `${d.cro}/${d.cro_uf ?? ""}` : "—"}</td>
                <td className="px-4 py-3">{d.clinica ?? "—"}</td>
                <td className="px-4 py-3">{d.cidade ?? "—"}</td>
                <td className="px-4 py-3">{d.whatsapp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
