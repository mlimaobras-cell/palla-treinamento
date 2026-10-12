"use client";

export function Imprimir() {
  return (
    <button onClick={() => window.print()} className="inline-flex min-h-10 items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-palla-azul-escuro ring-1 ring-inset ring-linha hover:bg-slate-50 print:hidden">
      Imprimir ficha
    </button>
  );
}
