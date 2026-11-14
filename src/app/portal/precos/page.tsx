import { TabelaPrecos } from "@/components/precos/tabela-precos";

export const metadata = { title: "Tabela de preços" };

/** Tabela de preços dentro do Portal do Dentista (só para quem tem login). */
export default function PrecosPortal() {
  return (
    <div className="overflow-hidden rounded-3xl bg-grafite-800 text-prata-200">
      <TabelaPrecos />
    </div>
  );
}
