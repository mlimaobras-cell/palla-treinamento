CREATE TABLE "dds" (
	"id" text PRIMARY KEY NOT NULL,
	"obra_id" text NOT NULL,
	"data" timestamp with time zone NOT NULL,
	"tema" text NOT NULL,
	"psicossocial" boolean DEFAULT false NOT NULL,
	"conteudo" text,
	"conduzido_por" text NOT NULL,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escutas" (
	"id" text PRIMARY KEY NOT NULL,
	"obra_id" text,
	"ghe_id" text,
	"tipo" text NOT NULL,
	"data" timestamp with time zone NOT NULL,
	"participantes" integer NOT NULL,
	"conduzido_por" text NOT NULL,
	"temas" text NOT NULL,
	"encaminhamentos" text,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicadores_mensais" (
	"id" text PRIMARY KEY NOT NULL,
	"obra_id" text NOT NULL,
	"mes" text NOT NULL,
	"efetivo" integer,
	"horas_extras_media" real,
	"faltas" integer,
	"afastamentos" integer,
	"desligamentos" integer,
	"quase_acidentes" integer,
	"observacao" text,
	"registrado_por_id" text,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presencas_dds" (
	"id" text PRIMARY KEY NOT NULL,
	"dds_id" text NOT NULL,
	"colaborador_id" text NOT NULL,
	"confirmado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"metodo" text NOT NULL,
	"registrado_por_id" text
);
--> statement-breakpoint
CREATE TABLE "relatos" (
	"id" text PRIMARY KEY NOT NULL,
	"protocolo" text NOT NULL,
	"obra_id" text,
	"categoria" text NOT NULL,
	"descricao" text NOT NULL,
	"anonimo" boolean DEFAULT true NOT NULL,
	"colaborador_id" text,
	"status" text DEFAULT 'RECEBIDO' NOT NULL,
	"prazo_apuracao" timestamp with time zone NOT NULL,
	"resposta" text,
	"medidas" text,
	"tratado_por_id" text,
	"concluido_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "relatos_protocolo_unique" UNIQUE("protocolo")
);
--> statement-breakpoint
ALTER TABLE "dds" ADD CONSTRAINT "dds_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dds" ADD CONSTRAINT "dds_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escutas" ADD CONSTRAINT "escutas_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escutas" ADD CONSTRAINT "escutas_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicadores_mensais" ADD CONSTRAINT "indicadores_mensais_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicadores_mensais" ADD CONSTRAINT "indicadores_mensais_registrado_por_id_usuarios_id_fk" FOREIGN KEY ("registrado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas_dds" ADD CONSTRAINT "presencas_dds_dds_id_dds_id_fk" FOREIGN KEY ("dds_id") REFERENCES "public"."dds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas_dds" ADD CONSTRAINT "presencas_dds_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas_dds" ADD CONSTRAINT "presencas_dds_registrado_por_id_usuarios_id_fk" FOREIGN KEY ("registrado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatos" ADD CONSTRAINT "relatos_obra_id_obras_id_fk" FOREIGN KEY ("obra_id") REFERENCES "public"."obras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatos" ADD CONSTRAINT "relatos_colaborador_id_colaboradores_id_fk" FOREIGN KEY ("colaborador_id") REFERENCES "public"."colaboradores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatos" ADD CONSTRAINT "relatos_tratado_por_id_usuarios_id_fk" FOREIGN KEY ("tratado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "indicador_obra_mes" ON "indicadores_mensais" USING btree ("obra_id","mes");--> statement-breakpoint
CREATE UNIQUE INDEX "presenca_unica" ON "presencas_dds" USING btree ("dds_id","colaborador_id");