CREATE TABLE "parceiros" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text,
	"tipo" text NOT NULL,
	"logo_path" text,
	"logo_tipo" text,
	"contato" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signatarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"qualificacao" text NOT NULL,
	"conselho" text,
	"registro" text NOT NULL,
	"uf" text,
	"cargo" text,
	"parceiro_id" text,
	"email" text,
	"telefone" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pcmsos" ADD COLUMN "medico_id" text;--> statement-breakpoint
ALTER TABLE "pcmsos" ADD COLUMN "parceiro_id" text;--> statement-breakpoint
ALTER TABLE "pgrs" ADD COLUMN "elaborador_id" text;--> statement-breakpoint
ALTER TABLE "pgrs" ADD COLUMN "responsavel_org_id" text;--> statement-breakpoint
ALTER TABLE "pgrs" ADD COLUMN "parceiro_id" text;--> statement-breakpoint
ALTER TABLE "signatarios" ADD CONSTRAINT "signatarios_parceiro_id_parceiros_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."parceiros"("id") ON DELETE no action ON UPDATE no action;