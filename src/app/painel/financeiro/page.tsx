export const metadata = { title: "Financeiro" };

export default function Financeiro() {
  return (
    <div className="max-w-xl space-y-3">
      <h1 className="font-serif text-4xl font-semibold">Financeiro</h1>
      <p className="text-grafite-600">
        Próximo módulo: faturamento por clínica e dentista, com fechamento no fim do mês, desconto de 5% à vista e
        parcelamento em 3x. Ele vai usar o valor de cada OS já cadastrado no painel.
      </p>
    </div>
  );
}
