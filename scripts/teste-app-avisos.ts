// Teste do app (PWA), da biblioteca de vídeos e do aviso de login.
// Pré-requisito: servidor rodando; para o aviso, um receptor HTTPS local (PUSH_TESTE_ENDPOINT) confiável pelo servidor.
import "../db/carregar-env";
import { createECDH, randomBytes } from "node:crypto";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { desc, eq, like } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, encerrarDb, schema } from "../db";

const BASE = process.env.APP_URL ?? "http://localhost:3000";
const OUT = "saida-testes/app-avisos";
let ok = 0, total = 0;
const checar = (n: string, c: boolean, d = "") => { total++; if (c) ok++; console.log(`${c ? "✔" : "✘"} ${n}${d ? ` — ${d}` : ""}`); };

(async () => {
  mkdirSync(OUT, { recursive: true });
  const m = await (await fetch(`${BASE}/manifest.webmanifest`)).json();
  checar("Manifesto do app com nome e ícones", m.short_name === "Palla Treinamento" && m.icons.length >= 4 && m.display === "standalone");
  checar("Service worker publicado", (await fetch(`${BASE}/sw.js`)).ok && (await fetch(`${BASE}/offline.html`)).ok);

  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const erros: string[] = [];
  const ctx = await b.newContext({ viewport: { width: 1360, height: 860 } });
  const p = await ctx.newPage(); p.on("pageerror", (e) => erros.push(e.message));
  await p.goto(`${BASE}/login`); await p.fill('input[name="email"]', "admin@palla.teste"); await p.fill('input[name="senha"]', "Palla@2026");
  await Promise.all([p.waitForURL(/\/admin/), p.click('button[type="submit"]')]);
  await p.goto(`${BASE}/admin/videos`);
  const itens = await p.locator("ol li button").count();
  checar("Biblioteca lista vídeos do curso aberto", itens > 0, `${itens} vídeos`);
  const src1 = await p.locator("video").getAttribute("src");
  await p.locator("ol li button").nth(1).click();
  const src2 = await p.locator("video").getAttribute("src");
  checar("Trocar de vídeo na lista troca o player", !!src1 && !!src2 && src1 !== src2, `${src2}`);
  await p.screenshot({ path: `${OUT}/01-videos.png` });
  const reg = await p.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
  checar("Service worker ativo no navegador", reg);
  await p.goto(`${BASE}/admin/acessos`);
  checar("Página Acessos e avisos abre", (await p.locator("main").textContent())!.includes("Aviso de login no seu aparelho"));
  await p.screenshot({ path: `${OUT}/02-acessos.png`, fullPage: true });

  // Aviso: inscreve um "aparelho" falso (receptor local) para o administrador de teste e faz login de um colaborador.
  const ep = process.env.PUSH_TESTE_ENDPOINT;
  if (ep) {
    const admin = (await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, "admin@palla.teste") }))!;
    const ecdh = createECDH("prime256v1"); ecdh.generateKeys();
    await db.delete(schema.inscricoesPush).where(like(schema.inscricoesPush.endpoint, `${ep}%`));
    await db.insert(schema.inscricoesPush).values({ usuarioId: admin.id, endpoint: `${ep}/teste-${Date.now()}`, p256dh: ecdh.getPublicKey("base64url"), auth: randomBytes(16).toString("base64url"), aparelho: "teste" });
    const log = process.env.PUSH_TESTE_LOG!;
    const antes = existsSync(log) ? readFileSync(log, "utf8").split("\n").filter(Boolean).length : 0;
    const colab = (await db.query.usuarios.findFirst({ where: eq(schema.usuarios.perfil, "COLABORADOR"), orderBy: desc(schema.usuarios.criadoEm) }))!;
    await db.update(schema.usuarios).set({ senhaHash: await bcrypt.hash("SenhaTeste123", 10) }).where(eq(schema.usuarios.id, colab.id)); // dado fictício local
    const c2 = await b.newContext(); const q = await c2.newPage();
    await q.goto(`${BASE}/login`); await q.fill('input[name="email"]', colab.email); await q.fill('input[name="senha"]', "SenhaTeste123");
    await Promise.all([q.waitForURL(/\/colaborador/, { timeout: 20000 }), q.click('button[type="submit"]')]);
    await new Promise((r) => setTimeout(r, 1500));
    const linhas = readFileSync(log, "utf8").split("\n").filter(Boolean);
    const nova = linhas.slice(antes).find((l) => l.includes("POST /teste-"));
    checar("Login de colaborador envia o aviso (Web Push criptografado)", !!nova && nova.includes("enc=aes128gcm") && nova.includes("auth=vapid"), nova ?? "nada recebido");
    await p.reload();
    checar("Login aparece na lista de acessos", (await p.locator("main").textContent())!.includes(colab.nome));
    await p.screenshot({ path: `${OUT}/03-acessos-com-login.png`, fullPage: true });
    await db.delete(schema.inscricoesPush).where(like(schema.inscricoesPush.endpoint, `${ep}%`));
  }
  checar("Sem erros de página", erros.length === 0, erros.join(" | "));
  console.log(`\n${ok}/${total} verificações aprovadas.`);
  await b.close(); await encerrarDb();
  if (ok !== total) process.exit(1);
})().catch(async (e) => { console.error(e); await encerrarDb(); process.exit(1); });
