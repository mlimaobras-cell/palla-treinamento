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
  "ASO", "FICHA_EPI", "DOCUMENTO_CONTRATANTE", "CERTIFICADO_EXTERNO", "OUTRO", "ADMISSIONAL",
]);
export const statusDocumentoEnum = pgEnum("status_documento", ["PENDENTE_CONFERENCIA", "CONFERIDO", "REJEITADO"]);
export const tipoTentativaEnum = pgEnum("tipo_tentativa", ["DIAGNOSTICA", "FINAL"]);
export const semaforoEnum = pgEnum("semaforo", ["VERDE", "AMARELO", "VERMELHO"]);
// Saúde e Segurança (PGR, PCMSO, dossiê admissional, termos)
export const tipoExameEnum = pgEnum("tipo_exame", ["ADMISSIONAL", "PERIODICO", "RETORNO_TRABALHO", "MUDANCA_RISCO", "DEMISSIONAL"]);
export const resultadoAsoEnum = pgEnum("resultado_aso", ["APTO", "INAPTO"]);
export const quemEnviaEnum = pgEnum("quem_envia", ["COLABORADOR", "EQUIPE"]);
export const statusProgramaEnum = pgEnum("status_programa", ["RASCUNHO", "EM_REVISAO", "APROVADO", "SUBSTITUIDO"]);
export const categoriaRiscoEnum = pgEnum("categoria_risco", ["FISICO", "QUIMICO", "BIOLOGICO", "ERGONOMICO", "PSICOSSOCIAL", "ACIDENTE"]);
export const tipoMedidaEnum = pgEnum("tipo_medida", ["ELIMINACAO", "SUBSTITUICAO", "ENGENHARIA", "ADMINISTRATIVA", "EPI"]);
export const statusAcaoEnum = pgEnum("status_acao", ["PLANEJADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]);

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
  dataAdmissao: data("data_admissao"),
  // contrato de experiência: dias do 1º período e da prorrogação (CLT art. 445, parágrafo único: total até 90 dias; art. 451: uma prorrogação)
  experienciaDias: integer("experiencia_dias"),
  experienciaProrrogacaoDias: integer("experiencia_prorrogacao_dias"),
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

/** Links de nova senha gerados pela equipe (sem e-mail automático): guarda só o hash do token, vale 48 h e uma vez. */
export const redefinicoesSenha = pgTable("redefinicoes_senha", {
  id: id(),
  tokenHash: text("token_hash").notNull().unique(),
  usuarioId: text("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  expiraEm: data("expira_em").notNull(),
  usadoEm: data("usado_em"),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

/** Aparelhos da equipe inscritos para receber notificações (Web Push): ex.: aviso quando um colaborador entra na plataforma. */
export const inscricoesPush = pgTable("inscricoes_push", {
  id: id(),
  usuarioId: text("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  aparelho: text("aparelho"),
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
  duracaoSeg: integer("duracao_seg"), // duração real do vídeo; quando existe, o tempo mínimo é calculado sobre ela
  videoUrl: text("video_url"),
  posterUrl: text("poster_url"),
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
  posicaoMaxSeg: integer("posicao_max_seg").default(0).notNull(), // ponto mais avançado do vídeo já assistido
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
  // dossiê admissional: qual item da lista este arquivo atende
  itemAdmissionalId: text("item_admissional_id"),
  // ASO: tipo de exame, conclusão e PCMSO de referência (dados digitados a partir do ASO emitido pelo médico)
  asoTipoExame: tipoExameEnum("aso_tipo_exame"),
  asoResultado: resultadoAsoEnum("aso_resultado"),
  pcmsoId: text("pcmso_id"),
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


// ---------------------------------------------------------------- Saúde e Segurança: dossiê admissional e termos

/** Lista configurável de documentos de admissão (o que o RH pede). `base` informa se é exigência legal ou critério interno. */
export const itensAdmissionais = pgTable("itens_admissionais", {
  id: id(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  orientacao: text("orientacao"),
  base: text("base").notNull(),
  origem: origemEnum("origem").notNull(),
  obrigatorio: boolean("obrigatorio").default(true).notNull(),
  quemEnvia: quemEnviaEnum("quem_envia").default("COLABORADOR").notNull(),
  exigeValidade: boolean("exige_validade").default(false).notNull(),
  // dado pessoal sensível (LGPD art. 5º, II): só RH/ADMIN abre o arquivo
  sensivel: boolean("sensivel").default(false).notNull(),
  funcoesCodigos: jsonb("funcoes_codigos").$type<string[] | null>(),
  ordem: integer("ordem").default(0).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
});

/** Modelos de termo que o colaborador assina na plataforma (ciência de riscos, recebimento de EPI, regulamento, LGPD…). */
export const modelosTermo = pgTable("modelos_termo", {
  id: id(),
  codigo: text("codigo").notNull(),
  versao: integer("versao").default(1).notNull(),
  titulo: text("titulo").notNull(),
  // texto com marcadores: {{nome}}, {{cpf}}, {{funcao}}, {{obra}}, {{empresa}}, {{data}}, {{riscos}}, {{epis}}
  texto: text("texto").notNull(),
  base: text("base").notNull(),
  origem: origemEnum("origem").notNull(),
  naAdmissao: boolean("na_admissao").default(true).notNull(),
  funcoesCodigos: jsonb("funcoes_codigos").$type<string[] | null>(),
  status: statusConteudoEnum("status").default("EM_REVISAO").notNull(),
  aprovadoPorId: text("aprovado_por_id").references(() => usuarios.id),
  aprovadoEm: data("aprovado_em"),
  ativo: boolean("ativo").default(true).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  criadoEm: agora("criado_em"),
}, (t) => [unique("modelo_termo_versao").on(t.codigo, t.versao)]);

/** Assinatura eletrônica do colaborador: texto congelado, hash, data/hora, IP e aparelho. Não é assinatura ICP-Brasil. */
export const assinaturasTermo = pgTable("assinaturas_termo", {
  id: id(),
  modeloId: text("modelo_id").notNull().references(() => modelosTermo.id),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  textoFinal: text("texto_final").notNull(),
  hashSha256: text("hash_sha256").notNull(),
  codigo: text("codigo").notNull().unique(),
  metodo: text("metodo").notNull(), // SENHA_PLATAFORMA | PRESENCIAL_EQUIPE
  nomeDigitado: text("nome_digitado").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  assinadoEm: agora("assinado_em"),
  testemunhaId: text("testemunha_id").references(() => usuarios.id),
  invalidadoEm: data("invalidado_em"),
  motivoInvalidacao: text("motivo_invalidacao"),
}, (t) => [index("assinatura_colab").on(t.colaboradorId)]);

/** Prazos avulsos (além dos calculados: ASO, certificados, PGR, PCMSO, experiência). */
export const prazos = pgTable("prazos", {
  id: id(),
  titulo: text("titulo").notNull(),
  venceEm: data("vence_em").notNull(),
  colaboradorId: text("colaborador_id").references(() => colaboradores.id, { onDelete: "cascade" }),
  obraId: text("obra_id").references(() => obras.id, { onDelete: "cascade" }),
  avisarDiasAntes: integer("avisar_dias_antes").default(30).notNull(),
  observacao: text("observacao"),
  concluidoEm: data("concluido_em"),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});


// ---------------------------------------------------------------- Saúde e Segurança: parceiros e signatários

/** Empresas parceiras (consultoria de segurança, clínica de medicina do trabalho…) com logotipo para os documentos. */
export const parceiros = pgTable("parceiros", {
  id: id(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj"),
  tipo: text("tipo").notNull(), // SEGURANCA | CLINICA | OUTRA
  logoPath: text("logo_path"),
  logoTipo: text("logo_tipo"),
  contato: text("contato"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: agora("criado_em"),
});

/** Quem assina os documentos (profissional habilitado do PGR, médico do PCMSO, responsável pela organização). Dados preenchidos pela equipe. */
export const signatarios = pgTable("signatarios", {
  id: id(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(), // PROFISSIONAL_SST | MEDICO_TRABALHO | RESPONSAVEL_ORGANIZACAO
  qualificacao: text("qualificacao").notNull(),
  conselho: text("conselho"), // CREA, CRM, registro MTE…
  registro: text("registro").notNull(),
  uf: text("uf"),
  cargo: text("cargo"),
  parceiroId: text("parceiro_id").references(() => parceiros.id),
  email: text("email"),
  telefone: text("telefone"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: agora("criado_em"),
});

// ---------------------------------------------------------------- Saúde e Segurança: PGR

/** Critério de risco documentado pela organização (NR-1, 1.5.4.4.2). Guardado em JSON, com versão. */
export type CriterioRisco = {
  severidade: { valor: number; rotulo: string; descricao: string }[];
  probabilidade: { valor: number; rotulo: string; descricao: string }[];
  niveis: { ate: number; nivel: string; cor: string; decisao: string }[]; // nível pelo produto S×P
};

/** Biblioteca Palla de ambientes/atividades com perigos típicos. Ponto de partida, sempre revisado pelo profissional habilitado. */
export const ambientesBiblioteca = pgTable("ambientes_biblioteca", {
  id: id(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  descricao: text("descricao").notNull(),
  atividades: text("atividades").notNull(),
  ordem: integer("ordem").default(0).notNull(),
  statusRevisao: statusConteudoEnum("status_revisao").default("EM_REVISAO").notNull(),
});

export const perigosBiblioteca = pgTable("perigos_biblioteca", {
  id: id(),
  ambienteId: text("ambiente_id").notNull().references(() => ambientesBiblioteca.id, { onDelete: "cascade" }),
  categoria: categoriaRiscoEnum("categoria").notNull(),
  perigo: text("perigo").notNull(),
  fonte: text("fonte").notNull(),
  lesoes: text("lesoes").notNull(),
  medidas: text("medidas").notNull(),
  severidade: integer("severidade").notNull(),
  probabilidade: integer("probabilidade").notNull(),
  // sugestões para o médico do PCMSO avaliar — nunca exigência automática
  examesSugeridos: text("exames_sugeridos"),
  cursosRelacionados: text("cursos_relacionados"),
  referencia: text("referencia"),
  ordem: integer("ordem").default(0).notNull(),
});

/** Documento-base do PGR. obraId nulo = PGR da empresa (sede/fábrica). Cada revisão é uma nova versão; nada é apagado (NR-1, 1.5.7.3.3.1: 20 anos). */
export const pgrs = pgTable("pgrs", {
  id: id(),
  obraId: text("obra_id").references(() => obras.id),
  titulo: text("titulo").notNull(),
  estabelecimento: text("estabelecimento").notNull(),
  versao: integer("versao").default(1).notNull(),
  anteriorId: text("anterior_id"),
  status: statusProgramaEnum("status").default("RASCUNHO").notNull(),
  motivoRevisao: text("motivo_revisao"),
  descricaoProcessos: text("descricao_processos"),
  criterio: jsonb("criterio").$type<CriterioRisco>().notNull(),
  elaboradorNome: text("elaborador_nome"),
  elaboradorQualificacao: text("elaborador_qualificacao"),
  elaboradorRegistro: text("elaborador_registro"),
  responsavelOrganizacao: text("responsavel_organizacao"),
  // cadastro de quem assina e do parceiro (logo); os campos de texto acima guardam o retrato do momento da assinatura
  elaboradorId: text("elaborador_id"),
  responsavelOrgId: text("responsavel_org_id"),
  parceiroId: text("parceiro_id"),
  vigenciaInicio: data("vigencia_inicio"),
  proximaRevisao: data("proxima_revisao"),
  arquivoAssinadoPath: text("arquivo_assinado_path"),
  arquivoAssinadoHash: text("arquivo_assinado_hash"),
  aprovadoPorId: text("aprovado_por_id").references(() => usuarios.id),
  aprovadoEm: data("aprovado_em"),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

/** Grupo homogêneo de exposição (GHE): reúne funções expostas aos mesmos riscos. */
export const ghes = pgTable("ghes", {
  id: id(),
  pgrId: text("pgr_id").notNull().references(() => pgrs.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  nome: text("nome").notNull(),
  descricaoAtividades: text("descricao_atividades").notNull(),
  ambientes: text("ambientes"),
  funcoesIds: jsonb("funcoes_ids").$type<string[]>().default([]).notNull(),
  // relação de EPIs do GHE (NR-18, 18.4.3, e) — usada na ordem de serviço
  epis: text("epis"),
  trabalhadores: integer("trabalhadores"),
  ordem: integer("ordem").default(0).notNull(),
});

export const riscosInventario = pgTable("riscos_inventario", {
  id: id(),
  pgrId: text("pgr_id").notNull().references(() => pgrs.id, { onDelete: "cascade" }),
  gheId: text("ghe_id").notNull().references(() => ghes.id, { onDelete: "cascade" }),
  categoria: categoriaRiscoEnum("categoria").notNull(),
  perigo: text("perigo").notNull(),
  fonte: text("fonte").notNull(),
  lesoes: text("lesoes").notNull(),
  medidasExistentes: text("medidas_existentes").notNull(),
  exposicao: text("exposicao"),
  monitoramento: text("monitoramento"),
  severidade: integer("severidade").notNull(),
  probabilidade: integer("probabilidade").notNull(),
  examesSugeridos: text("exames_sugeridos"),
  origemPerigoId: text("origem_perigo_id"),
  ordem: integer("ordem").default(0).notNull(),
});

export const acoesPlano = pgTable("acoes_plano", {
  id: id(),
  pgrId: text("pgr_id").notNull().references(() => pgrs.id, { onDelete: "cascade" }),
  riscoId: text("risco_id").references(() => riscosInventario.id, { onDelete: "set null" }),
  medida: text("medida").notNull(),
  tipo: tipoMedidaEnum("tipo").notNull(),
  responsavel: text("responsavel").notNull(),
  prazo: data("prazo"),
  acompanhamento: text("acompanhamento"),
  status: statusAcaoEnum("status").default("PLANEJADA").notNull(),
  concluidaEm: data("concluida_em"),
  evidencia: text("evidencia"),
});

// ---------------------------------------------------------------- Saúde e Segurança: PCMSO

/** PCMSO elaborado pelo médico do trabalho (NR-7). A plataforma registra o documento recebido e os exames que ele define; não elabora o programa. */
export const pcmsos = pgTable("pcmsos", {
  id: id(),
  pgrId: text("pgr_id").references(() => pgrs.id),
  obraId: text("obra_id").references(() => obras.id),
  titulo: text("titulo").notNull(),
  versao: integer("versao").default(1).notNull(),
  status: statusProgramaEnum("status").default("RASCUNHO").notNull(),
  medicoNome: text("medico_nome").notNull(),
  medicoCrm: text("medico_crm").notNull(),
  clinica: text("clinica"),
  medicoId: text("medico_id"),
  parceiroId: text("parceiro_id"),
  vigenciaInicio: data("vigencia_inicio"),
  proximoRelatorioAnual: data("proximo_relatorio_anual"),
  arquivoPath: text("arquivo_path"),
  arquivoHash: text("arquivo_hash"),
  observacao: text("observacao"),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

/** Exames por GHE conforme o PCMSO (transcritos do documento assinado pelo médico). */
export const examesPcmso = pgTable("exames_pcmso", {
  id: id(),
  pcmsoId: text("pcmso_id").notNull().references(() => pcmsos.id, { onDelete: "cascade" }),
  gheId: text("ghe_id").references(() => ghes.id, { onDelete: "set null" }),
  funcaoId: text("funcao_id").references(() => funcoes.id),
  exame: text("exame").notNull(),
  momentos: jsonb("momentos").$type<string[]>().notNull(), // valores de tipo_exame
  periodicidadeMeses: integer("periodicidade_meses"),
  observacao: text("observacao"),
});


// ---------------------------------------------------------------- Saúde e Segurança: fatores psicossociais (NR-1, 1.5.3.1.4)

/** Canal de relato confidencial. Relato anônimo não guarda quem enviou (nem IP); o acompanhamento é pelo protocolo. Só RH/ADMIN leem. */
export const relatos = pgTable("relatos", {
  id: id(),
  protocolo: text("protocolo").notNull().unique(),
  obraId: text("obra_id").references(() => obras.id),
  categoria: text("categoria").notNull(),
  descricao: text("descricao").notNull(),
  anonimo: boolean("anonimo").default(true).notNull(),
  colaboradorId: text("colaborador_id").references(() => colaboradores.id, { onDelete: "set null" }),
  status: text("status").default("RECEBIDO").notNull(), // RECEBIDO | EM_APURACAO | CONCLUIDO | ARQUIVADO
  prazoApuracao: data("prazo_apuracao").notNull(),
  resposta: text("resposta"), // devolutiva visível a quem tem o protocolo
  medidas: text("medidas"),   // registro interno das medidas (não aparece para o relator)
  tratadoPorId: text("tratado_por_id").references(() => usuarios.id),
  concluidoEm: data("concluido_em"),
  criadoEm: agora("criado_em"),
});

/** Escuta por equipe (roda de conversa) ou pesquisa anônima: só resultados agregados, sem nomes. */
export const escutas = pgTable("escutas", {
  id: id(),
  obraId: text("obra_id").references(() => obras.id),
  gheId: text("ghe_id"),
  tipo: text("tipo").notNull(), // RODA | PESQUISA
  data: data("data").notNull(),
  participantes: integer("participantes").notNull(),
  conduzidoPor: text("conduzido_por").notNull(),
  temas: text("temas").notNull(),
  encaminhamentos: text("encaminhamentos"),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

/** DDS (diálogo diário de segurança) com confirmação de presença pelo colaborador no celular. */
export const dds = pgTable("dds", {
  id: id(),
  obraId: text("obra_id").notNull().references(() => obras.id),
  data: data("data").notNull(),
  tema: text("tema").notNull(),
  psicossocial: boolean("psicossocial").default(false).notNull(),
  conteudo: text("conteudo"),
  conduzidoPor: text("conduzido_por").notNull(),
  criadoPorId: text("criado_por_id").references(() => usuarios.id),
  criadoEm: agora("criado_em"),
});

export const presencasDds = pgTable("presencas_dds", {
  id: id(),
  ddsId: text("dds_id").notNull().references(() => dds.id, { onDelete: "cascade" }),
  colaboradorId: text("colaborador_id").notNull().references(() => colaboradores.id, { onDelete: "cascade" }),
  confirmadoEm: agora("confirmado_em"),
  metodo: text("metodo").notNull(), // CELULAR | EQUIPE
  registradoPorId: text("registrado_por_id").references(() => usuarios.id),
}, (t) => [uniqueIndex("presenca_unica").on(t.ddsId, t.colaboradorId)]);

/** Indicadores mensais agregados por obra, informados pelo RH/SST (sem dados individuais). */
export const indicadoresMensais = pgTable("indicadores_mensais", {
  id: id(),
  obraId: text("obra_id").notNull().references(() => obras.id),
  mes: text("mes").notNull(), // AAAA-MM
  efetivo: integer("efetivo"),
  horasExtrasMedia: real("horas_extras_media"),
  faltas: integer("faltas"),
  afastamentos: integer("afastamentos"),
  desligamentos: integer("desligamentos"),
  quaseAcidentes: integer("quase_acidentes"),
  observacao: text("observacao"),
  registradoPorId: text("registrado_por_id").references(() => usuarios.id),
  atualizadoEm: agora("atualizado_em"),
}, (t) => [uniqueIndex("indicador_obra_mes").on(t.obraId, t.mes)]);

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
  assinaturas: many(assinaturasTermo),
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
  itemAdmissional: one(itensAdmissionais, { fields: [documentos.itemAdmissionalId], references: [itensAdmissionais.id] }),
  pcmso: one(pcmsos, { fields: [documentos.pcmsoId], references: [pcmsos.id] }),
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

export const itensAdmissionaisRel = relations(itensAdmissionais, ({ many }) => ({ documentos: many(documentos) }));
export const modelosTermoRel = relations(modelosTermo, ({ many }) => ({ assinaturas: many(assinaturasTermo) }));
export const assinaturasTermoRel = relations(assinaturasTermo, ({ one }) => ({
  modelo: one(modelosTermo, { fields: [assinaturasTermo.modeloId], references: [modelosTermo.id] }),
  colaborador: one(colaboradores, { fields: [assinaturasTermo.colaboradorId], references: [colaboradores.id] }),
}));
export const prazosRel = relations(prazos, ({ one }) => ({
  colaborador: one(colaboradores, { fields: [prazos.colaboradorId], references: [colaboradores.id] }),
  obra: one(obras, { fields: [prazos.obraId], references: [obras.id] }),
}));
export const ambientesRel = relations(ambientesBiblioteca, ({ many }) => ({ perigos: many(perigosBiblioteca) }));
export const perigosRel = relations(perigosBiblioteca, ({ one }) => ({
  ambiente: one(ambientesBiblioteca, { fields: [perigosBiblioteca.ambienteId], references: [ambientesBiblioteca.id] }),
}));
export const pgrsRel = relations(pgrs, ({ one, many }) => ({
  obra: one(obras, { fields: [pgrs.obraId], references: [obras.id] }),
  ghes: many(ghes),
  riscos: many(riscosInventario),
  acoes: many(acoesPlano),
  aprovadoPor: one(usuarios, { fields: [pgrs.aprovadoPorId], references: [usuarios.id] }),
  parceiro: one(parceiros, { fields: [pgrs.parceiroId], references: [parceiros.id] }),
}));
export const ghesRel = relations(ghes, ({ one, many }) => ({
  pgr: one(pgrs, { fields: [ghes.pgrId], references: [pgrs.id] }),
  riscos: many(riscosInventario),
}));
export const riscosRel = relations(riscosInventario, ({ one, many }) => ({
  pgr: one(pgrs, { fields: [riscosInventario.pgrId], references: [pgrs.id] }),
  ghe: one(ghes, { fields: [riscosInventario.gheId], references: [ghes.id] }),
  acoes: many(acoesPlano),
}));
export const acoesPlanoRel = relations(acoesPlano, ({ one }) => ({
  pgr: one(pgrs, { fields: [acoesPlano.pgrId], references: [pgrs.id] }),
  risco: one(riscosInventario, { fields: [acoesPlano.riscoId], references: [riscosInventario.id] }),
}));
export const pcmsosRel = relations(pcmsos, ({ one, many }) => ({
  pgr: one(pgrs, { fields: [pcmsos.pgrId], references: [pgrs.id] }),
  obra: one(obras, { fields: [pcmsos.obraId], references: [obras.id] }),
  parceiro: one(parceiros, { fields: [pcmsos.parceiroId], references: [parceiros.id] }),
  exames: many(examesPcmso),
}));
export const examesPcmsoRel = relations(examesPcmso, ({ one }) => ({
  pcmso: one(pcmsos, { fields: [examesPcmso.pcmsoId], references: [pcmsos.id] }),
  ghe: one(ghes, { fields: [examesPcmso.gheId], references: [ghes.id] }),
  funcao: one(funcoes, { fields: [examesPcmso.funcaoId], references: [funcoes.id] }),
}));
export const parceirosRel = relations(parceiros, ({ many }) => ({ signatarios: many(signatarios) }));
export const signatariosRel = relations(signatarios, ({ one }) => ({
  parceiro: one(parceiros, { fields: [signatarios.parceiroId], references: [parceiros.id] }),
}));
export const relatosRel = relations(relatos, ({ one }) => ({ obra: one(obras, { fields: [relatos.obraId], references: [obras.id] }) }));
export const escutasRel = relations(escutas, ({ one }) => ({ obra: one(obras, { fields: [escutas.obraId], references: [obras.id] }) }));
export const ddsRel = relations(dds, ({ one, many }) => ({ obra: one(obras, { fields: [dds.obraId], references: [obras.id] }), presencas: many(presencasDds) }));
export const presencasDdsRel = relations(presencasDds, ({ one }) => ({
  dds: one(dds, { fields: [presencasDds.ddsId], references: [dds.id] }),
  colaborador: one(colaboradores, { fields: [presencasDds.colaboradorId], references: [colaboradores.id] }),
}));
export const indicadoresMensaisRel = relations(indicadoresMensais, ({ one }) => ({ obra: one(obras, { fields: [indicadoresMensais.obraId], references: [obras.id] }) }));
