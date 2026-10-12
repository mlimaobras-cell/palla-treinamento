// Exporta só o CATÁLOGO (sem usuários, colaboradores ou dados de teste) para carga no Supabase.
import "../db/carregar-env";
import { writeFileSync } from "node:fs";
import pg from "pg";
const S = process.argv[2] ?? "saida-catalogo";
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
const consultas: [string, string][] = [
  ["empresas", "select * from empresas where propria"],
  ["funcoes", "select * from funcoes"],
  ["cursos", "select *, null as responsavel_tecnico_id from cursos"],
  ["capitulos", "select * from capitulos"],
  ["aulas", "select * from aulas"],
  ["questoes", "select * from questoes"],
  ["matriz_funcao", "select * from matriz_funcao where obra_id is null"],
];
import { mkdirSync } from "node:fs";
mkdirSync(S, { recursive: true });
await c.connect();
const partes: string[] = [];
for (const [t, q] of consultas) {
  let { rows } = await c.query(q);
  if (t === "cursos") rows = rows.map((r) => ({ ...r, responsavel_tecnico_id: null }));
  // lotes de ~60 KB
  let lote: unknown[] = [];
  const flush = () => { if (lote.length) partes.push(`insert into treinamento.${t} select * from json_populate_recordset(null::treinamento.${t}, '${JSON.stringify(lote).replace(/'/g, "''")}');`); lote = []; };
  for (const r of rows) { lote.push(r); if (JSON.stringify(lote).length > 60000) flush(); }
  flush();
  console.log(t, rows.length);
}
await c.end();
partes.forEach((p, i) => writeFileSync(`${S}/carga-${String(i).padStart(2, "0")}.sql`, p));
console.log("arquivos", partes.length, partes.map((p) => p.length));
