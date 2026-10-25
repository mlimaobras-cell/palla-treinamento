"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/** Foto 3×4 opcional: fica só nesta tela para imprimir; não é enviada nem guardada na plataforma. */
export function FotoCracha() {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <>
      <label className="nao-imprimir mb-4 flex items-center gap-3 text-sm">
        <span className="font-medium">Foto 3×4 (opcional, não fica salva):</span>
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setUrl(URL.createObjectURL(f)); }} />
      </label>
      <style>{`.foto-cracha { ${url ? `background-image: url(${url});` : ""} }`}</style>
    </>
  );
}
