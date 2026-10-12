import { and, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { DadosCertificado } from "@/db/schema";
import { auditar } from "@/lib/auditoria";
import { codigoAleatorio, mascararCpf, sha256 } from "@/lib/cripto";
import { somarMeses } from "@/lib/formato";
import { exigir, type Ator } from "@/lib/permissoes";
import { gerarPdfCertificado } from "@/lib/pdf";

async function carregar(matriculaId: string) {
  const m = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.id, matriculaId),
    with: {
      curso: { with: { capitulos: { with: { aulas: true } }, responsavelTecnico: true } },
      colaborador: { with: { empresa: true, obra: true } },
      progresso: true,
      tentativas: true,
      praticas: { with: { instrutor: true } },
      certificados: true,
    },
  });
  if (!m) throw new Error("Matrícula não encontrada.");
  return m;
}

export type ItemChecklist = { item: string; ok: boolean; detalhe?: string };

/** Tudo o que precisa estar comprovado antes da emissão do certificado integral. */
export async function checklistEmissao(matriculaId: string): Promise<ItemChecklist[]> {
  const m = await carregar(matriculaId);
  const c = m.curso;
  const itens: ItemChecklist[] = [];
  const presencial = c.modalidade === "PRESENCIAL";
  const aptas = m.praticas.filter((p) => p.resultado === "APTO");

  itens.push({
    item: "Conteúdo do curso aprovado pelo responsável técnico",
    ok: c.statusConteudo === "APROVADO",
    detalhe: c.statusConteudo === "APROVADO" ? undefined : "Conteúdo ainda em revisão: não pode gerar certificado oficial.",
  });
  itens.push({ item: "Responsável técnico definido no curso", ok: !!c.responsavelTecnicoId });
  itens.push({
    item: "Carga horária definida",
    ok: c.cargaHoraria != null && c.cargaOrigem !== "A_VALIDAR",
    detalhe: c.cargaOrigem === "A_VALIDAR" ? "Carga horária pendente de validação técnica." : undefined,
  });
  if (!presencial) {
    const aulas = c.capitulos.flatMap((x) => x.aulas);
    const concluidas = aulas.filter((a) => m.progresso.some((p) => p.aulaId === a.id && p.concluidaEm)).length;
    itens.push({ item: "Todas as aulas concluídas com tempo mínimo", ok: aulas.length > 0 && concluidas === aulas.length, detalhe: `${concluidas} de ${aulas.length}` });
    const aprov = m.tentativas.find((t) => t.aprovado);
    itens.push({ item: `Avaliação aprovada (mínimo ${c.notaMinima}%)`, ok: !!aprov, detalhe: aprov ? `Nota ${aprov.nota}%` : "Sem aprovação" });
  } else {
    const comNota = aptas.find((p) => (p.notaAvaliacao ?? 0) >= c.notaMinima);
    itens.push({ item: "Teoria e avaliação presenciais registradas pelo instrutor", ok: !!comNota, detalhe: comNota ? `Nota ${comNota.notaAvaliacao}%` : undefined });
  }
  if (c.exigePratica || presencial) {
    itens.push({ item: "Atividade prática registrada como APTO", ok: aptas.length > 0 });
    itens.push({ item: "Instrutor identificado com qualificação", ok: aptas.some((p) => !!p.instrutor.qualificacao) });
  }
  itens.push({ item: "Situação aguardando aprovação", ok: m.status === "AGUARDANDO_APROVACAO", detalhe: m.status });
  return itens;
}

async function proximoNumero(prefixo: string) {
  const ano = new Date().getFullYear();
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(schema.certificados)
    .where(sql`${schema.certificados.numero} like ${`${prefixo}-${ano}-%`}`);
  return `${prefixo}-${ano}-${String(total + 1).padStart(6, "0")}`;
}

async function codigoUnico() {
  for (;;) {
    const c = codigoAleatorio(10);
    const existe = await db.query.certificados.findFirst({ where: eq(schema.certificados.codigoVerificacao, c) });
    if (!existe) return c;
  }
}

