export const fmtData = (d?: Date | string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—";

export const fmtDataHora = (d?: Date | string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }) : "—";

export const fmtHoras = (h?: number | null) =>
  h == null ? "Não fixada" : `${String(h).replace(".", ",")} h`;

export function somarMeses(d: Date, meses: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + meses);
  return r;
}

export const STATUS_MATRICULA: Record<string, { rotulo: string; cor: string }> = {
  MATRICULADO: { rotulo: "Não iniciado", cor: "cinza" },
  EM_ANDAMENTO: { rotulo: "Em andamento", cor: "azul" },
  TEORIA_CONCLUIDA: { rotulo: "Teoria concluída", cor: "azul" },
  PENDENTE_PRATICA: { rotulo: "Pendente de prática", cor: "amarelo" },
  AGUARDANDO_APROVACAO: { rotulo: "Aguardando aprovação", cor: "amarelo" },
  CAPACITADO: { rotulo: "Capacitação integral", cor: "verde" },
  REPROVADO: { rotulo: "Reprovado", cor: "vermelho" },
  VENCIDO: { rotulo: "Vencido", cor: "vermelho" },
  CANCELADA: { rotulo: "Cancelada", cor: "cinza" },
};

export const CLASSIFICACAO: Record<string, string> = {
  OBRIGATORIO: "Obrigatório",
  INTERNO: "Interno Palla",
  RECOMENDADO: "Recomendado",
  CONDICIONAL: "Condicional",
};

export const ORIGEM: Record<string, string> = {
  LEGAL: "fixado pela norma",
  EMPREGADOR: "critério interno Palla",
  A_VALIDAR: "pendente de validação técnica",
};

export const MODALIDADE: Record<string, string> = {
  EAD: "A distância (EAD)",
  SEMIPRESENCIAL: "Semipresencial",
  PRESENCIAL: "Presencial",
};

export const TIPO_CURSO: Record<string, string> = {
  LEGAL: "Obrigação legal (NR)",
  INTERNO: "Capacitação interna",
  INTERNO_COMPLEMENTAR: "Interno complementar",
};

export const TIPO_DOC: Record<string, string> = {
  ASO: "ASO",
  FICHA_EPI: "Ficha de entrega de EPI",
  DOCUMENTO_CONTRATANTE: "Documento da contratante",
  CERTIFICADO_EXTERNO: "Certificado externo",
  OUTRO: "Outro",
};

/** Nome abreviado para a página pública: "João da Silva Pereira" → "João S. P." */
export function nomeAbreviado(nome: string) {
  const partes = nome.trim().split(/\s+/).filter((p) => !/^(da|de|do|das|dos|e)$/i.test(p));
  if (partes.length <= 1) return nome;
  return [partes[0], ...partes.slice(1).map((p) => `${p[0].toUpperCase()}.`)].join(" ");
}
