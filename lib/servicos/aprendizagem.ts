import { and, asc, eq, gt } from "drizzle-orm";
import { randomInt } from "node:crypto";
import { db, schema } from "@/db";
import type { QuestaoSorteada, Resposta } from "@/db/schema";
import { auditar } from "@/lib/auditoria";
import type { Ator } from "@/lib/permissoes";

const QUESTOES_POR_AVALIACAO = 10;
const MAX_SEGUNDOS_POR_PULSO = 75; // o player envia pulsos a cada 30 s; limite evita fraude de tempo

export async function carregarMatriculaDoColaborador(ator: Ator, matriculaId: string) {
  const m = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.id, matriculaId),
    with: {
      curso: { with: { capitulos: { orderBy: asc(schema.capitulos.ordem), with: { aulas: { orderBy: asc(schema.aulas.ordem) } } } } },
      progresso: true,
      tentativas: { orderBy: asc(schema.tentativas.numero) },
      certificados: true,
      praticas: true,
    },
  });
  if (!m || m.colaboradorId !== ator.colaboradorId) throw new Error("Curso não encontrado.");
  return m;
}

export function aulasDoCurso(m: Awaited<ReturnType<typeof carregarMatriculaDoColaborador>>) {
  return m.curso.capitulos.flatMap((c) => c.aulas.map((a) => ({ ...a, capituloTitulo: c.titulo, capituloOrdem: c.ordem })));
}

export function segundosMinimos(duracaoMin: number, pct: number) {
  return Math.ceil((duracaoMin * 60 * pct) / 100);
}

/** Pulso do player: soma o tempo assistido (com teto por pulso) e marca início do curso. */
export async function registrarTempo(ator: Ator, matriculaId: string, aulaId: string, segundos: number) {
  const m = await carregarMatriculaDoColaborador(ator, matriculaId);
  if (m.curso.modalidade === "PRESENCIAL") throw new Error("Curso presencial: a carga horária não é cumprida na plataforma.");
  if (!aulasDoCurso(m).some((a) => a.id === aulaId)) throw new Error("Aula não pertence ao curso.");
  if (diagnosticaPendente(m)) throw new Error("Faça a avaliação diagnóstica antes de assistir às aulas.");
  const s = Math.max(0, Math.min(MAX_SEGUNDOS_POR_PULSO, Math.floor(segundos)));
  const atual = m.progresso.find((p) => p.aulaId === aulaId);
  if (atual) {
    await db.update(schema.progressoAulas)
      .set({ segundos: atual.segundos + s, ultimoAcessoEm: new Date() })
      .where(eq(schema.progressoAulas.id, atual.id));
  } else {
    await db.insert(schema.progressoAulas).values({ matriculaId, aulaId, segundos: s });
  }
  if (m.status === "MATRICULADO") {
    await db.update(schema.matriculas).set({ status: "EM_ANDAMENTO", iniciadoEm: new Date() })
      .where(eq(schema.matriculas.id, matriculaId));
  }
}

/** Conclusão da aula só com o tempo mínimo cumprido. */
export async function concluirAula(ator: Ator, matriculaId: string, aulaId: string) {
  const m = await carregarMatriculaDoColaborador(ator, matriculaId);
  const aula = aulasDoCurso(m).find((a) => a.id === aulaId);
  if (!aula) throw new Error("Aula não pertence ao curso.");
  if (diagnosticaPendente(m)) throw new Error("Faça a avaliação diagnóstica antes de assistir às aulas.");
  const p = m.progresso.find((x) => x.aulaId === aulaId);
  const minimo = segundosMinimos(aula.duracaoMin, m.curso.tempoMinimoAulaPct);
  if (!p || p.segundos < minimo) {
    const faltam = Math.ceil((minimo - (p?.segundos ?? 0)) / 60);
    throw new Error(`Assista à aula até o fim. Faltam cerca de ${faltam} min de participação.`);
  }
  if (!p.concluidaEm) {
    await db.update(schema.progressoAulas).set({ concluidaEm: new Date() }).where(eq(schema.progressoAulas.id, p.id));
    await auditar(ator, "aula.concluida", "matricula", matriculaId, { aulaId, segundos: p.segundos });
  }
}

function embaralhar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type TentativaResumo = { tipo: "DIAGNOSTICA" | "FINAL"; finalizadaEm: Date | null };

/** Tentativas da avaliação FINAL que contam para o limite (a diagnóstica nunca conta). */
export function tentativasValidas(m: { tentativas: TentativaResumo[]; reavaliacaoLiberadaEm: Date | null }) {
  return m.tentativas.filter(
    (t) => t.tipo === "FINAL" && t.finalizadaEm && (!m.reavaliacaoLiberadaEm || t.finalizadaEm > m.reavaliacaoLiberadaEm),
  ).length;
}

