// Dossiê admissional e termos assinados eletronicamente pelo colaborador.
// A assinatura aqui é eletrônica simples/avançada (login individual + senha na hora + texto congelado com hash).
// NÃO é assinatura ICP-Brasil: documentos das NR que exigirem certificado digital (NR-1, 1.6.2) seguem o modelo definido pelo jurídico.
import bcrypt from "bcryptjs";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { codigoAleatorio, mascararCpf, sha256 } from "@/lib/cripto";
import { fmtData } from "@/lib/formato";
import { exigir, pode, type Ator } from "@/lib/permissoes";
import { CATEGORIA_RISCO, riscosDaFuncao } from "./pgr";

const aplica = (lista: string[] | null | undefined, funcaoCodigo: string) => !lista || lista.length === 0 || lista.includes(funcaoCodigo);
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

export type SituacaoItem = "ENTREGUE" | "EM_CONFERENCIA" | "REJEITADO" | "FALTA" | "VENCIDO";

/** Itens de admissão que valem para o colaborador, com o documento mais recente de cada um. */
export async function dossieAdmissional(colaboradorId: string, hoje = new Date()) {
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId), with: { funcao: true } });
  if (!c) throw new Error("Colaborador não encontrado.");
  const [itens, docs] = await Promise.all([
    db.query.itensAdmissionais.findMany({ where: eq(schema.itensAdmissionais.ativo, true), orderBy: (i, { asc }) => asc(i.ordem) }),
    db.query.documentos.findMany({ where: and(eq(schema.documentos.colaboradorId, colaboradorId), eq(schema.documentos.tipo, "ADMISSIONAL")), orderBy: desc(schema.documentos.enviadoEm) }),
  ]);
  const linhas = itens.filter((i) => aplica(i.funcoesCodigos, c.funcao.codigo)).map((item) => {
    const doc = docs.find((d) => d.itemAdmissionalId === item.id) ?? null;
    let situacao: SituacaoItem = "FALTA";
    if (doc) {
      if (doc.status === "REJEITADO") situacao = "REJEITADO";
      else if (doc.validoAte && doc.validoAte < hoje) situacao = "VENCIDO";
      else situacao = doc.status === "CONFERIDO" ? "ENTREGUE" : "EM_CONFERENCIA";
    }
    return { item, doc, situacao };
  });
  const obrig = linhas.filter((l) => l.item.obrigatorio);
  return {
    colaborador: c,
    linhas,
    total: obrig.length,
    entregues: obrig.filter((l) => l.situacao === "ENTREGUE").length,
    pendentes: obrig.filter((l) => l.situacao !== "ENTREGUE").length,
  };
}

/** Envio de um item do dossiê (pelo colaborador ou pela equipe). */
export async function enviarItemAdmissional(
  ator: Ator, colaboradorId: string, itemId: string,
  arquivo: { nome: string; tipo: string; bytes: Buffer }, validoAte?: Date | null, salvar?: (colabId: string, a: typeof arquivo) => Promise<string>,
) {
  const proprio = ator.perfil === "COLABORADOR" && ator.colaboradorId === colaboradorId;
  if (!proprio) exigir(ator, "admissao.gerir");
  const item = await db.query.itensAdmissionais.findFirst({ where: eq(schema.itensAdmissionais.id, itemId) });
  if (!item) throw new Error("Item não encontrado.");
  if (proprio && item.quemEnvia === "EQUIPE") throw new Error("Este documento é registrado pelo RH.");
  if (item.exigeValidade && !validoAte) throw new Error("Informe a data de validade do documento.");
  const { salvarArquivo } = await import("./documentos");
  const caminho = await (salvar ?? salvarArquivo)(colaboradorId, arquivo);
  const [doc] = await db.insert(schema.documentos).values({
    colaboradorId, tipo: "ADMISSIONAL", descricao: item.nome, itemAdmissionalId: item.id,
    arquivoPath: caminho, arquivoNome: arquivo.nome, validoAte: validoAte ?? null,
    // o que a equipe registra já entra conferido por quem registrou
    ...(proprio ? {} : { status: "CONFERIDO" as const, conferidoPorId: ator.id, conferidoEm: new Date() }),
  }).returning();
  await auditar(ator, "admissao.documento_enviado", "documento", doc.id, { colaboradorId, item: item.codigo });
  return doc;
}

