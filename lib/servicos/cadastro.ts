import { and, eq, isNull, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { cifrarCpf, cpfValido, hashCpf, somenteDigitos, tokenConvite } from "@/lib/cripto";
import { exigir, type Ator } from "@/lib/permissoes";

export const VERSAO_AVISO_PRIVACIDADE = "2026-10";

/** Matriz efetiva de uma função numa obra: padrão + ajustes da obra (ajuste da obra prevalece). */
export async function matrizEfetiva(funcaoId: string, obraId: string | null) {
  const linhas = await db.query.matrizFuncao.findMany({
    where: and(
      eq(schema.matrizFuncao.funcaoId, funcaoId),
      obraId ? or(isNull(schema.matrizFuncao.obraId), eq(schema.matrizFuncao.obraId, obraId)) : isNull(schema.matrizFuncao.obraId),
    ),
    with: { curso: true },
  });
  const porCurso = new Map<string, (typeof linhas)[number]>();
  for (const l of linhas.filter((l) => !l.obraId)) porCurso.set(l.cursoId, l);
  for (const l of linhas.filter((l) => l.obraId)) porCurso.set(l.cursoId, l);
  return [...porCurso.values()]
    .filter((l) => l.curso.ativo)
    .sort((a, b) => a.curso.ordem - b.curso.ordem);
}

/**
 * Matrícula automática pela matriz. Obrigatórios, internos e recomendados são matriculados;
 * condicionais só entram quando a Segurança do Trabalho confirma que a atividade existe.
 */
export async function matricularPelaMatriz(colaboradorId: string, ator: Pick<Ator, "id" | "nome"> | null) {
  const colab = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, colaboradorId) });
  if (!colab) throw new Error("Colaborador não encontrado.");
  const matriz = await matrizEfetiva(colab.funcaoId, colab.obraId);
  const existentes = await db.query.matriculas.findMany({ where: eq(schema.matriculas.colaboradorId, colaboradorId) });
  const ativos = new Set(existentes.filter((m) => m.status !== "CANCELADA").map((m) => m.cursoId));
  const novas = matriz.filter((l) => l.classificacao !== "CONDICIONAL" && !ativos.has(l.cursoId));
  if (novas.length) {
    await db.insert(schema.matriculas).values(
      novas.map((l) => ({ colaboradorId, cursoId: l.cursoId, classificacao: l.classificacao })),
    );
    await auditar(ator, "matricula.automatica", "colaborador", colaboradorId, {
      cursos: novas.map((l) => l.curso.codigo),
    });
  }
  return novas.length;
}

export async function matricularCondicional(ator: Ator, colaboradorId: string, cursoId: string, justificativa: string) {
  exigir(ator, "matriz.editar");
  if (!justificativa.trim()) throw new Error("Informe a atividade que torna o curso aplicável.");
  const [m] = await db.insert(schema.matriculas).values({
    colaboradorId, cursoId, classificacao: "CONDICIONAL", observacao: justificativa,
  }).returning();
  await auditar(ator, "matricula.condicional", "matricula", m.id, { justificativa });
  return m;
}

export async function criarConvite(
  ator: Ator,
  dados: { obraId: string; funcaoId: string; empresaId: string; nomeSugerido?: string; validadeDias?: number },
) {
  exigir(ator, "convite.criar");
  const [c] = await db.insert(schema.convites).values({
    token: tokenConvite(),
    obraId: dados.obraId,
    funcaoId: dados.funcaoId,
    empresaId: dados.empresaId,
    nomeSugerido: dados.nomeSugerido || null,
    expiraEm: new Date(Date.now() + (dados.validadeDias ?? 15) * 86400_000),
    criadoPorId: ator.id,
  }).returning();
  await auditar(ator, "convite.criar", "convite", c.id, { obraId: dados.obraId, funcaoId: dados.funcaoId });
  return c;
}

export async function buscarConviteValido(token: string) {
  const c = await db.query.convites.findFirst({
    where: eq(schema.convites.token, token),
    with: { obra: true, funcao: true, empresa: true },
  });
  if (!c) return { erro: "Convite não encontrado." } as const;
  if (c.usadoEm) return { erro: "Este convite já foi utilizado. Faça login com seu e-mail e senha." } as const;
  if (c.expiraEm < new Date()) return { erro: "Este convite expirou. Peça um novo link ao RH." } as const;
  return { convite: c } as const;
}

export const esquemaCadastro = z.object({
  nome: z.string().trim().min(5, "Informe o nome completo."),
  cpf: z.string().refine(cpfValido, "CPF inválido."),
  dataNascimento: z.string().optional(),
  telefone: z.string().trim().min(10, "Informe o telefone com DDD."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  consentimento: z.literal(true, { message: "É preciso confirmar a leitura do aviso de privacidade." }),
  ficticio: z.boolean().optional(),
});

export async function cadastrarPorConvite(token: string, entrada: z.input<typeof esquemaCadastro>) {
  const r = await buscarConviteValido(token);
  if ("erro" in r) throw new Error(r.erro);
  const d = esquemaCadastro.parse(entrada);
  const cpfH = hashCpf(d.cpf);
  const jaExiste = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.cpfHash, cpfH) });
  if (jaExiste) throw new Error("Já existe cadastro com este CPF. Faça login ou procure o RH.");
  const emailEmUso = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, d.email) });
  if (emailEmUso) throw new Error("Este e-mail já está em uso.");

  const resultado = await db.transaction(async (tx) => {
    const [colab] = await tx.insert(schema.colaboradores).values({
      nome: d.nome,
      cpfCifrado: cifrarCpf(d.cpf),
      cpfHash: cpfH,
      cpfFinal: somenteDigitos(d.cpf).slice(-2),
      dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null,
      telefone: d.telefone,
      email: d.email,
      empresaId: r.convite.empresaId,
      funcaoId: r.convite.funcaoId,
      obraId: r.convite.obraId,
      consentimentoLgpdEm: new Date(),
      versaoAvisoPrivacidade: VERSAO_AVISO_PRIVACIDADE,
      dadoFicticio: !!d.ficticio,
    }).returning();
    const [usuario] = await tx.insert(schema.usuarios).values({
      nome: d.nome,
      email: d.email,
      senhaHash: await bcrypt.hash(d.senha, 10),
      perfil: "COLABORADOR",
      colaboradorId: colab.id,
    }).returning();
    await tx.update(schema.convites).set({ usadoEm: new Date() }).where(eq(schema.convites.id, r.convite.id));
    return { colab, usuario };
  });
  await auditar({ id: resultado.usuario.id, nome: d.nome }, "colaborador.cadastro_por_convite", "colaborador", resultado.colab.id, {
    conviteId: r.convite.id, obra: r.convite.obra.codigo, funcao: r.convite.funcao.codigo,
    aviso: VERSAO_AVISO_PRIVACIDADE,
  });
  await matricularPelaMatriz(resultado.colab.id, { id: resultado.usuario.id, nome: d.nome });
  return resultado;
}

export async function alterarFuncaoObra(ator: Ator, colaboradorId: string, funcaoId: string, obraId: string | null) {
  exigir(ator, "colaborador.cadastrar");
  await db.update(schema.colaboradores).set({ funcaoId, obraId }).where(eq(schema.colaboradores.id, colaboradorId));
  await auditar(ator, "colaborador.alterar_funcao_obra", "colaborador", colaboradorId, { funcaoId, obraId });
  return matricularPelaMatriz(colaboradorId, ator);
}
