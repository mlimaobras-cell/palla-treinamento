import Link from "next/link";
import type { ReactNode } from "react";

export function Cartao({ children, className = "", titulo, acao }: { children: ReactNode; className?: string; titulo?: ReactNode; acao?: ReactNode }) {
  return (
    <section className={`rounded-xl border border-linha bg-white ${className}`}>
      {titulo && (
        <header className="flex items-center justify-between gap-3 border-b border-linha px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-palla-azul-escuro">{titulo}</h2>
          {acao}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const CORES: Record<string, string> = {
  verde: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amarelo: "bg-amber-50 text-amber-800 ring-amber-200",
  laranja: "bg-orange-100 text-orange-900 ring-orange-300",
  vermelho: "bg-red-50 text-red-800 ring-red-200",
  azul: "bg-palla-azul-claro text-palla-azul ring-indigo-200",
  cinza: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function Selo({ cor = "cinza", children }: { cor?: string; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${CORES[cor] ?? CORES.cinza}`}>{children}</span>;
}

export function Semaforo({ valor, grande = false }: { valor: "VERDE" | "AMARELO" | "VERMELHO"; grande?: boolean }) {
  const m = {
    VERDE: { cor: "bg-emerald-500", texto: "Documentação conferida", classe: "text-emerald-800 bg-emerald-50 ring-emerald-200" },
    AMARELO: { cor: "bg-amber-400", texto: "Pendências", classe: "text-amber-900 bg-amber-50 ring-amber-200" },
    VERMELHO: { cor: "bg-red-600", texto: "Não liberado", classe: "text-red-800 bg-red-50 ring-red-200" },
  }[valor];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full ring-1 ring-inset ${m.classe} ${grande ? "px-3.5 py-1.5 text-sm font-semibold" : "px-2.5 py-0.5 text-xs font-medium"}`}>
      <span className={`inline-block rounded-full ${m.cor} ${grande ? "h-3 w-3" : "h-2 w-2"}`} aria-hidden />
      {m.texto}
    </span>
  );
}

export function Botao({ children, variante = "primario", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "primario" | "secundario" | "perigo" | "fantasma" }) {
  const v = {
    primario: "bg-palla-azul text-white hover:bg-palla-azul-escuro disabled:bg-slate-300",
    secundario: "bg-white text-palla-azul-escuro ring-1 ring-inset ring-linha hover:bg-slate-50",
    perigo: "bg-palla-vermelho text-white hover:bg-red-800",
    fantasma: "text-palla-azul hover:bg-palla-azul-claro",
  }[variante];
  return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${v} ${className}`}>{children}</button>;
}

export function LinkBotao({ href, children, variante = "primario", className = "" }: { href: string; children: ReactNode; variante?: "primario" | "secundario"; className?: string }) {
  const v = variante === "primario" ? "bg-palla-azul text-white hover:bg-palla-azul-escuro" : "bg-white text-palla-azul-escuro ring-1 ring-inset ring-linha hover:bg-slate-50";
  return <Link href={href} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${v} ${className}`}>{children}</Link>;
}

export function Campo({ rotulo, ajuda, children }: { rotulo: string; ajuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-tinta">{rotulo}</span>
      {children}
      {ajuda && <span className="mt-1 block text-xs text-tinta-suave">{ajuda}</span>}
    </label>
  );
}

export const estiloEntrada = "block w-full rounded-lg border border-linha bg-white px-3 py-2.5 text-[15px] text-tinta shadow-sm focus:border-palla-azul focus:outline-none focus:ring-2 focus:ring-palla-azul/20";

export function Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${estiloEntrada} ${props.className ?? ""}`} />;
}
export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${estiloEntrada} ${props.className ?? ""}`} />;
}
export function AreaTexto(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${estiloEntrada} ${props.className ?? ""}`} />;
}

export function Progresso({ valor, rotulo }: { valor: number; rotulo?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <div>
      {rotulo && <div className="mb-1 flex justify-between text-xs text-tinta-suave"><span>{rotulo}</span><span className="font-semibold text-tinta">{v}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-palla-azul" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Indicador({ rotulo, valor, detalhe, tom = "neutro", href }: { rotulo: string; valor: ReactNode; detalhe?: string; tom?: "neutro" | "verde" | "amarelo" | "vermelho"; href?: string }) {
  const barra = { neutro: "bg-palla-azul", verde: "bg-emerald-500", amarelo: "bg-amber-400", vermelho: "bg-palla-vermelho" }[tom];
  const conteudo = (
    <div className="relative h-full overflow-hidden rounded-xl border border-linha bg-white p-4 transition hover:border-palla-azul/40">
      <span className={`absolute inset-y-0 left-0 w-1 ${barra}`} aria-hidden />
      <div className="text-xs font-medium uppercase tracking-wide text-tinta-suave">{rotulo}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums text-palla-azul-escuro">{valor}</div>
      {detalhe && <div className="mt-0.5 text-xs text-tinta-suave">{detalhe}</div>}
    </div>
  );
  return href ? <Link href={href}>{conteudo}</Link> : conteudo;
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-linha p-6 text-center text-sm text-tinta-suave">{children}</p>;
}

export function Aviso({ tom = "info", children }: { tom?: "info" | "alerta" | "erro" | "sucesso"; children: ReactNode }) {
  const c = {
    info: "border-indigo-200 bg-palla-azul-claro text-palla-azul-escuro",
    alerta: "border-amber-200 bg-amber-50 text-amber-900",
    erro: "border-red-200 bg-red-50 text-red-800",
    sucesso: "border-emerald-200 bg-emerald-50 text-emerald-900",
  }[tom];
  return <div className={`rounded-lg border px-4 py-3 text-sm ${c}`} role={tom === "erro" ? "alert" : undefined}>{children}</div>;
}

export function Tabela({ cabecalho, children }: { cabecalho: ReactNode[]; children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-linha text-xs uppercase tracking-wide text-tinta-suave">
            {cabecalho.map((c, i) => <th key={i} className="px-5 py-2.5 font-medium">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-linha">{children}</tbody>
      </table>
    </div>
  );
}

export function TituloPagina({ titulo, subtitulo, acao }: { titulo: string; subtitulo?: string; acao?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-palla-azul-escuro">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-tinta-suave">{subtitulo}</p>}
      </div>
      {acao}
    </div>
  );
}
