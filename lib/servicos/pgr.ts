// PGR — inventário de riscos e plano de ação (NR-1, 1.5.7; NR-18, 18.4).
// A plataforma organiza os dados e gera o documento; quem elabora e assina é o profissional legalmente habilitado
// em segurança do trabalho (NR-18, 18.4.2). O status APROVADO exige o PDF assinado anexado.
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import type { CriterioRisco } from "@/db/schema";
import { criterioPadrao, nivelDoRisco } from "@/db/conteudo/sst-admissao";
import { auditar } from "@/lib/auditoria";
import { sha256 } from "@/lib/cripto";
import { somarMeses } from "@/lib/formato";
import { exigir, type Ator } from "@/lib/permissoes";

export const CATEGORIA_RISCO: Record<string, string> = {
  FISICO: "Físico", QUIMICO: "Químico", BIOLOGICO: "Biológico", ERGONOMICO: "Ergonômico", PSICOSSOCIAL: "Psicossocial", ACIDENTE: "Acidente",
};
export const TIPO_MEDIDA: Record<string, string> = {
  ELIMINACAO: "Eliminação", SUBSTITUICAO: "Substituição", ENGENHARIA: "Proteção coletiva / engenharia", ADMINISTRATIVA: "Administrativa / organização", EPI: "EPI",
};
export const STATUS_PROGRAMA: Record<string, { rotulo: string; cor: string }> = {
  RASCUNHO: { rotulo: "Rascunho", cor: "cinza" }, EM_REVISAO: { rotulo: "Em revisão", cor: "amarelo" },
  APROVADO: { rotulo: "Aprovado e assinado", cor: "verde" }, SUBSTITUIDO: { rotulo: "Substituído (histórico)", cor: "cinza" },
};
export { nivelDoRisco };

/** Revisão a cada 2 anos (NR-1, 1.5.4.4.6); prazo menor pode ser definido. */
export const MESES_REVISAO_PGR = 24;

async function editavel(pgrId: string) {
  const p = await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgrId) });
  if (!p) throw new Error("PGR não encontrado.");
  if (p.status === "APROVADO" || p.status === "SUBSTITUIDO") throw new Error("Versão aprovada não pode ser alterada: crie uma revisão.");
  return p;
}

export async function criarPgr(ator: Ator, dados: { obraId?: string | null; titulo: string; estabelecimento: string; descricaoProcessos?: string | null }) {
  exigir(ator, "sst.editar");
  if (!dados.titulo.trim() || !dados.estabelecimento.trim()) throw new Error("Informe título e estabelecimento.");
  const [p] = await db.insert(schema.pgrs).values({
    obraId: dados.obraId || null, titulo: dados.titulo.trim(), estabelecimento: dados.estabelecimento.trim(),
    descricaoProcessos: dados.descricaoProcessos ?? null, criterio: criterioPadrao, criadoPorId: ator.id,
  }).returning();
  await auditar(ator, "pgr.criado", "pgr", p.id, { titulo: p.titulo });
  return p;
}

export async function atualizarPgr(ator: Ator, pgrId: string, dados: Partial<typeof schema.pgrs.$inferInsert>) {
  exigir(ator, "sst.editar");
  await editavel(pgrId);
  const permitidos = ["titulo", "estabelecimento", "descricaoProcessos", "elaboradorNome", "elaboradorQualificacao", "elaboradorRegistro", "responsavelOrganizacao", "motivoRevisao", "criterio"] as const;
  const set: Record<string, unknown> = {};
  for (const k of permitidos) if (k in dados) set[k] = dados[k];
  await db.update(schema.pgrs).set(set).where(eq(schema.pgrs.id, pgrId));
  await auditar(ator, "pgr.atualizado", "pgr", pgrId, { campos: Object.keys(set) });
}