function montarDados(m: Awaited<ReturnType<typeof carregar>>, praticaPendente: boolean): DadosCertificado {
  const c = m.curso;
  const instrutores = new Map<string, DadosCertificado["instrutores"][number]>();
  for (const p of m.praticas.filter((x) => x.resultado === "APTO")) {
    instrutores.set(p.instrutor.id, { nome: p.instrutor.nome, qualificacao: p.instrutor.qualificacao, registro: p.instrutor.registroProfissional });
  }
  const nota = c.modalidade === "PRESENCIAL"
    ? m.praticas.find((p) => p.resultado === "APTO")?.notaAvaliacao ?? null
    : m.tentativas.find((t) => t.aprovado)?.nota ?? null;
  return {
    colaboradorNome: m.colaborador.nome,
    cpfMascarado: mascararCpf(m.colaborador.cpfFinal),
    cursoCodigo: c.codigo,
    cursoTitulo: c.titulo,
    tipoCurso: c.tipo,
    cargaHoraria: c.cargaHoraria,
    cargaOrigem: c.cargaOrigem,
    modalidade: c.modalidade,
    normaReferencia: c.normaReferencia,
    normaVersao: c.normaVersao,
    conteudoProgramatico: c.conteudoProgramatico.split("\n").map((s) => s.trim()).filter(Boolean),
    local: "",
    instrutores: [...instrutores.values()],
    responsavelTecnico: c.responsavelTecnico
      ? { nome: c.responsavelTecnico.nome, qualificacao: c.responsavelTecnico.qualificacao, registro: c.responsavelTecnico.registroProfissional }
      : null,
    empresa: { nome: process.env.EMPRESA_NOME ?? "Palla Construções", cnpj: process.env.EMPRESA_CNPJ || null },
    praticaPendente,
    notaAvaliacao: nota,
    validadeObservacao: c.validadeObservacao,
  };
}

/** Aprovação do responsável técnico + emissão do certificado integral. */
export async function aprovarEEmitir(ator: Ator, matriculaId: string, local: string) {
  exigir(ator, "capacitacao.aprovar");
  const m = await carregar(matriculaId);
  if (m.curso.responsavelTecnicoId && m.curso.responsavelTecnicoId !== ator.id) {
    throw new Error("Somente o responsável técnico designado para este curso pode aprovar.");
  }
  const pendencias = (await checklistEmissao(matriculaId)).filter((i) => !i.ok);
  if (pendencias.length) throw new Error(`Requisitos não atendidos: ${pendencias.map((p) => p.item).join("; ")}.`);
  if (!local.trim()) throw new Error("Informe o local ou a modalidade de realização.");

  const agora = new Date();
  const dados = { ...montarDados(m, false), local };
  const datas = [
    m.iniciadoEm, m.teoriaConcluidaEm, ...m.praticas.map((p) => p.data),
  ].filter(Boolean) as Date[];
  const dataInicio = new Date(Math.min(...datas.map((d) => +d), +agora));
  const dataConclusao = new Date(Math.max(...datas.map((d) => +d)));
  const validoAte = m.curso.validadeMeses ? somarMeses(dataConclusao, m.curso.validadeMeses) : null;
  const numero = await proximoNumero("PALLA");
  const codigo = await codigoUnico();

  const base = {
    numero, codigoVerificacao: codigo, tipo: "INTEGRAL" as const, emitidoEm: agora,
    dataInicio, dataConclusao, validoAte, local, aprovadoPorNome: ator.nome, aprovadoEm: agora, cienciaTrabalhadorEm: null,
  };
  const pdf = await gerarPdfCertificado(base, dados);
  const [cert] = await db.insert(schema.certificados).values({
    numero, codigoVerificacao: codigo, matriculaId, tipo: "INTEGRAL", emitidoEm: agora,
    dataInicio, dataConclusao, validoAte, local, aprovadoPorId: ator.id, aprovadoEm: agora,
    dadosSnapshot: dados, hashSha256: sha256(pdf),
  }).returning();
  await db.update(schema.matriculas).set({ status: "CAPACITADO", concluidoEm: dataConclusao, validoAte })
    .where(eq(schema.matriculas.id, matriculaId));
  await auditar(ator, "certificado.emitido", "certificado", cert.id, { numero, matriculaId, hash: cert.hashSha256 });
  return cert;
}

