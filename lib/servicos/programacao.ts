// Programação de treinamento: distribui os cursos pendentes da trilha em dias úteis a partir de uma data de início.
// Regra (a mesma do antigo emissor PALLA Certificados): 8 h por dia, sem sábados, domingos e feriados nacionais.
// É um documento de PLANEJAMENTO: não registra realização nem libera certificado.
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export const HORAS_POR_DIA = 8;

/** Cursos que já não precisam entrar na programação. */
const FORA_DA_PROGRAMACAO = new Set(["CAPACITADO", "CANCELADA", "AGUARDANDO_APROVACAO"]);

export type ItemEntrada = { id: string; codigo: string; titulo: string; horas: number | null; modalidade: string; exigePratica: boolean };
export type Bloco = { data: string; horas: number }; // data ISO (AAAA-MM-DD)
export type ItemProgramado = ItemEntrada & { horasPlanejadas: number; cargaADefinir: boolean; blocos: Bloco[]; inicio: string; fim: string };

const iso = (d: Date) => d.toISOString().slice(0, 10);
const dia = (s: string) => new Date(`${s}T12:00:00Z`);
const somarDias = (d: Date, n: number) => new Date(d.getTime() + n * 86400_000);

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
function pascoa(ano: number): Date {
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), diaMes = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(ano, mes - 1, diaMes, 12));
}

/** Feriados nacionais (Lei 662/1949 e alterações, incluindo 20/11 pela Lei 14.759/2023) e Sexta-feira Santa. */
export function feriadosNacionais(ano: number): Map<string, string> {
  const f = new Map<string, string>([
    [`${ano}-01-01`, "Confraternização Universal"],
    [`${ano}-04-21`, "Tiradentes"],
    [`${ano}-05-01`, "Dia do Trabalho"],
    [`${ano}-09-07`, "Independência"],
    [`${ano}-10-12`, "Nossa Senhora Aparecida"],
    [`${ano}-11-02`, "Finados"],
    [`${ano}-11-15`, "Proclamação da República"],
    [`${ano}-11-20`, "Dia Nacional de Zumbi e da Consciência Negra"],
    [`${ano}-12-25`, "Natal"],
  ]);
  f.set(iso(somarDias(pascoa(ano), -2)), "Sexta-feira Santa");
  return f;
}

export function diaUtil(d: Date): boolean {
  const s = d.getUTCDay();
  return s !== 0 && s !== 6 && !feriadosNacionais(d.getUTCFullYear()).has(iso(d));
}

function proximoUtil(d: Date): Date {
  let r = d;
  while (!diaUtil(r)) r = somarDias(r, 1);
  return r;
}

/**
 * Distribui os cursos em sequência. Um curso pode ocupar vários dias e um dia pode ter mais de um curso,
 * sempre até HORAS_POR_DIA. Curso presencial de até 8 h fica inteiro num mesmo dia.
 * Curso sem carga fixada entra com 1 dia (8 h) marcado como "a definir".
 */
export function programar(itens: ItemEntrada[], inicioIso: string): ItemProgramado[] {
  let atual = proximoUtil(dia(inicioIso));
  let livres = HORAS_POR_DIA;
  const r: ItemProgramado[] = [];
  for (const it of itens) {
    const cargaADefinir = it.horas == null || it.horas <= 0;
    const total = cargaADefinir ? HORAS_POR_DIA : it.horas!;
    let resta = total;
    const blocos: Bloco[] = [];
    // Turma presencial que cabe num dia não é partida: começa no próximo dia útil se não couber no que sobrou.
    if (it.modalidade === "PRESENCIAL" && total <= HORAS_POR_DIA && livres + 1e-9 < total) livres = 0;
    while (resta > 1e-9) {
      if (livres <= 1e-9) { atual = proximoUtil(somarDias(atual, 1)); livres = HORAS_POR_DIA; }
      const h = Math.min(resta, livres);
      blocos.push({ data: iso(atual), horas: Math.round(h * 100) / 100 });
      resta -= h; livres -= h;
    }
    r.push({ ...it, horasPlanejadas: total, cargaADefinir, blocos, inicio: blocos[0].data, fim: blocos[blocos.length - 1].data });
  }
  return r;
}

/** Dados da programação de um colaborador: cursos ainda não concluídos da trilha, na ordem do catálogo. */
export async function programacaoDoColaborador(colaboradorId: string, inicioIso: string, incluirRecomendados = false) {
  const c = await db.query.colaboradores.findFirst({
    where: eq(schema.colaboradores.id, colaboradorId),
    with: { funcao: true, obra: true, empresa: true, matriculas: { with: { curso: true } } },
  });
  if (!c) return null;
  const pendentes = c.matriculas
    .filter((m) => !FORA_DA_PROGRAMACAO.has(m.status) && (incluirRecomendados || m.classificacao !== "RECOMENDADO"))
    .sort((a, b) => a.curso.ordem - b.curso.ordem);
  const itens = programar(pendentes.map((m) => ({
    id: m.id, codigo: m.curso.codigo, titulo: m.curso.titulo, horas: m.curso.cargaHoraria,
    modalidade: m.curso.modalidade, exigePratica: m.curso.exigePratica,
  })), inicioIso);
  const recomendadosFora = c.matriculas.filter((m) => m.classificacao === "RECOMENDADO" && !FORA_DA_PROGRAMACAO.has(m.status)).length;
  return { colaborador: c, itens, recomendadosFora: incluirRecomendados ? 0 : recomendadosFora };
}

/** Feriados que caem dentro do período programado (para listar no rodapé). */
export function feriadosNoPeriodo(inicioIso: string, fimIso: string) {
  const r: { data: string; nome: string }[] = [];
  for (let a = dia(inicioIso).getUTCFullYear(); a <= dia(fimIso).getUTCFullYear(); a++) {
    for (const [d, n] of feriadosNacionais(a)) if (d >= inicioIso && d <= fimIso) r.push({ data: d, nome: n });
  }
  return r.sort((x, y) => x.data.localeCompare(y.data));
}