export async function salvarGhe(ator: Ator, pgrId: string, dados: { id?: string; codigo: string; nome: string; descricaoAtividades: string; ambientes?: string | null; funcoesIds: string[]; epis?: string | null; trabalhadores?: number | null }) {
  exigir(ator, "sst.editar");
  await editavel(pgrId);
  if (!dados.codigo.trim() || !dados.nome.trim()) throw new Error("Informe código e nome do GHE.");
  const valores = { codigo: dados.codigo.trim().toUpperCase(), nome: dados.nome.trim(), descricaoAtividades: dados.descricaoAtividades.trim(), ambientes: dados.ambientes ?? null, funcoesIds: dados.funcoesIds, epis: dados.epis ?? null, trabalhadores: dados.trabalhadores ?? null };
  if (dados.id) {
    await db.update(schema.ghes).set(valores).where(and(eq(schema.ghes.id, dados.id), eq(schema.ghes.pgrId, pgrId)));
    await auditar(ator, "pgr.ghe_atualizado", "ghe", dados.id, { pgrId });
    return dados.id;
  }
  const n = (await db.query.ghes.findMany({ where: eq(schema.ghes.pgrId, pgrId) })).length;
  const [g] = await db.insert(schema.ghes).values({ ...valores, pgrId, ordem: n + 1 }).returning();
  await auditar(ator, "pgr.ghe_criado", "ghe", g.id, { pgrId, codigo: g.codigo });
  return g.id;
}

/** Copia os perigos típicos dos ambientes da biblioteca para o GHE (ponto de partida; o profissional revisa cada linha). */
export async function importarDaBiblioteca(ator: Ator, pgrId: string, gheId: string, ambienteIds: string[]) {
  exigir(ator, "sst.editar");
  await editavel(pgrId);
  if (!ambienteIds.length) throw new Error("Escolha ao menos um ambiente ou atividade.");
  const perigos = await db.query.perigosBiblioteca.findMany({ where: inArray(schema.perigosBiblioteca.ambienteId, ambienteIds), orderBy: asc(schema.perigosBiblioteca.ordem) });
  const existentes = await db.query.riscosInventario.findMany({ where: eq(schema.riscosInventario.gheId, gheId) });
  const ja = new Set(existentes.map((r) => r.origemPerigoId).filter(Boolean));
  const novos = perigos.filter((p) => !ja.has(p.id));
  if (novos.length) {
    await db.insert(schema.riscosInventario).values(novos.map((p, i) => ({
      pgrId, gheId, categoria: p.categoria, perigo: p.perigo, fonte: p.fonte, lesoes: p.lesoes, medidasExistentes: p.medidas,
      severidade: p.severidade, probabilidade: p.probabilidade, examesSugeridos: p.examesSugeridos, origemPerigoId: p.id, ordem: existentes.length + i + 1,
    })));
  }
  await db.update(schema.ghes).set({ ambientes: (await db.query.ambientesBiblioteca.findMany({ where: inArray(schema.ambientesBiblioteca.id, ambienteIds) })).map((a) => a.nome).join("; ") })
    .where(and(eq(schema.ghes.id, gheId), isNull(schema.ghes.ambientes)));
  await auditar(ator, "pgr.biblioteca_importada", "ghe", gheId, { pgrId, ambienteIds, novos: novos.length });
  return novos.length;
}

