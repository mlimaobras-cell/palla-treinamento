// Mini curso de montagem de estruturas metálicas (M1–M8): cursos internos semipresenciais.
// Fluxo online: avaliação diagnóstica (antes do vídeo) → videoaula → avaliação final → prática presencial com o instrutor.
// As videoaulas de cada módulo são montadas a partir dos roteiros v2 usados para gerar os vídeos (video/v2/cenas/*.json),
// para que roteiro, narração e texto de apoio na plataforma sejam exatamente os do vídeo publicado.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { AulaSeed, CapituloSeed, QuestaoSeed } from "../integracao";
import type { Q } from "./tipos";
import { m1 } from "./m1";
import { m2 } from "./m2";
import { m3 } from "./m3";
import { m4 } from "./m4";
import { m5 } from "./m5";
import { m6 } from "./m6";
import { m7 } from "./m7";
import { m8 } from "./m8";


export type ModuloMiniCurso = {
  codigo: string; arquivo: string; titulo: string; horas: number; publico: string;
  referencias: string; banco: Q[]; caderno: string;
};

export const modulosMiniCurso: ModuloMiniCurso[] = [
  { codigo: "MC-M1", arquivo: "M1-fundamentos", titulo: "Fundamentos de estruturas metálicas", horas: 8, publico: "Todas as trilhas de montagem", referencias: "ABNT NBR 8800 (referência técnica)", banco: m1, caderno: "48eb4367-af2a-4f3c-b297-28f47adbb04b" },
  { codigo: "MC-M2", arquivo: "M2-projetos", titulo: "Leitura e interpretação de projetos", horas: 8, publico: "Todas as trilhas de montagem", referencias: "ABNT NBR 8800, item 4.4 (referência técnica)", banco: m2, caderno: "5b602fdd-53b2-486b-b6e0-18674cfd0142" },
  { codigo: "MC-M3", arquivo: "M3-montagem", titulo: "Montagem, içamento e rigging", horas: 16, publico: "Ajudante (parte), montador e encarregado", referencias: "ABNT NBR 8800; ABNT NBR 15637 (cintas); Petrobras N-293 (referência técnica). Complementa NR-11, NR-18 e NR-35; não as substitui", banco: m3, caderno: "caca6f13-56ea-4484-8cca-51f2ef671efa" },
  { codigo: "MC-M4", arquivo: "M4-parafusos", titulo: "Ligações parafusadas e torque", horas: 12, publico: "Montador e encarregado", referencias: "ABNT NBR 8800; RCSC; Petrobras N-293 (referências técnicas)", banco: m4, caderno: "58622b68-d230-49ce-b349-b0f7a712e6c0" },
  { codigo: "MC-M5", arquivo: "M5-soldagem", titulo: "Soldagem estrutural aplicada", horas: 12, publico: "Soldador, montador e encarregado", referencias: "AWS D1.1 (edição citada no material: 2010 — conferir a edição em uso); Petrobras N-293. Não substitui a qualificação do soldador", banco: m5, caderno: "e252d412-8b9c-4a51-afe5-838e50d4bb54" },
  { codigo: "MC-M6", arquivo: "M6-metrologia", titulo: "Metrologia e topografia de montagem", horas: 12, publico: "Encarregado", referencias: "ABNT NBR 8800, item 12.3; Petrobras N-293 (referências técnicas)", banco: m6, caderno: "f550d515-82c2-48a2-b6b6-8c9776519aee" },
  { codigo: "MC-M7", arquivo: "M7-seguranca", titulo: "Segurança, NRs e documentação de obra", horas: 12, publico: "Todas as trilhas de montagem", referencias: "NR-6, NR-18 e NR-35 (citadas); Petrobras N-293. Complementa os treinamentos legais; não os substitui", banco: m7, caderno: "79ab2cfe-dd52-42b8-bb4a-4ef1c2e50b74" },
  { codigo: "MC-M8", arquivo: "M8-cobertura", titulo: "Cobertura e fechamento", horas: 8, publico: "Montador e encarregado", referencias: "Petrobras N-293 e orientações de fabricantes (referências técnicas)", banco: m8, caderno: "233e57e3-7985-4dd3-b40d-bef9356e955b" },
];

const DIAG_MIN = 8;
const DIAG_MAX = 10;

/** Questões da diagnóstica: as de nível básico (até 10); se houver menos de 8, completa com as intermediárias na ordem do caderno. */
export function codigosDiagnostica(banco: Q[]) {
  const b = banco.filter((q) => q[1] === "B").slice(0, DIAG_MAX);
  const i = banco.filter((q) => q[1] === "I").slice(0, Math.max(0, DIAG_MIN - b.length));
  return new Set([...b, ...i].map((q) => q[0]));
}

export function questoesDoModulo(mod: ModuloMiniCurso): QuestaoSeed[] {
  const diag = codigosDiagnostica(mod.banco);
  return mod.banco.map(([codigo, nivel, enunciado, alternativas, correta, comentario]) => ({
    tipo: "MULTIPLA_ESCOLHA",
    enunciado,
    alternativas: alternativas.map((texto, k) => ({ id: "abcd"[k], texto })),
    correta,
    comentario: `${comentario} (Caderno do módulo, questão ${codigo}.)`,
    codigo,
    nivel,
    diagnostica: diag.has(codigo),
  }));
}

