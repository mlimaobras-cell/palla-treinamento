import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Campo, Cartao, Entrada, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { criarConviteAcao, criarObraAcao } from "../acoes";
import { CopiarLink } from "./copiar";

export const metadata = { title: "Obras e convites" };

export default async function Obras() {
  await exigirEquipe("obra.gerir");
  const [obras, funcoes, empresas, gestores, convites] = await Promise.all([
    db.query.obras.findMany({ with: { contratante: true, gestor: true, colaboradores: true }, orderBy: (o, { asc }) => asc(o.codigo) }),
    db.query.funcoes.findMany({ orderBy: (f, { asc }) => asc(f.ordem) }),
    db.query.empresas.findMany(),
    db.query.usuarios.findMany({ where: (u, { eq }) => eq(u.perfil, "GESTOR_OBRA") }),
    db.query.convites.findMany({ with: { obra: true, funcao: true }, orderBy: desc(schema.convites.criadoEm), limit: 15 }),
  ]);
  const base = (process.env.APP_URL ?? "").replace(/\/$/, "");
  return (
    <>
      <TituloPagina titulo="Obras e convites" subtitulo="Cadastre obras e gere o link que o futuro colaborador recebe para se cadastrar." />
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <Cartao titulo="Obras">
            {obras.length === 0 ? <Vazio>Nenhuma obra.</Vazio> : (
              <Tabela cabecalho={["Código", "Obra", "Contratante", "Gestor", "Equipe"]}>
                {obras.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-2.5 font-mono text-xs">{o.codigo}</td>
                    <td className="px-5">{o.nome}{o.exigenciasExtras && <span className="block text-xs text-tinta-suave">Exige: {o.exigenciasExtras}</span>}</td>
                    <td className="px-5">{o.contratante?.nome ?? "—"}</td>
                    <td className="px-5">{o.gestor?.nome ?? "—"}</td>
                    <td className="px-5 tabular-nums">{o.colaboradores.length}</td>
                  </tr>
                ))}
              </Tabela>
            )}
          </Cartao>
          <Cartao titulo="Links de cadastro recentes">
            {convites.length === 0 ? <Vazio>Nenhum link gerado.</Vazio> : (
              <ul className="divide-y divide-linha text-sm">
                {convites.map((c) => {
                  const estado = c.usadoEm ? ["Usado", "verde"] : c.expiraEm < new Date() ? ["Expirado", "vermelho"] : ["Ativo", "azul"];
                  return (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                      <span>{c.nomeSugerido || "Sem nome"} · {c.funcao.nome} · {c.obra.codigo}<span className="block text-xs text-tinta-suave">Expira em {fmtData(c.expiraEm)}</span></span>
                      <span className="flex items-center gap-2"><Selo cor={estado[1]}>{estado[0]}</Selo>{!c.usadoEm && c.expiraEm > new Date() && <CopiarLink url={`${base}/convite/${c.token}`} />}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Cartao>
        </div>
        <div className="space-y-5">
          <Cartao titulo="Gerar link de cadastro">
            <Formulario acao={criarConviteAcao} rotulo="Gerar link">
              <Campo rotulo="Nome do futuro colaborador (opcional)"><Entrada name="nomeSugerido" /></Campo>
              <Campo rotulo="Função"><Selecao name="funcaoId" required>{funcoes.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Selecao></Campo>
              <Campo rotulo="Obra de destino"><Selecao name="obraId" required>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} · {o.nome}</option>)}</Selecao></Campo>
              <Campo rotulo="Empresa"><Selecao name="empresaId">{empresas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}</Selecao></Campo>
              <Campo rotulo="Validade do link (dias)"><Entrada name="validadeDias" type="number" min={1} max={60} defaultValue={15} /></Campo>
            </Formulario>
          </Cartao>
          <Cartao titulo="Nova obra">
            <Formulario acao={criarObraAcao} rotulo="Cadastrar obra" limparAoConcluir>
              <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                <Campo rotulo="Código"><Entrada name="codigo" placeholder="OBR-002" required /></Campo>
                <Campo rotulo="Nome"><Entrada name="nome" required /></Campo>
              </div>
              <Campo rotulo="Endereço"><Entrada name="endereco" /></Campo>
              <Campo rotulo="Contratante"><Entrada name="contratante" /></Campo>
              <Campo rotulo="Gestor da obra"><Selecao name="gestorId"><option value="">—</option>{gestores.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}</Selecao></Campo>
              <Campo rotulo="Documentos extras exigidos pela contratante"><Entrada name="exigenciasExtras" /></Campo>
              <Campo rotulo="Regras específicas para a integração"><AreaTexto name="textoIntegracao" rows={3} /></Campo>
            </Formulario>
          </Cartao>
        </div>
      </div>
    </>
  );
}
