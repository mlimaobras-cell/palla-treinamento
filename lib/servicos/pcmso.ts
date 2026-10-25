// PCMSO (NR-7): elaborado pelo médico do trabalho. A plataforma registra o documento assinado recebido e transcreve
// a matriz de exames por GHE/função para calcular os próximos exames. Não guarda prontuário nem resultado de exame.
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { sha256 } from "@/lib/cripto";
import { somarMeses } from "@/lib/formato";
import { exigir, type Ator } from "@/lib/permissoes";

export const TIPO_EXAME: Record<string, string> = {
  ADMISSIONAL: "Admissional", PERIODICO: "Periódico", RETORNO_TRABALHO: "Retorno ao trabalho", MUDANCA_RISCO: "Mudança de riscos", DEMISSIONAL: "Demissional",
};

export async function registrarPcmso(
  ator: Ator,
  dados: { titulo: string; obraId?: string | null; pgrId?: string | null; medicoNome: string; medicoCrm: string; clinica?: string | null; vigenciaInicio: Date; observacao?: string | null; arquivo: { nome: string; tipo: string; bytes: Buffer } },
) {
  exigir(ator, "sst.editar");
  if (!dados.medicoNome.trim() || !dados.medicoCrm.trim()) throw new Error("Informe o médico do trabalho responsável e o CRM (NR-7).");
  if (dados.arquivo.tipo !== "application/pdf") throw new Error("Anexe o PDF do PCMSO assinado pelo médico.");
  const { salvarArquivo } = await import("./documentos");
  const anterior = await db.query.pcmsos.findFirst({
    where: and(eq(schema.pcmsos.status, "APROVADO"), dados.obraId ? eq(schema.pcmsos.obraId, dados.obraId) : isNull(schema.pcmsos.obraId)),
    orderBy: desc(schema.pcmsos.versao),
  });
  const caminho = await salvarArquivo("pcmso", dados.arquivo);
  const id = await db.transaction(async (tx) => {
    if (anterior) await tx.update(schema.pcmsos).set({ status: "SUBSTITUIDO" }).where(eq(schema.pcmsos.id, anterior.id));
    const [p] = await tx.insert(schema.pcmsos).values({
      titulo: dados.titulo.trim() || "PCMSO", obraId: dados.obraId || null, pgrId: dados.pgrId || null, versao: (anterior?.versao ?? 0) + 1,
      status: "APROVADO", medicoNome: dados.medicoNome.trim(), medicoCrm: dados.medicoCrm.trim(), clinica: dados.clinica ?? null,
      vigenciaInicio: dados.vigenciaInicio, proximoRelatorioAnual: somarMeses(dados.vigenciaInicio, 12),
      arquivoPath: caminho, arquivoHash: sha256(dados.arquivo.bytes), observacao: dados.observacao ?? null, criadoPorId: ator.id,
    }).returning();
    // a matriz de exames da versão anterior é copiada para conferência; o médico/SST ajusta conforme o novo documento
    if (anterior) {
      const ex = await tx.query.examesPcmso.findMany({ where: eq(schema.examesPcmso.pcmsoId, anterior.id) });
      if (ex.length) await tx.insert(schema.examesPcmso).values(ex.map((e) => ({ ...e, id: undefined, pcmsoId: p.id })));
    }
    return p.id;
  });
  await auditar(ator, "pcmso.registrado", "pcmso", id, { versao: (anterior?.versao ?? 0) + 1, medicoCrm: dados.medicoCrm });
  return id;
}

export async function salvarExame(ator: Ator, pcmsoId: string, dados: { id?: string; gheId?: string | null; funcaoId?: string | null; exame: string; momentos: string[]; periodicidadeMeses?: number | null; observacao?: string | null }) {
  exigir(ator, "sst.editar");
  if (!dados.exame.trim()) throw new Error("Informe o exame.");
  if (!dados.gheId && !dados.funcaoId) throw new Error("Vincule o exame a um GHE ou a uma função.");
  if (!dados.momentos.length) throw new Error("Marque em quais exames ocupacionais ele é feito.");
  if (dados.momentos.includes("PERIODICO") && !dados.periodicidadeMeses) throw new Error("Informe a periodicidade definida no PCMSO.");
  const v = { gheId: dados.gheId || null, funcaoId: dados.funcaoId || null, exame: dados.exame.trim(), momentos: dados.momentos, periodicidadeMeses: dados.periodicidadeMeses ?? null, observacao: dados.observacao ?? null };
  if (dados.id) await db.update(schema.examesPcmso).set(v).where(and(eq(schema.examesPcmso.id, dados.id), eq(schema.examesPcmso.pcmsoId, pcmsoId)));
  else await db.insert(schema.examesPcmso).values({ ...v, pcmsoId });
  await auditar(ator, dados.id ? "pcmso.exame_atualizado" : "pcmso.exame_criado", "pcmso", pcmsoId, { exame: v.exame });
}

export async function excluirExame(ator: Ator, pcmsoId: string, exameId: string) {
  exigir(ator, "sst.editar");
  await db.delete(schema.examesPcmso).where(and(eq(schema.examesPcmso.id, exameId), eq(schema.examesPcmso.pcmsoId, pcmsoId)));
  await auditar(ator, "pcmso.exame_excluido", "pcmso", pcmsoId, { exameId });
}

/** PCMSO vigente para a obra (ou o da empresa) e os exames que valem para a função. */
export async function examesDaFuncao(funcaoId: string, obraId: string | null) {
  const vigentes = await db.query.pcmsos.findMany({
    where: and(eq(schema.pcmsos.status, "APROVADO"), obraId ? or(eq(schema.pcmsos.obraId, obraId), isNull(schema.pcmsos.obraId)) : isNull(schema.pcmsos.obraId)),
    orderBy: desc(schema.pcmsos.versao),
    with: { exames: { with: { ghe: true } } },
  });
  const pcmso = vigentes.find((p) => obraId && p.obraId === obraId) ?? vigentes.find((p) => !p.obraId) ?? null;
  if (!pcmso) return null;
  const exames = pcmso.exames.filter((e) => e.funcaoId === funcaoId || (e.ghe && e.ghe.funcoesIds.includes(funcaoId)));
  const periodicos = exames.filter((e) => e.momentos.includes("PERIODICO") && e.periodicidadeMeses);
  const menorPeriodicidade = periodicos.length ? Math.min(...periodicos.map((e) => e.periodicidadeMeses!)) : null;
  return { pcmso, exames, menorPeriodicidade };
}

/** Sugestão de data do próximo exame periódico a partir do ASO e da periodicidade do PCMSO (a equipe confere). */
export async function sugerirProximoExame(colaboradorId: string, emitidoEm: Date | null) {
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId) });
  if (!c || !emitidoEm) return null;
  const r = await examesDaFuncao(c.funcaoId, c.obraId);
  if (!r?.menorPeriodicidade) return null;
  return { data: somarMeses(emitidoEm, r.menorPeriodicidade), meses: r.menorPeriodicidade, pcmsoId: r.pcmso.id };
}
