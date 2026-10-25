// Fatores de risco psicossociais (NR-1, 1.5.3.1.4): canal de relato, escutas por equipe, DDS com presença e indicadores mensais.
// Princípio: a empresa gere fatores do TRABALHO; não diagnostica ninguém e não guarda dado de saúde mental individual.
import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { codigoAleatorio } from "@/lib/cripto";
import { exigir, type Ator } from "@/lib/permissoes";

export const CATEGORIA_RELATO: Record<string, string> = {
  ASSEDIO_MORAL: "Assédio moral (humilhação, ameaça, perseguição)",
  ASSEDIO_SEXUAL: "Assédio sexual",
  VIOLENCIA: "Violência ou agressão",
  DISCRIMINACAO: "Discriminação",
  SOBRECARGA: "Sobrecarga, jornada ou pressão excessiva",
  ALOJAMENTO: "Alojamento, alimentação ou condições de vivência",
  CONFLITO: "Conflito entre pessoas ou equipes",
  OUTRO: "Outro",
};
export const STATUS_RELATO: Record<string, { rotulo: string; cor: string }> = {
  RECEBIDO: { rotulo: "Recebido", cor: "amarelo" }, EM_APURACAO: { rotulo: "Em apuração", cor: "azul" },
  CONCLUIDO: { rotulo: "Concluído", cor: "verde" }, ARQUIVADO: { rotulo: "Arquivado", cor: "cinza" },
};
/** Prazo interno de apuração (critério Palla, configurável aqui). */
export const DIAS_APURACAO = 30;
/** Mínimo de participantes para registrar resultado de pesquisa (evita identificar pessoas). */
export const MIN_PESQUISA = 5;

// ---------------------------------------------------------------- canal de relato

export async function enviarRelato(ator: Ator, d: { categoria: string; descricao: string; identificar: boolean }) {
  if (ator.perfil !== "COLABORADOR" || !ator.colaboradorId) throw new Error("O canal é para colaboradores.");
  if (!CATEGORIA_RELATO[d.categoria]) throw new Error("Escolha o assunto.");
  if (d.descricao.trim().length < 20) throw new Error("Conte com um pouco mais de detalhe (o que, onde, quando).");
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, ator.colaboradorId) });
  const protocolo = `REL-${codigoAleatorio(8)}`;
  const [r] = await db.insert(schema.relatos).values({
    protocolo, obraId: c?.obraId ?? null, categoria: d.categoria, descricao: d.descricao.trim(), anonimo: !d.identificar,
    colaboradorId: d.identificar ? ator.colaboradorId : null, prazoApuracao: new Date(Date.now() + DIAS_APURACAO * 86400_000),
    // anônimo: guarda só o dia (sem hora), para não cruzar com o registro de entradas na plataforma
    ...(d.identificar ? {} : { criadoEm: new Date(new Date().toISOString().slice(0, 10) + "T12:00:00Z") }),
  }).returning();
  // relato anônimo: a auditoria não registra quem enviou
  await auditar(d.identificar ? ator : null, "relato.recebido", "relato", r.id, { categoria: d.categoria, anonimo: !d.identificar });
  return protocolo;
}

/** Consulta pelo protocolo: só status, prazo e devolutiva (nunca as medidas internas). */
export async function consultarRelato(protocolo: string) {
  const r = await db.query.relatos.findFirst({ where: eq(schema.relatos.protocolo, protocolo.trim().toUpperCase()) });
  if (!r) return null;
  return { protocolo: r.protocolo, status: r.status, criadoEm: r.criadoEm, prazoApuracao: r.prazoApuracao, resposta: r.resposta, categoria: r.categoria };
}

export async function tratarRelato(ator: Ator, id: string, d: { status: string; resposta?: string | null; medidas?: string | null }) {
  exigir(ator, "relato.tratar");
  if (!STATUS_RELATO[d.status]) throw new Error("Situação inválida.");
  if ((d.status === "CONCLUIDO" || d.status === "ARQUIVADO") && !d.resposta?.trim()) throw new Error("Escreva a devolutiva para quem relatou antes de concluir ou arquivar.");
  await db.update(schema.relatos).set({
    status: d.status, resposta: d.resposta || null, medidas: d.medidas || null, tratadoPorId: ator.id,
    concluidoEm: d.status === "CONCLUIDO" || d.status === "ARQUIVADO" ? new Date() : null,
  }).where(eq(schema.relatos.id, id));
  await auditar(ator, "relato.tratado", "relato", id, { status: d.status });
}

// ---------------------------------------------------------------- escutas

export async function registrarEscuta(ator: Ator, d: { obraId?: string | null; tipo: "RODA" | "PESQUISA"; data: Date; participantes: number; conduzidoPor: string; temas: string; encaminhamentos?: string | null }) {
  exigir(ator, "sst.ver");
  if (!["SST", "RH", "ADMIN"].includes(ator.perfil)) throw new Error("Escutas são registradas pela Segurança do Trabalho ou pelo RH.");
  if (!d.participantes || d.participantes < 1) throw new Error("Informe o número de participantes.");
  if (d.tipo === "PESQUISA" && d.participantes < MIN_PESQUISA) throw new Error(`Resultado de pesquisa só com ${MIN_PESQUISA} ou mais respostas, para ninguém ser identificado.`);
  if (!d.temas.trim() || !d.conduzidoPor.trim()) throw new Error("Informe quem conduziu e os temas levantados (sem nomes).");
  const [e] = await db.insert(schema.escutas).values({ ...d, obraId: d.obraId || null, encaminhamentos: d.encaminhamentos || null, criadoPorId: ator.id }).returning();
  await auditar(ator, "escuta.registrada", "escuta", e.id, { tipo: d.tipo, participantes: d.participantes });
  return e.id;
}

