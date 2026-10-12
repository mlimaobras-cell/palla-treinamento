import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Aviso } from "@/components/ui";
import { exigirColaborador } from "@/lib/sessao";
import { aulasDoCurso, carregarMatriculaDoColaborador, diagnosticaPendente, segundosMinimos } from "@/lib/servicos/aprendizagem";
import { Player } from "./player";

export default async function Aula({ params }: { params: Promise<{ id: string; aulaId: string }> }) {
  const { id, aulaId } = await params;
  const a = await exigirColaborador();
  const m = await carregarMatriculaDoColaborador(a, id);
  if (diagnosticaPendente(m)) redirect(`/colaborador/curso/${id}`);
  const apoio = m.curso.modalidade === "PRESENCIAL";
  const aulas = aulasDoCurso(m);
  const i = aulas.findIndex((x) => x.id === aulaId);
  if (i < 0) notFound();
  const aula = aulas[i];
  const prog = m.progresso.find((p) => p.aulaId === aulaId);
  return (
    <div className="space-y-4">
      <Link href={`/colaborador/curso/${id}`} className="text-sm font-medium text-palla-azul">← {m.curso.titulo}</Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-tinta-suave">Capítulo {aula.capituloOrdem} · {aula.capituloTitulo} · Aula {i + 1} de {aulas.length}</p>
        <h1 className="mt-1 text-xl font-semibold text-palla-azul-escuro">{aula.titulo}</h1>
      </div>
      {apoio && (
        <Aviso tom="info"><strong>Material de apoio.</strong> Use para estudar antes da turma e revisar depois. Ele não conta como carga horária: o treinamento é presencial, com teoria, prática e avaliação aplicadas pelo instrutor.</Aviso>
      )}
      <Player
        matriculaId={id}
        aula={{ id: aula.id, videoUrl: aula.videoUrl, legendaUrl: aula.legendaUrl, roteiro: aula.roteiro, narracao: aula.narracao, textoApoio: aula.textoApoio, exemplo: aula.exemplo, perguntaFixacao: aula.perguntaFixacao, resumo: aula.resumo, duracaoMin: aula.duracaoMin }}
        segundosIniciais={prog?.segundos ?? 0}
        segundosMinimos={segundosMinimos(aula.duracaoMin, m.curso.tempoMinimoAulaPct)}
        concluida={!!prog?.concluidaEm}
        proxima={aulas[i + 1]?.id ?? null}
        anterior={aulas[i - 1]?.id ?? null}
        apoio={apoio}
      />
    </div>
  );
}
