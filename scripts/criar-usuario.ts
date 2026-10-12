// Cria um usuário real da equipe (produção). Uso:
// npx tsx scripts/criar-usuario.ts "Nome Completo" email@empresa.com.br PERFIL "Qualificação" "Registro profissional"
// PERFIL: ADMIN | RH | SST | INSTRUTOR | RESPONSAVEL_TECNICO | GESTOR_OBRA
// A senha provisória é exibida uma única vez; peça para a pessoa trocá-la no primeiro acesso.
import "../db/carregar-env";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db, encerrarDb, schema } from "../db";
import { auditar } from "../lib/auditoria";

async function main() {
  const [nome, email, perfil, qualificacao, registro] = process.argv.slice(2);
  const perfis = ["ADMIN", "RH", "SST", "INSTRUTOR", "RESPONSAVEL_TECNICO", "GESTOR_OBRA"];
  if (!nome || !email || !perfis.includes(perfil)) {
    console.error("Uso: criar-usuario.ts \"Nome\" email PERFIL [qualificação] [registro]");
    process.exit(1);
  }
  const senha = randomBytes(9).toString("base64url");
  const [u] = await db.insert(schema.usuarios).values({
    nome, email: email.toLowerCase(), perfil: perfil as never, senhaHash: await bcrypt.hash(senha, 10),
    qualificacao: qualificacao || null, registroProfissional: registro || null,
  }).returning();
  await auditar(null, "usuario.criado", "usuario", u.id, { email: u.email, perfil });
  console.log(`Usuário criado: ${u.email} (${perfil}). Senha provisória: ${senha}`);
  await encerrarDb();
}
main().catch(async (e) => { console.error(e.message); await encerrarDb(); process.exit(1); });
