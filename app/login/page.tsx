import Link from "next/link";
import { Formulario } from "@/components/formulario";
import { Marca } from "@/components/marca";
import { Campo, Entrada } from "@/components/ui";
import { entrar } from "./acoes";

export const metadata = { title: "Entrar" };

export default async function Login({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar } = await searchParams;
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-palla-azul-escuro p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Marca branco className="h-12" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Grupo Palla</p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight">Treinamento e Integração</h1>
          <p className="mt-4 max-w-md text-white/75">Integração, cursos, avaliações, práticas e certificados das equipes de montagem de estruturas metálicas, em um só lugar.</p>
        </div>
        <p className="text-xs text-white/50">Palla Construções · Capacitação interna</p>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rotate-12 border-[28px] border-white/5" aria-hidden />
        <div className="absolute bottom-0 left-0 h-2 w-48 bg-palla-vermelho" aria-hidden />
      </aside>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Marca className="h-10" /></div>
          <h2 className="text-2xl font-semibold text-palla-azul-escuro">Entrar</h2>
          <p className="mt-1 text-sm text-tinta-suave">Use o e-mail e a senha do seu cadastro.</p>
          <div className="mt-6">
            <Formulario acao={entrar} rotulo="Entrar">
              <input type="hidden" name="voltar" value={voltar ?? ""} />
              <Campo rotulo="E-mail"><Entrada name="email" type="email" autoComplete="email" required /></Campo>
              <Campo rotulo="Senha"><Entrada name="senha" type="password" autoComplete="current-password" required /></Campo>
            </Formulario>
          </div>
          <p className="mt-3 text-sm"><Link className="font-medium text-palla-azul hover:underline" href="/esqueci-senha">Esqueci minha senha</Link></p>
          <p className="mt-8 text-sm text-tinta-suave">
            Primeiro acesso? Use o link de cadastro que você recebeu do RH.
          </p>
          <p className="mt-2 text-sm"><Link className="font-medium text-palla-azul hover:underline" href="/verificar">Verificar a autenticidade de um certificado</Link></p>
        </div>
      </section>
    </main>
  );
}