export async function salvarRisco(ator: Ator, pgrId: string, dados: Partial<typeof schema.riscosInventario.$inferInsert> & { id?: string; gheId: string }) {
  exigir(ator, "sst.editar");
  const p = await editavel(pgrId);
  const sev = Number(dados.severidade), prob = Number(dados.probabilidade);
  const max = p.criterio.severidade.length, maxP = p.criterio.probabilidade.length;
  if (!(sev >= 1 && sev <= max && prob >= 1 && prob <= maxP)) throw new Error("Severidade e probabilidade fora da escala do critério.");
  for (const k of ["perigo", "fonte", "lesoes", "medidasExistentes"] as const) if (!String(dados[k] ?? "").trim()) throw new Error("Preencha perigo, fonte, possíveis lesões e medidas existentes.");
  const valores = {
    gheId: dados.gheId, categoria: dados.categoria!, perigo: dados.perigo!, fonte: dados.fonte!, lesoes: dados.lesoes!, medidasExistentes: dados.medidasExistentes!,
    exposicao: dados.exposicao ?? null, monitoramento: dados.monitoramento ?? null, severidade: sev, probabilidade: prob, examesSugeridos: dados.examesSugeridos ?? null,
  };
  if (dados.id) {
    await db.update(schema.riscosInventario).set(valores).where(and(eq(schema.riscosInventario.id, dados.id), eq(schema.riscosInventario.pgrId, pgrId)));
    await auditar(ator, "pgr.risco_atualizado", "risco", dados.id, { pgrId });
    return dados.id;
  }
  const [r] = await db.insert(schema.riscosInventario).values({ ...valores, pgrId }).returning();
  await auditar(ator, "pgr.risco_criado", "risco", r.id, { pgrId });
  return r.id;
}

export async function excluirRisco(ator: Ator, pgrId: string, riscoId: string) {
  exigir(ator, "sst.editar");
  await editavel(pgrId);
  await db.delete(schema.riscosInventario).where(and(eq(schema.riscosInventario.id, riscoId), eq(schema.riscosInventario.pgrId, pgrId)));
  await auditar(ator, "pgr.risco_excluido", "risco", riscoId, { pgrId });
}

export async function salvarAcao(ator: Ator, pgrId: string, dados: { id?: string; riscoId?: string | null; medida: string; tipo: typeof schema.tipoMedidaEnum.enumValues[number]; responsavel: string; prazo?: Date | null; acompanhamento?: string | null; status?: typeof schema.statusAcaoEnum.enumValues[number]; evidencia?: string | null }) {
  exigir(ator, "sst.editar");
  const p = await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgrId) });
  if (!p) throw new Error("PGR não encontrado.");
  // o acompanhamento do plano de ação continua na versão aprovada (status, evidência); criar ação nova exige versão editável
  if (!dados.id && p.status !== "RASCUNHO" && p.status !== "EM_REVISAO") throw new Error("Nova ação só em versão editável: crie uma revisão.");
  if (!dados.medida.trim() || !dados.responsavel.trim()) throw new Error("Informe a medida e o responsável.");
  const valores = {
    riscoId: dados.riscoId || null, medida: dados.medida.trim(), tipo: dados.tipo, responsavel: dados.responsavel.trim(), prazo: dados.prazo ?? null,
    acompanhamento: dados.acompanhamento ?? null, status: dados.status ?? "PLANEJADA", evidencia: dados.evidencia ?? null,
    concluidaEm: dados.status === "CONCLUIDA" ? new Date() : null,
  };
  if (dados.id) {
    const atual = await db.query.acoesPlano.findFirst({ where: eq(schema.acoesPlano.id, dados.id) });
    if (!atual) throw new Error("Ação não encontrada.");
    const set = p.status === "APROVADO"
      ? { status: valores.status, evidencia: valores.evidencia, concluidaEm: valores.status === "CONCLUIDA" ? (atual.concluidaEm ?? new Date()) : null }
      : valores;
    await db.update(schema.acoesPlano).set(set).where(and(eq(schema.acoesPlano.id, dados.id), eq(schema.acoesPlano.pgrId, pgrId)));
    await auditar(ator, "pgr.acao_atualizada", "acao_plano", dados.id, { pgrId, status: valores.status });
    return dados.id;
  }
  const [a] = await db.insert(schema.acoesPlano).values({ ...valores, pgrId }).returning();
  await auditar(ator, "pgr.acao_criada", "acao_plano", a.id, { pgrId });
  return a.id;
}

