"use client";
import { useState } from "react";

export function CopiarLink({ url }: { url: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-palla-azul ring-1 ring-inset ring-linha hover:bg-slate-50">
      {ok ? "Copiado" : "Copiar link"}
    </button>
  );
}