/** Comprovante de etapa teórica: só para cursos que ainda dependem de prática. */
export async function emitirComprovanteEtapa(ator: Ator, matriculaId: string) {
  const m = await carregar(matriculaId);
  if (ator.perfil === "COLABORADOR" && m.colaboradorId !== ator.colaboradorId) throw new Error("Sem permissão.");
  if (m.status !== "PENDENTE_PRATICA") throw new Error("Comprovante de etapa só existe para teoria concluída com prática pendente.");
  const existente = m.certificados.find((c) => c.tipo === "COMPROVANTE_ETAPA" && c.status === "VALIDO");
  if (existente) return existente;
  const agora = new Date();
  const dados = { ...montarDados(m, true), local: "Plataforma Grupo Palla | Treinamento e Integração (EAD)" };
  const numero = await proximoNumero("PALLA-ETAPA");
  const codigo = await codigoUnico();
  const base = {
    numero, codigoVerificacao: codigo, tipo: "COMPROVANTE_ETAPA" as const, emitidoEm: agora,
    dataInicio: m.iniciadoEm ?? agora, dataConclusao: m.teoriaConcluidaEm ?? agora, validoAte: null,
    local: dados.local, aprovadoPorNome: null, aprovadoEm: null, cienciaTrabalhadorEm: null,
  };
  const pdf = await gerarPdfCertificado(base, dados);
  const [cert] = await db.insert(schema.certificados).values({
    numero, codigoVerificacao: codigo, matriculaId, tipo: "COMPROVANTE_ETAPA", emitidoEm: agora,
    dataInicio: base.dataInicio, dataConclusao: base.dataConclusao, local: dados.local,
    dadosSnapshot: dados, hashSha256: sha256(pdf),
  }).returning();
  await auditar(ator, "comprovante_etapa.emitido", "certificado", cert.id, { numero, matriculaId });
  return cert;
}

/** Gera o PDF a partir dos dados congelados na emissão (o conteúdo não muda depois). */
export async function pdfDoCertificado(certId: string) {
  const c = await db.query.certificados.findFirst({
    where: eq(schema.certificados.id, certId),
    with: { aprovadoPor: true, matricula: true },
  });
  if (!c) throw new Error("Certificado não encontrado.");
  const pdf = await gerarPdfCertificado({
    numero: c.numero, codigoVerificacao: c.codigoVerificacao, tipo: c.tipo, emitidoEm: c.emitidoEm,
    dataInicio: c.dataInicio, dataConclusao: c.dataConclusao, validoAte: c.validoAte, local: c.local,
    aprovadoPorNome: c.aprovadoPor?.nome ?? null, aprovadoEm: c.aprovadoEm, cienciaTrabalhadorEm: c.cienciaTrabalhadorEm,
    status: c.status,
  }, c.dadosSnapshot);
  return { cert: c, pdf };
}

export async function registrarCiencia(ator: Ator, certId: string) {
  const c = await db.query.certificados.findFirst({ where: eq(schema.certificados.id, certId), with: { matricula: true } });
  if (!c || c.matricula.colaboradorId !== ator.colaboradorId) throw new Error("Certificado não encontrado.");
  if (c.cienciaTrabalhadorEm) return;
  await db.update(schema.certificados).set({ cienciaTrabalhadorEm: new Date() }).where(eq(schema.certificados.id, certId));
  await auditar(ator, "certificado.ciencia_trabalhador", "certificado", certId, {});
}

export async function cancelarCertificado(ator: Ator, certId: string, motivo: string) {
  exigir(ator, "certificado.cancelar");
  if (!motivo.trim()) throw new Error("Informe o motivo do cancelamento.");
  const c = await db.query.certificados.findFirst({ where: eq(schema.certificados.id, certId) });
  if (!c || c.status !== "VALIDO") throw new Error("Certificado não está válido.");
  await db.update(schema.certificados).set({ status: "CANCELADO", motivoStatus: motivo, alteradoEm: new Date() })
    .where(eq(schema.certificados.id, certId));
  if (c.tipo === "INTEGRAL") {
    await db.update(schema.matriculas).set({ status: "AGUARDANDO_APROVACAO", validoAte: null })
      .where(eq(schema.matriculas.id, c.matriculaId));
  }
  await auditar(ator, "certificado.cancelado", "certificado", certId, { motivo, numero: c.numero });
}

