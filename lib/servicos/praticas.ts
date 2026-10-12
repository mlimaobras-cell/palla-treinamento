import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { exigir, type Ator } from "@/lib/permissoes";

export const esquemaPratica = z.object({
  matriculaId: z.string().min(1),
  data: z.coerce.date(),
  local: z.string().trim().min(3, "Informe o local."),
  equipamento: z.string().trim().optional(),
  conteudo: z.string().trim().min(10, "Descreva o conteúdo prático executado."),
  duracaoMin: z.coerce.number().int().min(1, "Informe a duração."),
  notaAvaliacao: z.coerce.number().int().min(0).max(100).optional(),
  resultado: z.enum(["APTO", "NAO_APTO"]),
  observacoes: z.string().trim().optional(),
  evidencias: z.array(z.string()).default([]),
});

/**
 * Registro de atividade presencial pelo instrutor.
 * - Curso com teoria na plataforma: só aceita prática depois da teoria aprovada (PENDENTE_PRATICA).
 * - Curso integralmente presencial (ex.: NR-35): registra teoria e prática juntas.
 * O curso fica "Pendente de prática" até um registro APTO.
 */
export async function registrarPratica(ator: Ator, entrada: z.input<typeof esquemaPratica>) {
  exigir(ator, "pratica.registrar");
  const d = esquemaPratica.parse(entrada);
  const instrutor = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, ator.id) });
  if (!instrutor?.qualificacao) throw new Error("Cadastre a qualificação do instrutor antes de registrar práticas.");
  const m = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.id, d.matriculaId),
    with: { curso: true },
  });
  if (!m) throw new Error("Matrícula não encontrada.");
  if (d.data > new Date()) throw new Error("A data da prática não pode ser futura.");

  const presencial = m.curso.modalidade === "PRESENCIAL";
  if (!m.curso.exigePratica && !presencial) throw new Error("Este curso não tem etapa prática.");
  if (presencial) {
    if (!["MATRICULADO", "EM_ANDAMENTO"].includes(m.status)) throw new Error(`Situação atual não permite registro: ${m.status}.`);
    if (d.notaAvaliacao == null) throw new Error("Informe a nota da avaliação aplicada presencialmente.");
    if (m.curso.cargaHoraria && d.duracaoMin < m.curso.cargaHoraria * 60) {
      throw new Error(`Carga registrada (${d.duracaoMin} min) menor que a do curso (${m.curso.cargaHoraria} h).`);
    }
  } else if (m.status !== "PENDENTE_PRATICA") {
    throw new Error("A prática só pode ser registrada depois da teoria aprovada.");
  }

  const [r] = await db.insert(schema.registrosPraticos).values({
    matriculaId: m.id,
    instrutorId: ator.id,
    abrangencia: presencial ? "TEORIA_E_PRATICA" : "PRATICA",
    data: d.data,
    local: d.local,
    equipamento: d.equipamento || null,
    conteudo: d.conteudo,
    duracaoMin: d.duracaoMin,
    notaAvaliacao: d.notaAvaliacao ?? null,
    resultado: d.resultado,
    observacoes: d.observacoes || null,
    evidencias: d.evidencias,
  }).returning();

  const aprovadoNota = d.notaAvaliacao == null || d.notaAvaliacao >= m.curso.notaMinima;
  if (d.resultado === "APTO" && aprovadoNota) {
    await db.update(schema.matriculas).set({
      status: "AGUARDANDO_APROVACAO",
      iniciadoEm: m.iniciadoEm ?? d.data,
      teoriaConcluidaEm: m.teoriaConcluidaEm ?? d.data,
    }).where(eq(schema.matriculas.id, m.id));
  }
  await auditar(ator, "pratica.registrada", "registro_pratico", r.id, {
    matriculaId: m.id, resultado: d.resultado, nota: d.notaAvaliacao ?? null,
  });
  return r;
}
