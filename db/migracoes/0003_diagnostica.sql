CREATE TYPE "public"."tipo_tentativa" AS ENUM('DIAGNOSTICA', 'FINAL');--> statement-breakpoint
ALTER TABLE "cursos" ADD COLUMN "exige_diagnostica" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "questoes" ADD COLUMN "codigo" text;--> statement-breakpoint
ALTER TABLE "questoes" ADD COLUMN "nivel" text;--> statement-breakpoint
ALTER TABLE "questoes" ADD COLUMN "diagnostica" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tentativas" ADD COLUMN "tipo" "tipo_tentativa" DEFAULT 'FINAL' NOT NULL;