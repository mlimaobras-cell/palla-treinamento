ALTER TABLE "aulas" ADD COLUMN "duracao_seg" integer;--> statement-breakpoint
ALTER TABLE "aulas" ADD COLUMN "poster_url" text;--> statement-breakpoint
ALTER TABLE "progresso_aulas" ADD COLUMN "posicao_max_seg" integer DEFAULT 0 NOT NULL;