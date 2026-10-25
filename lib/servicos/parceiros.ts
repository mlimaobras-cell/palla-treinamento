// Cadastro de empresas parceiras (com logotipo) e de quem assina os documentos de SST.
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { exigir, type Ator } from "@/lib/permissoes";

export const TIPO_PARCEIRO: Record<string, string> = { SEGURANCA: "Consultoria de segurança do trabalho", CLINICA: "Clínica / medicina do trabalho", OUTRA: "Outra" };
export const TIPO_SIGNATARIO: Record<string, string> = {
  PROFISSIONAL_SST: "Profissional de segurança (assina o PGR)",
  MEDICO_TRABALHO: "Médico do trabalho (assina o PCMSO)",
  RESPONSAVEL_ORGANIZACAO: "Responsável pela organização",
};
const LOGOS = new Map([["image/png", ".png"], ["image/jpeg", ".jpg"], ["image/webp", ".webp"]]);
const MAX_LOGO = 2 * 1024 * 1024;

export async function salvarParceiro(
  ator: Ator,
  dados: { id?: string; nome: string; cnpj?: string | null; tipo: string; contato?: string | null; ativo?: boolean; logo?: { nome: string; tipo: string; bytes: Buffer } | null; removerLogo?: boolean },
) {
  exigir(ator, "sst.editar");
  if (!dados.nome.trim()) throw new Error("Informe o nome da empresa.");
  if (!TIPO_PARCEIRO[dados.tipo]) throw new Error("Tipo inválido.");
  const set: Partial<typeof schema.parceiros.$inferInsert> = { nome: dados.nome.trim(), cnpj: dados.cnpj || null, tipo: dados.tipo, contato: dados.contato || null, ativo: dados.ativo ?? true };
  if (dados.logo) {
    if (!LOGOS.has(dados.logo.tipo)) throw new Error("Logotipo em PNG, JPG ou WEBP (de preferência PNG com fundo transparente).");
    if (dados.logo.bytes.length > MAX_LOGO) throw new Error("Logotipo maior que 2 MB.");
    const { salvarArquivo } = await import("./documentos");
    set.logoPath = await salvarArquivo("parceiros", dados.logo);
    set.logoTipo = dados.logo.tipo;
  } else if (dados.removerLogo) {
    set.logoPath = null; set.logoTipo = null;
  }
  if (dados.id) {
    await db.update(schema.parceiros).set(set).where(eq(schema.parceiros.id, dados.id));
    await auditar(ator, "parceiro.atualizado", "parceiro", dados.id, { logo: !!dados.logo });
    return dados.id;
  }
  const [p] = await db.insert(schema.parceiros).values(set as typeof schema.parceiros.$inferInsert).returning();
  await auditar(ator, "parceiro.criado", "parceiro", p.id, { nome: p.nome });
  return p.id;
}

export async function salvarSignatario(
  ator: Ator,
  dados: { id?: string; nome: string; tipo: string; qualificacao: string; conselho?: string | null; registro: string; uf?: string | null; cargo?: string | null; parceiroId?: string | null; email?: string | null; telefone?: string | null; ativo?: boolean },
) {
  exigir(ator, "sst.editar");
  if (!TIPO_SIGNATARIO[dados.tipo]) throw new Error("Tipo inválido.");
  if (!dados.nome.trim() || !dados.qualificacao.trim()) throw new Error("Informe nome e qualificação.");
  if (dados.tipo !== "RESPONSAVEL_ORGANIZACAO" && !dados.registro.trim()) throw new Error("Informe o número de registro profissional (CREA, CRM ou registro no MTE).");
  if (dados.tipo === "MEDICO_TRABALHO" && !/crm/i.test(`${dados.conselho ?? ""} ${dados.registro}`)) throw new Error("Para o médico do trabalho, informe o CRM.");
  const v = {
    nome: dados.nome.trim(), tipo: dados.tipo, qualificacao: dados.qualificacao.trim(), conselho: dados.conselho || null, registro: dados.registro.trim(),
    uf: dados.uf?.toUpperCase() || null, cargo: dados.cargo || null, parceiroId: dados.parceiroId || null, email: dados.email || null, telefone: dados.telefone || null, ativo: dados.ativo ?? true,
  };
  if (dados.id) {
    await db.update(schema.signatarios).set(v).where(eq(schema.signatarios.id, dados.id));
    await auditar(ator, "signatario.atualizado", "signatario", dados.id, { tipo: v.tipo });
    return dados.id;
  }
  const [s] = await db.insert(schema.signatarios).values(v).returning();
  await auditar(ator, "signatario.criado", "signatario", s.id, { tipo: v.tipo });
  return s.id;
}

/** Texto do registro como aparece no documento: "CREA-SP 123456" / "CRM-SP 12345". */
export const registroCompleto = (s: { conselho: string | null; registro: string; uf: string | null }) =>
  s.registro.trim() ? [s.conselho ? `${s.conselho}${s.uf ? `-${s.uf}` : ""}` : s.uf, s.registro].filter(Boolean).join(" ") : "";

export async function signatario(id: string | null | undefined) {
  if (!id) return null;
  return (await db.query.signatarios.findFirst({ where: eq(schema.signatarios.id, id), with: { parceiro: true } })) ?? null;
}
