CREATE TYPE "public"."categoria_risco" AS ENUM('FISICO', 'QUIMICO', 'BIOLOGICO', 'ERGONOMICO', 'PSICOSSOCIAL', 'ACIDENTE');--> statement-breakpoint
CREATE TYPE "public"."quem_envia" AS ENUM('COLABORADOR', 'EQUIPE');--> statement-breakpoint
CREATE TYPE "public"."resultado_aso" AS ENUM('APTO', 'INAPTO');--> statement-breakpoint
CREATE TYPE "public"."status_acao" AS ENUM('PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."status_programa" AS ENUM('RASCUNHO', 'EM_REVISAO', 'APROVADO', 'SUBSTITUIDO');--> statement-breakpoint
CREATE TYPE "public"."tipo_exame" AS ENUM('ADMISSIONAL', 'PERIODICO', 'RETORNO_TRABALHO', 'MUDANCA_RISCO', 'DEMISSIONAL');--> statement-breakpoint
CREATE TYPE "public"."tipo_medida" AS ENUM('ELIMINACAO', 'SUBSTITUICAO', 'ENGENHARIA', 'ADMINISTRATIVA', 'EPI');--> statement-breakpoint
ALTER TYPE "public"."tipo_documento" ADD VALUE 'ADMISSIONAL';--> statement-breakpoint
CREATE TABLE "acoes_plano" (
	"id" text PRIMARY KEY NOT NULL,
	"pgr_id" text NOT NULL,
	"risco_id" text,
	"medida" text NOT NULL,
	"tipo" "tipo_medida" NOT NULL,
	"responsavel" text NOT NULL,
	"prazo" timestamp with time zone,
	"acompanhamento" text,
	"status" "status_acao" DEFAULT 'PLANEJADA' NOT NULL,
	"concluida_em" timestamp with time zone,
	"evidencia" text
);
--> statement-breakpoint
CREATE TABLE "ambientes_biblioteca" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text NOT NULL,
	"atividades" text NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"status_revisao" "status_conteudo" DEFAULT 'EM_REVISAO' NOT NULL,
	CONSTRAINT "ambientes_biblioteca_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "assinaturas_termo" (
	"id" text PRIMARY KEY NOT NULL,
	"modelo_id" text NOT NULL,
	"colaborador_id" text NOT NULL,
	"titulo" text NOT NULL,
	"texto_final" text NOT NULL,
	"hash_sha256" text NOT NULL,
	"codigo" text NOT NULL,
	"metodo" text NOT NULL,
	"nome_digitado" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"assinado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"testemunha_id" text,
	"invalidado_em" timestamp with time zone,
	"motivo_invalidacao" text,
	CONSTRAINT "assinaturas_termo_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "exames_pcmso" (
	"id" text PRIMARY KEY NOT NULL,
	"pcmso_id" text NOT NULL,
	"ghe_id" text,
	"funcao_id" text,
	"exame" text NOT NULL,
	"momentos" jsonb NOT NULL,
	"periodicidade_meses" integer,
	"observacao" text
);
--> statement-breakpoint
CREATE TABLE "ghes" (
	"id" text PRIMARY KEY NOT NULL,
	"pgr_id" text NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"descricao_atividades" text NOT NULL,
	"ambientes" text,
	"funcoes_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"epis" text,
	"trabalhadores" integer,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itens_admissionais" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"orientacao" text,
	"base" text NOT NULL,
	"origem" "origem_parametro" NOT NULL,
	"obrigatorio" boolean DEFAULT true NOT NULL,
	"quem_envia" "quem_envia" DEFAULT 'COLABORADOR' NOT NULL,
	"exige_validade" boolean DEFAULT false NOT NULL,
	"sensivel" boolean DEFAULT false NOT NULL,
	"funcoes_codigos" jsonb,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "itens_admissionais_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "modelos_termo" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"titulo" text NOT NULL,
	"texto" text NOT NULL,
	"base" text NOT NULL,
	"origem" "origem_parametro" NOT NULL,
	"na_admissao" boolean DEFAULT true NOT NULL,
	"funcoes_codigos" jsonb,
	"status" "status_conteudo" DEFAULT 'EM_REVISAO' NOT NULL,
	"aprovado_por_id" text,
	"aprovado_em" timestamp with time zone,
	"ativo" boolean DEFAULT true NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "modelo_termo_versao" UNIQUE("codigo","versao")
);
--> statement-breakpoint
CREATE TABLE "pcmsos" (
	"id" text PRIMARY KEY NOT NULL,
	"pgr_id" text,
	"obra_id" text,
	"titulo" text NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"status" "status_programa" DEFAULT 'RASCUNHO' NOT NULL,
	"medico_nome" text NOT NULL,
	"medico_crm" text NOT NULL,
	"clinica" text,
	"vigencia_inicio" timestamp with time zone,
	"proximo_relatorio_anual" timestamp with time zone,
	"arquivo_path" text,
	"arquivo_hash" text,
	"observacao" text,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perigos_biblioteca" (
	"id" text PRIMARY KEY NOT NULL,
	"ambiente_id" text NOT NULL,
	"categoria" "categoria_risco" NOT NULL,
	"perigo" text NOT NULL,
	"fonte" text NOT NULL,
	"lesoes" text NOT NULL,
	"medidas" text NOT NULL,
	"severidade" integer NOT NULL,
	"probabilidade" integer NOT NULL,
	"exames_sugeridos" text,
	"cursos_relacionados" text,
	"referencia" text,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pgrs" (
	"id" text PRIMARY KEY NOT NULL,
	"obra_id" text,
	"titulo" text NOT NULL,
	"estabelecimento" text NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"anterior_id" text,
	"status" "status_programa" DEFAULT 'RASCUNHO' NOT NULL,
	"motivo_revisao" text,
	"descricao_processos" text,
	"criterio" jsonb NOT NULL,
	"elaborador_nome" text,
	"elaborador_qualificacao" text,
	"elaborador_registro" text,
	"responsavel_organizacao" text,
	"vigencia_inicio" timestamp with time zone,
	"proxima_revisao" timestamp with time zone,
	"arquivo_assinado_path" text,
	"arquivo_assinado_hash" text,
	"aprovado_por_id" text,
	"aprovado_em" timestamp with time zone,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prazos" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"vence_em" timestamp with time zone NOT NULL,
	"colaborador_id" text,
	"obra_id" text,
	"avisar_dias_antes" integer DEFAULT 30 NOT NULL,
	"observacao" text,
	"concluido_em" timestamp with time zone,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "riscos_inventario" (
	"id" text PRIMARY KEY NOT NULL,
	"pgr_id" text NOT NULL,
	"ghe_id" text NOT NULL,
	"categoria" "categoria_risco" NOT NULL,
	"perigo" text NOT NULL,
	"fonte" text NOT NULL,
	"lesoes" text NOT NULL,
	"medidas_existentes" text NOT NULL,
	"exposicao" text,
	"monitoramento" text,
	"severidade" integer NOT NULL,
	"probabilidade" integer NOT NULL,
	"exames_sugeridos" text,
	"origem_perigo_id" text,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "colaboradores" ADD COLUMN "data_admissao" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "colaboradores" ADD COLUMN "experiencia_dias" integer;--> statement-breakpoint
ALTER TABLE "colaboradores" ADD COLUMN "experiencia_prorrogacao_dias" integer;--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "item_admissional_id" text;--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "aso_tipo_exame" "tipo_exame";--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "aso_resultado" "resultado_aso";--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "pcmso_id" text;--> statement-breakpoint
ALTER TABLE "acoes_plano" ADD CONSTRAINT "acoes_plano_pgr_id_pgrs_id_fk" FOREIGN KEY ("pgr_id") REFERENCES "public"."pgrs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acoes_plano" ADD CONSTRAINT "acoes_plano_risco_id_riscos_inventario_id_fk" FOREIGN KEY ("risco_id") REFERENCES "public"."riscos_inventario"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assinaturas_termo" ADD CONSTRAINT "assinaturas_termo_modelo_id_modelos_termo_id_fk" FOREIGN KEY ("modelo_id") REFERENCES "public"."modelos_termo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assinaturas_termo" ADD CONSTRAINT "assinaturas_termo_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assinaturas_termo" ADD CONSTRAINT "assinaturas_termo_testemunha_id_usuarios_id_fk" FOREIGN KEY ("testemunha_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exames_pcmso" ADD CONSTRAINT "exames_pcmso_pcmso_id_pcmsos_id_fk" FOREIGN KEY ("pcmso_id") REFERENCES "public"."pcmsos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exames_pcmso" ADD CONSTRAINT "exames_pcmso_ghe_id_ghes_id_fk" FOREIGN KEY ("ghe_id") REFERENCES "public"."ghes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exames_pcmso" ADD CONSTRAINT "exames_pcmso_funcao_id_funcoes_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ghes" ADD CONSTRAINT "ghes_pgr_id_pgrs_id_fk" FOREIGN KEY ("pgr_id") REFERENCES "public"."pgrs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modelos_termo" ADD CONSTRAINT "modelos_termo_aprovado_por_id_usuarios_id_fk" FOREIGN KEY ("aprovado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pcmsos" ADD CONSTRAINT "pcmsos_pgr_id_pgrs_id_fk" FOREIGN KEY ("pgr_id") REFERENCES "public"."pgrs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pcmsos" ADD CONSTRAINT "pcmsos_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pcmsos" ADD CONSTRAINT "pcmsos_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perigos_biblioteca" ADD CONSTRAINT "perigos_biblioteca_ambiente_id_ambientes_biblioteca_id_fk" FOREIGN KEY ("ambiente_id") REFERENCES "public"."ambientes_biblioteca"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pgrs" ADD CONSTRAINT "pgrs_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pgrs" ADD CONSTRAINT "pgrs_aprovado_por_id_usuarios_id_fk" FOREIGN KEY ("aprovado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pgrs" ADD CONSTRAINT "pgrs_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riscos_inventario" ADD CONSTRAINT "riscos_inventario_pgr_id_pgrs_id_fk" FOREIGN KEY ("pgr_id") REFERENCES "public"."pgrs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riscos_inventario" ADD CONSTRAINT "riscos_inventario_ghe_id_ghes_id_fk" FOREIGN KEY ("ghe_id") REFERENCES "public"."ghes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assinatura_colab" ON "assinaturas_termo" USING btree ("colaborador_id");