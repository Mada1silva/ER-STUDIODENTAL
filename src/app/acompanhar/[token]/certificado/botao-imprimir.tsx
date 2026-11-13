"use client";

export function BotaoImprimir() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-full bg-grafite-800 px-5 py-2 text-sm font-medium text-white hover:bg-grafite-700">
      Imprimir ou salvar em PDF
    </button>
  );
}