/** O curso exige diagnóstica e ela ainda não foi enviada: as aulas ficam bloqueadas. */
export function diagnosticaPendente(m: { curso: { exigeDiagnostica: boolean }; tentativas: TentativaResumo[] }) {
  return m.curso.exigeDiagnostica && !m.tentativas.some((t) => t.tipo === "DIAGNOSTICA" && t.finalizadaEm);
}

/** Avaliação diagnóstica: uma única tentativa, antes das aulas, com as questões marcadas no banco. Não aprova nem reprova. */
export async function iniciarDiagnostica(ator: Ator, matriculaId: string, userAgent?: string) {
  const m = await carregarMatriculaDoColaborador(ator, matriculaId);
  if (!m.curso.exigeDiagnostica) throw new Error("Este curso não tem avaliação diagnóstica.");
  const existente = m.tentativas.find((t) => t.tipo === "DIAGNOSTICA");
  if (existente?.finalizadaEm) throw new Error("A avaliação diagnóstica já foi feita.");
  if (existente) return existente;
  const banco = await db.query.questoes.findMany({
    where: and(eq(schema.questoes.cursoId, m.cursoId), eq(schema.questoes.ativa, true), eq(schema.questoes.diagnostica, true)),
  });
  if (banco.length < 3) throw new Error("Banco da avaliação diagnóstica insuficiente para este curso.");
  const sorteio: QuestaoSorteada[] = embaralhar(banco).map((q) => ({ questaoId: q.id, alternativas: embaralhar(q.alternativas.map((a) => a.id)) }));
  const [t] = await db.insert(schema.tentativas).values({
    matriculaId, tipo: "DIAGNOSTICA", numero: 0, questoes: sorteio, userAgent: userAgent?.slice(0, 250),
  }).returning();
  if (m.status === "MATRICULADO") {
    await db.update(schema.matriculas).set({ status: "EM_ANDAMENTO", iniciadoEm: new Date() }).where(eq(schema.matriculas.id, matriculaId));
  }
  await auditar(ator, "diagnostica.iniciada", "tentativa", t.id, { matriculaId });
  return t;
}

export async function iniciarAvaliacao(ator: Ator, matriculaId: string, userAgent?: string) {
  const m = await carregarMatriculaDoColaborador(ator, matriculaId);
  if (m.curso.modalidade === "PRESENCIAL") throw new Error("A avaliação deste curso é aplicada presencialmente pelo instrutor.");
  if (!["EM_ANDAMENTO", "MATRICULADO"].includes(m.status)) throw new Error("A avaliação não está disponível nesta etapa.");
  const aulas = aulasDoCurso(m);
  const pendentes = aulas.filter((a) => !m.progresso.find((p) => p.aulaId === a.id && p.concluidaEm));
  if (diagnosticaPendente(m)) throw new Error("Faça a avaliação diagnóstica antes.");
  if (aulas.length === 0 || pendentes.length) throw new Error("Conclua todas as aulas antes da avaliação.");
  if (tentativasValidas(m) >= m.curso.maxTentativas) throw new Error("Limite de tentativas atingido. A reavaliação depende de liberação da Segurança do Trabalho.");

  const aberta = m.tentativas.find((t) => t.tipo === "FINAL" && !t.finalizadaEm);
  if (aberta) return aberta;

  const banco = await db.query.questoes.findMany({
    where: and(eq(schema.questoes.cursoId, m.cursoId), eq(schema.questoes.ativa, true)),
  });
  if (banco.length < 3) throw new Error("Banco de questões insuficiente para este curso.");
  const sorteio: QuestaoSorteada[] = embaralhar(banco).slice(0, QUESTOES_POR_AVALIACAO).map((q) => ({
    questaoId: q.id,
    alternativas: embaralhar(q.alternativas.map((a) => a.id)),
  }));
  const [t] = await db.insert(schema.tentativas).values({
    matriculaId, tipo: "FINAL", numero: m.tentativas.filter((x) => x.tipo === "FINAL").length + 1, questoes: sorteio, userAgent: userAgent?.slice(0, 250),
  }).returning();
  await auditar(ator, "avaliacao.iniciada", "tentativa", t.id, { matriculaId, numero: t.numero });
  return t;
}

