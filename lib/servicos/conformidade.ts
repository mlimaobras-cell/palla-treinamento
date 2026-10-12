// Semáforo de acesso à obra. Calcula a situação documental; NÃO libera ninguém.
// A liberação é sempre um ato humano registrado (ver liberacao.ts).
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type Situacao = "OK" | "PENDENTE" | "IMPEDITIVO";
export type ItemConformidade = { grupo: string; descricao: string; situacao: Situacao; detalhe?: string };
export type Semaforo = "VERDE" | "AMARELO" | "VERMELHO";

const EXIGIDOS = new Set(["OBRIGATORIO", "INTERNO", "CONDICIONAL"]);

export async function avaliarColaborador(colaboradorId: string, hoje = new Date()) {
  const c = await db.query.colaboradores.findFirst({
    where: eq(schema.colaboradores.id, colaboradorId),
    with: {
      matriculas: { with: { curso: true } },
      documentos: true,
      autorizacoes: true,
      liberacoes: true,
      obra: true,
    },
  });
  if (!c) throw new Error("Colaborador não encontrado.");
  const itens: ItemConformidade[] = [];

  // 1. Treinamentos exigidos (a matrícula mais recente de cada curso vale)
  const porCurso = new Map<string, (typeof c.matriculas)[number]>();
  for (const m of c.matriculas.filter((m) => m.status !== "CANCELADA" && EXIGIDOS.has(m.classificacao))) {
    const atual = porCurso.get(m.cursoId);
    if (!atual || m.matriculadoEm > atual.matriculadoEm) porCurso.set(m.cursoId, m);
  }
  for (const m of [...porCurso.values()].sort((a, b) => a.curso.ordem - b.curso.ordem)) {
    const nome = `${m.curso.codigo} · ${m.curso.titulo}`;
    const vencido = m.status === "VENCIDO" || (m.validoAte && m.validoAte < hoje);
    if (m.status === "CAPACITADO" && !vencido) {
      itens.push({ grupo: "Treinamentos", descricao: nome, situacao: "OK", detalhe: m.validoAte ? `válido até ${m.validoAte.toLocaleDateString("pt-BR")}` : undefined });
    } else if (vencido) {
      itens.push({ grupo: "Treinamentos", descricao: nome, situacao: "IMPEDITIVO", detalhe: "Certificado vencido: reciclagem necessária" });
    } else if (m.status === "REPROVADO") {
      itens.push({ grupo: "Treinamentos", descricao: nome, situacao: "IMPEDITIVO", detalhe: "Reprovado: aguarda reavaliação" });
    } else {
      const det: Record<string, string> = {
        MATRICULADO: "Não iniciado", EM_ANDAMENTO: "Em andamento", TEORIA_CONCLUIDA: "Teoria concluída",
        PENDENTE_PRATICA: "Pendente de prática presencial", AGUARDANDO_APROVACAO: "Aguardando aprovação do responsável técnico",
      };
      itens.push({ grupo: "Treinamentos", descricao: nome, situacao: "PENDENTE", detalhe: det[m.status] ?? m.status });
    }
  }

  // 2. ASO — documento médico; nunca gerado pela plataforma
  const asos = c.documentos.filter((d) => d.tipo === "ASO" && d.status !== "REJEITADO")
    .sort((a, b) => +(b.emitidoEm ?? b.enviadoEm) - +(a.emitidoEm ?? a.enviadoEm));
  const aso = asos[0];
  if (!aso) itens.push({ grupo: "Documentos", descricao: "ASO", situacao: "IMPEDITIVO", detalhe: "Não enviado" });
  else if (aso.validoAte && aso.validoAte < hoje) itens.push({ grupo: "Documentos", descricao: "ASO", situacao: "IMPEDITIVO", detalhe: "Vencido" });
  else if (aso.status === "PENDENTE_CONFERENCIA") itens.push({ grupo: "Documentos", descricao: "ASO", situacao: "PENDENTE", detalhe: "Aguardando conferência" });
  else itens.push({ grupo: "Documentos", descricao: "ASO", situacao: "OK", detalhe: aso.validoAte ? `válido até ${aso.validoAte.toLocaleDateString("pt-BR")}` : undefined });

  // aptidões exigidas pelos cursos da trilha (ex.: altura, espaço confinado)
  const aptidoesExigidas = new Set([...porCurso.values()].map((m) => m.curso.exigeAptidaoAso).filter(Boolean) as string[]);
  for (const apt of aptidoesExigidas) {
    const tem = aso && aso.status === "CONFERIDO" && (aso.aptidoes ?? "").split(";").map((s) => s.trim()).includes(apt);
    itens.push({
      grupo: "Documentos", descricao: `ASO com aptidão para ${apt}`,
      situacao: tem ? "OK" : aso?.status === "PENDENTE_CONFERENCIA" ? "PENDENTE" : "IMPEDITIVO",
      detalhe: tem ? undefined : "Aptidão não registrada no ASO conferido",
    });
  }

  // 3. Ficha de EPI
  const epi = c.documentos.find((d) => d.tipo === "FICHA_EPI" && d.status !== "REJEITADO");
  itens.push(!epi
    ? { grupo: "Documentos", descricao: "Ficha de entrega de EPI", situacao: "IMPEDITIVO", detalhe: "Não registrada" }
    : epi.status === "PENDENTE_CONFERENCIA"
      ? { grupo: "Documentos", descricao: "Ficha de entrega de EPI", situacao: "PENDENTE", detalhe: "Aguardando conferência" }
      : { grupo: "Documentos", descricao: "Ficha de entrega de EPI", situacao: "OK" });

  // 4. Documentos extras da contratante
  if (c.obra?.exigenciasExtras) {
    const doc = c.documentos.find((d) => d.tipo === "DOCUMENTO_CONTRATANTE" && d.status !== "REJEITADO");
    itens.push({
      grupo: "Documentos", descricao: "Documentos exigidos pela contratante",
      situacao: !doc ? "IMPEDITIVO" : doc.status === "CONFERIDO" ? "OK" : "PENDENTE",
      detalhe: c.obra.exigenciasExtras,
    });
  }

  // 5. Autorizações formais exigidas pelos cursos (ex.: NR-35, 35.4.1)
  const atividades = new Set([...porCurso.values()].map((m) => m.curso.exigeAutorizacao).filter(Boolean) as string[]);
  for (const at of atividades) {
    const a = c.autorizacoes.find((x) => x.atividade === at && !x.revogadaEm && (!x.validoAte || x.validoAte >= hoje));
    itens.push({ grupo: "Autorizações", descricao: `Autorização: ${at}`, situacao: a ? "OK" : "PENDENTE", detalhe: a ? undefined : "Aguardando autorização formal da SST" });
  }

  // 6. Afastamento > 180 dias exige treinamento eventual (NR-1, 1.7.1.2.3 c)
  if (c.afastadoDesde && (+hoje - +c.afastadoDesde) / 86400_000 > 180) {
    itens.push({ grupo: "Treinamentos", descricao: "Retorno de afastamento > 180 dias", situacao: "PENDENTE", detalhe: "Treinamento eventual exigido (NR-1, 1.7.1.2.3)" });
  }

  const semaforo: Semaforo = itens.some((i) => i.situacao === "IMPEDITIVO") ? "VERMELHO"
    : itens.some((i) => i.situacao === "PENDENTE") ? "AMARELO" : "VERDE";
  const liberacaoAtiva = c.liberacoes.find((l) => l.obraId === c.obraId && !l.revogadaEm) ?? null;
  return { colaborador: c, itens, semaforo, liberacaoAtiva };
}

export const SEMAFORO_TEXTO: Record<Semaforo, { titulo: string; descricao: string }> = {
  VERDE: { titulo: "Documentação conferida", descricao: "Atende aos requisitos cadastrados para a obra e a função, sujeito à validação final do responsável designado." },
  AMARELO: { titulo: "Pendências", descricao: "Há documentação, treinamento, avaliação ou autorização aguardando conclusão ou conferência." },
  VERMELHO: { titulo: "Não liberado", descricao: "Não atende a um ou mais requisitos necessários." },
};
