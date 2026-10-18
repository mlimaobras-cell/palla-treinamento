// Vídeos v2 da Integração (INT-01), da Segurança na montagem (PAL-52) e APRESENTAÇÕES curtas de NR-17, NR-23, NR-26 e NR-33.
// As apresentações mostram o que é a norma, para quem é e como é o treinamento; NÃO substituem a capacitação
// (NR-33 é presencial, com prática; NR-23 informativa não forma brigadista). Parâmetros vêm de db/catalogo.ts.
// Status: EM REVISÃO pelo responsável técnico.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AulaSeed, CapituloSeed, QuestaoSeed } from "./integracao";

type Item = { m?: string; titulo?: string; texto?: string };
type Cena = { tipo: string; titulo?: string; narracao: string; objetivo?: string; caso?: boolean; cards?: Item[]; etapas?: Item[]; itens?: Item[]; colunas?: { titulo: string; itens: Item[] }[];
  pergunta?: string; rodape?: string; aviso?: string };
export type Roteiro = { codigo: string; titulo: string; fontes?: string[]; nota?: string; cenas: Cena[] };

const semMarcas = (s?: string) => (s ?? "").replace(/\{[^}]+\}/g, "").replace(/\[\[pausa:\d+\]\]/g, "").replace(/\s+/g, " ").trim();
const ler = (arq: string, raiz: string): Roteiro => JSON.parse(readFileSync(join(raiz, "video", "v2", "cenas", arq), "utf8"));
const duracoes = (raiz: string) => JSON.parse(readFileSync(join(raiz, "public", "videos", "v2", "duracoes.json"), "utf8")) as Record<string, number>;

/** Campos de vídeo de um roteiro v2 publicado (public/videos/v2/<codigo>.*). */
export function videoV2(codigo: string, raiz = process.cwd()): Pick<AulaSeed, "videoUrl" | "legendaUrl" | "posterUrl" | "duracaoSeg"> {
  const seg = Math.round(duracoes(raiz)[codigo] ?? 0);
  if (!seg) throw new Error(`Duração não encontrada para ${codigo} (public/videos/v2/duracoes.json).`);
  return { videoUrl: `/videos/v2/${codigo}.mp4`, legendaUrl: `/videos/v2/${codigo}.vtt`, posterUrl: `/videos/v2/${codigo}.jpg`, duracaoSeg: seg };
}

/** Acrescenta o vídeo v2 às aulas existentes (mesmos títulos e textos), na ordem dada. */
export function comVideos(capitulos: CapituloSeed[], codigos: string[], raiz = process.cwd()): CapituloSeed[] {
  let i = 0;
  return capitulos.map((c) => ({ ...c, aulas: c.aulas.map((a) => {
    const cod = codigos[i++];
    if (!cod) return a;
    const v = videoV2(cod, raiz);
    return { ...a, ...v, duracaoMin: Math.ceil(v.duracaoSeg! / 60) };
  }) }));
}

/** Aula a partir de um roteiro v2 com cenas genéricas (foto, cartões, etapas, colunas, situação real, pergunta, resumo). */
export function aulaDoRoteiroGenerico(r: Roteiro, raiz = process.cwd(), apresentacao = false): AulaSeed {
  const v = videoV2(r.codigo, raiz);
  const lin = (i: Item) => `• ${[i.titulo, i.texto].filter(Boolean).join(": ")}`;
  const casoCena = r.cenas.find((c) => c.caso);
  const blocos = r.cenas.filter((c) => (["cartoes", "etapas", "colunas"].includes(c.tipo) || (c.tipo === "foto" && c.itens?.length && c !== r.cenas[0])) && !c.caso).map((c) => [
    `■ ${c.titulo ?? ""}`,
    ...(c.cards ?? c.etapas ?? []).map(lin),
    ...(c.tipo === "foto" ? (c.itens ?? []).map(lin) : []),
    ...(c.colunas ?? []).flatMap((col) => [`${col.titulo}:`, ...col.itens.map(lin)]),
    c.aviso ? `Obs.: ${c.aviso}` : "",
  ].filter(Boolean).join("\n"));
  const ab = r.cenas.find((c) => c.tipo === "abertura"), pg = r.cenas.find((c) => c.tipo === "pergunta"), ck = r.cenas.find((c) => c.tipo === "checklist");
  return {
    titulo: r.titulo, ...v, duracaoMin: Math.ceil(v.duracaoSeg! / 60),
    roteiro: r.cenas.map((c, n) => `CENA ${n + 1} — ${c.tipo}${c.titulo ? ` — ${c.titulo}` : ""}`).join("\n"),
    narracao: r.cenas.map((c) => semMarcas(c.narracao)).join("\n\n"),
    textoApoio: [ab?.objetivo ? `Objetivo: ${ab.objetivo}` : "", ...blocos,
      apresentacao ? "Esta aula é uma apresentação: mostra o que é a norma, para quem é e como é o treinamento. Ela não substitui a capacitação prevista para a sua função." : "",
      r.nota ?? "",
      r.fontes?.length ? `Fontes: ${r.fontes.join("; ")}.` : ""].filter(Boolean).join("\n\n"),
    exemplo: casoCena ? semMarcas(casoCena.narracao) : undefined,
    perguntaFixacao: pg?.pergunta,
    resumo: [...(ck?.itens ?? []).map((i) => `• ${i.texto}`), ck?.rodape ?? ""].filter(Boolean).join("\n"),
  };
}

