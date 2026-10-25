import { ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada, Selecao, Selo, TituloPagina } from "@/components/ui";
import { fmtDataHora } from "@/lib/formato";
import { NOME_PERFIL } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { PERFIS_EQUIPE } from "@/lib/servicos/equipe";
import { alterarUsuarioAcao, criarUsuarioAcao, linkSenhaEquipeAcao } from "../sst/acoes";

export const metadata = { title: "Equipe" };

export default async function Equipe() {
  const a = await exigirEquipe("painel.ver");
  if (a.perfil !== "ADMIN") return <Aviso tom="erro">Só o administrador geral gerencia a equipe.</Aviso>;
  const usuarios = await db.query.usuarios.findMany({ where: ne(schema.usuarios.perfil, "COLABORADOR"), orderBy: (u, { asc }) => [asc(u.perfil), asc(u.nome)] });
  return (
    <>
      <TituloPagina titulo="Equipe" subtitulo="Pessoas da Palla que usam o painel: RH, Segurança do Trabalho, instrutores, responsável técnico e gestores de obra." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Cartao titulo={`${usuarios.length} usuário(s)`}>
          <ul className="divide-y divide-linha text-sm">
            {usuarios.map((u) => (
              <li key={u.id} className={`py-3 ${u.ativo ? "" : "opacity-60"}`}>
                <div className="flex items-start justify-between gap-2">
                  <span><span className="font-medium">{u.nome}</span>{u.email.endsWith(".teste") && <Selo cor="amarelo">teste</Selo>}<span className="block text-xs text-tinta-suave">{u.email}{u.qualificacao && ` · ${u.qualificacao}`}{u.registroProfissional && ` · ${u.registroProfissional}`} · último acesso {u.ultimoAcessoEm ? fmtDataHora(u.ultimoAcessoEm) : "nunca"}</span></span>
                  <Selo cor={u.ativo ? "azul" : "cinza"}>{u.ativo ? NOME_PERFIL[u.perfil] : "Desativado"}</Selo>
                </div>
                <details className="mt-1"><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Alterar</summary>
                  <Formulario acao={alterarUsuarioAcao.bind(null, u.id)} rotulo="Salvar" variante="secundario" className="mt-2 grid gap-2 sm:grid-cols-2">
                    <Campo rotulo="Perfil"><Selecao name="perfil" defaultValue={u.perfil}>{PERFIS_EQUIPE.map((p) => <option key={p} value={p}>{NOME_PERFIL[p]}</option>)}</Selecao></Campo>
                    <Campo rotulo="Qualificação"><Entrada name="qualificacao" defaultValue={u.qualificacao ?? ""} /></Campo>
                    <Campo rotulo="Registro profissional"><Entrada name="registro" defaultValue={u.registroProfissional ?? ""} /></Campo>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="ativo" value="1" defaultChecked={u.ativo} /> Ativo</label>
                  </Formulario>
                  <Formulario acao={linkSenhaEquipeAcao.bind(null, u.id)} rotulo="Gerar link de nova senha" variante="secundario" className="mt-2"><span /></Formulario>
                </details>
              </li>
            ))}
          </ul>
        </Cartao>
        <Cartao titulo="Novo usuário">
          <Formulario acao={criarUsuarioAcao} rotulo="Criar e gerar link" limparAoConcluir>
            <Campo rotulo="Nome completo"><Entrada name="nome" required /></Campo>
            <Campo rotulo="E-mail"><Entrada type="email" name="email" required /></Campo>
            <Campo rotulo="Perfil"><Selecao name="perfil">{PERFIS_EQUIPE.map((p) => <option key={p} value={p}>{NOME_PERFIL[p]}</option>)}</Selecao></Campo>
            <Campo rotulo="Qualificação" ajuda="Obrigatória para instrutor e responsável técnico (sai no certificado)."><Entrada name="qualificacao" /></Campo>
            <Campo rotulo="Registro profissional" ajuda="Ex.: CREA-SP 000000; registro MTE."><Entrada name="registro" /></Campo>
            <p className="text-xs text-tinta-suave">A pessoa recebe um link para criar a própria senha. Ninguém vê a senha.</p>
          </Formulario>
        </Cartao>
      </div>
    </>
  );
}
