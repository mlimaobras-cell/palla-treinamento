CREATE TABLE "anotacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"matricula_id" text NOT NULL,
	"aula_id" text NOT NULL,
	"texto" text NOT NULL,
	"segundo_video" integer,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aulas" ADD COLUMN "legenda_url" text;--> statement-breakpoint
ALTER TABLE "anotacoes" ADD CONSTRAINT "anotacoes_matricula_id_matriculas_id_fk" FOREIGN KEY ("matricula_id") REFERENCES "public"."matriculas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anotacoes" ADD CONSTRAINT "anotacoes_aula_id_aulas_id_fk" FOREIGN KEY ("aula_id") REFERENCES "public"."aulas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "anotacao_mat_aula" ON "anotacoes" USING btree ("matricula_id","aula_id");