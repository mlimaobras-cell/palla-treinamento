import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Cartao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtDataHora, STATUS_MATRICULA } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { segundosMinimos } from "@/lib/servicos/aprendizagem";
import { Imprimir } from "./imprimir";

export const metadata = { title: "Ficha do curso" };

const mmss = (s: number) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;

/**
 * Ficha de participação de um colaborador num curso: o que assistiu (tempo e ponto do vídeo),
 * e cada avaliação com as respostas marcadas. É o registro que a equipe usa para avaliar e auditar.
 */
export default async function FichaMatricula({ params }: { params: Promise<{ id: string; mid: string }> }) {
  const { id, mid } = await params;
  const a = await exigirEquipe("colaborador.ver");
  const m = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.id, mid),
    with: {
      colaborador: { with: { funcao: true, obra: true } },
      curso: { with: { capitulos: { orderBy: asc(schema.capitulos.ordem), with: { aulas: { orderBy: asc(schema.aulas.ordem) } } } } },
      progresso: true,
      tentativas: { orderBy: asc(schema.tentativas.iniciadaEm) },
    },
  });
  if (!m || m.colaboradorId !== id) notFound();
  if (a.perfil === "GESTOR_OBRA" && m.colaborador.obra?.gestorId !== a.id) notFound();

  const aulas = m.curso.capitulos.flatMap((c) => c.aulas);
  const concluidas = aulas.filter((x) => m.progresso.find((p) => p.aulaId === x.id)?.concluidaEm).length;
  const ids = m.tentativas.flatMap((t) => t.questoes.map((q) => q.questaoId));
  const questoes = ids.length ? await db.query.questoes.findMany({ where: (q, { inArray }) => inArray(q.id, ids) }) : [];
  const finais = m.tentativas.filter((t) => t.tipo === "FINAL" && t.finalizadaEm);

  return (
    <>
      <Link href={`/admin/colaboradores/${id}`} className="text-sm font-medium text-palla-azul print:hidden">← {m.colaborador.nome}</Link>
      <TituloPagina
        titulo={`${m.curso.codigo} · ${m.curso.titulo}`}
        subtitulo={`${m.colaborador.nome} · ${m.colaborador.funcao?.nome ?? ""}${m.colaborador.obra ? ` · ${m.colaborador.obra.codigo}` : ""}`}
        acao={<Imprimir />}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {[
          ["Situação", <Selo key="s" cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo>],
          ["Aulas concluídas", `${concluidas} de ${aulas.length}`],
          ["Avaliação final", finais.length ? `${Math.max(...finais.map((t) => t.nota ?? 0))}% (${finais.length} tentativa${finais.length > 1 ? "s" : ""})` : "não feita"],
          ["Início", m.iniciadoEm ? fmtDataHora(m.iniciadoEm) : "—"],
        ].map(([r, v]) => (
          <div key={String(r)} className="rounded-xl border border-linha bg-white px-4 py-3">
            <p className="text-xs text-tinta-suave">{r}</p>
            <div className="mt-1 text-sm font-semibold text-palla-azul-escuro">{v}</div>
          </div>
        ))}
      </div>

      <Cartao titulo="Videoaulas assistidas">
        {aulas.length === 0 ? <Vazio>Curso sem aulas na plataforma.</Vazio> : (
          <Tabela cabecalho={["Aula", "Duração", "Tempo assistido", "Ponto do vídeo", "Concluída em"]}>
            {aulas.map((x, i) => {
              const p = m.progresso.find((q) => q.aulaId === x.id);
              const dur = x.duracaoSeg ?? x.duracaoMin * 60;
              const pct = p && x.duracaoSeg ? Math.min(100, Math.round((p.posicaoMaxSeg / x.duracaoSeg) * 100)) : null;
              const minimo = segundosMinimos(x, m.curso.tempoMinimoAulaPct);
              return (
                <tr key={x.id}>
                  <td className="px-5 py-2.5"><span className="text-xs text-tinta-suave">{i + 1}.</span> <span className="font-medium">{x.titulo}</span></td>
                  <td className="px-5 text-xs">{mmss(dur)}</td>
                  <td className="px-5 text-xs">{p ? mmss(p.segundos) : "—"}{p && p.segundos < minimo && <span className="block text-tinta-suave">mínimo {mmss(minimo)}</span>}</td>
                  <td className="px-5 text-xs">{pct === null ? "—" : `${pct}%`}</td>
                  <td className="px-5 text-xs">{p?.concluidaEm ? fmtDataHora(p.concluidaEm) : <Selo cor="amarelo">pendente</Selo>}</td>
                </tr>
              );
            })}
          </Tabela>
        )}
      </Cartao>

      <Cartao titulo="Avaliações e respostas" className="mt-5">
        {m.tentativas.filter((t) => t.finalizadaEm).length === 0 ? <Vazio>Nenhuma avaliação enviada.</Vazio> : (
          <div className="space-y-3">
            {m.tentativas.filter((t) => t.finalizadaEm).map((t) => (
              <details key={t.id} className="rounded-lg border border-linha" open={t === finais[finais.length - 1]}>
                <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3 text-sm">
                  <span className="font-semibold">{t.tipo === "DIAGNOSTICA" ? "Diagnóstica (antes das aulas)" : `Final · tentativa ${t.numero}`}</span>
                  <span className="text-tinta-suave">{fmtDataHora(t.finalizadaEm!)}</span>
                  <Selo cor={t.tipo === "DIAGNOSTICA" ? "cinza" : t.aprovado ? "verde" : "vermelho"}>{t.nota}%{t.tipo === "FINAL" ? (t.aprovado ? " · aprovado" : " · reprovado") : ""}</Selo>
                </summary>
                <ol className="space-y-2 border-t border-linha px-4 py-3 text-sm">
                  {(t.respostas ?? []).map((r, k) => {
                    const q = questoes.find((x) => x.id === r.questaoId);
                    if (!q) return null;
                    const txt = (aid: string | null) => (aid ? q.alternativas.find((x) => x.id === aid)?.texto ?? aid : "sem resposta");
                    return (
                      <li key={r.questaoId} className="rounded-md bg-slate-50 px-3 py-2">
                        <p className="font-medium">{k + 1}. {q.codigo && <span className="font-mono text-xs text-tinta-suave">{q.codigo} </span>}{q.enunciado}</p>
                        <p className={`mt-1 text-xs ${r.correta ? "text-emerald-700" : "text-red-700"}`}>{r.correta ? "✓" : "✗"} Marcou: {txt(r.marcada)}</p>
                        {!r.correta && <p className="text-xs text-tinta-suave">Correta: {txt(q.correta)}</p>}
                      </li>
                    );
                  })}
                </ol>
              </details>
            ))}
          </div>
        )}
      </Cartao>
      <p className="mt-4 text-xs text-tinta-suave">Registro gerado pela plataforma a partir do tempo de reprodução do vídeo, do ponto mais avançado assistido e das respostas enviadas. Atividades práticas e aprovações ficam na página do colaborador.</p>
    </>
  );
}
