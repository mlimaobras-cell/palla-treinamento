import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { db, schema } from "@/db";
import { pode, type Ator, type Perfil, type Permissao } from "./permissoes";

export const COOKIE = "palla_sessao";
const DURACAO_HORAS = 10;

function segredo() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET ausente ou curta (mínimo 32 caracteres).");
  return new TextEncoder().encode(s);
}

export async function criarSessao(usuarioId: string) {
  const token = await new SignJWT({ sub: usuarioId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_HORAS}h`)
    .sign(segredo());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: DURACAO_HORAS * 3600,
  });
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE);
}

/** Usuário da requisição atual (null se não autenticado ou inativo). */
export const obterAtor = cache(async (): Promise<Ator | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, segredo());
    const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, String(payload.sub)) });
    if (!u || !u.ativo) return null;
    return { id: u.id, nome: u.nome, perfil: u.perfil as Perfil, colaboradorId: u.colaboradorId };
  } catch {
    return null;
  }
});

export async function exigirColaborador() {
  const a = await obterAtor();
  if (!a) redirect("/login");
  if (a.perfil !== "COLABORADOR" || !a.colaboradorId) redirect("/admin");
  return a;
}

export async function exigirEquipe(p: Permissao = "painel.ver") {
  const a = await obterAtor();
  if (!a) redirect("/login");
  if (a.perfil === "COLABORADOR") redirect("/colaborador");
  if (!pode(a, p)) redirect("/admin?erro=permissao");
  return a;
}