export async function enviarParaRevisao(ator: Ator, pgrId: string) {
  exigir(ator, "sst.editar");
  const p = await editavel(pgrId);
  const ghes = await db.query.ghes.findMany({ where: eq(schema.ghes.pgrId, pgrId) });
  if (!ghes.length) throw new Error("Cadastre ao menos um GHE.");
  const riscos = await db.query.riscosInventario.findMany({ where: eq(schema.riscosInventario.pgrId, pgrId) });
  const semRisco = ghes.filter((g) => !riscos.some((r) => r.gheId === g.id));
  if (semRisco.length) throw new Error(`GHE sem riscos no inventário: ${semRisco.map((g) => g.codigo).join(", ")}.`);
  const semFuncao = ghes.filter((g) => !g.funcoesIds.length);
  if (semFuncao.length) throw new Error(`GHE sem função vinculada: ${semFuncao.map((g) => g.codigo).join(", ")}.`);
  await db.update(schema.pgrs).set({ status: "EM_REVISAO" }).where(eq(schema.pgrs.id, p.id));
  await auditar(ator, "pgr.enviado_revisao", "pgr", pgrId, {});
}

/**
 * Aprovação: registra o documento assinado pelo profissional habilitado (PDF gerado aqui, assinado fora — ICP-Brasil ou à mão e digitalizado).
 * A versão anterior do mesmo estabelecimento passa a SUBSTITUIDO e fica guardada (histórico de 20 anos).
 */
export async function aprovarPgr(
  ator: Ator, pgrId: string,
  dados: { vigenciaInicio: Date; mesesRevisao?: number; arquivo: { nome: string; tipo: string; bytes: Buffer } },
) {
  exigir(ator, "sst.editar");
  const p = await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgrId) });
  if (!p) throw new Error("PGR não encontrado.");
  if (p.status !== "EM_REVISAO") throw new Error("Envie para revisão antes de aprovar.");
  if (!p.elaboradorNome || !p.elaboradorRegistro || !p.elaboradorQualificacao) throw new Error("Informe nome, qualificação e registro do profissional que elaborou e assinou o PGR (NR-18, 18.4.2).");
  if (!p.responsavelOrganizacao) throw new Error("Informe o responsável pela organização.");
  if (dados.arquivo.tipo !== "application/pdf") throw new Error("Anexe o PDF do PGR assinado.");
  const meses = Math.min(dados.mesesRevisao || MESES_REVISAO_PGR, MESES_REVISAO_PGR);
  const { salvarArquivo } = await import("./documentos");
  const caminho = await salvarArquivo(`pgr-${pgrId}`, dados.arquivo);
  await db.transaction(async (tx) => {
    if (p.anteriorId) await tx.update(schema.pgrs).set({ status: "SUBSTITUIDO" }).where(eq(schema.pgrs.id, p.anteriorId));
    await tx.update(schema.pgrs).set({
      status: "APROVADO", vigenciaInicio: dados.vigenciaInicio, proximaRevisao: somarMeses(dados.vigenciaInicio, meses),
      arquivoAssinadoPath: caminho, arquivoAssinadoHash: sha256(dados.arquivo.bytes), aprovadoPorId: ator.id, aprovadoEm: new Date(),
    }).where(eq(schema.pgrs.id, pgrId));
  });
  await auditar(ator, "pgr.aprovado", "pgr", pgrId, { versao: p.versao, hash: sha256(dados.arquivo.bytes) });
}

