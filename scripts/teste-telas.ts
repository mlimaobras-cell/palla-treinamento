// Teste das telas no navegador (Playwright): cadastro pelo link, área do colaborador e painel.
// Pré-requisito: servidor rodando (npm run build && npm start) e seed aplicado. Uso: npx tsx scripts/teste-telas.ts
import "../db/carregar-env";
import { mkdirSync } from "node:fs";
import { chromium, type Page } from "playwright";
import { eq } from "drizzle-orm";
import { db, encerrarDb, schema } from "../db";

const BASE = process.env.APP_URL ?? "http://localhost:3000";
const OUT = "saida-testes/telas";

function cpfFicticio() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const dv = (b: number[]) => { const r = (b.reduce((a, d, i) => a + d * (b.length + 1 - i), 0) * 10) % 11; return r === 10 ? 0 : r; };
  const d1 = dv(n); return [...n, d1, dv([...n, d1])].join("");
}

async function entrar(p: Page, email: string) {
  await p.goto(`${BASE}/login`);
  await p.fill('input[name="email"]', email);
  await p.fill('input[name="senha"]', "Palla@2026");
  await Promise.all([p.waitForURL(/\/(admin|colaborador)/), p.click('button[type="submit"]')]);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const erros: string[] = [];

  // ---- RH gera o link de cadastro pela tela
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await desk.newPage();
  p.on("pageerror", (e) => erros.push(e.message));
  await entrar(p, "rh@palla.teste");
  await p.goto(`${BASE}/admin/obras`);
  await p.fill('input[name="nomeSugerido"]', "Maria Fictícia Teste");
  await p.selectOption('select[name="funcaoId"]', { label: "Montador de estruturas metálicas" });
  await p.selectOption('select[name="obraId"]', { index: 0 });
  await p.click('button:has-text("Gerar link")');
  const aviso = await p.locator("text=Link gerado:").first().textContent({ timeout: 15000 });
  const link = aviso!.replace(/^.*Link gerado:\s*/, "").trim();
  await p.screenshot({ path: `${OUT}/01-obras-convite.png`, fullPage: true });
  console.log("Link:", link);

  // ---- futuro colaborador no celular
  const cel = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const m = await cel.newPage();
  m.on("pageerror", (e) => erros.push(e.message));
  await m.goto(link);
  await m.screenshot({ path: `${OUT}/02-cadastro-celular.png`, fullPage: true });
  if ((await m.locator('a[href="/login"]:has-text("Entrar")').count()) === 0) erros.push("Convite: falta o link Entrar para quem já tem cadastro");
  await m.locator('input[name="dataNascimento"]').pressSequentially("15031990");
  const dataDigitada = await m.inputValue('input[name="dataNascimento"]');
  console.log("Data digitada:", dataDigitada);
  if (dataDigitada !== "15/03/1990") erros.push(`Data de nascimento digitada ficou "${dataDigitada}"`);
  await m.fill('input[name="cpf"]', cpfFicticio());
  await m.fill('input[name="telefone"]', "11988887777");
  const email = `maria.${Date.now()}@ficticio.teste`;
  await m.fill('input[name="email"]', email);
  await m.fill('input[name="senha"]', "SenhaTeste123");
  await m.check('input[name="consentimento"]');
  await Promise.all([m.waitForURL(/\/colaborador$/, { timeout: 30000 }), m.click('button:has-text("Criar meu cadastro")')]);
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.email, email) });
  if (c) await db.update(schema.colaboradores).set({ dadoFicticio: true }).where(eq(schema.colaboradores.id, c.id));
  await m.screenshot({ path: `${OUT}/03-boas-vindas-celular.png`, fullPage: true });

  // ---- NR-35 (presencial): material de apoio sem contagem de carga horária
  if (c) {
    const nr35 = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, "NR35-ALT") });
    const mt = nr35 && await db.query.matriculas.findFirst({ where: (t, { and, eq: ig }) => and(ig(t.colaboradorId, c.id), ig(t.cursoId, nr35.id)) });
    if (mt) {
      await m.goto(`${BASE}/colaborador/curso/${mt.id}`);
      await m.screenshot({ path: `${OUT}/03b-nr35-curso-celular.png`, fullPage: true });
      await m.locator('a[href*="/aula/"]').first().click();
      await m.waitForURL(/\/aula\//);
      const txt = await m.textContent("body");
      if (!txt?.includes("Material de apoio")) erros.push("NR-35: aviso de material de apoio ausente");
      if (txt?.includes("Concluir aula")) erros.push("NR-35: material de apoio não deveria ter conclusão de aula");
      await m.screenshot({ path: `${OUT}/03c-nr35-apoio-celular.png`, fullPage: true });
      await p.goto(`${BASE}/imprimir/prova/${nr35.id}?gabarito=1`);
      await p.screenshot({ path: `${OUT}/03d-nr35-prova-impressa.png`, fullPage: true });
    } else erros.push("NR-35: matrícula não criada para o montador");
    // ---- Mini curso M3: diagnóstica antes do vídeo
    const m3 = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, "MC-M3") });
    const mm = m3 && await db.query.matriculas.findFirst({ where: (t, { and, eq: ig }) => and(ig(t.colaboradorId, c.id), ig(t.cursoId, m3.id)) });
    if (mm) {
      await m.goto(`${BASE}/colaborador/curso/${mm.id}`);
      if ((await m.locator('a[href*="/aula/"]').count()) > 0) erros.push("MC-M3: vídeo deveria estar bloqueado antes da diagnóstica");
      await m.screenshot({ path: `${OUT}/03e-mc-bloqueado-celular.png`, fullPage: true });
      await Promise.all([m.waitForURL(/\/avaliacao$/), m.click('button:has-text("Fazer avaliação diagnóstica")')]);
      await m.screenshot({ path: `${OUT}/03f-mc-diagnostica-celular.png`, fullPage: true });
      const grupos = m.locator("fieldset");
      for (let i = 0; i < await grupos.count(); i++) await grupos.nth(i).locator('input[type="radio"]').nth(i % 4).check();
      await Promise.all([m.waitForURL(/resultado=/), m.click('button:has-text("Enviar respostas")')]);
      const txt = await m.textContent("body");
      if (txt?.includes("Gabarito comentado")) erros.push("MC-M3: diagnóstica não deve mostrar gabarito antes do vídeo");
      await m.screenshot({ path: `${OUT}/03g-mc-diagnostica-resultado-celular.png`, fullPage: true });
      await m.goto(`${BASE}/colaborador/curso/${mm.id}`);
      if ((await m.locator('a[href*="/aula/"]').count()) === 0) erros.push("MC-M3: vídeo não foi liberado após a diagnóstica");
      await m.screenshot({ path: `${OUT}/03h-mc-liberado-celular.png`, fullPage: true });
      await m.locator('a[href*="/aula/"]').first().click();
      await m.waitForURL(/\/aula\//);
      await m.waitForTimeout(2500);
      await m.screenshot({ path: `${OUT}/03i-mc-video-celular.png`, fullPage: false });
      await p.goto(`${BASE}/imprimir/prova/${m3.id}?tipo=diagnostica&gabarito=1`);
      await p.screenshot({ path: `${OUT}/03j-mc-diagnostica-impressa.png`, fullPage: true });
    } else erros.push("MC-M3: matrícula não criada para o montador");
    await m.goto(`${BASE}/colaborador`);
  }
  const titulo = await m.locator("text=Bem-vindo à Palla Construções").count();
  console.log("Boas-vindas exibida:", titulo > 0);

  await m.locator(`a[href*="/colaborador/curso/"]:has-text("Integração institucional")`).first().click();
  await m.waitForURL(/\/colaborador\/curso\//);
  await m.screenshot({ path: `${OUT}/04-curso-celular.png`, fullPage: true });
  await m.locator("ol a").first().click();
  await m.waitForURL(/\/aula\//);
  await m.waitForTimeout(2500);
  await m.screenshot({ path: `${OUT}/05-aula-celular.png`, fullPage: false });
  const botao = m.locator('button:has-text("Concluir aula")');
  console.log("Concluir aula bloqueado antes do tempo mínimo:", await botao.isDisabled());

  // ---- painel: SST, responsável técnico e verificação pública
  await entrar(p, "sst@palla.teste");
  await p.goto(`${BASE}/admin`);
  await p.screenshot({ path: `${OUT}/06-painel.png`, fullPage: true });
  await p.goto(`${BASE}/admin/colaboradores`);
  await p.screenshot({ path: `${OUT}/07-colaboradores.png`, fullPage: true });
  const ficticio = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.nome, "João Fictício da Silva Teste") });
  if (ficticio) {
    await p.goto(`${BASE}/admin/colaboradores/${ficticio.id}`);
    await p.screenshot({ path: `${OUT}/08-colaborador-detalhe.png`, fullPage: true });
  }
  await p.goto(`${BASE}/admin/matriz`);
  await p.screenshot({ path: `${OUT}/09-matriz.png`, fullPage: true });
  await p.goto(`${BASE}/admin/resultados`);
  await p.screenshot({ path: `${OUT}/09b-resultados.png`, fullPage: true });
  const m3c = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, "MC-M3") });
  if (m3c) {
    await p.goto(`${BASE}/admin/resultados?curso=${m3c.id}`);
    await p.screenshot({ path: `${OUT}/09c-resultados-m3.png`, fullPage: true });
  }
  await p.goto(`${BASE}/admin/cursos`);
  await p.screenshot({ path: `${OUT}/10-cursos.png`, fullPage: true });
  await entrar(p, "rt@palla.teste");
  await p.goto(`${BASE}/admin/certificados`);
  await p.screenshot({ path: `${OUT}/11-certificados.png`, fullPage: true });
  const cert = await db.query.certificados.findFirst({ where: eq(schema.certificados.status, "VALIDO") });
  if (cert) {
    await p.goto(`${BASE}/verificar/${cert.codigoVerificacao}`);
    await p.screenshot({ path: `${OUT}/12-verificacao-publica.png`, fullPage: true });
  }
  await p.goto(`${BASE}/login`);
  await p.screenshot({ path: `${OUT}/00-login.png` });

  // controle de acesso: colaborador não entra no painel
  await m.goto(`${BASE}/admin`);
  console.log("Colaborador redirecionado ao tentar /admin:", m.url().endsWith("/colaborador"));

  console.log("Erros de página:", erros.length ? erros : "nenhum");
  await browser.close();
  await encerrarDb();
}

main().catch(async (e) => { console.error(e); await encerrarDb(); process.exit(1); });
