// Crachá do colaborador: o QR leva a uma página pública com os treinamentos válidos e a liberação de acesso.
// O link é assinado (HMAC) para não ser adivinhado a partir de outro colaborador; não expõe CPF nem dados de saúde.
import { createHmac, timingSafeEqual } from "node:crypto";
import { avaliarColaborador } from "./conformidade";
import { certificadosDoColaborador } from "./certificacao";

function chave() {
  // CPF_HMAC_KEY não pode mudar (indexa os CPFs), por isso serve de chave estável para os crachás impressos.
  const k = process.env.CPF_HMAC_KEY || process.env.SESSION_SECRET;
  if (!k) throw new Error("CPF_HMAC_KEY ausente.");
  return k;
}

export function assinaturaCracha(colaboradorId: string): string {
  return createHmac("sha256", chave()).update(`cracha:v1:${colaboradorId}`).digest("base64url").slice(0, 16);
}

export function crachaValido(colaboradorId: string, t: string | undefined): boolean {
  if (!t) return false;
  const a = Buffer.from(assinaturaCracha(colaboradorId));
  const b = Buffer.from(t);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function urlCracha(colaboradorId: string): string {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}/cracha/${colaboradorId}?t=${assinaturaCracha(colaboradorId)}`;
}

/** Situação mostrada à portaria: só o necessário para decidir a entrada. */
export async function situacaoPublica(colaboradorId: string, hoje = new Date()) {
  const { colaborador: c, semaforo, liberacaoAtiva } = await avaliarColaborador(colaboradorId, hoje);
  const certs = await certificadosDoColaborador(colaboradorId);
  // Um certificado por curso: o mais recente válido; integrais primeiro.
  const porCurso = new Map<string, (typeof certs)[number]>();
  for (const k of certs.filter((x) => x.status === "VALIDO" && x.tipo === "INTEGRAL")) {
    if (!porCurso.has(k.dadosSnapshot.cursoCodigo)) porCurso.set(k.dadosSnapshot.cursoCodigo, k);
  }
  const treinamentos = [...porCurso.values()].map((k) => ({
    numero: k.numero,
    codigoVerificacao: k.codigoVerificacao,
    curso: k.dadosSnapshot.cursoTitulo,
    codigoCurso: k.dadosSnapshot.cursoCodigo,
    validoAte: k.validoAte,
    vencido: !!k.validoAte && k.validoAte < hoje,
    venceEmBreve: !!k.validoAte && k.validoAte >= hoje && +k.validoAte - +hoje < 30 * 86400_000,
  })).sort((x, y) => x.curso.localeCompare(y.curso, "pt-BR"));
  const autorizacoes = c.autorizacoes.filter((x) => !x.revogadaEm && (!x.validoAte || x.validoAte >= hoje)).map((x) => ({ atividade: x.atividade, validoAte: x.validoAte }));
  const acesso: "LIBERADO" | "EM_REVISAO" | "NAO_LIBERADO" =
    liberacaoAtiva && semaforo === "VERDE" ? "LIBERADO" : liberacaoAtiva ? "EM_REVISAO" : "NAO_LIBERADO";
  return { colaborador: c, acesso, liberacao: liberacaoAtiva, treinamentos, autorizacoes };
}