/** Revisão: copia a versão aprovada (GHEs, riscos e ações abertas) para uma nova versão editável. */
export async function revisarPgr(ator: Ator, pgrId: string, motivo: string) {
  exigir(ator, "sst.editar");
  if (!motivo.trim()) throw new Error("Informe o motivo da revisão (NR-1, 1.5.4.4.6).");
  const p = await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgrId), with: { ghes: true, riscos: true, acoes: true } });
  if (!p) throw new Error("PGR não encontrado.");
  if (p.status !== "APROVADO") throw new Error("Só uma versão aprovada pode ser revisada.");
  const aberta = await db.query.pgrs.findFirst({ where: and(eq(schema.pgrs.anteriorId, pgrId)) });
  if (aberta) throw new Error(`Já existe a revisão v${aberta.versao} em andamento.`);
  const novoId = await db.transaction(async (tx) => {
    const [n] = await tx.insert(schema.pgrs).values({
      obraId: p.obraId, titulo: p.titulo, estabelecimento: p.estabelecimento, versao: p.versao + 1, anteriorId: p.id, motivoRevisao: motivo,
      descricaoProcessos: p.descricaoProcessos, criterio: p.criterio, elaboradorNome: p.elaboradorNome, elaboradorQualificacao: p.elaboradorQualificacao,
      elaboradorRegistro: p.elaboradorRegistro, responsavelOrganizacao: p.responsavelOrganizacao, criadoPorId: ator.id,
    }).returning();
    const mapaGhe = new Map<string, string>(), mapaRisco = new Map<string, string>();
    for (const g of p.ghes) {
      const [ng] = await tx.insert(schema.ghes).values({ ...g, id: undefined, pgrId: n.id }).returning();
      mapaGhe.set(g.id, ng.id);
    }
    for (const r of p.riscos) {
      const [nr] = await tx.insert(schema.riscosInventario).values({ ...r, id: undefined, pgrId: n.id, gheId: mapaGhe.get(r.gheId)! }).returning();
      mapaRisco.set(r.id, nr.id);
    }
    const abertas = p.acoes.filter((a) => a.status !== "CONCLUIDA" && a.status !== "CANCELADA");
    if (abertas.length) await tx.insert(schema.acoesPlano).values(abertas.map((a) => ({ ...a, id: undefined, pgrId: n.id, riscoId: a.riscoId ? mapaRisco.get(a.riscoId) ?? null : null })));
    return n.id;
  });
  await auditar(ator, "pgr.revisao_criada", "pgr", novoId, { anterior: pgrId, motivo });
  return novoId;
}

/** PGR aprovado que vale para a função: o da obra; se não houver, o da empresa. */
export async function riscosDaFuncao(funcaoId: string, obraId: string | null) {
  const candidatos = await db.query.pgrs.findMany({ where: eq(schema.pgrs.status, "APROVADO"), orderBy: desc(schema.pgrs.versao) });
  const ordem = [...candidatos.filter((p) => obraId && p.obraId === obraId), ...candidatos.filter((p) => !p.obraId)];
  for (const pgr of ordem) {
    const ghes = (await db.query.ghes.findMany({ where: eq(schema.ghes.pgrId, pgr.id) })).filter((g) => g.funcoesIds.includes(funcaoId));
    if (!ghes.length) continue;
    const riscos = await db.query.riscosInventario.findMany({ where: inArray(schema.riscosInventario.gheId, ghes.map((g) => g.id)), orderBy: asc(schema.riscosInventario.ordem) });
    return { pgr, ghes, riscos };
  }
  return null;
}

export async function carregarPgr(pgrId: string) {
  const p = await db.query.pgrs.findFirst({
    where: eq(schema.pgrs.id, pgrId),
    with: {
      obra: true, aprovadoPor: true,
      ghes: { orderBy: (g, { asc }) => asc(g.ordem) },
      riscos: { orderBy: (r, { asc }) => asc(r.ordem) },
      acoes: true,
    },
  });
  return p ?? null;
}

export function resumoNiveis(criterio: CriterioRisco, riscos: { severidade: number; probabilidade: number }[]) {
  const cont = new Map<string, number>();
  for (const r of riscos) { const n = nivelDoRisco(criterio, r.severidade, r.probabilidade).nivel; cont.set(n, (cont.get(n) ?? 0) + 1); }
  return criterio.niveis.map((n) => ({ ...n, total: cont.get(n.nivel) ?? 0 }));
}
