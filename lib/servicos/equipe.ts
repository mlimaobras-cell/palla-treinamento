// Usuários da equipe (todos os perfis menos COLABORADOR). Só o administrador geral cria, altera e desativa.
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import type { Ator, Perfil } from "@/lib/permissoes";
import { gerarLinkNovaSenha } from "./senha";

export const PERFIS_EQUIPE: Perfil[] = ["ADMIN", "RH", "SST", "INSTRUTOR", "RESPONSAVEL_TECNICO", "GESTOR_OBRA"];

function soAdmin(ator: Ator) { if (ator.perfil !== "ADMIN") throw new Error("Só o administrador geral gerencia a equipe."); }

/** Cria o usuário com senha aleatória que ninguém vê e devolve o link para a pessoa criar a própria senha (48 h, uso único). */
export async function criarUsuarioEquipe(ator: Ator, d: { nome: string; email: string; perfil: Perfil; qualificacao?: string | null; registro?: string | null }) {
  soAdmin(ator);
  const email = d.email.trim().toLowerCase();
  if (!d.nome.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Informe nome e um e-mail válido.");
  if (!PERFIS_EQUIPE.includes(d.perfil)) throw new Error("Perfil inválido.");
  if (["INSTRUTOR", "RESPONSAVEL_TECNICO"].includes(d.perfil) && (!d.qualificacao || !d.registro)) throw new Error("Instrutor e responsável técnico precisam de qualificação e registro (saem no certificado).");
  if (await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) })) throw new Error("Já existe usuário com este e-mail.");
  const [u] = await db.insert(schema.usuarios).values({
    nome: d.nome.trim(), email, perfil: d.perfil, senhaHash: await bcrypt.hash(randomBytes(24).toString("base64url"), 10),
    qualificacao: d.qualificacao || null, registroProfissional: d.registro || null,
  }).returning();
  await auditar(ator, "usuario.criado", "usuario", u.id, { email, perfil: d.perfil });
  return gerarLinkNovaSenha(ator, u.id);
}

export async function alterarUsuarioEquipe(ator: Ator, id: string, d: { perfil: Perfil; qualificacao?: string | null; registro?: string | null; ativo: boolean }) {
  soAdmin(ator);
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, id) });
  if (!u || u.perfil === "COLABORADOR") throw new Error("Usuário da equipe não encontrado.");
  if (u.id === ator.id && (!d.ativo || d.perfil !== "ADMIN")) throw new Error("Você não pode tirar o seu próprio acesso de administrador.");
  if (!PERFIS_EQUIPE.includes(d.perfil)) throw new Error("Perfil inválido.");
  await db.update(schema.usuarios).set({ perfil: d.perfil, qualificacao: d.qualificacao || null, registroProfissional: d.registro || null, ativo: d.ativo }).where(eq(schema.usuarios.id, id));
  await auditar(ator, "usuario.alterado", "usuario", id, { perfil: d.perfil, ativo: d.ativo });
}
