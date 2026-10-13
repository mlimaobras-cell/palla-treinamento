"use client";
import { useState } from "react";
import { Entrada } from "./ui";

/** Campo de senha com botão para mostrar ou esconder o que está sendo digitado. */
export function CampoSenha(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative">
      <Entrada {...props} type={ver ? "text" : "password"} className={`pr-20 ${props.className ?? ""}`} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      <button type="button" onClick={() => setVer((v) => !v)} aria-pressed={ver} aria-label={ver ? "Esconder senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-1 my-1 flex items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-palla-azul hover:bg-palla-azul-claro">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
          {ver && <path d="M4 4l16 16" />}
        </svg>
        {ver ? "Esconder" : "Mostrar"}
      </button>
    </div>
  );
}
