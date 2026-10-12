import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalParaDb = globalThis as unknown as { poolPalla?: Pool };

const pool =
  globalParaDb.poolPalla ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Em hospedagem serverless (Netlify) cada instância abre poucas conexões; o pooler do Supabase faz o resto.
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    // DATABASE_SSL=1 → conexão cifrada (Supabase). Não ponha sslmode na URL: ele sobrescreve esta opção.
    ssl: process.env.DATABASE_SSL === "1" ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") globalParaDb.poolPalla = pool;

export const db = drizzle(pool, { schema });
export type Db = typeof db;
export { schema };
export async function encerrarDb() {
  await pool.end();
}
