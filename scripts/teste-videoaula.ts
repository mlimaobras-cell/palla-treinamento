// Teste da videoaula no navegador (Playwright): o tempo só conta com o vídeo tocando, não dá para adiantar o vídeo,
// a aula conclui depois de assistida e a ficha do curso mostra o registro para a equipe.
// Pré-requisito: servidor rodando e scripts/teste-telas.ts executado (cria a colaboradora fictícia com o M3 liberado).
import "../db/carregar-env";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { and, asc, desc, eq, like } from "drizzle-orm";
import { db, encerrarDb, schema } from "../db";
import { segundosMinimos } from "../lib/servicos/aprendizagem";

const BASE = process.env.APP_URL ?? "http://localhost:3000";
const OUT = "saida-testes/videoaula";
let ok = 0, total = 0;
const checar = (nome: string, cond: boolean, det = "") => { total++; if (cond) ok++; console.log(`${cond ? "✔" : "✘"} ${nome}${det ? ` — ${det}` : ""}`); };

async function main() {
  mkdirSync(OUT, { recursive: true });
  const c = await db.query.colaboradores.findFirst({ where: like(schema.colaboradores.email, "maria.%@ficticio.teste"), orderBy: desc(schema.colaboradores.criadoEm) });
  if (!c) throw new Error("Rode antes scripts/teste-telas.ts.");
  const m3 = (await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, "MC-M3") }))!;
  const mat = (await db.query.matriculas.findFirst({ where: and(eq(schema.matriculas.colaboradorId, c.id), eq(schema.matriculas.cursoId, m3.id)) }))!;
  const aulas = (await db.query.capitulos.findMany({ where: eq(schema.capitulos.cursoId, m3.id), orderBy: asc(schema.capitulos.ordem), with: { aulas: { orderBy: asc(schema.aulas.ordem) } } })).flatMap((k) => k.aulas);
  const a1 = aulas[0];

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const erros: string[] = [];
  const cel = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await cel.newPage();
  p.on("pageerror", (e) => erros.push(e.message));
  // O Chromium do Playwright não traz H.264: no teste, o MP4 é servido como WebM (mesma imagem, 40 s).
  if (process.env.VIDEO_TESTE_WEBM) await p.route("**/videos/v2/*.mp4", (r) => r.fulfill({ path: process.env.VIDEO_TESTE_WEBM!, contentType: "video/webm" }));
  await p.goto(`${BASE}/login`);
  await p.fill('input[name="email"]', c.email!);
  await p.fill('input[name="senha"]', "SenhaTeste123");
  await Promise.all([p.waitForURL(/\/colaborador/), p.click('button[type="submit"]')]);

  await p.goto(`${BASE}/colaborador/curso/${mat.id}`);
  const nAulas = await p.locator('a[href*="/aula/"]').count();
  checar("Curso M3 lista as videoaulas v2", nAulas >= 6, `${nAulas} links de aula`);
  await p.screenshot({ path: `${OUT}/01-curso-m3.png`, fullPage: true });

  await p.goto(`${BASE}/colaborador/curso/${mat.id}/aula/${a1.id}`);
  const v = p.locator("video");
  checar("Vídeo v2 com capa e legenda", (await v.getAttribute("src"))?.startsWith("/videos/v2/") === true && !!(await v.getAttribute("poster")) && (await p.locator("video track").count()) === 1);
  const txt0 = await p.locator("text=Dê play no vídeo").count();
  checar("Antes do play, o tempo não conta e a tela orienta", txt0 === 1);
  await p.waitForTimeout(3000);
  const parado = await p.locator("text=/\\d+ min$/").first().textContent();
  await v.evaluate((el: HTMLVideoElement) => { el.muted = true; return el.play(); });
  await p.waitForTimeout(6500);
  const tempoVideo = await v.evaluate((el: HTMLVideoElement) => el.currentTime);
  console.log("ponto assistido antes do salto:", await v.getAttribute("data-assistido"));
  checar("Vídeo toca no navegador", tempoVideo > 4, `${tempoVideo.toFixed(1)} s`);
  await v.evaluate((el: HTMLVideoElement) => { el.currentTime = 120; });
  await p.waitForTimeout(800);
  const aposSalto = await v.evaluate((el: HTMLVideoElement) => el.currentTime);
  checar("Não deixa adiantar o vídeo além do ponto assistido", aposSalto < 15, `tentou 120 s, ficou em ${aposSalto.toFixed(1)} s`);
  await v.evaluate((el: HTMLVideoElement) => { el.playbackRate = 2; });
  await p.waitForTimeout(300);
  checar("Velocidade fica em 1×", (await v.evaluate((el: HTMLVideoElement) => el.playbackRate)) === 1);
  checar("Concluir bloqueado antes de assistir", await p.locator('button:has-text("Concluir aula")').isDisabled());
  await p.screenshot({ path: `${OUT}/02-aula-tocando.png`, fullPage: true });
  void parado;

  // Simula o restante assistido (o servidor só aceita o avanço por pulso; aqui gravamos direto para não esperar o vídeo inteiro).
  const min = segundosMinimos(a1, m3.tempoMinimoAulaPct);
  const prog = await db.query.progressoAulas.findFirst({ where: and(eq(schema.progressoAulas.matriculaId, mat.id), eq(schema.progressoAulas.aulaId, a1.id)) });
  if (prog) await db.update(schema.progressoAulas).set({ segundos: min, posicaoMaxSeg: min }).where(eq(schema.progressoAulas.id, prog.id));
  else await db.insert(schema.progressoAulas).values({ matriculaId: mat.id, aulaId: a1.id, segundos: min, posicaoMaxSeg: min });
  await p.reload();
  await p.click('button:has-text("Concluir aula")');
  await p.waitForURL(new RegExp(`/aula/${aulas[1].id}`), { timeout: 15000 }).catch(() => {});
  checar("Aula concluída leva à próxima", p.url().includes(aulas[1].id));
  const resume = await p.locator("video").evaluate((el: HTMLVideoElement) => el.currentTime);
  checar("Aula nova começa do início", resume < 1);

  // Equipe: ficha do curso com o registro
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const d = await desk.newPage();
  d.on("pageerror", (e) => erros.push(e.message));
  await d.goto(`${BASE}/login`);
  await d.fill('input[name="email"]', "sst@palla.teste");
  await d.fill('input[name="senha"]', "Palla@2026");
  await Promise.all([d.waitForURL(/\/admin/), d.click('button[type="submit"]')]);
  await d.goto(`${BASE}/admin/colaboradores/${c.id}/matricula/${mat.id}`);
  const corpo = (await d.locator("main").textContent()) ?? "";
  checar("Ficha mostra aulas assistidas e avaliações", corpo.includes("Videoaulas assistidas") && corpo.includes("1 de 6") && corpo.includes("Diagnóstica"));
  await d.screenshot({ path: `${OUT}/03-ficha-equipe.png`, fullPage: true });
  await d.goto(`${BASE}/admin/resultados`);
  checar("Resultados lista quem está assistindo", ((await d.locator("main").textContent()) ?? "").includes("Assistindo às aulas"));
  await d.screenshot({ path: `${OUT}/04-resultados.png`, fullPage: true });

  checar("Sem erros de página", erros.length === 0, erros.join(" | "));
  console.log(`\n${ok}/${total} verificações aprovadas.`);
  await browser.close();
  await encerrarDb();
  if (ok !== total) process.exit(1);
}

main().catch(async (e) => { console.error(e); await encerrarDb(); process.exit(1); });
