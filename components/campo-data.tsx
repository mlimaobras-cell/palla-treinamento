"use client";
import { useState } from "react";
import { Entrada } from "./ui";

/** Data digitada (dd/mm/aaaa), com as barras inseridas automaticamente. Funciona igual no celular e no computador. */
export function CampoData({ name, required, defaultValue = "" }: { name: string; required?: boolean; defaultValue?: string }) {
  const [v, setV] = useState(defaultValue);
  const formatar = (s: string) => {
    const d = s.replace(/\D/g, "").slice(0, 8);
    return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join("/");
  };
  return (
    <Entrada name={name} value={v} onChange={(e) => setV(formatar(e.target.value))} inputMode="numeric" autoComplete="bday"
      placeholder="dd/mm/aaaa" maxLength={10} pattern="\d{2}/\d{2}/\d{4}" title="Digite no formato dd/mm/aaaa" required={required} />
  );
}
