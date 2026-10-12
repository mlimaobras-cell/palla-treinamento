// Prévia rápida: gera quadros PNG de instantes escolhidos, sem renderizar o vídeo inteiro.
// Uso: npx tsx video/v2/previa.ts <cenas.json> <pasta-tts-com-wav.json> <saida> <cena:seg> [<cena:seg> ...]
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [arq, pastaTts, saida, ...pontos] = process.argv.slice(2);
const r = JSON.parse(readFileSync(arq, "utf8"));
const ATRASO = 0.6, SOBRA = 0.9;
let t = 0;
const tempos = r.cenas.map((c: { tipo: string }, i: number) => {
  const f = JSON.parse(readFileSync(path.join(pastaTts, `${i + 1}.wav.json`), "utf8"));
  const dur = ATRASO + f.duracao + SOBRA + (c.tipo === "abertura" ? 0.8 : 0);
  const x = { inicio: t, duracao: dur, marcas: Object.fromEntries(Object.entries(f.marcas).map(([k, v]) => [k, (v as number) + ATRASO])) };
  t += dur; return x;
});
(async () => {
  mkdirSync(saida, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on("pageerror", (e) => console.error("ERRO NA PÁGINA:", e.message));
  await p.goto("file://" + path.resolve(__dirname, "modelo-v2.html"));
  await p.evaluate(([m, tp]) => (window as any).montar(m, tp), [r, tempos] as const);
  for (const pt of pontos) {
    const [c, s] = pt.split(":").map(Number);
    await p.evaluate((x) => (window as any).irPara(x), tempos[c - 1].inicio + s);
    await p.screenshot({ path: path.join(saida, `c${c}-${s}.png`) });
  }
  console.log(tempos.map((x: { inicio: number; duracao: number }, i: number) => `${i + 1}: ${x.inicio.toFixed(1)}+${x.duracao.toFixed(1)}`).join("  "));
  await b.close();
})();
