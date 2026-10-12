import { and, eq, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import { avaliarColaborador, type Semaforo } from "./conformidade";

export type FiltrosPainel = { obra?: string; funcao?: string; empresa?: string; situacao?: string; busca?: string; curso?: string; de?: string; ate?: string };

/** Lista de colaboradores com semáforo calculado (adequado para centenas de registros; em escala maior, materializar). */
export async function listarColaboradores(f: FiltrosPainel, restringirObraGestor?: string) {
  const cond: SQL[] = [];
  if (f.obra) cond.push(eq(schema.colaboradores.obraId, f.obra));
  if (restringirObraGestor) cond.push(eq(schema.colaboradores.obraId, restringirObraGestor));
  if (f.funcao) cond.push(eq(schema.colaboradores.funcaoId, f.funcao));
  if (f.empresa) cond.push(eq(schema.colaboradores.empresaId, f.empresa));
  const base = await db.query.colaboradores.findMany({
    where: cond.length ? and(...cond) : undefined,
    with: { funcao: true, obra: true, empresa: true },
    orderBy: (c, { asc }) => asc(c.nome),
  });
  const busca = f.busca?.toLowerCase().trim();
  const filtrados = busca ? base.filter((c) => c.nome.toLowerCase().includes(busca)) : base;
  const comSemaforo = await Promise.all(filtrados.map(async (c) => {
    const r = await avaliarColaborador(c.id);
    return { ...c, semaforo: r.semaforo as Semaforo, pendencias: r.itens.filter((i) => i.situacao !== "OK"), liberado: !!r.liberacaoAtiva, matriculas: r.colaborador.matriculas };
  }));
  return f.situacao ? comSemaforo.filter((c) => c.semaforo === f.situacao) : comSemaforo;
}

export async function indicadores(f: FiltrosPainel, restringirObraGestor?: string) {
  const lista = await listarColaboradores({ ...f, situacao: undefined }, restringirObraGestor);
  const ids = new Set(lista.map((c) => c.id));
  const mats = lista.flatMap((c) => c.matriculas.filter((m) => m.status !== "CANCELADA" && (!f.curso || m.cursoId === f.curso)));
  const certs = (await db.query.certificados.findMany({ with: { matricula: true } }))
    .filter((c) => ids.has(c.matricula.colaboradorId) && c.tipo === "INTEGRAL" && (!f.curso || c.matricula.cursoId === f.curso))
    .filter((c) => (!f.de || c.emitidoEm >= new Date(f.de)) && (!f.ate || c.emitidoEm <= new Date(`${f.ate}T23:59:59`)));
  const hoje = Date.now();
  const em60 = hoje + 60 * 86400_000;
  const porFuncao = new Map<string, { nome: string; total: number; verde: number; amarelo: number; vermelho: number }>();
  const porEmpresa = new Map<string, { nome: string; total: number; verde: number }>();
  for (const c of lista) {
    const pf = porFuncao.get(c.funcaoId) ?? { nome: c.funcao.nome, total: 0, verde: 0, amarelo: 0, vermelho: 0 };
    pf.total++; pf[c.semaforo === "VERDE" ? "verde" : c.semaforo === "AMARELO" ? "amarelo" : "vermelho"]++;
    porFuncao.set(c.funcaoId, pf);
    const pe = porEmpresa.get(c.empresaId) ?? { nome: c.empresa.nome, total: 0, verde: 0 };
    pe.total++; if (c.semaforo === "VERDE") pe.verde++;
    porEmpresa.set(c.empresaId, pe);
  }
  const porObra = new Map<string, { nome: string; liberados: number; total: number }>();
  for (const c of lista) {
    if (!c.obra) continue;
    const po = porObra.get(c.obra.id) ?? { nome: c.obra.nome, liberados: 0, total: 0 };
    po.total++; if (c.liberado) po.liberados++;
    porObra.set(c.obra.id, po);
  }
  return {
    lista,
    total: lista.length,
    emTreinamento: lista.filter((c) => c.matriculas.some((m) => ["EM_ANDAMENTO", "TEORIA_CONCLUIDA"].includes(m.status))).length,
    concluidos: lista.filter((c) => {
      const ex = c.matriculas.filter((m) => m.classificacao !== "RECOMENDADO" && m.status !== "CANCELADA");
      return ex.length > 0 && ex.every((m) => m.status === "CAPACITADO");
    }).length,
    capacitacoesPendentes: mats.filter((m) => !["CAPACITADO", "CANCELADA"].includes(m.status) && m.classificacao !== "RECOMENDADO").length,
    pendentesPratica: mats.filter((m) => m.status === "PENDENTE_PRATICA").length,
    aguardandoAprovacao: mats.filter((m) => m.status === "AGUARDANDO_APROVACAO").length,
    certificadosEmitidos: certs.filter((c) => c.status === "VALIDO").length,
    proximosVencimento: certs.filter((c) => c.status === "VALIDO" && c.validoAte && +c.validoAte >= hoje && +c.validoAte <= em60).length,
    vencidos: mats.filter((m) => m.status === "VENCIDO").length,
    docPendente: lista.filter((c) => c.pendencias.some((p) => p.grupo === "Documentos")).length,
    semaforo: { VERDE: lista.filter((c) => c.semaforo === "VERDE").length, AMARELO: lista.filter((c) => c.semaforo === "AMARELO").length, VERMELHO: lista.filter((c) => c.semaforo === "VERMELHO").length },
    liberadosObra: [...porObra.values()],
    porFuncao: [...porFuncao.values()].sort((a, b) => b.total - a.total),
    porEmpresa: [...porEmpresa.values()],
  };
}
