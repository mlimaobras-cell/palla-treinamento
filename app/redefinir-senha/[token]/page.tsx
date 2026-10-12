import Link from "next/link";
import { CabecalhoPublico } from "@/components/marca";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Entrada } from "@/components/ui";
import { buscarRedefinicao, SENHA_MINIMA } from "@/lib/servicos/senha";
import { redefinir } from "./acoes";

export const metadata = { title: "Criar nova senha" };

export default async function RedefinirSenha({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await buscarRedefinicao(token);
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-md px-4 py-8">
        {"erro" in r ? (
          <Aviso tom="erro">{r.erro} <Link href="/login" className="font-semibold underline">Ir para o login</Link></Aviso>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-wider text-palla-vermelho">Nova senha</p>
            <h1 className="mt-1 text-2xl font-semibold text-palla-azul-escuro">Olá, {r.usuario.nome.split(" ")[0]}</h1>
            <p className="mt-2 text-sm text-tinta-suave">Crie uma nova senha para entrar com o e-mail <strong>{r.usuario.email}</strong>.</p>
            <div className="mt-6 rounded-xl border border-linha bg-white p-5">
              <Formulario acao={redefinir.bind(null, token)} rotulo="Salvar e entrar">
                <Campo rotulo="Nova senha" ajuda={`Mínimo de ${SENHA_MINIMA} caracteres.`}><Entrada name="nova" type="password" autoComplete="new-password" minLength={SENHA_MINIMA} required /></Campo>
                <Campo rotulo="Repita a nova senha"><Entrada name="confirma" type="password" autoComplete="new-password" minLength={SENHA_MINIMA} required /></Campo>
              </Formulario>
            </div>
          </>
        )}
      </main>
    </>
  );
}