// ------------------------------------------------------------ videoaulas v2 (uma aula por vídeo)
type CenaV2 = {
  tipo: string; titulo?: string; objetivo?: string; narracao?: string; pergunta?: string; resposta?: string; conta?: string;
  rodape?: string; itens?: { texto: string }[];
};
type AulaV2 = { codigo: string; titulo: string; capitulo: string; fontes?: string[]; pendencias?: string[]; cenas: CenaV2[] };

/** Arquivo publicado na plataforma (o piloto da aula 3.4 foi publicado como M3-4-lingada). */
export const arquivoWebV2 = (codigo: string) => (codigo === "M3-piloto-lingada" ? "M3-4-lingada" : codigo);

const semMarcas = (s?: string) => (s ?? "").replace(/\{[^}]+\}/g, "").replace(/\[\[pausa:\d+\]\]/g, "").replace(/\s+/g, " ").trim();
const ordemDaAula = (a: AulaV2) => {
  const m = a.capitulo.match(/(?:Aula|Apoio) (\d+)(?:\.(\d+))?/);
  return m ? Number(m[2] ?? m[1]) : 99;
};

/** Lê os roteiros v2 (video/v2/cenas) de um prefixo, ex.: "m3-" ou "nr35-", na ordem das aulas. */
export function aulasV2(prefixo: string, raiz = process.cwd()): AulaV2[] {
  const dir = join(raiz, "video", "v2", "cenas");
  return readdirSync(dir).filter((f) => f.startsWith(prefixo) && f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as AulaV2)
    .sort((a, b) => ordemDaAula(a) - ordemDaAula(b));
}

/** Converte um roteiro v2 em aula da plataforma: texto da narração, material de leitura, situação real, pergunta e resumo. */
export function aulaDoRoteiroV2(a: AulaV2, raiz = process.cwd()): AulaSeed {
  const arq = arquivoWebV2(a.codigo);
  const duracoes = JSON.parse(readFileSync(join(raiz, "public", "videos", "v2", "duracoes.json"), "utf8")) as Record<string, number>;
  const seg = Math.round(duracoes[arq] ?? 0);
  if (!seg) throw new Error(`Duração não encontrada para ${arq} (public/videos/v2/duracoes.json).`);
  const abertura = a.cenas.find((c) => c.tipo === "abertura");
  const erro = a.cenas.find((c) => c.titulo?.startsWith("Erro frequente"));
  const pergunta = a.cenas.find((c) => c.tipo === "pergunta");
  const checklist = a.cenas.find((c) => c.tipo === "checklist");
  const ilustra = a.cenas.filter((c) => c.tipo === "ilustra" && c !== erro);
  const textoApoio = [
    abertura?.objetivo ? `Objetivo da aula: ${abertura.objetivo}` : "",
    ...ilustra.map((c) => [`■ ${c.titulo}`, c.itens?.length ? c.itens.map((i) => `• ${i.texto}`).join("\n") : semMarcas(c.narracao)].join("\n")),
    a.fontes?.length ? `Fontes: ${a.fontes.join("; ")}.` : "",
  ].filter(Boolean).join("\n\n");
  return {
    titulo: a.titulo,
    duracaoMin: Math.ceil(seg / 60),
    duracaoSeg: seg,
    videoUrl: `/videos/v2/${arq}.mp4`,
    legendaUrl: `/videos/v2/${arq}.vtt`,
    posterUrl: `/videos/v2/${arq}.jpg`,
    roteiro: a.cenas.map((c, n) => `CENA ${n + 1} — ${c.tipo}${c.titulo ? ` — ${c.titulo}` : ""}`).join("\n"),
    narracao: a.cenas.map((c) => semMarcas(c.narracao)).filter(Boolean).join("\n\n"),
    textoApoio,
    exemplo: erro ? [`${erro.titulo}.`, ...(erro.itens ?? []).map((i) => `• ${i.texto}`)].join("\n") : undefined,
    perguntaFixacao: pergunta?.pergunta,
    resumo: [...(checklist?.itens ?? []).map((i) => `• ${i.texto}`), checklist?.rodape ?? ""].filter(Boolean).join("\n"),
  };
}

/** Capítulo único do módulo, com uma aula por vídeo v2 (ex.: M3 = aulas 3.1 a 3.6). */
export function capitulosDoModulo(mod: ModuloMiniCurso, raiz = process.cwd()): CapituloSeed[] {
  const prefixo = `${mod.codigo.replace("MC-", "").toLowerCase()}-`;
  const aulas = aulasV2(prefixo, raiz);
  if (!aulas.length) throw new Error(`Sem roteiros v2 para ${mod.codigo}.`);
  return [{ titulo: mod.titulo, aulas: aulas.map((a) => aulaDoRoteiroV2(a, raiz)) }];
}
