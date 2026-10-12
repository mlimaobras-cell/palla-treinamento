"use client";

export function BotaoImprimir() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-lg bg-palla-azul px-3 py-2 text-sm font-semibold text-white">
      Imprimir
    </button>
  );
}
