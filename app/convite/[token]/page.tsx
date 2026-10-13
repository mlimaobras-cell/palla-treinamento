import Link from "next/link";
import { CabecalhoPublico } from "@/components/marca";
import { CampoData } from "@/components/campo-data";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Entrada } from "@/components/ui";
import { buscarConviteValido } from "@/lib/servicos/cadastro";
import { cadastrar } from "./acoes";
import { CampoSenha } from "@/components/campo-senha";

export const metadata = { title: "Cadastro" };

export default async function Convite({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await buscarConviteValido(token);
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-xl px-4 py-8">
        {"erro" in r ? (
          <Aviso tom="erro">{r.erro} <Link href="/login" className="font-semibold underline">Ir para o login</Link></Aviso>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-linha bg-white px-4 py-3 text-sm">
              <span className="text-tinta-suave">Já tem cadastro na plataforma?</span>
              <span className="flex gap-4">
                <Link href="/login" className="font-semibold text-palla-azul hover:underline">Entrar</Link>
                <Link href="/esqueci-senha" className="font-medium text-palla-azul hover:underline">Esqueci minha senha</Link>
              </span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-palla-vermelho">Cadastro do colaborador</p>
            <h1 className="mt-1 text-2xl font-semibold text-palla-azul-escuro">Bem-vindo à Palla Construções</h1>
            <p className="mt-2 text-sm text-tinta-suave">
              Preencha seus dados para começar a integração e os treinamentos da sua função antes de ir para a obra.
            </p>
            <dl className="mt-5 grid gap-3 rounded-xl border border-linha bg-white p-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase text-tinta-suave">Função</dt><dd className="font-medium">{r.convite.funcao.nome}</dd></div>
              <div><dt className="text-xs uppercase text-tinta-suave">Obra de destino</dt><dd className="font-medium">{r.convite.obra.nome}</dd></div>
            </dl>
            <div className="mt-6 rounded-xl border border-linha bg-white p-5">
              <Formulario acao={cadastrar.bind(null, token)} rotulo="Criar meu cadastro">
                <Campo rotulo="Nome completo"><Entrada name="nome" defaultValue={r.convite.nomeSugerido ?? ""} autoComplete="name" required /></Campo>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo rotulo="CPF"><Entrada name="cpf" inputMode="numeric" placeholder="000.000.000-00" required /></Campo>
                  <Campo rotulo="Data de nascimento"><CampoData name="dataNascimento" /></Campo>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo rotulo="Celular com DDD"><Entrada name="telefone" type="tel" inputMode="tel" autoComplete="tel" required /></Campo>
                  <Campo rotulo="E-mail"><Entrada name="email" type="email" autoComplete="email" required /></Campo>
                </div>
                <Campo rotulo="Crie uma senha" ajuda="Mínimo de 8 caracteres."><CampoSenha name="senha" autoComplete="new-password" minLength={8} required /></Campo>
                <label className="flex gap-3 rounded-lg bg-palla-azul-claro p-3 text-sm">
                  <input type="checkbox" name="consentimento" className="mt-1 h-4 w-4" required />
                  <span>Li o <Link href="/aviso-privacidade" target="_blank" className="font-semibold text-palla-azul underline">aviso de privacidade</Link> e estou ciente de como meus dados pessoais serão tratados para fins de integração, treinamento e controle de acesso às obras.</span>
                </label>
              </Formulario>
            </div>
          </>
        )}
      </main>
    </>
  );
}
