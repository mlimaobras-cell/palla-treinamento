CREATE TABLE "arquivos" (
	"caminho" text PRIMARY KEY NOT NULL,
	"colaborador_id" text NOT NULL,
	"tipo" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
