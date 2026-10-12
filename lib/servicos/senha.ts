import bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { sha256, tokenConvite } from "@/lib/cripto";
import type { Ator } from "@/lib/permissoes";

const VALIDADE_HORAS = 48;
export const SENHA_MINIMA = 8;

/**
 * Link de nova senha. A plataforma não envia e-mail: quem gera (RH, Segurança do Trabalho ou administrador)
 * manda o link para a pessoa (WhatsApp, por exemplo). Só o hash do token fica gravado; o link vale 48 h e uma vez.
 * Colaborador: RH, SST ou administrador geram. Usuário da equipe: só o administrador.
 */
export async function gerarLinkNovaSenha(ator: Ator, usuarioId: string) {
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, usuarioId) });
  if (!u || !u.ativo) throw new Error("Usuário não encontrado ou inativo.");
  const podeColaborador = ["ADMIN", "RH", "SST"].includes(ator.perfil);
  if (u.perfil === "COLABORADOR" ? !podeColaborador : ator.perfil !== "ADMIN") {
    throw new Error("Sem permissão para gerar link de nova senha para este usuário.");
  }
  // Um link por vez: os anteriores ainda não usados deixam de valer.
  await db.update(schema.redefinicoesSenha).set({ usadoEm: new Date() })
    .where(and(eq(schema.redefinicoesSenha.usuarioId, u.id), isNull(schema.redefinicoesSenha.usadoEm)));
  const token = tokenConvite();
  await db.insert(schema.redefinicoesSenha).values({
    tokenHash: sha256(token), usuarioId: u.id, criadoPorId: ator.id,
    expiraEm: new Date(Date.now() + VALIDADE_HORAS * 3600_000),
  });
  await auditar(ator, "usuario.link_nova_senha", "usuario", u.id, { validadeHoras: VALIDADE_HORAS });
  return { url: `${(process.env.APP_URL ?? "").replace(/\/$/, "")}/redefinir-senha/${token}`, nome: u.nome, email: u.email };
}

export async function buscarRedefinicao(token: string) {
  const r = await db.query.redefinicoesSenha.findFirst({ where: eq(schema.redefinicoesSenha.tokenHash, sha256(token)) });
  if (!r) return { erro: "Link inválido. Peça um novo ao RH ou à Segurança do Trabalho." } as const;
  if (r.usadoEm) return { erro: "Este link já foi usado ou foi substituído por outro. Peça um novo, se precisar." } as const;
  if (r.expiraEm < new Date()) return { erro: "Este link expirou. Peça um novo ao RH ou à Segurança do Trabalho." } as const;
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, r.usuarioId) });
  if (!u || !u.ativo) return { erro: "Usuário inativo. Procure o RH." } as const;
  return { redefinicao: r, usuario: u } as const;
}

export async function redefinirSenha(token: string, nova: string, confirma: string) {
  const r = await buscarRedefinicao(token);
  if ("erro" in r) throw new Error(r.erro);
  if (nova.length < SENHA_MINIMA) throw new Error(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
  if (nova !== confirma) throw new Error("A confirmação não confere com a nova senha.");
  await db.update(schema.usuarios).set({ senhaHash: await bcrypt.hash(nova, 10) }).where(eq(schema.usuarios.id, r.usuario.id));
  await db.update(schema.redefinicoesSenha).set({ usadoEm: new Date() }).where(eq(schema.redefinicoesSenha.id, r.redefinicao.id));
  await auditar({ id: r.usuario.id, nome: r.usuario.nome }, "usuario.senha_redefinida", "usuario", r.usuario.id, { porLink: true });
  return r.usuario;
}
