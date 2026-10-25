import { desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Aviso, Campo, Cartao, Entrada, LinkBotao, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData, MODALIDADE, STATUS_MATRICULA } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { registrarPraticaAcao } from "../acoes";

export const metadata = { title: "Atividades práticas" };

export default async function Praticas() {
  const a = await exigirEquipe("pratica.registrar");
  const instrutor = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, a.id) });
  const todas = await db.query.matriculas.findMany({
    where: inArray(schema.matriculas.status, ["PENDENTE_PRATICA", "MATRICULADO", "EM_ANDAMENTO"]),
    with: { curso: true, colaborador: { with: { obra: true } } },
  });
  const pendentes = todas.filter((m) => m.status === "PENDENTE_PRATICA" || (m.curso.modalidade === "PRESENCIAL" && m.classificacao !== "RECOMENDADO"));
  const registros = await db.query.registrosPraticos.findMany({
    orderBy: desc(schema.registrosPraticos.criadoEm), limit: 20,
    with: { matricula: { with: { curso: true, colaborador: true } }, instrutor: true },
  });
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <>
      <TituloPagina
        titulo="Atividades práticas e turmas presenciais"
        subtitulo="O curso fica “Pendente de prática” até o registro do instrutor como APTO."
        acao={<LinkBotao href="/imprimir/ficha" variante="secundario">Ficha de evidência para imprimir</LinkBotao>}
      />
      {!instrutor?.qualificacao && <div className="mb-4"><Aviso tom="erro">Seu cadastro de instrutor está sem qualificação. Peça ao administrador para completá-lo antes de registrar.</Aviso></div>}
      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <Cartao titulo={`Pendentes (${pendentes.length})`}>
          {pendentes.length === 0 ? <Vazio>Nenhuma etapa presencial pendente.</Vazio> : (
            <ul className="divide-y divide-linha text-sm">
              {pendentes.map((m) => (
                <li key={m.id} className="py-2.5">
                  <span className="font-medium">{m.colaborador.nome}</span> <span className="text-tinta-suave">· {m.colaborador.obra?.codigo ?? "—"}</span>
                  <span className="block text-xs text-tinta-suave">{m.curso.codigo} · {m.curso.titulo} · {MODALIDADE[m.curso.modalidade]} · <Selo cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo></span>
                </li>
              ))}
            </ul>
          )}
        </Cartao>
        <Cartao titulo="Registrar atividade presencial">
          <Formulario acao={registrarPraticaAcao} rotulo="Salvar registro" limparAoConcluir>
            <Campo rotulo="Participante e treinamento">
              <Selecao name="matriculaId" required>
                <option value="">Selecione…</option>
                {pendentes.map((m) => <option key={m.id} value={m.id}>{m.colaborador.nome} — {m.curso.codigo} ({m.curso.modalidade === "PRESENCIAL" ? "teoria + prática" : "prática"})</option>)}
              </Selecao>
            </Campo>
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Data"><Entrada type="date" name="data" defaultValue={hoje} max={hoje} required /></Campo>
              <Campo rotulo="Duração (min)"><Entrada type="number" name="duracaoMin" min={1} required /></Campo>
              <Campo rotulo="Nota (cursos presenciais)"><Entrada type="number" name="notaAvaliacao" min={0} max={100} /></Campo>
            </div>
            <Campo rotulo="Local"><Entrada name="local" required /></Campo>
            <Campo rotulo="Equipamento utilizado"><Entrada name="equipamento" /></Campo>
            <Campo rotulo="Conteúdo prático executado"><AreaTexto name="conteudo" rows={3} required /></Campo>
            <Campo rotulo="Resultado"><Selecao name="resultado"><option value="APTO">Apto</option><option value="NAO_APTO">Não apto</option></Selecao></Campo>
            <Campo rotulo="Observações"><Entrada name="observacoes" /></Campo>
            <Campo rotulo="Evidências (fotos, lista de presença assinada)"><Entrada type="file" name="evidencias" multiple accept="image/*,application/pdf" /></Campo>
            <p className="text-xs text-tinta-suave">O registro fica vinculado ao seu login ({a.nome}) e entra na trilha de auditoria.</p>
          </Formulario>
        </Cartao>
      </div>
      <Cartao titulo="Registros recentes" className="mt-5">
        {registros.length === 0 ? <Vazio>Nenhum registro.</Vazio> : (
          <Tabela cabecalho={["Data", "Participante", "Curso", "Local", "Duração", "Resultado", "Instrutor"]}>
            {registros.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-2.5">{fmtData(r.data)}</td>
                <td className="px-5">{r.matricula.colaborador.nome}</td>
                <td className="px-5 text-xs">{r.matricula.curso.codigo}</td>
                <td className="px-5 text-xs">{r.local}</td>
                <td className="px-5 tabular-nums">{r.duracaoMin} min</td>
                <td className="px-5"><Selo cor={r.resultado === "APTO" ? "verde" : "vermelho"}>{r.resultado === "APTO" ? "Apto" : "Não apto"}</Selo></td>
                <td className="px-5 text-xs">{r.instrutor.nome}</td>
              </tr>
            ))}
          </Tabela>
        )}
      </Cartao>
    </>
  );
}
