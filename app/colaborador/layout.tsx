import Link from "next/link";
import { Marca } from "@/components/marca";
import { exigirColaborador } from "@/lib/sessao";
import { sair } from "@/app/login/acoes";
import { InstalarApp } from "@/components/app-pwa";

export default async function LayoutColaborador({ children }: { children: React.ReactNode }) {
  const a = await exigirColaborador();
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-linha bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/colaborador" aria-label="Início"><Marca className="h-8" /></Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden max-w-40 truncate text-tinta-suave sm:inline">{a.nome}</span>
            <Link href="/colaborador/documentos" className="font-medium text-palla-azul">Documentos</Link>
            <Link href="/conta/senha" className="font-medium text-tinta-suave hover:text-palla-azul">Senha</Link>
            <form action={sair}><button className="font-medium text-tinta-suave hover:text-palla-vermelho">Sair</button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-5"><InstalarApp className="mb-3 flex justify-end" />{children}</main>
    </div>
  );
}