/** Lê o roteiro v2 pelo código (arquivo video/v2/cenas/<codigo em minúsculas>.json). */
export const roteiroPorCodigo = (codigo: string, raiz = process.cwd()) => ler(`${codigo.toLowerCase()}.json`, raiz);

export const VIDEOS_INT = ["INT-1-quem-somos", "INT-2-missao", "INT-3-conduta", "INT-4-direitos", "INT-5-lideranca", "INT-6-canteiro", "INT-7-celular",
  "INT-8-regras-ouro", "INT-9-prevencao", "INT-10-alcool", "INT-11-incidentes", "INT-12-disciplina", "INT-13-encerramento"];
export const VIDEOS_PAL52 = ["PAL52-1-esmagamento", "PAL52-2-estabilidade", "PAL52-3-suspensa"];

const ARQ = { "NR17-ERG": "nr17-apresentacao.json", "NR23-INC": "nr23-apresentacao.json", "NR26-SIN": "nr26-apresentacao.json", "NR33-TAV": "nr33-apresentacao.json", "NR33-SUP": "nr33-apresentacao.json" } as const;
export type CursoApresentacao = keyof typeof ARQ;
export const CURSOS_APRESENTACAO = Object.keys(ARQ) as CursoApresentacao[];

export function capitulosApresentacao(curso: CursoApresentacao, raiz = process.cwd()): CapituloSeed[] {
  return [{ titulo: "Apresentação", aulas: [aulaDoRoteiroGenerico(ler(ARQ[curso], raiz), raiz, true)] }];
}

const q = (enunciado: string, alts: string[], correta: string, comentario: string, tipo: QuestaoSeed["tipo"] = "MULTIPLA_ESCOLHA"): QuestaoSeed =>
  ({ tipo, enunciado, alternativas: alts.map((texto, i) => ({ id: "abcd"[i], texto })), correta, comentario });

