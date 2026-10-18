// Carga inicial: catálogo, funções, matriz, conteúdos desenvolvidos e usuários de TESTE (dados fictícios).
// Uso: npm run db:seed   (idempotente para catálogo/matriz; usuários de teste só são criados se não existirem)
import "./carregar-env";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, encerrarDb, schema } from "./index";
import { cursosSeed, funcoesSeed, matrizSeed } from "./catalogo";
import { capitulosIntegracao, questoesIntegracao, type CapituloSeed, type QuestaoSeed } from "./conteudo/integracao";
import { capitulosMontagemSegura, questoesMontagemSegura } from "./conteudo/montagem-segura";
import { capitulosNr35, questoesNr35 } from "./conteudo/nr35";
import { capitulosDoModulo, modulosMiniCurso, questoesDoModulo } from "./conteudo/minicurso";
import { capitulosApresentacao, comVideos, CURSOS_APRESENTACAO, questoesApresentacao, VIDEOS_INT, VIDEOS_PAL52 } from "./conteudo/apresentacoes";

const SENHA_TESTE = "Palla@2026";
// SEED_PRODUCAO=1: carrega só catálogo, funções, matriz e conteúdos. Não cria usuários de teste nem obra de exemplo,
// e não recarrega conteúdo de curso que já existe (recarregar apaga o progresso das aulas). SEED_RECARREGAR=1 força.
const PRODUCAO = process.env.SEED_PRODUCAO === "1";
if (PRODUCAO && !process.env.DATABASE_URL) {
  console.error("DATABASE_URL não definida. Configure a variável de ambiente no Netlify (Project configuration → Environment variables).");
  process.exit(1);
}
const RECARREGAR = process.env.SEED_RECARREGAR === "1";

async function upsertCurso(c: (typeof cursosSeed)[number], ordem: number, rtId: string | null) {
  const valores = {
    ...c,
    conteudoProgramatico: c.conteudoProgramatico.join("\n"),
    ordem,
    responsavelTecnicoId: rtId,
    notaMinima: c.notaMinima ?? 70,
  };
  const existente = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, c.codigo) });
  if (existente) {
    // Em produção não sobrescreve o que a equipe já ajustou pela tela (parâmetros validados, RT, status).
    if (PRODUCAO) return existente.id;
    await db.update(schema.cursos).set(valores).where(eq(schema.cursos.id, existente.id));
    return existente.id;
  }
  const [novo] = await db.insert(schema.cursos).values(valores).returning();
  return novo.id;
}

/** Assinatura das aulas (título, vídeo, duração) para saber se o conteúdo da fonte mudou. */
const assinatura = (aulas: { titulo: string; videoUrl?: string | null; duracaoSeg?: number | null }[]) =>
  JSON.stringify(aulas.map((a) => [a.titulo, a.videoUrl ?? null, a.duracaoSeg ?? null]));

/**
 * Em produção, conteúdo existente não é recarregado (recarregar apaga o progresso das aulas).
 * Exceção (sincronizar): cursos de videoaula sem nenhuma matrícula são atualizados quando a fonte muda,
 * para que vídeos novos cheguem à plataforma sem apagar o histórico de ninguém.
 */
