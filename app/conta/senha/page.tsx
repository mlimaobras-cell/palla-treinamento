import Link from "next/link";
import { redirect } from "next/navigation";
import { Marca } from "@/components/marca";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada } from "@/components/ui";
import { obterAtor } from "@/lib/sessao";
import { trocarSenha } from "@/app/login/acoes";
import { CampoSenha } from "@/components/campo-senha";

export const metadata = { title: "Trocar senha" };

export default async function TrocarSenha() {
  const a = await obterAtor();
  if (!a) redirect("/login");
  const voltar = a.perfil === "COLABORADOR" ? "/colaborador" : "/admin";
  return (
    <main className="mx-auto max-w-md space-y-5 px-4 py-8">
      <Marca className="h-10" />
      <Link href={voltar} className="block text-sm font-medium text-palla-azul">← Voltar</Link>
      <Cartao titulo="Trocar senha">
        <Formulario acao={trocarSenha} rotulo="Salvar nova senha" limparAoConcluir>
          <Campo rotulo="Senha atual"><CampoSenha name="atual" autoComplete="current-password" required /></Campo>
          <Campo rotulo="Nova senha" ajuda="Pelo menos 10 caracteres."><CampoSenha name="nova" autoComplete="new-password" minLength={10} required /></Campo>
          <Campo rotulo="Repita a nova senha"><CampoSenha name="confirma" autoComplete="new-password" minLength={10} required /></Campo>
        </Formulario>
      </Cartao>
    </main>
  );
}
