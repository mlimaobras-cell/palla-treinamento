// Fábrica de videoaulas v2 (aulas demonstrativas). Preserva a v1 (scripts/gerar-video.ts + video/modelo.html).
// Uso: npx tsx scripts/gerar-video-v2.ts video/v2/cenas/<arquivo>.json [pasta-saida=video/v2/saida]
// Novidades: narração com dicionário de pronúncia e pausas ([[pausa:3]]), marcas de sincronia ({marca}),
// legendas com o tempo real de cada frase, ilustrações animadas quadro a quadro (video/v2/modelo-v2.html).
// Locução gravada tem prioridade: video/v2/audio/<codigo>/<n>.wav (+ <n>.wav.json com frases/marcas, opcional).
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const RAIZ = path.resolve(__dirname, "..");
const VOZ = process.env.VOZ ?? "pf_dora";
const VELOCIDADE = process.env.VELOCIDADE ?? "1.0";
const FPS = 25;
const TRABALHADORES = Number(process.env.TRABALHADORES ?? 2);
const ATRASO = 0.6; // respiro antes da fala
const SOBRA = 0.9;  // respiro depois da fala

type Frase = { texto: string; ini: number; fim: number };
type Fala = { frases: Frase[]; marcas: Record<string, number>; duracao: number };
type Cena = { tipo: string; narracao: string; [k: string]: unknown };
type Roteiro = { codigo: string; titulo: string; capitulo: string; cenas: Cena[] };

const duracao = (arq: string) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq]).toString().trim());
const vtt = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${x.toFixed(3).padStart(6, "0")}`;
};

async function renderizar(r: Roteiro, tempos: unknown, de: number, ate: number, saida: string) {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("file://" + path.join(RAIZ, "video/v2/modelo-v2.html"));
  await page.evaluate(([meta, tp]) => (window as unknown as { montar: (a: unknown, b: unknown) => Promise<void> }).montar(meta, tp), [r, tempos] as const);
  const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", saida], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = de; f < ate; f++) {
    await page.evaluate((s) => (window as unknown as { irPara: (s: number) => void }).irPara(s), f / FPS);
    const img = await page.screenshot({ type: "jpeg", quality: 93 });
    if (!ff.stdin.write(img)) await new Promise((ok) => ff.stdin.once("drain", ok));
  }
  ff.stdin.end();
  await new Promise((ok) => ff.on("close", ok));
  await browser.close();
}

async function main() {
  const arq = process.argv[2];
  const saida = path.resolve(process.argv[3] ?? path.join(RAIZ, "video/v2/saida"));
  const r: Roteiro = JSON.parse(readFileSync(arq, "utf8"));
  const tmp = path.join(RAIZ, "video/tmp", `v2-${r.codigo}`);
  mkdirSync(tmp, { recursive: true });
  mkdirSync(saida, { recursive: true });
  const t0 = Date.now();

  // 1) narração
  const audios = r.cenas.map((_, i) => {
    const gravado = path.join(RAIZ, "video/v2/audio", r.codigo, `${i + 1}.wav`);
    return existsSync(gravado) ? gravado : path.join(tmp, `${i + 1}.wav`);
  });
  const lote = r.cenas.map((c, i) => ({ texto: c.narracao, saida: audios[i] })).filter((x) => !x.saida.includes("/video/v2/audio/"));
  if (lote.length) {
    writeFileSync(path.join(tmp, "lote.json"), JSON.stringify(lote));
    execFileSync("python3", [path.join(RAIZ, "video/v2/tts_v2.py"), path.join(tmp, "lote.json"), VOZ, VELOCIDADE], { stdio: "ignore" });
  }
  const falas: Fala[] = audios.map((a) => existsSync(a + ".json")
    ? JSON.parse(readFileSync(a + ".json", "utf8"))
    : { frases: [], marcas: {}, duracao: duracao(a) });

  // 2) tempos e marcas (em tempo local da cena)
  let t = 0;
  const tempos = r.cenas.map((c, i) => {
    const f = falas[i];
    const dur = ATRASO + f.duracao + SOBRA + (c.tipo === "abertura" ? 0.8 : 0);
    const marcas = Object.fromEntries(Object.entries(f.marcas).map(([k, v]) => [k, v + ATRASO]));
    const x = { inicio: t, duracao: dur, fala: f.duracao, marcas };
    t += dur;
    return x;
  });
  const total = t;

  // 3) legendas com o tempo real de cada frase (texto original, sem as trocas de pronúncia)
  let leg = "WEBVTT\n\n", n = 1;
  falas.forEach((f, i) => {
    for (const fr of f.frases) {
      const ini = tempos[i].inicio + ATRASO + fr.ini, fim = tempos[i].inicio + ATRASO + fr.fim + 0.15;
      leg += `${n++}\n${vtt(ini)} --> ${vtt(fim)}\n${fr.texto}\n\n`;
    }
  });
  writeFileSync(path.join(saida, `${r.codigo}.vtt`), leg);

  // 4) trilha de áudio (pico máximo −1,5 dBTP)
  const audioFinal = path.join(tmp, "narracao.m4a");
  const filtros = tempos.map((x, i) => `[${i}:a]aresample=44100,adelay=${Math.round(ATRASO * 1000)}:all=1,apad=whole_dur=${x.duracao.toFixed(3)}[a${i}]`).join(";");
  const concat = tempos.map((_, i) => `[a${i}]`).join("") + `concat=n=${tempos.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=7,aformat=channel_layouts=stereo[out]`;
  execFileSync("ffmpeg", ["-y", "-v", "error", ...audios.flatMap((a) => ["-i", a]), "-filter_complex", `${filtros};${concat}`, "-map", "[out]", "-c:a", "aac", "-b:a", "160k", audioFinal]);

  // 5) quadros → vídeo
  const quadros = Math.ceil(total * FPS);
  const fatia = Math.ceil(quadros / TRABALHADORES);
  const partes = Array.from({ length: TRABALHADORES }, (_, k) => path.join(tmp, `parte${k}.mp4`));
  await Promise.all(partes.map((p, k) => renderizar(r, tempos, k * fatia, Math.min(quadros, (k + 1) * fatia), p)));
  writeFileSync(path.join(tmp, "partes.txt"), partes.map((p) => `file '${p}'`).join("\n"));
  const video = path.join(saida, `${r.codigo}.mp4`);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "partes.txt"), "-i", audioFinal,
    "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", video]);
  writeFileSync(path.join(saida, `${r.codigo}.json`), JSON.stringify({ codigo: r.codigo, titulo: r.titulo, duracao: total, tempos }, null, 1));
  console.log(`Vídeo: ${video} (${total.toFixed(1)} s) em ${Math.round((Date.now() - t0) / 1000)} s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