async function carregarConteudo(cursoId: string, capitulos: CapituloSeed[], questoes: QuestaoSeed[], sincronizar = false) {
  if (PRODUCAO && !RECARREGAR && (await db.query.capitulos.findFirst({ where: eq(schema.capitulos.cursoId, cursoId) }))) {
    if (!sincronizar) return;
    const atuais = await db.query.capitulos.findMany({
      where: eq(schema.capitulos.cursoId, cursoId), orderBy: (c, { asc }) => asc(c.ordem),
      with: { aulas: { orderBy: (a, { asc }) => asc(a.ordem) } },
    });
    const aulasAtuais = atuais.flatMap((c) => c.aulas), aulasFonte = capitulos.flatMap((c) => c.aulas);
    const matriculas = await db.query.matriculas.findFirst({ where: eq(schema.matriculas.cursoId, cursoId) });
    // Mesma estrutura (mesmas aulas, na mesma ordem): atualiza textos e vídeos no lugar, sem tocar no progresso de ninguém.
    if (matriculas && aulasAtuais.length === aulasFonte.length && aulasAtuais.every((a, i) => a.titulo === aulasFonte[i].titulo)) {
      let n = 0;
      for (const [i, a] of aulasAtuais.entries()) {
        const f = aulasFonte[i];
        const novo = { roteiro: f.roteiro, narracao: f.narracao, textoApoio: f.textoApoio, exemplo: f.exemplo ?? null, perguntaFixacao: f.perguntaFixacao ?? null,
          resumo: f.resumo, duracaoMin: f.duracaoMin, videoUrl: f.videoUrl ?? null, legendaUrl: f.legendaUrl ?? null, duracaoSeg: f.duracaoSeg ?? null, posterUrl: f.posterUrl ?? null };
        if ((Object.keys(novo) as (keyof typeof novo)[]).some((k) => (a[k] ?? null) !== novo[k])) { await db.update(schema.aulas).set(novo).where(eq(schema.aulas.id, a.id)); n++; }
      }
      if (n) console.log(`Curso ${cursoId}: ${n} aula(s) atualizada(s) no lugar (há matrículas; progresso mantido).`);
      return;
    }
    if (assinatura(aulasAtuais) === assinatura(aulasFonte)) return;
    if (matriculas) {
      console.warn(`Curso ${cursoId}: conteúdo novo na fonte, mas há matrículas. Não recarregado (use SEED_RECARREGAR com cuidado).`);
      return;
    }
    console.log(`Curso ${cursoId}: videoaulas atualizadas (sem matrículas).`);
  }
  await db.delete(schema.capitulos).where(eq(schema.capitulos.cursoId, cursoId));
  await db.delete(schema.questoes).where(eq(schema.questoes.cursoId, cursoId));
  for (const [i, cap] of capitulos.entries()) {
    const [c] = await db.insert(schema.capitulos).values({ cursoId, ordem: i + 1, titulo: cap.titulo }).returning();
    await db.insert(schema.aulas).values(cap.aulas.map((a, j) => ({ ...a, capituloId: c.id, ordem: j + 1 })));
  }
  await db.insert(schema.questoes).values(questoes.map((q) => ({ ...q, cursoId })));
}

async function usuario(nome: string, email: string, perfil: typeof schema.perfilEnum.enumValues[number], extra: Partial<typeof schema.usuarios.$inferInsert> = {}) {
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) });
  if (u) return u;
  const [novo] = await db.insert(schema.usuarios).values({
    nome, email, perfil, senhaHash: await bcrypt.hash(SENHA_TESTE, 10), ...extra,
  }).returning();
  return novo;
}

