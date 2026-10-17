"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { avisarLogin } from "@/lib/servicos/avisos";
import { criarSessao, encerrarSessao, obterAtor } from "@/lib/sessao";
import type { Estado } from "@/components/formulario";

const tentativas = new Map<string, { n: number; ate: number }>();

export async function entrar(_: Estado, f: FormData): Promise<Estado> {
  const email = String(f.get("email") ?? "").trim().toLowerCase();
  const senha = String(f.get("senha") ?? "");
  const voltar = String(f.get("voltar") ?? "");
  const t = tentativas.get(email);
  if (t && t.n >= 5 && t.ate > Date.now()) return { erro: "Muitas tentativas. Aguarde 15 minutos ou procure o RH." };
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) });
  const ok = u && u.ativo && (await bcrypt.compare(senha, u.senhaHash));
  if (!ok) {
    tentativas.set(email, { n: (t?.ate ?? 0) > Date.now() ? (t!.n + 1) : 1, ate: Date.now() + 15 * 60_000 });
    await auditar(null, "login.falha", "usuario", u?.id ?? null, { email });
    return { erro: "E-mail ou senha incorretos." };
  }
  tentativas.delete(email);
  await criarSessao(u.id);
  await db.update(schema.usuarios).set({ ultimoAcessoEm: new Date() }).where(eq(schema.usuarios.id, u.id));
  await auditar({ id: u.id, nome: u.nome }, "login", "usuario", u.id);
  await avisarLogin(u);
  const destino = u.perfil === "COLABORADOR" ? "/colaborador" : "/admin";
  redirect(voltar.startsWith(destino) ? voltar : destino);
}

export async function sair() {
  const a = await obterAtor();
  if (a) await auditar(a, "logout", "usuario", a.id);
  await encerrarSessao();
  redirect("/login");
}

export async function trocarSenha(_: Estado, f: FormData): Promise<Estado> {
  const a = await obterAtor();
  if (!a) redirect("/login");
  const atual = String(f.get("atual") ?? "");
  const nova = String(f.get("nova") ?? "");
  const confirma = String(f.get("confirma") ?? "");
  if (nova.length < 10) return { erro: "A nova senha precisa ter pelo menos 10 caracteres." };
  if (nova !== confirma) return { erro: "A confirmação não confere com a nova senha." };
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, a.id) });
  if (!u || !(await bcrypt.compare(atual, u.senhaHash))) return { erro: "Senha atual incorreta." };
  await db.update(schema.usuarios).set({ senhaHash: await bcrypt.hash(nova, 10) }).where(eq(schema.usuarios.id, a.id));
  await auditar(a, "usuario.senha_alterada", "usuario", a.id);
  return { ok: "Senha alterada." };
}
