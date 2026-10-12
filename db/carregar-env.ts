// Carrega .env para scripts executados fora do Next.js (seed, testes).
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const linha of readFileSync(".env", "utf8").split("\n")) {
    const m = linha.match(/^([A-Z_]+)="?(.*?)"?$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