export async function conferirItemAdmissional(ator: Ator, documentoId: string, aprovado: boolean, observacao?: string | null) {
  exigir(ator, "admissao.gerir");
  const d = await db.query.documentos.findFirst({ where: eq(schema.documentos.id, documentoId) });
  if (!d || d.tipo !== "ADMISSIONAL") throw new Error("Documento não encontrado.");
  await db.update(schema.documentos).set({
    status: aprovado ? "CONFERIDO" : "REJEITADO", observacao: observacao ?? null, conferidoPorId: ator.id, conferidoEm: new Date(),
  }).where(eq(schema.documentos.id, documentoId));
  await auditar(ator, aprovado ? "admissao.documento_conferido" : "admissao.documento_rejeitado", "documento", documentoId, { observacao });
}

/** Quem pode abrir o arquivo: o dono; RH/ADMIN; os demais perfis com documento.ver, exceto itens marcados como sensíveis. */
export async function podeAbrirDocumento(ator: Ator, documentoId: string) {
  const d = await db.query.documentos.findFirst({ where: eq(schema.documentos.id, documentoId), with: { itemAdmissional: true } });
  if (!d) return { d: null, ok: false };
  if (ator.perfil === "COLABORADOR") return { d, ok: d.colaboradorId === ator.colaboradorId };
  if (d.tipo === "ADMISSIONAL") return { d, ok: pode(ator, "admissao.gerir") || (pode(ator, "documento.ver") && !d.itemAdmissional?.sensivel) };
  return { d, ok: pode(ator, "documento.ver") };
}

// ---------------------------------------------------------------- Termos

/** Versão vigente (aprovada e ativa) de cada modelo. */
export async function modelosVigentes() {
  const todos = await db.query.modelosTermo.findMany({
    where: and(eq(schema.modelosTermo.status, "APROVADO"), eq(schema.modelosTermo.ativo, true)),
    orderBy: (m, { asc, desc }) => [asc(m.ordem), desc(m.versao)],
  });
  const porCodigo = new Map<string, (typeof todos)[number]>();
  for (const m of todos) if (!porCodigo.has(m.codigo)) porCodigo.set(m.codigo, m);
  return [...porCodigo.values()];
}

/** Monta o texto final do termo para o colaborador. Devolve `bloqueio` quando falta informação obrigatória (ex.: PGR aprovado). */
export async function montarTermo(modelo: typeof schema.modelosTermo.$inferSelect, colaboradorId: string) {
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId), with: { funcao: true, obra: true, empresa: true } });
  if (!c) throw new Error("Colaborador não encontrado.");
  let bloqueio: string | null = null;
  let riscos = "", epis = "";
  if (/\{\{(riscos|epis)\}\}/.test(modelo.texto)) {
    const r = await riscosDaFuncao(c.funcaoId, c.obraId);
    if (!r) {
      bloqueio = "Aguardando o PGR aprovado que inclua esta função (os riscos da ordem de serviço saem do inventário de riscos).";
    } else {
      riscos = r.riscos.length
        ? r.riscos.map((x) => `- [${CATEGORIA_RISCO[x.categoria]}] ${x.perigo} (${x.fonte}). Possíveis lesões: ${x.lesoes}. Medidas: ${x.medidasExistentes}.`).join("\n")
        : "- Nenhum risco registrado para o GHE desta função.";
      epis = r.ghes.map((g) => g.epis).filter(Boolean).join("\n") || "- Conforme a ficha de entrega de EPI.";
      riscos += `\n(Fonte: ${r.pgr.titulo}, versão ${r.pgr.versao}; GHE ${r.ghes.map((g) => g.codigo).join(", ")}.)`;
    }
  }
  const valores: Record<string, string> = {
    nome: c.nome, cpf: mascararCpf(c.cpfFinal), funcao: c.funcao.nome, obra: c.obra ? `${c.obra.codigo} — ${c.obra.nome}` : "a definir",
    empresa: c.empresa.nome, data: fmtData(new Date()), riscos, epis,
  };
  const texto = modelo.texto.replace(/\{\{(\w+)\}\}/g, (_, k) => valores[k] ?? "");
  return { texto, bloqueio, colaborador: c };
}

/** Termos que o colaborador precisa assinar (ou já assinou) — só modelos aprovados que valem para a função. */
export async function termosDoColaborador(colaboradorId: string) {
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId), with: { funcao: true } });
  if (!c) throw new Error("Colaborador não encontrado.");
  const [modelos, assinaturas] = await Promise.all([
    modelosVigentes(),
    db.query.assinaturasTermo.findMany({
      where: and(eq(schema.assinaturasTermo.colaboradorId, colaboradorId), isNull(schema.assinaturasTermo.invalidadoEm)),
      with: { modelo: true }, orderBy: desc(schema.assinaturasTermo.assinadoEm),
    }),
  ]);
  return modelos.filter((m) => aplica(m.funcoesCodigos, c.funcao.codigo)).map((m) => {
    const ass = assinaturas.find((a) => a.modelo.codigo === m.codigo) ?? null;
    const atual = !!ass && ass.modelo.versao === m.versao;
    return { modelo: m, assinatura: ass, situacao: atual ? "ASSINADO" as const : ass ? "NOVA_VERSAO" as const : "PENDENTE" as const };
  });
}

