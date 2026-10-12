"use client";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Aviso, Botao } from "./ui";

export type Estado = { erro?: string; ok?: string } | null;

function Enviar({ rotulo, variante }: { rotulo: string; variante?: "primario" | "secundario" | "perigo" }) {
  const { pending } = useFormStatus();
  return <Botao type="submit" variante={variante} disabled={pending}>{pending ? "Enviando…" : rotulo}</Botao>;
}

/** Formulário ligado a uma server action que devolve { erro } ou { ok }. */
export function Formulario({
  acao, children, rotulo = "Salvar", variante, className = "space-y-4", limparAoConcluir = false, semBotao = false,
}: {
  acao: (estado: Estado, dados: FormData) => Promise<Estado>;
  children: ReactNode; rotulo?: string; variante?: "primario" | "secundario" | "perigo"; className?: string;
  limparAoConcluir?: boolean; semBotao?: boolean;
}) {
  const [estado, executar] = useActionState(acao, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (estado?.ok && limparAoConcluir) ref.current?.reset();
  }, [estado, limparAoConcluir]);
  return (
    <form ref={ref} action={executar} className={className}>
      {children}
      {estado?.erro && <Aviso tom="erro">{estado.erro}</Aviso>}
      {estado?.ok && <Aviso tom="sucesso">{estado.ok}</Aviso>}
      {!semBotao && <div><Enviar rotulo={rotulo} variante={variante} /></div>}
    </form>
  );
}

export { Enviar };
