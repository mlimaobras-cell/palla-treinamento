import { defineConfig } from "drizzle-kit";
import { readFileSync } from "node:fs";

// carrega .env sem dependências extras
for (const linha of readFileSync(".env", "utf8").split("\n")) {
  const m = linha.match(/^([A-Z_]+)="?(.*?)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migracoes",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