export async function assinarTermo(
  ator: Ator, modeloId: string, dados: { senha: string; nomeDigitado: string; aceite: boolean; ip?: string | null; userAgent?: string | null },
) {
  if (ator.perfil !== "COLABORADOR" || !ator.colaboradorId) throw new Error("Só o próprio colaborador assina o termo.");
  if (!dados.aceite) throw new Error("Marque a confirmação de que leu e concorda.");
  const modelo = await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.id, modeloId) });
  if (!modelo || modelo.status !== "APROVADO" || !modelo.ativo) throw new Error("Termo indisponível.");
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, ator.id) });
  if (!u || !(await bcrypt.compare(dados.senha, u.senhaHash))) throw new Error("Senha incorreta.");
  const { texto, bloqueio, colaborador } = await montarTermo(modelo, ator.colaboradorId);
  if (bloqueio) throw new Error(bloqueio);
  if (normalizar(dados.nomeDigitado) !== normalizar(colaborador.nome)) throw new Error("Digite seu nome completo exatamente como no cadastro.");
  const assinadoEm = new Date();
  const codigo = `TRM-${codigoAleatorio(10)}`;
  const hash = sha256(`${modelo.codigo}|v${modelo.versao}|${colaborador.id}|${assinadoEm.toISOString()}|${texto}`);
  const [a] = await db.insert(schema.assinaturasTermo).values({
    modeloId, colaboradorId: colaborador.id, titulo: modelo.titulo, textoFinal: texto, hashSha256: hash, codigo,
    metodo: "SENHA_PLATAFORMA", nomeDigitado: dados.nomeDigitado.trim(), ip: dados.ip ?? null, userAgent: dados.userAgent ?? null, assinadoEm,
  }).returning();
  await auditar(ator, "termo.assinado", "assinatura_termo", a.id, { modelo: modelo.codigo, versao: modelo.versao, hash, codigo });
  return a;
}

export async function invalidarAssinatura(ator: Ator, assinaturaId: string, motivo: string) {
  exigir(ator, "admissao.gerir");
  if (!motivo.trim()) throw new Error("Informe o motivo.");
  await db.update(schema.assinaturasTermo).set({ invalidadoEm: new Date(), motivoInvalidacao: motivo }).where(eq(schema.assinaturasTermo.id, assinaturaId));
  await auditar(ator, "termo.invalidado", "assinatura_termo", assinaturaId, { motivo });
}

/** Aprovação de modelo pela SST (ou admin). A aprovação congela a versão; editar o texto cria versão nova. */
export async function aprovarModelo(ator: Ator, modeloId: string) {
  exigir(ator, "sst.editar");
  const m = await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.id, modeloId) });
  if (!m) throw new Error("Modelo não encontrado.");
  await db.update(schema.modelosTermo).set({ status: "APROVADO", aprovadoPorId: ator.id, aprovadoEm: new Date() }).where(eq(schema.modelosTermo.id, modeloId));
  await auditar(ator, "termo.modelo_aprovado", "modelo_termo", modeloId, { codigo: m.codigo, versao: m.versao });
}

export async function novaVersaoModelo(ator: Ator, modeloId: string, texto: string, titulo?: string) {
  exigir(ator, "sst.editar");
  const m = await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.id, modeloId) });
  if (!m) throw new Error("Modelo não encontrado.");
  if (m.status !== "APROVADO") {
    // rascunho/revisão ainda não assinado por ninguém: altera no lugar
    await db.update(schema.modelosTermo).set({ texto, titulo: titulo || m.titulo }).where(eq(schema.modelosTermo.id, modeloId));
    await auditar(ator, "termo.modelo_editado", "modelo_termo", modeloId, { codigo: m.codigo, versao: m.versao });
    return m.id;
  }
  const ultima = await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.codigo, m.codigo), orderBy: desc(schema.modelosTermo.versao) });
  const [n] = await db.insert(schema.modelosTermo).values({
    codigo: m.codigo, versao: (ultima?.versao ?? m.versao) + 1, titulo: titulo || m.titulo, texto, base: m.base, origem: m.origem,
    naAdmissao: m.naAdmissao, funcoesCodigos: m.funcoesCodigos, status: "EM_REVISAO", ordem: m.ordem,
  }).returning();
  await auditar(ator, "termo.modelo_nova_versao", "modelo_termo", n.id, { codigo: m.codigo, versao: n.versao });
  return n.id;
}
