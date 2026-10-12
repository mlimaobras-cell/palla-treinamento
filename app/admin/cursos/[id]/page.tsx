import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada, Selecao, Selo, TituloPagina } from "@/components/ui";
import { fmtData, fmtHoras, MODALIDADE, ORIGEM, TIPO_CURSO } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { aprovarConteudoAcao, validarParametrosAcao } from "../../acoes";

export default async function CursoAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirEquipe("curso.ver");
  const c = await db.query.cursos.findFirst({
    where: eq(schema.cursos.id, id),
    with: {
      capitulos: { orderBy: asc(schema.capitulos.ordem), with: { aulas: { orderBy: asc(schema.aulas.ordem) } } },
      questoes: true, responsavelTecnico: true,
    },
  });
  if (!c) notFound();
  const totalMin = c.capitulos.flatMap((x) => x.aulas).reduce((s, x) => s + x.duracaoMin, 0);

  return (
    <>
      <Link href="/admin/cursos" className="text-sm font-medium text-palla-azul">← Cursos</Link>
      <div className="mt-2"><TituloPagina titulo={c.titulo} subtitulo={`${c.codigo} · ${TIPO_CURSO[c.tipo]}`} /></div>
      {c.observacaoLegal && <div className="mb-4"><Aviso tom="alerta">{c.observacaoLegal}</Aviso></div>}

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <Cartao titulo="Plano de ensino">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Fundamentação normativa", c.normaReferencia],
                ["Versão da norma usada", c.normaVersao],
                ["Objetivo", c.objetivo],
                ["Público-alvo", c.publicoAlvo],
                ["Pré-requisitos", c.preRequisitos ?? "—"],
                ["Carga horária", `${fmtHoras(c.cargaHoraria)} — ${ORIGEM[c.cargaOrigem]}`],
                ["Reciclagem", `${c.validadeMeses ? `${c.validadeMeses} meses` : "Sem prazo fixo"} — ${ORIGEM[c.validadeOrigem]}${c.validadeObservacao ? `. ${c.validadeObservacao}` : ""}`],
                ["Modalidade", MODALIDADE[c.modalidade]],
                ["Atividade prática", c.exigePratica ? c.praticaDescricao ?? "Sim" : "Não exigida"],
                ["Requisitos do instrutor", c.requisitosInstrutor ?? "Definidos pelo responsável técnico"],
                ["Responsável técnico", c.responsavelTecnico ? `${c.responsavelTecnico.nome} (${c.responsavelTecnico.qualificacao ?? "—"})` : "Não definido"],
                ["Critério de aprovação", `Nota mínima ${c.notaMinima}% (critério interno) · até ${c.maxTentativas} tentativas · ${c.tempoMinimoAulaPct}% do tempo de cada aula`],
                ["Autorização exigida", c.exigeAutorizacao ?? "—"],
                ["Aptidão no ASO", c.exigeAptidaoAso ?? "—"],
                ["Projeto pedagógico válido até", fmtData(c.projetoPedagogicoValidoAte)],
                ["Duração das aulas online", totalMin ? `${totalMin} min` : "—"],
              ].map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-wide text-tinta-suave">{k}</dt><dd className="mt-0.5">{v}</dd></div>)}
            </dl>
            <h3 className="mt-5 text-sm font-semibold">Conteúdo programático</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{c.conteudoProgramatico.split("\n").map((l) => <li key={l}>{l}</li>)}</ol>
          </Cartao>

          <Cartao titulo={`Aulas (${c.capitulos.flatMap((x) => x.aulas).length})`}>
            {c.modalidade === "PRESENCIAL" && c.capitulos.length > 0 && <p className="mb-3 text-sm text-tinta-suave">Material de apoio para o colaborador. Não conta como carga horária: a turma é presencial.</p>}
            {c.capitulos.length === 0 ? <p className="text-sm text-tinta-suave">{c.modalidade === "PRESENCIAL" ? "Curso presencial: o conteúdo é ministrado em turma e registrado em Atividades práticas." : "Conteúdo em desenvolvimento."}</p> : (
              <div className="space-y-4">
                {c.capitulos.map((cap) => (
                  <div key={cap.id}>
                    <p className="text-xs font-semibold uppercase text-tinta-suave">Capítulo {cap.ordem} · {cap.titulo}</p>
                    {cap.aulas.map((au) => (
                      <details key={au.id} className="mt-2 rounded-lg border border-linha p-3 text-sm">
                        <summary className="cursor-pointer font-medium">{au.ordem}. {au.titulo} <span className="font-normal text-tinta-suave">· {au.duracaoMin} min</span></summary>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div><p className="text-xs font-semibold uppercase text-tinta-suave">Roteiro</p><p className="prosa mt-1 text-xs">{au.roteiro}</p></div>
                          <div><p className="text-xs font-semibold uppercase text-tinta-suave">Narração</p><p className="prosa mt-1 text-xs">{au.narracao}</p></div>
                        </div>
                      </details>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Cartao>

          <Cartao titulo={`Banco de questões (${c.questoes.length})`}>
            {c.questoes.length > 0 && (
              <div className="mb-4 space-y-2 rounded-lg border border-linha bg-slate-50 p-3 text-sm">
                {c.modalidade === "PRESENCIAL" && <p>Curso presencial: a prova é aplicada em sala e a nota é lançada em Atividades práticas.</p>}
                <p>
                  <span className="font-medium">Banco completo:</span>{" "}
                  <a href={`/imprimir/prova/${c.id}`} target="_blank" className="font-semibold text-palla-azul underline">imprimir</a> ·{" "}
                  <a href={`/imprimir/prova/${c.id}?gabarito=1`} target="_blank" className="font-semibold text-palla-azul underline">com gabarito</a>
                </p>
                {c.exigeDiagnostica && (
                  <p>
                    <span className="font-medium">Diagnóstica ({c.questoes.filter((q) => q.diagnostica).length} questões, antes do vídeo):</span>{" "}
                    <a href={`/imprimir/prova/${c.id}?tipo=diagnostica`} target="_blank" className="font-semibold text-palla-azul underline">imprimir</a> ·{" "}
                    <a href={`/imprimir/prova/${c.id}?tipo=diagnostica&gabarito=1`} target="_blank" className="font-semibold text-palla-azul underline">com gabarito</a> ·{" "}
                    <a href={`/admin/resultados?curso=${c.id}`} className="font-semibold text-palla-azul underline">ver resultados</a>
                  </p>
                )}
              </div>
            )}
            <ol className="space-y-4 text-sm">
              {c.questoes.map((q, i) => (
                <li key={q.id}>
                  <p className="font-medium">{i + 1}. {q.codigo && <span className="text-xs text-tinta-suave">[{q.codigo}] </span>}{q.enunciado} {q.tipo === "SITUACIONAL" && <Selo cor="azul">situacional</Selo>} {q.diagnostica && <Selo cor="amarelo">diagnóstica</Selo>}</p>
                  <ul className="mt-1 space-y-0.5">{q.alternativas.map((al) => <li key={al.id} className={al.id === q.correta ? "font-semibold text-emerald-700" : "text-tinta-suave"}>{al.id}) {al.texto}</li>)}</ul>
                  <p className="mt-1 text-xs text-palla-azul-escuro">Comentário: {q.comentario}</p>
                </li>
              ))}
            </ol>
          </Cartao>
        </div>

        <div className="space-y-5">
          <Cartao titulo="Situação do conteúdo">
            <Selo cor={c.statusConteudo === "APROVADO" ? "verde" : c.statusConteudo === "EM_REVISAO" ? "amarelo" : "cinza"}>{c.statusConteudo === "APROVADO" ? "Aprovado" : c.statusConteudo === "EM_REVISAO" ? "Em revisão técnica" : "Em desenvolvimento"}</Selo>
            <p className="mt-3 text-sm text-tinta-suave">Certificados só são emitidos para cursos com conteúdo aprovado pelo responsável técnico. Trechos marcados com [A PREENCHER PELA PALLA] precisam ser completados antes.</p>
            {c.statusConteudo !== "APROVADO" && a.perfil === "RESPONSAVEL_TECNICO" && (
              <Formulario acao={aprovarConteudoAcao.bind(null, c.id)} rotulo="Aprovar conteúdo" className="mt-4 space-y-3">
                <label className="flex gap-2 text-sm"><input type="checkbox" name="confirmo" className="mt-1" /> Revisei o conteúdo, o plano de ensino, o banco de questões e a conformidade com a norma vigente.</label>
              </Formulario>
            )}
          </Cartao>
          {pode(a, "curso.editar") && (
            <Cartao titulo="Validar parâmetros legais">
              <Formulario acao={validarParametrosAcao.bind(null, c.id)} rotulo="Salvar parâmetros" variante="secundario" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Campo rotulo="Carga (h)"><Entrada name="cargaHoraria" defaultValue={c.cargaHoraria ?? ""} inputMode="decimal" /></Campo>
                  <Campo rotulo="Origem"><Selecao name="cargaOrigem" defaultValue={c.cargaOrigem}>{Object.entries(ORIGEM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
                  <Campo rotulo="Reciclagem (meses)"><Entrada name="validadeMeses" defaultValue={c.validadeMeses ?? ""} inputMode="numeric" /></Campo>
                  <Campo rotulo="Origem"><Selecao name="validadeOrigem" defaultValue={c.validadeOrigem}>{Object.entries(ORIGEM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
                </div>
                <Campo rotulo="Modalidade"><Selecao name="modalidade" defaultValue={c.modalidade}>{Object.entries(MODALIDADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
                <Campo rotulo="Versão da norma conferida" ajuda="Ex.: NR-18 atualizada 2026 (Portaria MTE nº 836/2026), conferida em 10/10/2026"><Entrada name="normaVersao" defaultValue={c.normaVersao} /></Campo>
              </Formulario>
            </Cartao>
          )}
        </div>
      </div>
    </>
  );
}
