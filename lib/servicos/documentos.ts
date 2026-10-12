import { and, eq, isNull } from "drizzle-orm";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { exigir, type Ator } from "@/lib/permissoes";
import { avaliarColaborador } from "./conformidade";

const TIPOS_ACEITOS = new Map([
  ["application/pdf", ".pdf"], ["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/webp", ".webp"],
]);
const MAX_BYTES = 10 * 1024 * 1024;

function pastaBase() {
  return path.resolve(process.env.UPLOAD_DIR ?? "./armazenamento");
}

// ARMAZENAMENTO=banco guarda os arquivos no PostgreSQL (hospedagem sem disco persistente, ex.: Netlify);
// o padrão é a pasta UPLOAD_DIR no servidor.
const noBanco = () => process.env.ARMAZENAMENTO === "banco";

export async function salvarArquivo(colaboradorId: string, arquivo: { nome: string; tipo: string; bytes: Buffer }) {
  const ext = TIPOS_ACEITOS.get(arquivo.tipo);
  if (!ext) throw new Error("Formato não aceito. Envie PDF, JPG, PNG ou WEBP.");
  if (arquivo.bytes.length > MAX_BYTES) throw new Error("Arquivo maior que 10 MB.");
  if (noBanco()) {
    const caminho = `colaboradores/${colaboradorId}/${crypto.randomUUID()}${ext}`;
    await db.insert(schema.arquivos).values({ caminho, colaboradorId, tipo: arquivo.tipo, bytes: arquivo.bytes });
    return caminho;
  }
  const dir = path.join(pastaBase(), "colaboradores", colaboradorId);
  await mkdir(dir, { recursive: true });
  const rel = path.join("colaboradores", colaboradorId, `${crypto.randomUUID()}${ext}`);
  await writeFile(path.join(pastaBase(), rel), arquivo.bytes);
  return rel;
}

export async function lerArquivo(rel: string) {
  if (noBanco()) {
    const a = await db.query.arquivos.findFirst({ where: eq(schema.arquivos.caminho, rel) });
    if (!a) throw new Error("Arquivo não encontrado.");
    return a.bytes;
  }
  const abs = path.resolve(pastaBase(), rel);
  if (!abs.startsWith(pastaBase())) throw new Error("Caminho inválido.");
  return readFile(abs);
}

/** Envio de documento pelo próprio colaborador ou pelo RH/SST. O ASO é apenas anexado, nunca gerado. */
export async function enviarDocumento(
  ator: Ator,
  dados: {
    colaboradorId: string; tipo: "ASO" | "FICHA_EPI" | "DOCUMENTO_CONTRATANTE" | "CERTIFICADO_EXTERNO" | "OUTRO";
    descricao: string; emitidoEm?: Date | null; validoAte?: Date | null; emitente?: string | null;
    arquivo?: { nome: string; tipo: string; bytes: Buffer } | null;
  },
) {
  const proprio = ator.perfil === "COLABORADOR" && ator.colaboradorId === dados.colaboradorId;
  if (!proprio) exigir(ator, "documento.ver");
  const arquivoPath = dados.arquivo ? await salvarArquivo(dados.colaboradorId, dados.arquivo) : null;
  const [doc] = await db.insert(schema.documentos).values({
    colaboradorId: dados.colaboradorId,
    tipo: dados.tipo,
    descricao: dados.descricao,
    arquivoPath,
    arquivoNome: dados.arquivo?.nome ?? null,
    emitidoEm: dados.emitidoEm ?? null,
    validoAte: dados.validoAte ?? null,
    emitente: dados.emitente ?? null,
  }).returning();
  await auditar(ator, "documento.enviado", "documento", doc.id, { tipo: dados.tipo, colaboradorId: dados.colaboradorId });
  return doc;
}

