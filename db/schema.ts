// GRUPO PALLA | TREINAMENTO E INTEGRAÇÃO — modelo de dados (PostgreSQL + Drizzle ORM)
// Convenções: nomes em português; datas em UTC; ids UUID.
import { relations } from "drizzle-orm";
import {
  customType, pgTable, pgEnum, text, boolean, timestamp, integer, real, jsonb, uniqueIndex, index, unique,
} from "drizzle-orm/pg-core";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const agora = (nome: string) => timestamp(nome, { withTimezone: true }).defaultNow().notNull();
const data = (nome: string) => timestamp(nome, { withTimezone: true });

// ---------------------------------------------------------------- Enums

export const perfilEnum = pgEnum("perfil", [
  "ADMIN", "RH", "SST", "INSTRUTOR", "RESPONSAVEL_TECNICO", "GESTOR_OBRA", "COLABORADOR",
]);
export const tipoCursoEnum = pgEnum("tipo_curso", ["LEGAL", "INTERNO", "INTERNO_COMPLEMENTAR"]);
export const origemEnum = pgEnum("origem_parametro", ["LEGAL", "EMPREGADOR", "A_VALIDAR"]);
export const modalidadeEnum = pgEnum("modalidade", ["EAD", "SEMIPRESENCIAL", "PRESENCIAL"]);
export const statusConteudoEnum = pgEnum("status_conteudo", ["RASCUNHO", "EM_REVISAO", "APROVADO"]);
export const tipoQuestaoEnum = pgEnum("tipo_questao", ["MULTIPLA_ESCOLHA", "SITUACIONAL"]);
export const classificacaoEnum = pgEnum("classificacao", ["OBRIGATORIO", "INTERNO", "RECOMENDADO", "CONDICIONAL"]);
export const statusMatriculaEnum = pgEnum("status_matricula", [
  "MATRICULADO", "EM_ANDAMENTO", "TEORIA_CONCLUIDA", "PENDENTE_PRATICA",
  "AGUARDANDO_APROVACAO", "CAPACITADO", "REPROVADO", "VENCIDO", "CANCELADA",
]);
export const resultadoPraticaEnum = pgEnum("resultado_pratica", ["APTO", "NAO_APTO"]);
export const abrangenciaEnum = pgEnum("abrangencia_pratica", ["PRATICA", "TEORIA_E_PRATICA"]);
export const tipoCertificadoEnum = pgEnum("tipo_certificado", ["INTEGRAL", "COMPROVANTE_ETAPA"]);
export const statusCertificadoEnum = pgEnum("status_certificado", ["VALIDO", "CANCELADO", "SUBSTITUIDO"]);
export const tipoDocumentoEnum = pgEnum("tipo_documento", [
  "ASO", "FICHA_EPI", "DOCUMENTO_CONTRATANTE", "CERTIFICADO_EXTERNO", "OUTRO",
]);
export const statusDocumentoEnum = pgEnum("status_documento", ["PENDENTE_CONFERENCIA", "CONFERIDO", "REJEITADO"]);
export const tipoTentativaEnum = pgEnum("tipo_tentativa", ["DIAGNOSTICA", "FINAL"]);
export const semaforoEnum = pgEnum("semaforo", ["VERDE", "AMARELO", "VERMELHO"]);

const bytea = customType<{ data: Buffer; driverData: Buffer }>({ dataType: () => "bytea" });

// ---------------------------------------------------------------- Pessoas e acesso

