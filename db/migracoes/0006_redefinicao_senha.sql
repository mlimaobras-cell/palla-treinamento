CREATE TABLE "redefinicoes_senha" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"usuario_id" text NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"usado_em" timestamp with time zone,
	"criado_por_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "redefinicoes_senha_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "redefinicoes_senha" ADD CONSTRAINT "redefinicoes_senha_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redefinicoes_senha" ADD CONSTRAINT "redefinicoes_senha_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;