export async function conferirDocumento(
  ator: Ator, documentoId: string,
  decisao: { aprovado: boolean; validoAte?: Date | null; aptidoes?: string | null; observacao?: string | null },
) {
  exigir(ator, "documento.conferir");
  const doc = await db.query.documentos.findFirst({ where: eq(schema.documentos.id, documentoId) });
  if (!doc) throw new Error("Documento não encontrado.");
  if (doc.tipo === "ASO" && decisao.aprovado && !(decisao.validoAte ?? doc.validoAte)) {
    throw new Error("Informe a validade do ASO conforme o PCMSO.");
  }
  await db.update(schema.documentos).set({
    status: decisao.aprovado ? "CONFERIDO" : "REJEITADO",
    validoAte: decisao.validoAte ?? doc.validoAte,
    aptidoes: decisao.aptidoes ?? doc.aptidoes,
    observacao: decisao.observacao ?? null,
    conferidoPorId: ator.id,
    conferidoEm: new Date(),
  }).where(eq(schema.documentos.id, documentoId));
  await auditar(ator, decisao.aprovado ? "documento.conferido" : "documento.rejeitado", "documento", documentoId, {
    tipo: doc.tipo, aptidoes: decisao.aptidoes ?? null,
  });
}

/** Autorização formal (ex.: NR-35, 35.4.1): exige capacitação integral válida e ASO conferido. */
export async function concederAutorizacao(ator: Ator, colaboradorId: string, atividade: string, validoAte?: Date | null, observacao?: string) {
  exigir(ator, "autorizacao.conceder");
  const { colaborador, itens } = await avaliarColaborador(colaboradorId);
  const cursosDaAtividade = colaborador.matriculas.filter((m) => m.curso.exigeAutorizacao === atividade && m.status !== "CANCELADA");
  if (!cursosDaAtividade.length) throw new Error("Nenhum curso da trilha exige esta autorização.");
  const naoCapacitado = cursosDaAtividade.filter((m) => m.status !== "CAPACITADO");
  if (naoCapacitado.length) throw new Error("A autorização exige capacitação integral válida nos cursos da atividade.");
  const aso = itens.find((i) => i.descricao === "ASO");
  if (aso?.situacao !== "OK") throw new Error("A autorização exige ASO conferido e válido.");
  const aptidaoPend = itens.find((i) => i.descricao.startsWith("ASO com aptidão") && i.situacao !== "OK");
  if (aptidaoPend) throw new Error(`${aptidaoPend.descricao}: pendente.`);
  const [a] = await db.insert(schema.autorizacoes).values({
    colaboradorId, atividade, concedidaPorId: ator.id, validoAte: validoAte ?? null, observacao: observacao ?? null,
  }).returning();
  await auditar(ator, "autorizacao.concedida", "autorizacao", a.id, { colaboradorId, atividade });
  return a;
}

export async function revogarAutorizacao(ator: Ator, autorizacaoId: string, motivo: string) {
  exigir(ator, "autorizacao.conceder");
  await db.update(schema.autorizacoes).set({ revogadaEm: new Date(), observacao: motivo })
    .where(eq(schema.autorizacoes.id, autorizacaoId));
  await auditar(ator, "autorizacao.revogada", "autorizacao", autorizacaoId, { motivo });
}

/** Liberação de acesso: sempre aprovação humana e só com semáforo VERDE. */
export async function aprovarLiberacao(ator: Ator, colaboradorId: string, observacao?: string) {
  exigir(ator, "liberacao.aprovar");
  const { colaborador, semaforo, liberacaoAtiva } = await avaliarColaborador(colaboradorId);
  if (!colaborador.obraId) throw new Error("Colaborador sem obra definida.");
  if (ator.perfil === "GESTOR_OBRA" && colaborador.obra?.gestorId !== ator.id) {
    throw new Error("Gestor só libera colaboradores da própria obra.");
  }
  if (semaforo !== "VERDE") throw new Error("A liberação exige documentação conferida (verde).");
  if (liberacaoAtiva) return liberacaoAtiva;
  const [l] = await db.insert(schema.liberacoes).values({
    colaboradorId, obraId: colaborador.obraId, aprovadaPorId: ator.id, semaforo, observacao: observacao ?? null,
  }).returning();
  await auditar(ator, "liberacao.aprovada", "liberacao", l.id, { colaboradorId, obraId: colaborador.obraId });
  return l;
}

export async function revogarLiberacao(ator: Ator, colaboradorId: string, motivo: string) {
  exigir(ator, "liberacao.aprovar");
  const r = await db.update(schema.liberacoes).set({ revogadaEm: new Date(), motivoRevogacao: motivo })
    .where(and(eq(schema.liberacoes.colaboradorId, colaboradorId), isNull(schema.liberacoes.revogadaEm)))
    .returning({ id: schema.liberacoes.id });
  await auditar(ator, "liberacao.revogada", "colaborador", colaboradorId, { motivo, ids: r.map((x) => x.id) });
}
