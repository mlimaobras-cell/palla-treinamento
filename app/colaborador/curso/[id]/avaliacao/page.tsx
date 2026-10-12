import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Cartao, Selo } from "@/components/ui";
import { exigirColaborador } from "@/lib/sessao";
import { carregarMatriculaDoColaborador, questoesDaTentativa } from "@/lib/servicos/aprendizagem";
import { enviarAvaliacaoAcao } from "../../../acoes";

export default async function Avaliacao({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ resultado?: string }> }) {
  const { id } = await params;
  const { resultado } = await searchParams;
  const a = await exigirColaborador();
  const m = await carregarMatriculaDoColaborador(a, id);

  if (resultado) {
    const t = m.tentativas.find((x) => x.id === resultado && x.finalizadaEm);
    if (!t) redirect(`/colaborador/curso/${id}`);
    if (t.tipo === "DIAGNOSTICA") {
      const acertos = t.respostas?.filter((r) => r.correta).length ?? 0;
      return (
        <div className="space-y-5">
          <Link href={`/colaborador/curso/${id}`} className="text-sm font-medium text-palla-azul">← {m.curso.titulo}</Link>
          <Aviso tom="info">
            <p className="text-lg font-semibold">Avaliação diagnóstica enviada: {t.nota}% ({acertos} de {t.questoes.length})</p>
            <p>Esta nota não conta para aprovação. Ela mostra o que você já sabia antes do curso. O gabarito comentado aparece depois da avaliação final.</p>
          </Aviso>
          <Link href={`/colaborador/curso/${id}`} className="inline-block rounded-lg bg-palla-azul px-4 py-3 text-sm font-semibold text-white">Assistir à videoaula</Link>
        </div>
      );
    }
    const qs = await db.query.questoes.findMany({ where: (q, { inArray }) => inArray(q.id, t.questoes.map((x) => x.questaoId)) });
    return (
      <div className="space-y-5">
        <Link href={`/colaborador/curso/${id}`} className="text-sm font-medium text-palla-azul">← {m.curso.titulo}</Link>
        <Aviso tom={t.aprovado ? "sucesso" : "erro"}>
          <p className="text-lg font-semibold">{t.aprovado ? "Aprovado" : "Nota abaixo do mínimo"}: {t.nota}%</p>
          <p>Nota mínima: {m.curso.notaMinima}%. {t.aprovado ? (m.curso.exigePratica ? "Próximo passo: prática presencial." : "Próximo passo: aprovação do responsável técnico.") : "Revise as aulas e o gabarito comentado antes de tentar de novo."}</p>
        </Aviso>
        <Cartao titulo="Gabarito comentado">
          <ol className="space-y-5">
            {t.questoes.map((s, i) => {
              const q = qs.find((x) => x.id === s.questaoId)!;
              const r = t.respostas?.find((x) => x.questaoId === q.id);
              return (
                <li key={q.id} className="text-sm">
                  <div className="flex items-start justify-between gap-3"><p className="font-medium">{i + 1}. {q.enunciado}</p><Selo cor={r?.correta ? "verde" : "vermelho"}>{r?.correta ? "Acertou" : "Errou"}</Selo></div>
                  <p className="mt-1 text-tinta-suave">Resposta correta: {q.alternativas.find((x) => x.id === q.correta)?.texto}</p>
                  <p className="mt-1 rounded-lg bg-palla-azul-claro p-3 text-palla-azul-escuro">{q.comentario}</p>
                </li>
              );
            })}
          </ol>
        </Cartao>
      </div>
    );
  }

  const aberta = m.tentativas.find((t) => !t.finalizadaEm);
  if (!aberta) redirect(`/colaborador/curso/${id}`);
  const questoes = await questoesDaTentativa(aberta.id);
  const atual = await db.query.tentativas.findFirst({ where: eq(schema.tentativas.id, aberta.id) });

  return (
    <div className="space-y-5">
      <Link href={`/colaborador/curso/${id}`} className="text-sm font-medium text-palla-azul">← {m.curso.titulo}</Link>
      <div>
        {atual?.tipo === "DIAGNOSTICA" ? (
          <>
            <h1 className="text-xl font-semibold text-palla-azul-escuro">Avaliação diagnóstica · antes do vídeo</h1>
            <p className="mt-1 text-sm text-tinta-suave">{questoes.length} questões. Responda com o que você já sabe. Não há reprovação nesta etapa.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-palla-azul-escuro">Avaliação final · tentativa {atual?.numero}</h1>
            <p className="mt-1 text-sm text-tinta-suave">{questoes.length} questões. Responda todas antes de enviar. Nota mínima: {m.curso.notaMinima}%.</p>
          </>
        )}
      </div>
      <Formulario acao={enviarAvaliacaoAcao.bind(null, id, aberta.id)} rotulo="Enviar respostas" className="space-y-4">
        {questoes.map((q, i) => (
          <fieldset key={q.id} className="rounded-xl border border-linha bg-white p-4">
            <legend className="sr-only">Questão {i + 1}</legend>
            {q.tipo === "SITUACIONAL" && <Selo cor="azul">Situação de campo</Selo>}
            <p className="mt-2 font-medium">{i + 1}. {q.enunciado}</p>
            {q.imagemUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={q.imagemUrl} alt="" className="mt-3 max-h-64 rounded-lg" />}
            <div className="mt-3 space-y-2">
              {q.alternativas.map((alt) => (
                <label key={alt.id} className="flex cursor-pointer gap-3 rounded-lg border border-linha p-3 text-sm has-[:checked]:border-palla-azul has-[:checked]:bg-palla-azul-claro">
                  <input type="radio" name={`q_${q.id}`} value={alt.id} required className="mt-0.5 h-4 w-4" />
                  <span>{alt.texto}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </Formulario>
    </div>
  );
}
