// Controle de permissões por perfil. Toda ação no servidor chama exigir().
export type Perfil =
  | "ADMIN" | "RH" | "SST" | "INSTRUTOR" | "RESPONSAVEL_TECNICO" | "GESTOR_OBRA" | "COLABORADOR";

export type Ator = {
  id: string;
  nome: string;
  perfil: Perfil;
  colaboradorId: string | null;
};

export type Permissao =
  | "painel.ver"
  | "colaborador.ver"
  | "colaborador.cadastrar"
  | "obra.gerir"
  | "convite.criar"
  | "matriz.editar"
  | "curso.ver"
  | "curso.editar"
  | "pratica.registrar"
  | "capacitacao.aprovar"
  | "certificado.cancelar"
  | "documento.ver"
  | "documento.conferir"
  | "autorizacao.conceder"
  | "liberacao.aprovar"
  | "auditoria.ver"
  | "sst.ver"          // ver PGR, PCMSO, prazos e dossiê
  | "sst.editar"       // montar PGR, registrar PCMSO, aprovar modelos de termo
  | "admissao.gerir"   // dossiê admissional e documentos pessoais sensíveis
  | "prazo.ver";

const MAPA: Record<Perfil, Permissao[]> = {
  ADMIN: [
    "painel.ver", "colaborador.ver", "colaborador.cadastrar", "obra.gerir", "convite.criar",
    "matriz.editar", "curso.ver", "curso.editar", "certificado.cancelar", "documento.ver",
    "documento.conferir", "autorizacao.conceder", "liberacao.aprovar", "auditoria.ver",
    "sst.ver", "sst.editar", "admissao.gerir", "prazo.ver",
  ],
  RH: ["painel.ver", "colaborador.ver", "colaborador.cadastrar", "obra.gerir", "convite.criar", "curso.ver", "documento.ver",
    "sst.ver", "admissao.gerir", "prazo.ver"],
  SST: [
    "painel.ver", "colaborador.ver", "convite.criar", "matriz.editar", "curso.ver", "curso.editar",
    "documento.ver", "documento.conferir", "autorizacao.conceder", "liberacao.aprovar", "auditoria.ver",
    "sst.ver", "sst.editar", "prazo.ver",
  ],
  INSTRUTOR: ["painel.ver", "colaborador.ver", "curso.ver", "pratica.registrar"],
  RESPONSAVEL_TECNICO: [
    "painel.ver", "colaborador.ver", "curso.ver", "curso.editar", "capacitacao.aprovar",
    "certificado.cancelar", "documento.ver", "auditoria.ver", "sst.ver", "prazo.ver",
  ],
  GESTOR_OBRA: ["painel.ver", "colaborador.ver", "curso.ver", "liberacao.aprovar", "sst.ver", "prazo.ver"],
  COLABORADOR: [],
};

export function pode(ator: Pick<Ator, "perfil"> | null | undefined, p: Permissao): boolean {
  return !!ator && MAPA[ator.perfil].includes(p);
}

export class ErroPermissao extends Error {
  constructor(p: string) {
    super(`Sem permissão para: ${p}`);
  }
}

export function exigir(ator: Ator | null | undefined, p: Permissao): asserts ator is Ator {
  if (!pode(ator, p)) throw new ErroPermissao(p);
}

export const NOME_PERFIL: Record<Perfil, string> = {
  ADMIN: "Administrador geral",
  RH: "Recursos Humanos",
  SST: "Segurança do Trabalho",
  INSTRUTOR: "Instrutor",
  RESPONSAVEL_TECNICO: "Responsável técnico",
  GESTOR_OBRA: "Gestor de obra",
  COLABORADOR: "Colaborador",
};