const QUESTOES: Record<"NR17" | "NR23" | "NR26" | "NR33", QuestaoSeed[]> = {
  NR17: [
    q("Ao levantar uma caixa de parafusos do chão, qual é a forma correta?", ["Costas curvadas e pernas esticadas", "Joelhos dobrados, costas retas e carga perto do corpo", "Braços esticados, carga longe do corpo", "Girar o tronco enquanto levanta"], "b", "Carga perto do corpo, joelhos dobrados e costas retas reduzem o esforço na coluna."),
    q("A peça é pesada demais para uma pessoa. O que fazer?", ["Tentar sozinho com cuidado", "Arrastar pelo chão", "Pedir ajuda ou usar equipamento de movimentação", "Esperar o fim do turno"], "c", "Carga acima da capacidade de uma pessoa: ajuda de colegas ou equipamento."),
    q("Com a carga nas mãos, você precisa mudar de direção. Como?", ["Girar só o tronco", "Virar o corpo inteiro com os pés", "Jogar a carga para o lado", "Inclinar e girar ao mesmo tempo"], "b", "Girar o tronco com carga sobrecarrega a coluna; vire com os pés."),
    q("Sentiu dor nas costas depois de um dia de aperto de parafusos. O que fazer?", ["Ignorar", "Comunicar o encarregado ou a SST", "Tomar remédio por conta própria e seguir", "Trocar de função sem avisar"], "b", "Dor ou desconforto deve ser comunicado para avaliar a atividade e a organização do trabalho."),
    q("Qual destes é um risco ergonômico comum na montagem?", ["Trabalho com braços acima da cabeça por longo tempo", "Uso de capacete", "Leitura do projeto", "Participar do DDS"], "a", "Posturas como braços acima da cabeça e tronco torcido são riscos ergonômicos."),
  ],
  NR23: [
    q("O fogo precisa de três elementos. Quais?", ["Combustível, oxigênio e calor", "Água, ar e terra", "Fumaça, calor e luz", "Gás, óleo e madeira"], "a", "Tirando um dos três, o fogo apaga: é a base da prevenção e do combate."),
    q("Fogo em um painel elétrico energizado é de qual classe?", ["Classe A", "Classe B", "Classe C", "Não tem classe"], "c", "Classe C: equipamentos elétricos energizados. Água não pode ser usada."),
    q("Qual é a primeira atitude ao perceber um incêndio?", ["Filmar com o celular", "Dar o alarme e acionar a emergência da obra", "Voltar para pegar a ferramenta", "Esperar alguém ver"], "b", "Alarme primeiro; depois, princípio de incêndio só se for seguro e se você souber usar o extintor."),
    q("Ao abandonar a área, o que fazer?", ["Correr e voltar se esquecer algo", "Sair pela rota de fuga e ir ao ponto de encontro", "Usar qualquer caminho", "Ficar no local para ver"], "b", "Rota de fuga, sem correr e sem voltar, até o ponto de encontro."),
    q("O treinamento informativo da NR-23 forma brigadista?", ["Sim", "Não; brigada segue a legislação estadual e normas técnicas", "Só se tiver prova", "Só para encarregados"], "b", "O curso é informativo; formação de brigada tem requisitos próprios."),
  ],
  NR26: [
    q("Placa redonda com borda e barra vermelhas indica:", ["Obrigação", "Proibição", "Emergência", "Advertência"], "b", "Círculo com barra vermelha: proibição."),
    q("Placa triangular amarela indica:", ["Advertência (atenção a um perigo)", "Saída de emergência", "Proibição", "Obrigação"], "a", "Triângulo amarelo: advertência."),
    q("Placa redonda azul, como 'uso obrigatório de capacete', indica:", ["Proibição", "Obrigação", "Emergência", "Informação comercial"], "b", "Círculo azul: obrigação."),
    q("Onde encontrar os perigos, o uso seguro e o que fazer em emergência com um produto químico?", ["No rótulo e na FDS (ficha com dados de segurança)", "Só na nota fiscal", "No crachá", "Em nenhum lugar"], "a", "Rótulo e FDS trazem as informações de segurança do produto."),
    q("Encontrou um frasco de solvente sem rótulo. O que fazer?", ["Usar com cuidado", "Cheirar para identificar", "Não usar e comunicar a liderança", "Misturar com outro produto"], "c", "Produto sem rótulo não se usa: comunique para identificação e descarte adequado."),
  ],
  NR33: [
    q("Qual destas características define um espaço confinado?", ["Ambiente climatizado", "Não projetado para ocupação contínua, entrada e saída limitadas e atmosfera perigosa possível", "Qualquer sala fechada", "Qualquer local acima de 2 m"], "b", "Definição da NR-33: não projetado para ocupação contínua, meios limitados de entrada e saída e atmosfera perigosa existente ou possível."),
    q("Quem fica do lado de fora durante toda a entrada?", ["O supervisor de entrada, só no início", "O vigia", "Ninguém", "O motorista"], "b", "O vigia permanece fora do espaço confinado durante toda a atividade."),
    q("Qual documento libera a entrada?", ["Ordem de compra", "PET — Permissão de Entrada e Trabalho", "Crachá", "Ficha de EPI"], "b", "A PET é emitida pelo supervisor de entrada antes da entrada."),
    q("Um colega desmaiou dentro de um tanque. Qual a atitude correta?", ["Entrar imediatamente para puxá-lo", "Acionar a emergência e o resgate preparado, sem entrar", "Jogar água", "Esperar ele acordar"], "b", "Quem entra sem preparo e sem equipamento pode virar a segunda vítima."),
    q("O treinamento de trabalhador autorizado e vigia é:", ["Só online", "Presencial, com prática (catálogo: 16 h, metade prática)", "Dispensável com experiência", "Feito uma única vez na vida"], "b", "Capacitação presencial com prática e periódico anual, conforme NR-33 (Anexo III) e o catálogo da plataforma."),
  ],
};

export function questoesApresentacao(curso: CursoApresentacao): QuestaoSeed[] {
  return QUESTOES[curso.slice(0, 4) as keyof typeof QUESTOES];
}