/** Reemissão (retificação): novo número; o anterior fica como SUBSTITUÍDO, com vínculo. */
export async function reemitirCertificado(ator: Ator, certId: string, motivo: string) {
  exigir(ator, "capacitacao.aprovar");
  if (!motivo.trim()) throw new Error("Informe o motivo da reemissão.");
  const antigo = await db.query.certificados.findFirst({ where: eq(schema.certificados.id, certId) });
  if (!antigo || antigo.status !== "VALIDO" || antigo.tipo !== "INTEGRAL") throw new Error("Só certificados integrais válidos podem ser reemitidos.");
  const m = await carregar(antigo.matriculaId);
  const dados = { ...montarDados(m, false), local: antigo.local };
  const agora = new Date();
  const numero = await proximoNumero("PALLA");
  const codigo = await codigoUnico();
  const base = {
    numero, codigoVerificacao: codigo, tipo: "INTEGRAL" as const, emitidoEm: agora,
    dataInicio: antigo.dataInicio, dataConclusao: antigo.dataConclusao, validoAte: antigo.validoAte,
    local: antigo.local, aprovadoPorNome: ator.nome, aprovadoEm: agora, cienciaTrabalhadorEm: null,
  };
  const pdf = await gerarPdfCertificado(base, dados);
  const [novo] = await db.insert(schema.certificados).values({
    numero, codigoVerificacao: codigo, matriculaId: antigo.matriculaId, tipo: "INTEGRAL", emitidoEm: agora,
    dataInicio: antigo.dataInicio, dataConclusao: antigo.dataConclusao, validoAte: antigo.validoAte,
    local: antigo.local, aprovadoPorId: ator.id, aprovadoEm: agora, dadosSnapshot: dados,
    hashSha256: sha256(pdf), substituiId: antigo.id, motivoStatus: motivo,
  }).returning();
  await db.update(schema.certificados).set({ status: "SUBSTITUIDO", motivoStatus: `Substituído por ${numero}: ${motivo}`, alteradoEm: agora })
    .where(eq(schema.certificados.id, antigo.id));
  await auditar(ator, "certificado.reemitido", "certificado", novo.id, { substitui: antigo.numero, motivo });
  return novo;
}

/** Marca como VENCIDO tudo que passou da validade (executado no carregamento dos painéis). */
export async function atualizarVencidos() {
  const vencidas = await db.update(schema.matriculas).set({ status: "VENCIDO" })
    .where(and(eq(schema.matriculas.status, "CAPACITADO"), lt(schema.matriculas.validoAte, new Date())))
    .returning({ id: schema.matriculas.id });
  if (vencidas.length) await auditar(null, "matricula.vencida", "matricula", null, { ids: vencidas.map((v) => v.id) });
  return vencidas.length;
}

export async function verificarPublico(codigo: string) {
  const c = await db.query.certificados.findFirst({
    where: eq(schema.certificados.codigoVerificacao, codigo.trim().toUpperCase()),
  });
  if (!c) return null;
  let substituto: { numero: string; codigoVerificacao: string } | null = null;
  if (c.status === "SUBSTITUIDO") {
    const s = await db.query.certificados.findFirst({ where: eq(schema.certificados.substituiId, c.id) });
    if (s) substituto = { numero: s.numero, codigoVerificacao: s.codigoVerificacao };
  }
  return { c, substituto };
}

export async function certificadosDoColaborador(colaboradorId: string) {
  const ms = await db.query.matriculas.findMany({ where: eq(schema.matriculas.colaboradorId, colaboradorId) });
  if (!ms.length) return [];
  return db.query.certificados.findMany({
    where: inArray(schema.certificados.matriculaId, ms.map((m) => m.id)),
    orderBy: desc(schema.certificados.emitidoEm),
  });
}