export const usuarios = pgTable("usuarios", {
  id: id(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  perfil: perfilEnum("perfil").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  qualificacao: text("qualificacao"),
  registroProfissional: text("registro_profissional"),
  colaboradorId: text("colaborador_id").unique(),
  criadoEm: agora("criado_em"),
  ultimoAcessoEm: data("ultimo_acesso_em"),
});

export const empresas = pgTable("empresas", {
  id: id(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj").unique(),
  propria: boolean("propria").default(false).notNull(),
});

export const contratantes = pgTable("contratantes", {
  id: id(),
  nome: text("nome").notNull(),
});

export const obras = pgTable("obras", {
  id: id(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  endereco: text("endereco"),
  contratanteId: text("contratante_id").references(() => contratantes.id),
  gestorId: text("gestor_id").references(() => usuarios.id),
  exigenciasExtras: text("exigencias_extras"),
  textoIntegracao: text("texto_integracao"),
  ativa: boolean("ativa").default(true).notNull(),
  criadaEm: agora("criada_em"),
});

export const funcoes = pgTable("funcoes", {
  id: id(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  ordem: integer("ordem").default(0).notNull(),
});

export const colaboradores = pgTable("colaboradores", {
  id: id(),
  nome: text("nome").notNull(),
  cpfCifrado: text("cpf_cifrado").notNull(),
  cpfHash: text("cpf_hash").notNull().unique(),
  cpfFinal: text("cpf_final").notNull(),
  dataNascimento: data("data_nascimento"),
  telefone: text("telefone"),
  email: text("email"),
  empresaId: text("empresa_id").notNull().references(() => empresas.id),
  funcaoId: text("funcao_id").notNull().references(() => funcoes.id),
  obraId: text("obra_id").references(() => obras.id),
  consentimentoLgpdEm: data("consentimento_lgpd_em"),
  versaoAvisoPrivacidade: text("versao_aviso_privacidade"),
  afastadoDesde: data("afastado_desde"),
  criadoEm: agora("criado_em"),
  dadoFicticio: boolean("dado_ficticio").default(false).notNull(),
});

export const convites = pgTable("convites", {
  id: id(),
  token: text("token").notNull().unique(),
  obraId: text("obra_id").notNull().references(() => obras.id),
  funcaoId: text("funcao_id").notNull().references(() => funcoes.id),
  empresaId: text("empresa_id").notNull().references(() => empresas.id),
  nomeSugerido: text("nome_sugerido"),
  expiraEm: data("expira_em").notNull(),
  usadoEm: data("usado_em"),
  criadoPorId: text("criado_por_id").notNull().references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

/** Arquivos enviados (ASO, fichas de EPI…) quando ARMAZENAMENTO=banco — usado em hospedagem sem disco persistente. */
export const arquivos = pgTable("arquivos", {
  caminho: text("caminho").primaryKey(),
  colaboradorId: text("colaborador_id").notNull(),
  tipo: text("tipo").notNull(),
  bytes: bytea("bytes").notNull(),
  criadoEm: agora("criado_em"),
});

// ---------------------------------------------------------------- Catálogo

export const cursos = pgTable("cursos", {
  id: id(),
  codigo: text("codigo").notNull().unique(),
  titulo: text("titulo").notNull(),
  tipo: tipoCursoEnum("tipo").notNull(),
  normaReferencia: text("norma_referencia").notNull(),
  normaVersao: text("norma_versao").notNull(),
  objetivo: text("objetivo").notNull(),
  publicoAlvo: text("publico_alvo").notNull(),
  preRequisitos: text("pre_requisitos"),
  conteudoProgramatico: text("conteudo_programatico").notNull(),
  cargaHoraria: real("carga_horaria"),
  cargaOrigem: origemEnum("carga_origem").notNull(),
  validadeMeses: integer("validade_meses"),
  validadeOrigem: origemEnum("validade_origem").notNull(),
  validadeObservacao: text("validade_observacao"),
  modalidade: modalidadeEnum("modalidade").notNull(),
  exigePratica: boolean("exige_pratica").default(false).notNull(),
  praticaDescricao: text("pratica_descricao"),
  exigeAutorizacao: text("exige_autorizacao"),
  exigeAptidaoAso: text("exige_aptidao_aso"),
  requisitosInstrutor: text("requisitos_instrutor"),
  notaMinima: integer("nota_minima").default(70).notNull(),
  maxTentativas: integer("max_tentativas").default(3).notNull(),
  // Avaliação diagnóstica obrigatória antes das aulas (não conta para aprovação; serve para medir a evolução).
  exigeDiagnostica: boolean("exige_diagnostica").default(false).notNull(),
  tempoMinimoAulaPct: integer("tempo_minimo_aula_pct").default(80).notNull(),
  observacaoLegal: text("observacao_legal"),
  statusConteudo: statusConteudoEnum("status_conteudo").default("RASCUNHO").notNull(),
  projetoPedagogicoValidoAte: data("projeto_pedagogico_valido_ate"),
  ativo: boolean("ativo").default(true).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  responsavelTecnicoId: text("responsavel_tecnico_id").references(() => usuarios.id),
});

export const capitulos = pgTable("capitulos", {
  id: id(),
  cursoId: text("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  ordem: integer("ordem").notNull(),
  titulo: text("titulo").notNull(),
});

export const aulas = pgTable("aulas", {
  id: id(),
  capituloId: text("capitulo_id").notNull().references(() => capitulos.id, { onDelete: "cascade" }),
  ordem: integer("ordem").notNull(),
  titulo: text("titulo").notNull(),
  duracaoMin: integer("duracao_min").notNull(),
  videoUrl: text("video_url"),
  legendaUrl: text("legenda_url"), // arquivo .vtt de legendas (acessibilidade)
  roteiro: text("roteiro").notNull(),
  narracao: text("narracao").notNull(),
  textoApoio: text("texto_apoio").notNull(),
  exemplo: text("exemplo"),
  perguntaFixacao: text("pergunta_fixacao"),
  resumo: text("resumo").notNull(),
});

export type Alternativa = { id: string; texto: string };

export const questoes = pgTable("questoes", {
  id: id(),
  cursoId: text("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  tipo: tipoQuestaoEnum("tipo").notNull(),
  enunciado: text("enunciado").notNull(),
  imagemUrl: text("imagem_url"),
  alternativas: jsonb("alternativas").$type<Alternativa[]>().notNull(),
  correta: text("correta").notNull(),
  comentario: text("comentario").notNull(),
  codigo: text("codigo"), // código no caderno do instrutor (ex.: M3-09)
  nivel: text("nivel"), // B básico | I intermediário
  diagnostica: boolean("diagnostica").default(false).notNull(), // compõe a avaliação diagnóstica
  ativa: boolean("ativa").default(true).notNull(),
});

export const matrizFuncao = pgTable("matriz_funcao", {
  id: id(),
  funcaoId: text("funcao_id").notNull().references(() => funcoes.id, { onDelete: "cascade" }),
  cursoId: text("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  obraId: text("obra_id").references(() => obras.id, { onDelete: "cascade" }),
  classificacao: classificacaoEnum("classificacao").notNull(),
  observacao: text("observacao"),
}, (t) => [unique("matriz_unica").on(t.funcaoId, t.cursoId, t.obraId).nullsNotDistinct()]);

// ---------------------------------------------------------------- Capacitação

export const matriculas = pgTable("matriculas", {
  id: id(),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  cursoId: text("curso_id").notNull().references(() => cursos.id),
  classificacao: classificacaoEnum("classificacao").notNull(),
  status: statusMatriculaEnum("status").default("MATRICULADO").notNull(),
  matriculadoEm: agora("matriculado_em"),
  iniciadoEm: data("iniciado_em"),
  teoriaConcluidaEm: data("teoria_concluida_em"),
  concluidoEm: data("concluido_em"),
  validoAte: data("valido_ate"),
  reavaliacaoLiberadaEm: data("reavaliacao_liberada_em"),
  observacao: text("observacao"),
}, (t) => [index("matricula_colab").on(t.colaboradorId)]);

export const progressoAulas = pgTable("progresso_aulas", {
  id: id(),
  matriculaId: text("matricula_id").notNull().references(() => matriculas.id, { onDelete: "cascade" }),
  aulaId: text("aula_id").notNull().references(() => aulas.id, { onDelete: "cascade" }),
  segundos: integer("segundos").default(0).notNull(),
  primeiroAcessoEm: agora("primeiro_acesso_em"),
  ultimoAcessoEm: agora("ultimo_acesso_em"),
  concluidaEm: data("concluida_em"),
}, (t) => [uniqueIndex("progresso_unico").on(t.matriculaId, t.aulaId)]);

export type QuestaoSorteada = { questaoId: string; alternativas: string[] };
export type Resposta = { questaoId: string; marcada: string | null; correta: boolean };

export const tentativas = pgTable("tentativas", {
  id: id(),
  matriculaId: text("matricula_id").notNull().references(() => matriculas.id, { onDelete: "cascade" }),
  tipo: tipoTentativaEnum("tipo").default("FINAL").notNull(),
  numero: integer("numero").notNull(), // FINAL: 1, 2, 3…; DIAGNOSTICA: 0
  iniciadaEm: agora("iniciada_em"),
  finalizadaEm: data("finalizada_em"),
  questoes: jsonb("questoes").$type<QuestaoSorteada[]>().notNull(),
  respostas: jsonb("respostas").$type<Resposta[]>(),
  nota: integer("nota"),
  aprovado: boolean("aprovado"),
  userAgent: text("user_agent"),
});

export const registrosPraticos = pgTable("registros_praticos", {
  id: id(),
  matriculaId: text("matricula_id").notNull().references(() => matriculas.id, { onDelete: "cascade" }),
  instrutorId: text("instrutor_id").notNull().references(() => usuarios.id),
  abrangencia: abrangenciaEnum("abrangencia").notNull(),
  data: data("data").notNull(),
  local: text("local").notNull(),
  equipamento: text("equipamento"),
  conteudo: text("conteudo").notNull(),
  duracaoMin: integer("duracao_min").notNull(),
  notaAvaliacao: integer("nota_avaliacao"),
  resultado: resultadoPraticaEnum("resultado").notNull(),
  observacoes: text("observacoes"),
  evidencias: jsonb("evidencias").$type<string[]>().default([]).notNull(),
  criadoEm: agora("criado_em"),
});

export type DadosCertificado = {
  colaboradorNome: string;
  cpfMascarado: string;
  cursoCodigo: string;
  cursoTitulo: string;
  tipoCurso: string;
  cargaHoraria: number | null;
  cargaOrigem: string;
  modalidade: string;
  normaReferencia: string;
  normaVersao: string;
  conteudoProgramatico: string[];
  local: string;
  instrutores: { nome: string; qualificacao: string | null; registro: string | null }[];
  responsavelTecnico: { nome: string; qualificacao: string | null; registro: string | null } | null;
  empresa: { nome: string; cnpj: string | null };
  praticaPendente: boolean;
  notaAvaliacao: number | null;
  validadeObservacao: string | null;
};

export const certificados = pgTable("certificados", {
  id: id(),
  numero: text("numero").notNull().unique(),
  codigoVerificacao: text("codigo_verificacao").notNull().unique(),
  matriculaId: text("matricula_id").notNull().references(() => matriculas.id),
  tipo: tipoCertificadoEnum("tipo").notNull(),
  status: statusCertificadoEnum("status").default("VALIDO").notNull(),
  emitidoEm: agora("emitido_em"),
  dataInicio: data("data_inicio").notNull(),
  dataConclusao: data("data_conclusao").notNull(),
  validoAte: data("valido_ate"),
  local: text("local").notNull(),
  aprovadoPorId: text("aprovado_por_id").references(() => usuarios.id),
  aprovadoEm: data("aprovado_em"),
  dadosSnapshot: jsonb("dados_snapshot").$type<DadosCertificado>().notNull(),
  hashSha256: text("hash_sha256").notNull(),
  substituiId: text("substitui_id"),
  motivoStatus: text("motivo_status"),
  alteradoEm: data("alterado_em"),
  cienciaTrabalhadorEm: data("ciencia_trabalhador_em"),
});

export const anotacoes = pgTable("anotacoes", {
  id: id(),
  matriculaId: text("matricula_id").notNull().references(() => matriculas.id, { onDelete: "cascade" }),
  aulaId: text("aula_id").notNull().references(() => aulas.id, { onDelete: "cascade" }),
  texto: text("texto").notNull(),
  segundoVideo: integer("segundo_video"),
  criadaEm: agora("criada_em"),
}, (t) => [index("anotacao_mat_aula").on(t.matriculaId, t.aulaId)]);

// ---------------------------------------------------------------- Documentos e liberação

export const documentos = pgTable("documentos", {
  id: id(),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  tipo: tipoDocumentoEnum("tipo").notNull(),
  descricao: text("descricao").notNull(),
  arquivoPath: text("arquivo_path"),
  arquivoNome: text("arquivo_nome"),
  emitidoEm: data("emitido_em"),
  validoAte: data("valido_ate"),
  aptidoes: text("aptidoes"),
  emitente: text("emitente"),
  status: statusDocumentoEnum("status").default("PENDENTE_CONFERENCIA").notNull(),
  conferidoPorId: text("conferido_por_id").references(() => usuarios.id),
  conferidoEm: data("conferido_em"),
  observacao: text("observacao"),
  enviadoEm: agora("enviado_em"),
});

export const autorizacoes = pgTable("autorizacoes", {
  id: id(),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  atividade: text("atividade").notNull(),
  concedidaPorId: text("concedida_por_id").notNull().references(() => usuarios.id),
  concedidaEm: agora("concedida_em"),
  validoAte: data("valido_ate"),
  revogadaEm: data("revogada_em"),
  observacao: text("observacao"),
});

export const liberacoes = pgTable("liberacoes", {
  id: id(),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  obraId: text("obra_id").notNull().references(() => obras.id),
  aprovadaPorId: text("aprovada_por_id").notNull().references(() => usuarios.id),
  aprovadaEm: agora("aprovada_em"),
  semaforo: semaforoEnum("semaforo").notNull(),
  observacao: text("observacao"),
  revogadaEm: data("revogada_em"),
  motivoRevogacao: text("motivo_revogacao"),
});

// ---------------------------------------------------------------- Auditoria

export const auditoria = pgTable("auditoria", {
  id: id(),
  quando: agora("quando"),
  usuarioId: text("usuario_id"),
  usuarioNome: text("usuario_nome"),
  acao: text("acao").notNull(),
  entidade: text("entidade").notNull(),
  entidadeId: text("entidade_id"),
  detalhes: jsonb("detalhes"),
}, (t) => [index("auditoria_quando").on(t.quando)]);

// ---------------------------------------------------------------- Relações (API de consulta)

export const usuariosRel = relations(usuarios, ({ one }) => ({
  colaborador: one(colaboradores, { fields: [usuarios.colaboradorId], references: [colaboradores.id] }),
}));
export const obrasRel = relations(obras, ({ one, many }) => ({
  contratante: one(contratantes, { fields: [obras.contratanteId], references: [contratantes.id] }),
  gestor: one(usuarios, { fields: [obras.gestorId], references: [usuarios.id] }),
  colaboradores: many(colaboradores),
}));
export const contratantesRel = relations(contratantes, ({ many }) => ({ obras: many(obras) }));
export const funcoesRel = relations(funcoes, ({ many }) => ({ matriz: many(matrizFuncao), colaboradores: many(colaboradores) }));
export const empresasRel = relations(empresas, ({ many }) => ({ colaboradores: many(colaboradores) }));
export const colaboradoresRel = relations(colaboradores, ({ one, many }) => ({
  empresa: one(empresas, { fields: [colaboradores.empresaId], references: [empresas.id] }),
  funcao: one(funcoes, { fields: [colaboradores.funcaoId], references: [funcoes.id] }),
  obra: one(obras, { fields: [colaboradores.obraId], references: [obras.id] }),
  matriculas: many(matriculas),
  documentos: many(documentos),
  autorizacoes: many(autorizacoes),
  liberacoes: many(liberacoes),
}));
export const convitesRel = relations(convites, ({ one }) => ({
  obra: one(obras, { fields: [convites.obraId], references: [obras.id] }),
  funcao: one(funcoes, { fields: [convites.funcaoId], references: [funcoes.id] }),
  empresa: one(empresas, { fields: [convites.empresaId], references: [empresas.id] }),
}));
export const cursosRel = relations(cursos, ({ one, many }) => ({
  capitulos: many(capitulos),
  questoes: many(questoes),
  matriz: many(matrizFuncao),
  responsavelTecnico: one(usuarios, { fields: [cursos.responsavelTecnicoId], references: [usuarios.id] }),
}));
export const capitulosRel = relations(capitulos, ({ one, many }) => ({
  curso: one(cursos, { fields: [capitulos.cursoId], references: [cursos.id] }),
  aulas: many(aulas),
}));
export const aulasRel = relations(aulas, ({ one }) => ({
  capitulo: one(capitulos, { fields: [aulas.capituloId], references: [capitulos.id] }),
}));
export const questoesRel = relations(questoes, ({ one }) => ({
  curso: one(cursos, { fields: [questoes.cursoId], references: [cursos.id] }),
}));
export const matrizRel = relations(matrizFuncao, ({ one }) => ({
  funcao: one(funcoes, { fields: [matrizFuncao.funcaoId], references: [funcoes.id] }),
  curso: one(cursos, { fields: [matrizFuncao.cursoId], references: [cursos.id] }),
  obra: one(obras, { fields: [matrizFuncao.obraId], references: [obras.id] }),
}));
export const matriculasRel = relations(matriculas, ({ one, many }) => ({
  colaborador: one(colaboradores, { fields: [matriculas.colaboradorId], references: [colaboradores.id] }),
  curso: one(cursos, { fields: [matriculas.cursoId], references: [cursos.id] }),
  progresso: many(progressoAulas),
  tentativas: many(tentativas),
  praticas: many(registrosPraticos),
  certificados: many(certificados),
}));
export const progressoRel = relations(progressoAulas, ({ one }) => ({
  matricula: one(matriculas, { fields: [progressoAulas.matriculaId], references: [matriculas.id] }),
  aula: one(aulas, { fields: [progressoAulas.aulaId], references: [aulas.id] }),
}));
export const tentativasRel = relations(tentativas, ({ one }) => ({
  matricula: one(matriculas, { fields: [tentativas.matriculaId], references: [matriculas.id] }),
}));
export const praticasRel = relations(registrosPraticos, ({ one }) => ({
  matricula: one(matriculas, { fields: [registrosPraticos.matriculaId], references: [matriculas.id] }),
  instrutor: one(usuarios, { fields: [registrosPraticos.instrutorId], references: [usuarios.id] }),
}));
export const certificadosRel = relations(certificados, ({ one }) => ({
  matricula: one(matriculas, { fields: [certificados.matriculaId], references: [matriculas.id] }),
  aprovadoPor: one(usuarios, { fields: [certificados.aprovadoPorId], references: [usuarios.id] }),
}));
export const documentosRel = relations(documentos, ({ one }) => ({
  colaborador: one(colaboradores, { fields: [documentos.colaboradorId], references: [colaboradores.id] }),
  conferidoPor: one(usuarios, { fields: [documentos.conferidoPorId], references: [usuarios.id] }),
}));
export const autorizacoesRel = relations(autorizacoes, ({ one }) => ({
  colaborador: one(colaboradores, { fields: [autorizacoes.colaboradorId], references: [colaboradores.id] }),
  concedidaPor: one(usuarios, { fields: [autorizacoes.concedidaPorId], references: [usuarios.id] }),
}));
export const liberacoesRel = relations(liberacoes, ({ one }) => ({
  colaborador: one(colaboradores, { fields: [liberacoes.colaboradorId], references: [colaboradores.id] }),
  obra: one(obras, { fields: [liberacoes.obraId], references: [obras.id] }),
  aprovadaPor: one(usuarios, { fields: [liberacoes.aprovadaPorId], references: [usuarios.id] }),
}));
