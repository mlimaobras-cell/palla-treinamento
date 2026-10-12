// Mini curso de montagem de estruturas metálicas (M1–M8): cursos internos semipresenciais.
// Fluxo online: avaliação diagnóstica (antes do vídeo) → videoaula → avaliação final → prática presencial com o instrutor.
// A videoaula de cada módulo é montada a partir do arquivo de cenas usado para gerar o vídeo (video/cenas/*.json),
// para que roteiro, narração e texto de apoio na plataforma sejam exatamente os do vídeo publicado.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CapituloSeed, QuestaoSeed } from "../integracao";
import type { Q } from "./tipos";
import { m1 } from "./m1";
import { m2 } from "./m2";
import { m3 } from "./m3";
import { m4 } from "./m4";
import { m5 } from "./m5";
import { m6 } from "./m6";
import { m7 } from "./m7";
import { m8 } from "./m8";

type Item = string | { titulo: string; texto?: string };
type Cena = { tipo: string; pequeno?: string; titulo?: string; texto?: string; caixa?: string; itens?: Item[]; rodape?: string; narracao?: string };

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

const limpar = (s?: string) => (s ?? "").replace(/<[^>]+>/g, "").trim();
const itemTexto = (i: Item) => (typeof i === "string" ? i : [i.titulo, i.texto].filter(Boolean).join(": "));

export function capitulosDoModulo(mod: ModuloMiniCurso, raiz = process.cwd()): CapituloSeed[] {
  const cenasArq = join(raiz, "video", "cenas", `${mod.arquivo.toLowerCase()}.json`);
  const metaArq = join(raiz, "public", "videos", "curso", `${mod.arquivo}.json`);
  const { cenas } = JSON.parse(readFileSync(cenasArq, "utf8")) as { cenas: Cena[] };
  const { duracao } = JSON.parse(readFileSync(metaArq, "utf8")) as { duracao: number };

  const conteudo = cenas.filter((c) => !["abertura", "encerramento", "resumo"].includes(c.tipo));
  const resumo = cenas.find((c) => c.tipo === "resumo");
  const roteiro = cenas.map((c, n) => `CENA ${n + 1} — ${c.tipo}${c.titulo ? ` — ${limpar(c.titulo)}` : ""}`).join("\n");
  const narracao = cenas.map((c) => c.narracao).filter(Boolean).join("\n\n");
  const textoApoio = conteudo.map((c) => {
    const partes = [`■ ${limpar(c.titulo)}`];
    if (c.texto) partes.push(limpar(c.texto));
    if (c.caixa) partes.push(`${limpar(c.caixa)}:`);
    if (c.itens?.length) partes.push(c.itens.map((i) => `• ${limpar(itemTexto(i))}`).join("\n"));
    if (c.rodape) partes.push(limpar(c.rodape));
    return partes.join("\n");
  }).join("\n\n");
  const frase = cenas.find((c) => c.tipo === "frase");

  return [{
    titulo: mod.titulo,
    aulas: [{
      titulo: `Videoaula — ${mod.titulo}`,
      duracaoMin: Math.ceil(duracao / 60),
      videoUrl: `/videos/curso/web/${mod.arquivo}.mp4`,
      legendaUrl: `/videos/curso/${mod.arquivo}.vtt`,
      roteiro,
      narracao,
      textoApoio,
      exemplo: frase ? `${limpar(frase.titulo)} ${limpar(frase.texto)}`.trim() : undefined,
      resumo: resumo?.itens?.map((i) => `• ${limpar(itemTexto(i))}`).join("\n") ?? "",
    }],
  }];
}
