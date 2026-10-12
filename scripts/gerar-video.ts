// Fábrica de videoaulas: cenas (JSON) → narração → animação (HTML) → MP4 + legendas VTT + capa.
// Uso: npx tsx scripts/gerar-video.ts video/cenas/<arquivo>.json [pasta-saida]
// Voz padrão: Kokoro "pf_dora" (pt-BR). Locução gravada tem prioridade: coloque video/audio/<codigo>/<n>.wav
// (n = número da cena, a partir de 1) e as animações se ajustam à duração gravada.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const RAIZ = path.resolve(__dirname, "..");
const VOZ = process.env.VOZ ?? "pf_dora";
const VELOCIDADE = process.env.VELOCIDADE ?? "1.0";
const FPS = 25;
const TRABALHADORES = Number(process.env.TRABALHADORES ?? 2);
const ATRASO_FALA = 0.7;
const SOBRA = 1.0;

type Item = string | { titulo: string; texto?: string; forte?: boolean };
type Cena = { tipo: string; narracao: string; itens?: Item[]; passos?: number[]; [k: string]: unknown };
type Roteiro = { codigo: string; titulo: string; capitulo: string; cenas: Cena[] };

const duracao = (arq: string) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq]).toString().trim());
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const frases = (t: string) => t.match(/[^.!?;]+[.!?;]*/g)!.map((s) => s.trim()).filter(Boolean);
const vtt = (seg: number) => {
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
};
const tituloItem = (it: Item) => (typeof it === "string" ? it : it.titulo);

/** Momento em que cada item aparece: quando a narração o menciona (por palavra-chave), senão proporcional. */
function passos(c: Cena, fala: number) {
  if (!c.itens) return;
  const n = semAcento(c.narracao);
  let ultimo = 0;
  c.passos = c.itens.map((it, k) => {
    const chave = semAcento(String((it as { chave?: string }).chave ?? tituloItem(it))).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2).slice(0, 2).join(" ");
    let pos = chave ? n.indexOf(chave, ultimo) : -1;
    if (pos < 0 && chave) pos = n.indexOf(chave.split(" ")[0], ultimo);
    const frac = pos >= 0 ? pos / n.length : (k + 0.5) / c.itens!.length;
    if (pos >= 0) ultimo = pos;
    return Math.max(0.9 + k * 0.15, ATRASO_FALA + frac * fala - 0.3);
  });
  for (let k = 1; k < c.passos.length; k++) c.passos[k] = Math.max(c.passos[k], c.passos[k - 1] + 0.25);
}

async function renderizar(r: Roteiro, tempos: unknown, de: number, ate: number, saida: string) {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("file://" + path.join(RAIZ, "video/modelo.html"));
  await page.evaluate(([meta, tp]) => (window as unknown as { montar: (a: unknown, b: unknown) => Promise<void> }).montar(meta, tp), [r, tempos] as const);
  const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", saida], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = de; f < ate; f++) {
    await page.evaluate((s) => (window as unknown as { irPara: (s: number) => void }).irPara(s), f / FPS);
    const img = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(img)) await new Promise((ok) => ff.stdin.once("drain", ok));
  }
  ff.stdin.end();
  await new Promise((ok) => ff.on("close", ok));
  await browser.close();
}

async function main() {
  const arq = process.argv[2];
  const saida = path.resolve(process.argv[3] ?? path.join(RAIZ, "public/videos"));
  const r: Roteiro = JSON.parse(readFileSync(arq, "utf8"));
  const tmp = path.join(RAIZ, "video/tmp", r.codigo);
  mkdirSync(tmp, { recursive: true });
  mkdirSync(saida, { recursive: true });
  const t0 = Date.now();

  // 1) narração (locução gravada tem prioridade)
  const audios = r.cenas.map((_, i) => {
    const gravado = path.join(RAIZ, "video/audio", r.codigo, `${i + 1}.wav`);
    return existsSync(gravado) ? gravado : path.join(tmp, `${i + 1}.wav`);
  });
  const lote = r.cenas.map((c, i) => ({ texto: c.narracao, saida: audios[i] })).filter((x) => !x.saida.includes("/video/audio/"));
  if (lote.length) {
    writeFileSync(path.join(tmp, "lote.json"), JSON.stringify(lote));
    execFileSync("python3", [path.join(RAIZ, "video/tts_kokoro.py"), path.join(tmp, "lote.json"), VOZ, VELOCIDADE], { stdio: "ignore" });
  }

  // 2) tempos
  let t = 0;
  const tempos = r.cenas.map((c, i) => {
    const fala = duracao(audios[i]);
    const dur = ATRASO_FALA + fala + SOBRA + (c.tipo === "abertura" ? 0.6 : 0);
    const x = { inicio: t, duracao: dur, fala };
    t += dur;
    passos(c, fala);
    return x;
  });
  const total = t;

  // 3) legendas
  let leg = "WEBVTT\n\n", n = 1;
  r.cenas.forEach((c, i) => {
    const ps = frases(c.narracao);
    const soma = ps.reduce((a, p) => a + p.length, 0);
    let ini = tempos[i].inicio + ATRASO_FALA;
    for (const p of ps) {
      const d = (p.length / soma) * tempos[i].fala;
      leg += `${n++}\n${vtt(ini)} --> ${vtt(ini + d)}\n${p}\n\n`;
      ini += d;
    }
  });
  writeFileSync(path.join(saida, `${r.codigo}.vtt`), leg);

  // 4) trilha de áudio
  const audioFinal = path.join(tmp, "narracao.m4a");
  const filtros = tempos.map((x, i) => `[${i}:a]aresample=44100,adelay=${Math.round(ATRASO_FALA * 1000)}:all=1,apad=whole_dur=${x.duracao.toFixed(3)}[a${i}]`).join(";");
  const concat = tempos.map((_, i) => `[a${i}]`).join("") + `concat=n=${tempos.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5,aformat=channel_layouts=stereo[out]`;
  execFileSync("ffmpeg", ["-y", "-v", "error", ...audios.flatMap((a) => ["-i", a]), "-filter_complex", `${filtros};${concat}`, "-map", "[out]", "-c:a", "aac", "-b:a", "160k", audioFinal]);

  // 5) quadros em paralelo → partes → vídeo final
  const quadros = Math.ceil(total * FPS);
  const fatia = Math.ceil(quadros / TRABALHADORES);
  const partes = Array.from({ length: TRABALHADORES }, (_, k) => path.join(tmp, `parte${k}.mp4`));
  await Promise.all(partes.map((p, k) => renderizar(r, tempos, k * fatia, Math.min(quadros, (k + 1) * fatia), p)));
  writeFileSync(path.join(tmp, "partes.txt"), partes.map((p) => `file '${p}'`).join("\n"));
  const video = path.join(saida, `${r.codigo}.mp4`);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "partes.txt"), "-i", audioFinal,
    "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", video]);

  // 6) capa
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "3.5", "-i", video, "-frames:v", "1", "-q:v", "3", path.join(saida, `${r.codigo}.jpg`)]);
  writeFileSync(path.join(saida, `${r.codigo}.json`), JSON.stringify({ codigo: r.codigo, titulo: r.titulo, duracao: total }));
  console.log(`Vídeo: ${video} (${(total / 60).toFixed(1)} min) em ${Math.round((Date.now() - t0) / 1000)} s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
