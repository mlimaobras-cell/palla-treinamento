import Link from "next/link";
import { db } from "@/db";
import { Filtros } from "@/components/filtros";
import { Cartao, Indicador, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData, STATUS_MATRICULA } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";

export const metadata = { title: "Resultados das avaliações" };

const media = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

/** Diagnóstica (antes do vídeo) × avaliação final (depois do vídeo), por colaborador e por curso. */
export default async function Resultados({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await exigirEquipe("colaborador.ver");
  const f = await searchParams;
  const cursos = await db.query.cursos.findMany({
    orderBy: (c, { asc }) => asc(c.ordem),
    with: { questoes: true },
  });
  const matriculas = await db.query.matriculas.findMany({
    with: { curso: true, colaborador: { with: { funcao: true, obra: true } }, tentativas: true },
  });

  const linhas = matriculas
    .filter((m) => m.tentativas.some((t) => t.finalizadaEm))
    .filter((m) =>
      (!f.curso || m.cursoId === f.curso) &&
      (!f.obra || m.colaborador.obraId === f.obra) &&
      (!f.funcao || m.colaborador.funcaoId === f.funcao) &&
      (!f.busca || m.colaborador.nome.toLowerCase().includes(f.busca.toLowerCase())))
    .map((m) => {
      const diag = m.tentativas.find((t) => t.tipo === "DIAGNOSTICA" && t.finalizadaEm);
      const finais = m.tentativas.filter((t) => t.tipo === "FINAL" && t.finalizadaEm).sort((a, b) => a.numero - b.numero);
      const melhor = finais.length ? Math.max(...finais.map((t) => t.nota ?? 0)) : null;
      return { m, diag, finais, melhor, evolucao: diag?.nota != null && melhor !== null ? melhor - diag.nota : null };
    })
    .sort((a, b) => a.m.colaborador.nome.localeCompare(b.m.colaborador.nome, "pt-BR") || a.m.curso.ordem - b.m.curso.ordem);

  const diagNotas = linhas.flatMap((l) => (l.diag?.nota != null ? [l.diag.nota] : []));
  const finalNotas = linhas.flatMap((l) => (l.melhor !== null ? [l.melhor] : []));
  const comAmbas = linhas.filter((l) => l.evolucao !== null);

  // Acerto por questão (só quando um curso está filtrado): diagnóstica × final.
  const curso = f.curso ? cursos.find((c) => c.id === f.curso) : undefined;
  const porQuestao = curso
    ? curso.questoes
        .filter((q) => q.ativa)
        .sort((a, b) => (a.codigo ?? a.enunciado).localeCompare(b.codigo ?? b.enunciado, "pt-BR", { numeric: true }))
        .map((q) => {
          const conta = (tipo: "DIAGNOSTICA" | "FINAL") => {
            const rs = linhas.flatMap((l) => l.m.tentativas.filter((t) => t.tipo === tipo && t.finalizadaEm).flatMap((t) => t.respostas ?? []))
              .filter((r) => r.questaoId === q.id);
            return rs.length ? { n: rs.length, p: Math.round((rs.filter((r) => r.correta).length / rs.length) * 100) } : null;
          };
          return { q, d: conta("DIAGNOSTICA"), fi: conta("FINAL") };
        })
    : [];

  return (
    <>
      <TituloPagina titulo="Resultados das avaliações" subtitulo="Avaliação diagnóstica (antes do vídeo) comparada com a avaliação final (depois do vídeo). A diagnóstica não conta para aprovação." />
      <Filtros valores={f} campos={["busca", "obra", "funcao", "curso"]} />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Indicador rotulo="Avaliações registradas" valor={linhas.length} />
        <Indicador rotulo="Média diagnóstica" valor={pct(media(diagNotas))} />
        <Indicador rotulo="Média final (melhor nota)" valor={pct(media(finalNotas))} />
        <Indicador rotulo="Evolução média" valor={comAmbas.length ? `${(media(comAmbas.map((l) => l.evolucao!)) ?? 0) >= 0 ? "+" : ""}${media(comAmbas.map((l) => l.evolucao!))} p.p.` : "—"} detalhe={`${comAmbas.length} com as duas avaliações`} tom={comAmbas.length && (media(comAmbas.map((l) => l.evolucao!)) ?? 0) > 0 ? "verde" : "neutro"} />
      </div>

      <Cartao titulo="Por colaborador e curso">
        {linhas.length === 0 ? <Vazio>Nenhuma avaliação enviada com esses filtros.</Vazio> : (
          <Tabela cabecalho={["Colaborador", "Curso", "Diagnóstica", "Final (tentativas)", "Evolução", "Situação"]}>
            {linhas.map(({ m, diag, finais, melhor, evolucao }) => (
              <tr key={m.id}>
                <td className="px-5 py-2.5">
                  <Link href={`/admin/colaboradores/${m.colaboradorId}`} className="font-medium hover:underline">{m.colaborador.nome}</Link>
                  <span className="block text-xs text-tinta-suave">{m.colaborador.funcao?.nome} · {m.colaborador.obra?.codigo}</span>
                </td>
                <td className="px-5 text-xs">{m.curso.codigo}<span className="block text-tinta-suave">{m.curso.titulo}</span></td>
                <td className="px-5 text-sm">{diag ? <>{diag.nota}%<span className="block text-xs text-tinta-suave">{fmtData(diag.finalizadaEm)}</span></> : m.curso.exigeDiagnostica ? <span className="text-xs text-tinta-suave">não feita</span> : "—"}</td>
                <td className="px-5 text-sm">
                  {finais.length ? <>{melhor}%<span className="block text-xs text-tinta-suave">{finais.map((t) => `${t.nota}%`).join(" → ")}</span></> : <span className="text-xs text-tinta-suave">pendente</span>}
                </td>
                <td className="px-5">{evolucao === null ? "—" : <Selo cor={evolucao > 0 ? "verde" : evolucao < 0 ? "vermelho" : "cinza"}>{evolucao > 0 ? "+" : ""}{evolucao} p.p.</Selo>}</td>
                <td className="px-5"><Selo cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo></td>
              </tr>
            ))}
          </Tabela>
        )}
      </Cartao>

      {curso && (
        <Cartao titulo={`Acerto por questão · ${curso.codigo}`} className="mt-5">
          <p className="mb-3 text-sm text-tinta-suave">Mostra onde a turma chega com dificuldade e o que o vídeo e a aula corrigiram. Questões com acerto baixo na final pedem reforço na parte presencial.</p>
          <Tabela cabecalho={["Questão", "Diagnóstica", "Final"]}>
            {porQuestao.map(({ q, d, fi }) => (
              <tr key={q.id}>
                <td className="px-5 py-2 text-xs">{q.codigo && <span className="font-mono font-semibold">{q.codigo} </span>}{q.enunciado}{q.diagnostica && <> <Selo cor="amarelo">diagnóstica</Selo></>}</td>
                <td className="px-5 text-sm">{d ? `${d.p}% (${d.n})` : "—"}</td>
                <td className={`px-5 text-sm ${fi && fi.p < 70 ? "font-semibold text-red-700" : ""}`}>{fi ? `${fi.p}% (${fi.n})` : "—"}</td>
              </tr>
            ))}
          </Tabela>
        </Cartao>
      )}

      <Cartao titulo="Provas para impressão" className="mt-5">
        <p className="mb-3 text-sm text-tinta-suave">Use para aplicar em papel quando não houver celular ou internet, ou para conferência do instrutor. A nota de prova aplicada em papel é lançada pelo instrutor em Atividades práticas.</p>
        <Tabela cabecalho={["Curso", "Diagnóstica (antes do vídeo)", "Banco completo"]}>
          {cursos.filter((c) => c.questoes.length > 0).map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-2.5 text-xs"><Link href={`/admin/cursos/${c.id}`} className="font-semibold text-palla-azul hover:underline">{c.codigo}</Link><span className="block text-tinta-suave">{c.titulo}</span></td>
              <td className="px-5 text-xs">
                {c.exigeDiagnostica ? (
                  <><a href={`/imprimir/prova/${c.id}?tipo=diagnostica`} target="_blank" className="font-semibold text-palla-azul underline">imprimir</a> · <a href={`/imprimir/prova/${c.id}?tipo=diagnostica&gabarito=1`} target="_blank" className="font-semibold text-palla-azul underline">gabarito</a> <span className="text-tinta-suave">({c.questoes.filter((q) => q.diagnostica).length} q.)</span></>
                ) : <span className="text-tinta-suave">—</span>}
              </td>
              <td className="px-5 text-xs">
                <a href={`/imprimir/prova/${c.id}`} target="_blank" className="font-semibold text-palla-azul underline">imprimir</a> · <a href={`/imprimir/prova/${c.id}?gabarito=1`} target="_blank" className="font-semibold text-palla-azul underline">gabarito</a> <span className="text-tinta-suave">({c.questoes.filter((q) => q.ativa).length} q.)</span>
              </td>
            </tr>
          ))}
        </Tabela>
      </Cartao>
    </>
  );
}
