import Link from "next/link";
import { Formulario } from "@/components/formulario";
import { Aviso, Cartao, Selo } from "@/components/ui";
import { fmtData, fmtHoras, MODALIDADE, ORIGEM, STATUS_MATRICULA, TIPO_CURSO } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { aulasDoCurso, carregarMatriculaDoColaborador, diagnosticaPendente, tentativasValidas } from "@/lib/servicos/aprendizagem";
import { comprovanteAcao, iniciarAvaliacaoAcao, iniciarDiagnosticaAcao } from "../../acoes";

export default async function Curso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirColaborador();
  const m = await carregarMatriculaDoColaborador(a, id);
  const c = m.curso;
  const aulas = aulasDoCurso(m);
  const concluida = (aulaId: string) => m.progresso.some((p) => p.aulaId === aulaId && p.concluidaEm);
  const todas = aulas.length > 0 && aulas.every((x) => concluida(x.id));
  const usadas = tentativasValidas(m);
  const presencial = c.modalidade === "PRESENCIAL";
  const bloqueado = diagnosticaPendente(m);
  const diag = m.tentativas.find((t) => t.tipo === "DIAGNOSTICA");
  const finais = m.tentativas.filter((t) => t.tipo === "FINAL" && t.finalizadaEm);

  return (
    <div className="space-y-5">
      <Link href="/colaborador" className="text-sm font-medium text-palla-azul">← Minha trilha</Link>
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Selo cor="azul">{TIPO_CURSO[c.tipo]}</Selo>
          <Selo cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-palla-azul-escuro">{c.titulo}</h1>
        <p className="mt-1 text-sm text-tinta-suave">{c.objetivo}</p>
      </header>

      <dl className="grid grid-cols-2 gap-3 rounded-xl border border-linha bg-white p-4 text-sm sm:grid-cols-4">
        <div><dt className="text-xs text-tinta-suave">Carga horária</dt><dd className="font-semibold">{fmtHoras(c.cargaHoraria)}</dd><dd className="text-[11px] text-tinta-suave">{ORIGEM[c.cargaOrigem]}</dd></div>
        <div><dt className="text-xs text-tinta-suave">Modalidade</dt><dd className="font-semibold">{MODALIDADE[c.modalidade]}</dd></div>
        <div><dt className="text-xs text-tinta-suave">Nota mínima</dt><dd className="font-semibold">{c.notaMinima}%</dd></div>
        <div><dt className="text-xs text-tinta-suave">Fundamentação</dt><dd className="font-semibold">{c.normaReferencia.split(";")[0]}</dd></div>
      </dl>

      {c.statusConteudo !== "APROVADO" && (
        <Aviso tom="alerta">Conteúdo em revisão técnica. Você pode estudar, mas o certificado só é emitido depois da aprovação do responsável técnico.</Aviso>
      )}
      {presencial && (
        <Aviso tom="info">
          <strong>Curso presencial.</strong> {c.observacaoLegal ?? "A carga horária é cumprida em turma presencial com instrutor."} A Segurança do Trabalho vai agendar sua turma.
        </Aviso>
      )}
      {c.exigePratica && !presencial && (
        <Aviso tom="info"><strong>Este curso tem etapa prática presencial:</strong> {c.praticaDescricao}</Aviso>
      )}

      {c.exigeDiagnostica && !presencial && (
        <Cartao titulo="1. Avaliação diagnóstica (antes do vídeo)">
          {diag?.finalizadaEm ? (
            <p className="text-sm">Feita em {fmtData(diag.finalizadaEm)}. Sua nota de entrada: <strong>{diag.nota}%</strong>. Ela não conta para aprovação; serve para medir quanto você evoluiu com o curso.</p>
          ) : (
            <Formulario acao={iniciarDiagnosticaAcao.bind(null, m.id)} rotulo={diag ? "Continuar avaliação diagnóstica" : "Fazer avaliação diagnóstica"}>
              <p className="text-sm text-tinta-suave">Antes do vídeo, responda a algumas perguntas sobre o assunto. Responda com o que você já sabe: não há reprovação nesta etapa e ela é feita uma única vez. Depois dela, o vídeo é liberado.</p>
            </Formulario>
          )}
        </Cartao>
      )}

      {aulas.length > 0 && (
        <Cartao titulo={presencial ? "Material de apoio (não conta como carga horária)" : c.exigeDiagnostica ? "2. Videoaula" : "Aulas"}>
          <ol className="space-y-5">
            {m.curso.capitulos.map((cap) => (
              <li key={cap.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-tinta-suave">Capítulo {cap.ordem} · {cap.titulo}</p>
                <ul className="mt-2 divide-y divide-linha rounded-lg border border-linha">
                  {cap.aulas.map((au) => (
                    <li key={au.id}>
                      {bloqueado ? (
                        <span className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-tinta-suave">
                          <span className="flex items-center gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs">🔒</span>{au.titulo}</span>
                          <span className="shrink-0 text-xs">liberada após a diagnóstica</span>
                        </span>
                      ) : (
                      <Link href={`/colaborador/curso/${m.id}/aula/${au.id}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50">
                        <span className="flex items-center gap-3">
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${!presencial && concluida(au.id) ? "bg-emerald-500 text-white" : "bg-slate-100 text-tinta-suave"}`}>{!presencial && concluida(au.id) ? "✓" : au.ordem}</span>
                          {au.titulo}
                        </span>
                        <span className="shrink-0 text-xs text-tinta-suave">{au.duracaoMin} min</span>
                      </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Cartao>
      )}
      {aulas.length === 0 && !presencial && <Aviso tom="info">O conteúdo deste curso está em desenvolvimento.</Aviso>}

      {!presencial && aulas.length > 0 && (
        <Cartao titulo={c.exigeDiagnostica ? "3. Avaliação final (depois do vídeo)" : "Avaliação"}>
          {finais.length > 0 && (
            <ul className="mb-4 space-y-1 text-sm">
              {finais.map((t) => (
                <li key={t.id} className="flex justify-between"><span>Tentativa {t.numero} · {fmtData(t.finalizadaEm)}</span><span className={t.aprovado ? "font-semibold text-emerald-700" : "font-semibold text-red-700"}>{t.nota}% {t.aprovado ? "aprovado" : "não atingiu"}</span></li>
              ))}
            </ul>
          )}
          {diag?.finalizadaEm && finais.length > 0 && (
            <p className="mb-4 rounded-lg bg-palla-azul-claro p-3 text-sm text-palla-azul-escuro">Evolução: diagnóstica {diag.nota}% → melhor nota final {Math.max(...finais.map((t) => t.nota ?? 0))}%.</p>
          )}
          {["MATRICULADO", "EM_ANDAMENTO"].includes(m.status) ? (
            bloqueado ? <p className="text-sm text-tinta-suave">Faça a avaliação diagnóstica e assista ao vídeo para liberar a avaliação final.</p> : todas ? (
              usadas < c.maxTentativas ? (
                <Formulario acao={iniciarAvaliacaoAcao.bind(null, m.id)} rotulo={m.tentativas.some((t) => t.tipo === "FINAL" && !t.finalizadaEm) ? "Continuar avaliação" : "Iniciar avaliação"}>
                  <p className="text-sm text-tinta-suave">As perguntas e as alternativas aparecem em ordem sorteada. Tentativas usadas: {usadas} de {c.maxTentativas}.</p>
                </Formulario>
              ) : <Aviso tom="erro">Limite de tentativas atingido. Procure a Segurança do Trabalho para reforço e liberação de nova avaliação.</Aviso>
            ) : <p className="text-sm text-tinta-suave">Conclua todas as aulas para liberar a avaliação.</p>
          ) : m.status === "REPROVADO" ? (
            <Aviso tom="erro">Limite de tentativas atingido. Procure a Segurança do Trabalho para reforço e liberação de nova avaliação.</Aviso>
          ) : <p className="text-sm text-emerald-800">Avaliação teórica concluída com aprovação.</p>}
        </Cartao>
      )}

      {m.status === "PENDENTE_PRATICA" && (
        <Cartao titulo="Etapa prática pendente">
          <p className="text-sm">Você concluiu a teoria. Falta a prática presencial: {c.praticaDescricao}</p>
          <div className="mt-4">
            <Formulario acao={comprovanteAcao.bind(null, m.id)} rotulo="Emitir comprovante de etapa teórica" variante="secundario">
              <p className="text-xs text-tinta-suave">O comprovante de etapa não é certificado e não autoriza a atividade.</p>
            </Formulario>
          </div>
        </Cartao>
      )}
      {m.status === "AGUARDANDO_APROVACAO" && <Aviso tom="info">Requisitos concluídos. Aguardando conferência e aprovação do responsável técnico para emissão do certificado.</Aviso>}
    </div>
  );
}
