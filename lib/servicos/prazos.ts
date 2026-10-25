// Prazos e alertas: calculados a partir dos dados (não há data inventada). Cada item informa de onde vem a data.
import { and, eq, isNull, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { exigir, type Ator } from "@/lib/permissoes";

export type Prazo = {
  chave: string;
  tipo: "ASO" | "CERTIFICADO" | "DOCUMENTO" | "EXPERIENCIA" | "PGR" | "PCMSO" | "PLANO_ACAO" | "MANUAL";
  titulo: string;
  venceEm: Date;
  dias: number; // negativo = vencido
  origem: string;
  colaboradorId?: string | null;
  colaboradorNome?: string | null;
  obraId?: string | null;
  href?: string;
  prazoManualId?: string;
};

const DIA = 86400_000;
const TIPO_ROTULO: Record<Prazo["tipo"], string> = {
  ASO: "Exame ocupacional", CERTIFICADO: "Treinamento", DOCUMENTO: "Documento", EXPERIENCIA: "Contrato de experiência",
  PGR: "Revisão do PGR", PCMSO: "Relatório anual do PCMSO", PLANO_ACAO: "Plano de ação", MANUAL: "Prazo cadastrado",
};
export { TIPO_ROTULO };

export async function listarPrazos(opcoes: { hoje?: Date; janelaDias?: number; obraId?: string | null; colaboradorId?: string } = {}) {
  const hoje = opcoes.hoje ?? new Date();
  const janela = opcoes.janelaDias ?? 60;
  const limite = new Date(+hoje + janela * DIA);
  const out: Prazo[] = [];
  const add = (p: Omit<Prazo, "dias">) => { if (p.venceEm <= limite) out.push({ ...p, dias: Math.floor((+p.venceEm - +hoje) / DIA) }); };

  const colabs = await db.query.colaboradores.findMany({
    where: opcoes.colaboradorId ? eq(schema.colaboradores.id, opcoes.colaboradorId) : opcoes.obraId ? eq(schema.colaboradores.obraId, opcoes.obraId) : undefined,
    with: { documentos: { with: { itemAdmissional: true } }, matriculas: { with: { curso: true } } },
  });
  for (const c of colabs) {
    const base = { colaboradorId: c.id, colaboradorNome: c.nome, obraId: c.obraId, href: `/admin/colaboradores/${c.id}` };
    // ASO: só o mais recente conta
    const asos = c.documentos.filter((d) => d.tipo === "ASO" && d.status !== "REJEITADO").sort((a, b) => +(b.emitidoEm ?? b.enviadoEm) - +(a.emitidoEm ?? a.enviadoEm));
    if (asos[0]?.validoAte) add({ ...base, chave: `aso-${asos[0].id}`, tipo: "ASO", titulo: `Próximo exame periódico — ${c.nome}`, venceEm: asos[0].validoAte, origem: "Data registrada na conferência do ASO, conforme o PCMSO" });
    // outros documentos com validade (o mais recente de cada item)
    const vistos = new Set<string>();
    for (const d of c.documentos.filter((d) => d.tipo !== "ASO" && d.validoAte && d.status !== "REJEITADO").sort((a, b) => +b.enviadoEm - +a.enviadoEm)) {
      const k = d.itemAdmissionalId ?? `${d.tipo}-${d.descricao}`;
      if (vistos.has(k)) continue;
      vistos.add(k);
      add({ ...base, chave: `doc-${d.id}`, tipo: "DOCUMENTO", titulo: `${d.itemAdmissional?.nome ?? d.descricao} — ${c.nome}`, venceEm: d.validoAte!, origem: "Validade informada no documento" });
    }
    // treinamentos com validade (matrícula mais recente de cada curso)
    const porCurso = new Map<string, (typeof c.matriculas)[number]>();
    for (const m of c.matriculas.filter((m) => m.status !== "CANCELADA")) { const a = porCurso.get(m.cursoId); if (!a || m.matriculadoEm > a.matriculadoEm) porCurso.set(m.cursoId, m); }
    for (const m of porCurso.values()) if (m.validoAte && (m.status === "CAPACITADO" || m.status === "VENCIDO")) {
      add({ ...base, chave: `mat-${m.id}`, tipo: "CERTIFICADO", titulo: `Reciclagem ${m.curso.codigo} — ${c.nome}`, venceEm: m.validoAte, origem: `Validade do curso (${m.curso.validadeOrigem === "LEGAL" ? "fixada pela norma" : "critério interno"})` });
    }
    // experiência (CLT, arts. 445 e 451)
    if (c.dataAdmissao && c.experienciaDias) {
      const fim1 = new Date(+c.dataAdmissao + (c.experienciaDias - 1) * DIA);
      if (fim1 >= new Date(+hoje - 7 * DIA)) add({ ...base, chave: `exp1-${c.id}`, tipo: "EXPERIENCIA", titulo: `Fim do 1º período de experiência — ${c.nome}`, venceEm: fim1, origem: `Admissão ${c.dataAdmissao.toLocaleDateString("pt-BR")} + ${c.experienciaDias} dias` });
      if (c.experienciaProrrogacaoDias) {
        const fim2 = new Date(+fim1 + c.experienciaProrrogacaoDias * DIA);
        if (fim2 >= new Date(+hoje - 7 * DIA)) add({ ...base, chave: `exp2-${c.id}`, tipo: "EXPERIENCIA", titulo: `Fim da prorrogação da experiência — ${c.nome}`, venceEm: fim2, origem: `Prorrogação de ${c.experienciaProrrogacaoDias} dias (total máximo 90 dias)` });
      }
    }
  }

  if (!opcoes.colaboradorId) {
    for (const p of await db.query.pgrs.findMany({ where: eq(schema.pgrs.status, "APROVADO") })) {
      if (opcoes.obraId && p.obraId !== opcoes.obraId) continue;
      if (p.proximaRevisao) add({ chave: `pgr-${p.id}`, tipo: "PGR", titulo: `Revisão do PGR — ${p.titulo} (v${p.versao})`, venceEm: p.proximaRevisao, origem: "Revisão a cada 2 anos (NR-1, 1.5.4.4.6)", obraId: p.obraId, href: `/admin/sst/pgr/${p.id}` });
      const acoes = await db.query.acoesPlano.findMany({ where: and(eq(schema.acoesPlano.pgrId, p.id), ne(schema.acoesPlano.status, "CONCLUIDA"), ne(schema.acoesPlano.status, "CANCELADA")) });
      for (const a of acoes) if (a.prazo) add({ chave: `acao-${a.id}`, tipo: "PLANO_ACAO", titulo: `${a.medida} (${a.responsavel})`, venceEm: a.prazo, origem: `Plano de ação — ${p.titulo}`, obraId: p.obraId, href: `/admin/sst/pgr/${p.id}#plano` });
    }
    for (const p of await db.query.pcmsos.findMany({ where: eq(schema.pcmsos.status, "APROVADO") })) {
      if (opcoes.obraId && p.obraId !== opcoes.obraId) continue;
      if (p.proximoRelatorioAnual) add({ chave: `pcmso-${p.id}`, tipo: "PCMSO", titulo: `Relatório analítico anual — ${p.titulo}`, venceEm: p.proximoRelatorioAnual, origem: "Relatório analítico anual (NR-7)", obraId: p.obraId, href: `/admin/sst/pcmso` });
    }
  }
  const manuais = await db.query.prazos.findMany({ where: isNull(schema.prazos.concluidoEm), with: { colaborador: true } });
  for (const m of manuais) {
    if (opcoes.colaboradorId && m.colaboradorId !== opcoes.colaboradorId) continue;
    if (opcoes.obraId && m.obraId !== opcoes.obraId && m.colaborador?.obraId !== opcoes.obraId) continue;
    const venceEm = m.venceEm;
    if (+venceEm - m.avisarDiasAntes * DIA <= +limite || venceEm <= limite)
      out.push({ chave: `man-${m.id}`, tipo: "MANUAL", titulo: m.titulo, venceEm, dias: Math.floor((+venceEm - +hoje) / DIA), origem: m.observacao ?? "Cadastrado pela equipe", colaboradorId: m.colaboradorId, colaboradorNome: m.colaborador?.nome, obraId: m.obraId, prazoManualId: m.id });
  }
  return out.sort((a, b) => +a.venceEm - +b.venceEm);
}

export async function criarPrazo(ator: Ator, dados: { titulo: string; venceEm: Date; colaboradorId?: string | null; obraId?: string | null; avisarDiasAntes?: number; observacao?: string | null }) {
  exigir(ator, "prazo.ver");
  if (!dados.titulo.trim()) throw new Error("Informe o que vence.");
  const [p] = await db.insert(schema.prazos).values({ ...dados, titulo: dados.titulo.trim(), avisarDiasAntes: dados.avisarDiasAntes ?? 30, criadoPorId: ator.id }).returning();
  await auditar(ator, "prazo.criado", "prazo", p.id, { titulo: p.titulo });
}

export async function concluirPrazo(ator: Ator, id: string) {
  exigir(ator, "prazo.ver");
  await db.update(schema.prazos).set({ concluidoEm: new Date() }).where(eq(schema.prazos.id, id));
  await auditar(ator, "prazo.concluido", "prazo", id, {});
}
