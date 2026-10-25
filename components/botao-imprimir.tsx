"use client";

export function BotaoImprimir({ rotulo = "Imprimir" }: { rotulo?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-lg bg-palla-azul px-3 py-2 text-sm font-semibold text-white">
      {rotulo}
    </button>
  );
}
