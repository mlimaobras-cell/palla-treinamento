"use server";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { cadastrarPorConvite } from "@/lib/servicos/cadastro";
import { criarSessao } from "@/lib/sessao";
import { avisarLogin } from "@/lib/servicos/avisos";
import type { Estado } from "@/components/formulario";

export async function cadastrar(token: string, _: Estado, f: FormData): Promise<Estado> {
  let usuarioId: string;
  let usuario: Parameters<typeof avisarLogin>[0];
  try {
    const r = await cadastrarPorConvite(token, {
      nome: String(f.get("nome") ?? ""),
      cpf: String(f.get("cpf") ?? ""),
      dataNascimento: String(f.get("dataNascimento") ?? "") || undefined,
      telefone: String(f.get("telefone") ?? ""),
      email: String(f.get("email") ?? ""),
      senha: String(f.get("senha") ?? ""),
      consentimento: (f.get("consentimento") === "on") as true,
    });
    usuarioId = r.usuario.id;
    usuario = r.usuario;
  } catch (e) {
    if (e instanceof ZodError) return { erro: e.issues.map((i) => i.message).join(" ") };
    return { erro: (e as Error).message };
  }
  await criarSessao(usuarioId);
  await avisarLogin(usuario, "fez o cadastro e entrou na plataforma");
  redirect("/colaborador");
}
