CREATE TYPE "public"."abrangencia_pratica" AS ENUM('PRATICA', 'TEORIA_E_PRATICA');--> statement-breakpoint
CREATE TYPE "public"."classificacao" AS ENUM('OBRIGATORIO', 'INTERNO', 'RECOMENDADO', 'CONDICIONAL');--> statement-breakpoint
CREATE TYPE "public"."modalidade" AS ENUM('EAD', 'SEMIPRESENCIAL', 'PRESENCIAL');--> statement-breakpoint
CREATE TYPE "public"."origem_parametro" AS ENUM('LEGAL', 'EMPREGADOR', 'A_VALIDAR');--> statement-breakpoint
CREATE TYPE "public"."perfil" AS ENUM('ADMIN', 'RH', 'SST', 'INSTRUTOR', 'RESPONSAVEL_TECNICO', 'GESTOR_OBRA', 'COLABORADOR');--> statement-breakpoint
CREATE TYPE "public"."resultado_pratica" AS ENUM('APTO', 'NAO_APTO');--> statement-breakpoint
CREATE TYPE "public"."semaforo" AS ENUM('VERDE', 'AMARELO', 'VERMELHO');--> statement-breakpoint
CREATE TYPE "public"."status_certificado" AS ENUM('VALIDO', 'CANCELADO', 'SUBSTITUIDO');--> statement-breakpoint
CREATE TYPE "public"."status_conteudo" AS ENUM('RASCUNHO', 'EM_REVISAO', 'APROVADO');--> statement-breakpoint
CREATE TYPE "public"."status_documento" AS ENUM('PENDENTE_CONFERENCIA', 'CONFERIDO', 'REJEITADO');--> statement-breakpoint
CREATE TYPE "public"."status_matricula" AS ENUM('MATRICULADO', 'EM_ANDAMENTO', 'TEORIA_CONCLUIDA', 'PENDENTE_PRATICA', 'AGUARDANDO_APROVACAO', 'CAPACITADO', 'REPROVADO', 'VENCIDO', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."tipo_certificado" AS ENUM('INTEGRAL', 'COMPROVANTE_ETAPA');--> statement-breakpoint
CREATE TYPE "public"."tipo_curso" AS ENUM('LEGAL', 'INTERNO', 'INTERNO_COMPLEMENTAR');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento" AS ENUM('ASO', 'FICHA_EPI', 'DOCUMENTO_CONTRATANTE', 'CERTIFICADO_EXTERNO', 'OUTRO');--> statement-breakpoint
CREATE TYPE "public"."tipo_questao" AS ENUM('MULTIPLA_ESCOLHA', 'SITUACIONAL');--> statement-breakpoint
CREATE TABLE "auditoria" (
	"id" text PRIMARY KEY NOT NULL,
	"quando" timestamp with time zone DEFAULT now() NOT NULL,
	"usuario_id" text,
	"usuario_nome" text,
	"acao" text NOT NULL,
	"entidade" text NOT NULL,
	"entidade_id" text,
	"detalhes" jsonb
);
--> statement-breakpoint
CREATE TABLE "aulas" (
	"id" text PRIMARY KEY NOT NULL,
	"capitulo_id" text NOT NULL,
	"ordem" integer NOT NULL,
	"titulo" text NOT NULL,
	"duracao_min" integer NOT NULL,
	"video_url" text,
	"roteiro" text NOT NULL,
	"narracao" text NOT NULL,
	"texto_apoio" text NOT NULL,
	"exemplo" text,
	"pergunta_fixacao" text,
	"resumo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "autorizacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"colaborador_id" text NOT NULL,
	"atividade" text NOT NULL,
	"concedida_por_id" text NOT NULL,
	"concedida_em" timestamp with time zone DEFAULT now() NOT NULL,
	"valido_ate" timestamp with time zone,
	"revogada_em" timestamp with time zone,
	"observacao" text
);
--> statement-breakpoint
CREATE TABLE "capitulos" (
	"id" text PRIMARY KEY NOT NULL,
	"curso_id" text NOT NULL,
	"ordem" integer NOT NULL,
	"titulo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificados" (
	"id" text PRIMARY KEY NOT NULL,
	"numero" text NOT NULL,
	"codigo_verificacao" text NOT NULL,
	"matricula_id" text NOT NULL,
	"tipo" "tipo_certificado" NOT NULL,
	"status" "status_certificado" DEFAULT 'VALIDO' NOT NULL,
	"emitido_em" timestamp with time zone DEFAULT now() NOT NULL,
	"data_inicio" timestamp with time zone NOT NULL,
	"data_conclusao" timestamp with time zone NOT NULL,
	"valido_ate" timestamp with time zone,
	"local" text NOT NULL,
	"aprovado_por_id" text,
	"aprovado_em" timestamp with time zone,
	"dados_snapshot" jsonb NOT NULL,
	"hash_sha256" text NOT NULL,
	"substitui_id" text,
	"motivo_status" text,
	"alterado_em" timestamp with time zone,
	CONSTRAINT "certificados_numero_unique" UNIQUE("numero"),
	CONSTRAINT "certificados_codigo_verificacao_unique" UNIQUE("codigo_verificacao")
);
--> statement-breakpoint
CREATE TABLE "colaboradores" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cpf_cifrado" text NOT NULL,
	"cpf_hash" text NOT NULL,
	"cpf_final" text NOT NULL,
	"data_nascimento" timestamp with time zone,
	"telefone" text,
	"email" text,
	"empresa_id" text NOT NULL,
	"funcao_id" text NOT NULL,
	"obra_id" text,
	"consentimento_lgpd_em" timestamp with time zone,
	"versao_aviso_privacidade" text,
	"afastado_desde" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"dado_ficticio" boolean DEFAULT false NOT NULL,
	CONSTRAINT "colaboradores_cpf_hash_unique" UNIQUE("cpf_hash")
);
--> statement-breakpoint
CREATE TABLE "contratantes" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "convites" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"obra_id" text NOT NULL,
	"funcao_id" text NOT NULL,
	"empresa_id" text NOT NULL,
	"nome_sugerido" text,
	"expira_em" timestamp with time zone NOT NULL,
	"usado_em" timestamp with time zone,
	"criado_por_id" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "convites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "cursos" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"titulo" text NOT NULL,
	"tipo" "tipo_curso" NOT NULL,
	"norma_referencia" text NOT NULL,
	"norma_versao" text NOT NULL,
	"objetivo" text NOT NULL,
	"publico_alvo" text NOT NULL,
	"pre_requisitos" text,
	"conteudo_programatico" text NOT NULL,
	"carga_horaria" real,
	"carga_origem" "origem_parametro" NOT NULL,
	"validade_meses" integer,
	"validade_origem" "origem_parametro" NOT NULL,
	"validade_observacao" text,
	"modalidade" "modalidade" NOT NULL,
	"exige_pratica" boolean DEFAULT false NOT NULL,
	"pratica_descricao" text,
	"exige_autorizacao" text,
	"exige_aptidao_aso" text,
	"requisitos_instrutor" text,
	"nota_minima" integer DEFAULT 70 NOT NULL,
	"max_tentativas" integer DEFAULT 3 NOT NULL,
	"tempo_minimo_aula_pct" integer DEFAULT 80 NOT NULL,
	"observacao_legal" text,
	"status_conteudo" "status_conteudo" DEFAULT 'RASCUNHO' NOT NULL,
	"projeto_pedagogico_valido_ate" timestamp with time zone,
	"ativo" boolean DEFAULT true NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"responsavel_tecnico_id" text,
	CONSTRAINT "cursos_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "documentos" (
	"id" text PRIMARY KEY NOT NULL,
	"colaborador_id" text NOT NULL,
	"tipo" "tipo_documento" NOT NULL,
	"descricao" text NOT NULL,
	"arquivo_path" text,
	"arquivo_nome" text,
	"emitido_em" timestamp with time zone,
	"valido_ate" timestamp with time zone,
	"aptidoes" text,
	"emitente" text,
	"status" "status_documento" DEFAULT 'PENDENTE_CONFERENCIA' NOT NULL,
	"conferido_por_id" text,
	"conferido_em" timestamp with time zone,
	"observacao" text,
	"enviado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text,
	"propria" boolean DEFAULT false NOT NULL,
	CONSTRAINT "empresas_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "funcoes" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"ordem" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "funcoes_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "liberacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"colaborador_id" text NOT NULL,
	"obra_id" text NOT NULL,
	"aprovada_por_id" text NOT NULL,
	"aprovada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"semaforo" "semaforo" NOT NULL,
	"observacao" text,
	"revogada_em" timestamp with time zone,
	"motivo_revogacao" text
);
--> statement-breakpoint
CREATE TABLE "matriculas" (
	"id" text PRIMARY KEY NOT NULL,
	"colaborador_id" text NOT NULL,
	"curso_id" text NOT NULL,
	"classificacao" "classificacao" NOT NULL,
	"status" "status_matricula" DEFAULT 'MATRICULADO' NOT NULL,
	"matriculado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"iniciado_em" timestamp with time zone,
	"teoria_concluida_em" timestamp with time zone,
	"concluido_em" timestamp with time zone,
	"valido_ate" timestamp with time zone,
	"observacao" text
);
--> statement-breakpoint
CREATE TABLE "matriz_funcao" (
	"id" text PRIMARY KEY NOT NULL,
	"funcao_id" text NOT NULL,
	"curso_id" text NOT NULL,
	"obra_id" text,
	"classificacao" "classificacao" NOT NULL,
	"observacao" text,
	CONSTRAINT "matriz_unica" UNIQUE NULLS NOT DISTINCT("funcao_id","curso_id","obra_id")
);
--> statement-breakpoint
CREATE TABLE "obras" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"endereco" text,
	"contratante_id" text,
	"gestor_id" text,
	"exigencias_extras" text,
	"texto_integracao" text,
	"ativa" boolean DEFAULT true NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "obras_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "progresso_aulas" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"aula_id" text NOT NULL,
	"segundos" integer DEFAULT 0 NOT NULL,
	"primeiro_acesso_em" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_acesso_em" timestamp with time zone DEFAULT now() NOT NULL,
	"concluida_em" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "questoes" (
	"id" text PRIMARY KEY NOT NULL,
	"curso_id" text NOT NULL,
	"tipo" "tipo_questao" NOT NULL,
	"enunciado" text NOT NULL,
	"imagem_url" text,
	"alternativas" jsonb NOT NULL,
	"correta" text NOT NULL,
	"comentario" text NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registros_praticos" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"instrutor_id" text NOT NULL,
	"abrangencia" "abrangencia_pratica" NOT NULL,
	"data" timestamp with time zone NOT NULL,
	"local" text NOT NULL,
	"equipamento" text,
	"conteudo" text NOT NULL,
	"duracao_min" integer NOT NULL,
	"nota_avaliacao" integer,
	"resultado" "resultado_pratica" NOT NULL,
	"observacoes" text,
	"evidencias" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tentativas" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"numero" integer NOT NULL,
	"iniciada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"finalizada_em" timestamp with time zone,
	"questoes" jsonb NOT NULL,
	"respostas" jsonb,
	"nota" integer,
	"aprovado" boolean,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"perfil" "perfil" NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"qualificacao" text,
	"registro_profissional" text,
	"colaborador_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_acesso_em" timestamp with time zone,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email"),
	CONSTRAINT "usuarios_colaborador_id_unique" UNIQUE("colaborador_id")
);
--> statement-breakpoint
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_capitulo_id_capitulos_id_fk" FOREIGN KEY ("capitulo_id") REFERENCES "public"."capitulos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autorizacoes" ADD CONSTRAINT "autorizacoes_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autorizacoes" ADD CONSTRAINT "autorizacoes_concedida_por_id_usuarios_id_fk" FOREIGN KEY ("concedida_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capitulos" ADD CONSTRAINT "capitulos_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_matricula_id_matriculas_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matriculas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_aprovado_por_id_usuarios_id_fk" FOREIGN KEY ("aprovado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_funcao_id_funcoes_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites" ADD CONSTRAINT "convites_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites" ADD CONSTRAINT "convites_funcao_id_funcoes_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites" ADD CONSTRAINT "convites_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convites" ADD CONSTRAINT "convites_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_responsavel_tecnico_id_usuarios_id_fk" FOREIGN KEY ("responsavel_tecnico_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_conferido_por_id_usuarios_id_fk" FOREIGN KEY ("conferido_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liberacoes" ADD CONSTRAINT "liberacoes_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liberacoes" ADD CONSTRAINT "liberacoes_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liberacoes" ADD CONSTRAINT "liberacoes_aprovada_por_id_usuarios_id_fk" FOREIGN KEY ("aprovada_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriz_funcao" ADD CONSTRAINT "matriz_funcao_funcao_id_funcoes_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriz_funcao" ADD CONSTRAINT "matriz_funcao_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriz_funcao" ADD CONSTRAINT "matriz_funcao_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obras" ADD CONSTRAINT "obras_contratante_id_contratantes_id_fk" FOREIGN KEY ("contratante_id") REFERENCES "public"."contratantes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obras" ADD CONSTRAINT "obras_gestor_id_usuarios_id_fk" FOREIGN KEY ("gestor_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progresso_aulas" ADD CONSTRAINT "progresso_aulas_matricula_id_matriculas_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matriculas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progresso_aulas" ADD CONSTRAINT "progresso_aulas_aula_id_aulas_id_fk" FOREIGN KEY ("aula_id") REFERENCES "public"."aulas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_praticos" ADD CONSTRAINT "registros_praticos_matricula_id_matriculas_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matriculas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_praticos" ADD CONSTRAINT "registros_praticos_instrutor_id_usuarios_id_fk" FOREIGN KEY ("instrutor_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tentativas" ADD CONSTRAINT "tentativas_matricula_id_matriculas_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matriculas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auditoria_quando" ON "auditoria" USING btree ("quando");--> statement-breakpoint
CREATE INDEX "matricula_colab" ON "matriculas" USING btree ("colaborador_id");--> statement-breakpoint
CREATE UNIQUE INDEX "progresso_unico" ON "progresso_aulas" USING btree ("matricula_id","aula_id");