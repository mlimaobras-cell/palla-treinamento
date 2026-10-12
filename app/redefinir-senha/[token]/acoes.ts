"use server";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { redefinirSenha } from "@/lib/servicos/senha";
import { criarSessao } from "@/lib/sessao";
import type { Estado } from "@/components/formulario";

export async function redefinir(token: string, _: Estado, f: FormData): Promise<Estado> {
  let destino = "/colaborador";
  try {
    const u = await redefinirSenha(token, String(f.get("nova") ?? ""), String(f.get("confirma") ?? ""));
    await criarSessao(u.id);
    await db.update(schema.usuarios).set({ ultimoAcessoEm: new Date() }).where(eq(schema.usuarios.id, u.id));
    destino = u.perfil === "COLABORADOR" ? "/colaborador" : "/admin";
  } catch (e) {
    return { erro: (e as Error).message };
  }
  redirect(destino);
}