// ---------------------------------------------------------------- DDS

export async function registrarDds(ator: Ator, d: { obraId: string; data: Date; tema: string; psicossocial: boolean; conteudo?: string | null; conduzidoPor: string; presentesIds?: string[] }) {
  exigir(ator, "colaborador.ver");
  if (!["SST", "ADMIN", "GESTOR_OBRA", "INSTRUTOR"].includes(ator.perfil)) throw new Error("DDS é registrado pela Segurança do Trabalho, gestor ou instrutor.");
  if (!d.obraId || !d.tema.trim() || !d.conduzidoPor.trim()) throw new Error("Informe obra, tema e quem conduziu.");
  const [x] = await db.insert(schema.dds).values({ obraId: d.obraId, data: d.data, tema: d.tema.trim(), psicossocial: d.psicossocial, conteudo: d.conteudo || null, conduzidoPor: d.conduzidoPor.trim(), criadoPorId: ator.id }).returning();
  if (d.presentesIds?.length) {
    await db.insert(schema.presencasDds).values(d.presentesIds.map((colaboradorId) => ({ ddsId: x.id, colaboradorId, metodo: "EQUIPE", registradoPorId: ator.id }))).onConflictDoNothing();
  }
  await auditar(ator, "dds.registrado", "dds", x.id, { obraId: d.obraId, psicossocial: d.psicossocial });
  return x.id;
}

/** DDS dos últimos 3 dias da obra do colaborador que ele ainda não confirmou. */
export async function ddsParaConfirmar(colaboradorId: string) {
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId) });
  if (!c?.obraId) return [];
  const lista = await db.query.dds.findMany({
    where: and(eq(schema.dds.obraId, c.obraId), gte(schema.dds.data, new Date(Date.now() - 3 * 86400_000))),
    with: { presencas: true }, orderBy: desc(schema.dds.data),
  });
  return lista.filter((d) => !d.presencas.some((p) => p.colaboradorId === colaboradorId));
}

export async function confirmarPresenca(ator: Ator, ddsId: string) {
  if (ator.perfil !== "COLABORADOR" || !ator.colaboradorId) throw new Error("Só o próprio colaborador confirma.");
  const pend = await ddsParaConfirmar(ator.colaboradorId);
  if (!pend.some((d) => d.id === ddsId)) throw new Error("Este DDS não está disponível para confirmação.");
  await db.insert(schema.presencasDds).values({ ddsId, colaboradorId: ator.colaboradorId, metodo: "CELULAR" }).onConflictDoNothing();
  await auditar(ator, "dds.presenca_confirmada", "dds", ddsId, {});
}

// ---------------------------------------------------------------- indicadores

export async function salvarIndicador(ator: Ator, d: { obraId: string; mes: string; efetivo?: number | null; horasExtrasMedia?: number | null; faltas?: number | null; afastamentos?: number | null; desligamentos?: number | null; quaseAcidentes?: number | null; observacao?: string | null }) {
  exigir(ator, "sst.ver");
  if (!["SST", "RH", "ADMIN"].includes(ator.perfil)) throw new Error("Indicadores são lançados pela Segurança do Trabalho ou pelo RH.");
  if (!/^\d{4}-\d{2}$/.test(d.mes)) throw new Error("Mês inválido.");
  const v = { ...d, registradoPorId: ator.id, atualizadoEm: new Date() };
  await db.insert(schema.indicadoresMensais).values(v).onConflictDoUpdate({ target: [schema.indicadoresMensais.obraId, schema.indicadoresMensais.mes], set: v });
  await auditar(ator, "indicador.salvo", "indicador", `${d.obraId}:${d.mes}`, {});
}

/** Painel do mês por obra: relatos (só contagem por assunto), escutas, DDS e presença, indicadores lançados, ações psicossociais do PGR. */
export async function painelMensal(mes: string, obraId?: string | null) {
  const ini = new Date(`${mes}-01T00:00:00-03:00`);
  const fim = new Date(ini); fim.setMonth(fim.getMonth() + 1);
  const noMes = <T extends { obraId: string | null }>(xs: T[]) => (obraId ? xs.filter((x) => x.obraId === obraId) : xs);
  const [rel, esc, ddsMes, ind, obras] = await Promise.all([
    db.query.relatos.findMany({ where: and(gte(schema.relatos.criadoEm, ini), lt(schema.relatos.criadoEm, fim)) }),
    db.query.escutas.findMany({ where: and(gte(schema.escutas.data, ini), lt(schema.escutas.data, fim)) }),
    db.query.dds.findMany({ where: and(gte(schema.dds.data, ini), lt(schema.dds.data, fim)), with: { presencas: true } }),
    db.query.indicadoresMensais.findMany({ where: eq(schema.indicadoresMensais.mes, mes) }),
    db.query.obras.findMany({ where: eq(schema.obras.ativa, true) }),
  ]);
  const abertos = await db.query.relatos.findMany({ where: inArray(schema.relatos.status, ["RECEBIDO", "EM_APURACAO"]) });
  const r = noMes(rel), d = noMes(ddsMes);
  const porCategoria = Object.keys(CATEGORIA_RELATO).map((k) => ({ categoria: k, total: r.filter((x) => x.categoria === k).length })).filter((x) => x.total);
  return {
    relatosNoMes: r.length, porCategoria,
    relatosAbertos: noMes(abertos).length, relatosVencidos: noMes(abertos).filter((x) => x.prazoApuracao < new Date()).length,
    escutas: noMes(esc), dds: d, ddsPsicossocial: d.filter((x) => x.psicossocial).length,
    presencas: d.reduce((s, x) => s + x.presencas.length, 0),
    indicadores: obraId ? ind.filter((i) => i.obraId === obraId) : ind, obras,
  };
}