async function main() {
  let rtId: string | null = null;
  let adminEmail = "(produção: crie o administrador com npm run usuario:criar)";
  if (!PRODUCAO) {
  // Usuários de TESTE — nomes e registros fictícios. Em produção, cadastre os responsáveis reais.
  const admin = await usuario("Administrador (TESTE)", "admin@palla.teste", "ADMIN");
  await usuario("Analista de RH (TESTE)", "rh@palla.teste", "RH");
  await usuario("Técnica de Segurança (TESTE)", "sst@palla.teste", "SST", { qualificacao: "Técnica de Segurança do Trabalho", registroProfissional: "Registro MTE 00000 (fictício)" });
  await usuario("Instrutor de Campo (TESTE)", "instrutor@palla.teste", "INSTRUTOR", { qualificacao: "Técnico de Segurança do Trabalho, instrutor de trabalho em altura", registroProfissional: "Registro MTE 00001 (fictício)" });
  const rt = await usuario("Responsável Técnico (TESTE)", "rt@palla.teste", "RESPONSAVEL_TECNICO", { qualificacao: "Engenheiro de Segurança do Trabalho", registroProfissional: "CREA 0000000000 (fictício)" });
  const gestor = await usuario("Gestor de Obra (TESTE)", "gestor@palla.teste", "GESTOR_OBRA");

  // Empresa, contratante e obra de exemplo
  let palla = await db.query.empresas.findFirst({ where: eq(schema.empresas.propria, true) });
  if (!palla) [palla] = await db.insert(schema.empresas).values({ nome: "Palla Construções", propria: true }).returning();
  let contratante = await db.query.contratantes.findFirst();
  if (!contratante) [contratante] = await db.insert(schema.contratantes).values({ nome: "Contratante Exemplo S.A. (fictícia)" }).returning();
  const obra = await db.query.obras.findFirst({ where: eq(schema.obras.codigo, "OBR-001") });
  if (!obra) {
    await db.insert(schema.obras).values({
      codigo: "OBR-001", nome: "Obra exemplo — galpão industrial (dados fictícios)", endereco: "Endereço fictício",
      contratanteId: contratante.id, gestorId: gestor.id,
      exigenciasExtras: "Integração do cliente e ficha de registro do contratante",
      textoIntegracao: "Regras do cliente: uso obrigatório de óculos de ampla visão e luvas em toda a área operacional.",
    });
  }

  rtId = rt.id;
  adminEmail = admin.email;
  } else {
    const palla = await db.query.empresas.findFirst({ where: eq(schema.empresas.propria, true) });
    if (!palla) await db.insert(schema.empresas).values({ nome: process.env.EMPRESA_NOME ?? "Palla Construções", cnpj: process.env.EMPRESA_CNPJ || null, propria: true });
  }

  // Funções
  for (const [i, [codigo, nome]] of funcoesSeed.entries()) {
    const f = await db.query.funcoes.findFirst({ where: eq(schema.funcoes.codigo, codigo) });
    if (!f) await db.insert(schema.funcoes).values({ codigo, nome, ordem: i });
  }

  // Cursos e conteúdos
  const ids = new Map<string, string>();
  for (const [i, c] of cursosSeed.entries()) ids.set(c.codigo, await upsertCurso(c, i, rtId));
  await carregarConteudo(ids.get("INT-01")!, comVideos(capitulosIntegracao, VIDEOS_INT), questoesIntegracao, true);
  await carregarConteudo(ids.get("PAL-52")!, comVideos(capitulosMontagemSegura, VIDEOS_PAL52), questoesMontagemSegura, true);
  // Apresentações curtas (NR-17, NR-23, NR-26, NR-33): mostram a norma e o treinamento; não substituem a capacitação.
  for (const cod of CURSOS_APRESENTACAO) await carregarConteudo(ids.get(cod)!, capitulosApresentacao(cod), questoesApresentacao(cod), true);
  // NR-35 é presencial (35.4.5): as aulas abaixo são só material de apoio e o banco é da prova escrita presencial.
  await carregarConteudo(ids.get("NR35-ALT")!, capitulosNr35, questoesNr35, true);
  // Mini curso M1–M8: videoaula + banco de questões dos cadernos do instrutor (diagnóstica marcada por questão).
  for (const mod of modulosMiniCurso) await carregarConteudo(ids.get(mod.codigo)!, capitulosDoModulo(mod), questoesDoModulo(mod), true);
  // Conteúdos desenvolvidos ficam EM REVISÃO até aprovação do responsável técnico.
  for (const cod of ["INT-01", "PAL-52", "NR35-ALT", ...CURSOS_APRESENTACAO, ...modulosMiniCurso.map((m) => m.codigo)]) {
    const c = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, cod) });
    if (c?.statusConteudo === "RASCUNHO") await db.update(schema.cursos).set({ statusConteudo: "EM_REVISAO" }).where(eq(schema.cursos.id, c.id));
  }

  // Matriz padrão
  for (const [funcaoCodigo, linhas] of Object.entries(matrizSeed)) {
    const f = await db.query.funcoes.findFirst({ where: eq(schema.funcoes.codigo, funcaoCodigo) });
    for (const [cursoCodigo, classificacao] of linhas) {
      await db.insert(schema.matrizFuncao)
        .values({ funcaoId: f!.id, cursoId: ids.get(cursoCodigo)!, classificacao, obraId: null })
        .onConflictDoUpdate({ target: [schema.matrizFuncao.funcaoId, schema.matrizFuncao.cursoId, schema.matrizFuncao.obraId], set: { classificacao } });
    }
  }

  console.log(PRODUCAO ? `Carga de produção concluída. ${adminEmail}` : `Carga concluída. Usuários de teste com senha ${SENHA_TESTE} (admin: ${adminEmail}).`);
  await encerrarDb();
}

main().catch(async (e) => {
  console.error(e);
  await encerrarDb();
  process.exit(1);
});