/** Questões da tentativa sem o gabarito, na ordem sorteada. */
export async function questoesDaTentativa(tentativaId: string) {
  const t = await db.query.tentativas.findFirst({ where: eq(schema.tentativas.id, tentativaId) });
  if (!t) throw new Error("Tentativa não encontrada.");
  const ids = t.questoes.map((q) => q.questaoId);
  const qs = await db.query.questoes.findMany({ where: (q, { inArray }) => inArray(q.id, ids) });
  return t.questoes.map((s) => {
    const q = qs.find((x) => x.id === s.questaoId)!;
    return {
      id: q.id,
      tipo: q.tipo,
      enunciado: q.enunciado,
      imagemUrl: q.imagemUrl,
      alternativas: s.alternativas.map((aid) => q.alternativas.find((a) => a.id === aid)!),
    };
  });
}

export async function enviarAvaliacao(ator: Ator, tentativaId: string, marcadas: Record<string, string | null>) {
  const t = await db.query.tentativas.findFirst({
    where: eq(schema.tentativas.id, tentativaId),
    with: { matricula: { with: { curso: true } } },
  });
  if (!t || t.matricula.colaboradorId !== ator.colaboradorId) throw new Error("Tentativa não encontrada.");
  if (t.finalizadaEm) throw new Error("Esta tentativa já foi enviada.");
  const ids = t.questoes.map((q) => q.questaoId);
  const qs = await db.query.questoes.findMany({ where: (q, { inArray }) => inArray(q.id, ids) });
  const respostas: Resposta[] = t.questoes.map((s) => {
    const q = qs.find((x) => x.id === s.questaoId)!;
    const marcada = marcadas[s.questaoId] ?? null;
    return { questaoId: s.questaoId, marcada, correta: marcada === q.correta };
  });
  const nota = Math.round((respostas.filter((r) => r.correta).length / respostas.length) * 100);
  const curso = t.matricula.curso;
  if (t.tipo === "DIAGNOSTICA") {
    // Diagnóstica: só registra a nota de entrada. Não aprova, não reprova e não mostra gabarito antes das aulas.
    await db.update(schema.tentativas).set({ finalizadaEm: new Date(), respostas, nota, aprovado: null })
      .where(eq(schema.tentativas.id, tentativaId));
    await auditar(ator, "diagnostica.enviada", "tentativa", tentativaId, { nota, matriculaId: t.matricula.id });
    return { nota, aprovado: null, notaMinima: curso.notaMinima, respostas, questoes: qs };
  }
  const aprovado = nota >= curso.notaMinima;
  const agora = new Date();
  await db.update(schema.tentativas).set({ finalizadaEm: agora, respostas, nota, aprovado })
    .where(eq(schema.tentativas.id, tentativaId));

  const m = t.matricula;
  if (aprovado) {
    await db.update(schema.matriculas).set({
      status: curso.exigePratica ? "PENDENTE_PRATICA" : "AGUARDANDO_APROVACAO",
      teoriaConcluidaEm: agora,
    }).where(eq(schema.matriculas.id, m.id));
  } else {
    const anteriores = await db.query.tentativas.findMany({
      where: and(
        eq(schema.tentativas.matriculaId, m.id),
        eq(schema.tentativas.tipo, "FINAL"),
        m.reavaliacaoLiberadaEm ? gt(schema.tentativas.finalizadaEm, m.reavaliacaoLiberadaEm) : undefined,
      ),
    });
    const feitas = anteriores.filter((x) => x.finalizadaEm).length;
    if (feitas >= curso.maxTentativas) {
      await db.update(schema.matriculas).set({ status: "REPROVADO" }).where(eq(schema.matriculas.id, m.id));
    }
  }
  await auditar(ator, "avaliacao.enviada", "tentativa", tentativaId, { nota, aprovado, matriculaId: m.id });
  return { nota, aprovado, notaMinima: curso.notaMinima, respostas, questoes: qs };
}

/** Reavaliação controlada: só SST ou responsável técnico liberam novas tentativas. */
export async function liberarReavaliacao(ator: Ator, matriculaId: string, motivo: string) {
  if (!["SST", "RESPONSAVEL_TECNICO", "ADMIN"].includes(ator.perfil)) throw new Error("Sem permissão para liberar reavaliação.");
  if (!motivo.trim()) throw new Error("Informe o motivo (ex.: reforço de conteúdo realizado).");
  const m = await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, matriculaId) });
  if (!m || m.status !== "REPROVADO") throw new Error("Só é possível liberar reavaliação de matrícula reprovada.");
  await db.update(schema.matriculas).set({ status: "EM_ANDAMENTO", reavaliacaoLiberadaEm: new Date() })
    .where(eq(schema.matriculas.id, matriculaId));
  await auditar(ator, "avaliacao.reavaliacao_liberada", "matricula", matriculaId, { motivo });
}
