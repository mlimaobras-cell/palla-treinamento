// Gera link de nova senha para qualquer usuário (uso do administrador, ex.: conta da equipe). Uso: npx tsx scripts/link-nova-senha.ts email@exemplo.com
import "../db/carregar-env";
import { eq } from "drizzle-orm";
import { db, encerrarDb, schema } from "../db";
import { gerarLinkNovaSenha } from "../lib/servicos/senha";

async function main() {
  const email = (process.argv[2] ?? "").trim().toLowerCase();
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) });
  if (!u) throw new Error(`Usuário não encontrado: ${email}`);
  const r = await gerarLinkNovaSenha({ id: u.id, nome: "Script do administrador", perfil: "ADMIN" } as never, u.id);
  console.log(`${r.nome} <${r.email}>\n${r.url}\n(vale 48 h, uma vez)`);
  await encerrarDb();
}
main().catch(async (e) => { console.error(e.message); await encerrarDb(); process.exit(1); });
