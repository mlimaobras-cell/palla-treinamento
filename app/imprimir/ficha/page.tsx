import Link from "next/link";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { Marca } from "@/components/marca";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { mascararCpf } from "@/lib/cripto";
import { fmtData, fmtHoras, MODALIDADE } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";

export const metadata = { title: "Ficha de evidência" };

const PENDENTES = ["MATRICULADO", "EM_ANDAMENTO", "TEORIA_CONCLUIDA", "PENDENTE_PRATICA", "REPROVADO", "VENCIDO"] as const;
const LINHAS_MINIMAS = 12;

/**
 * Ficha de evidência (lista de presença com coluna de OK) para a turma presencial de um curso.
 * ?curso=<id> obrigatório; ?obra=<id> filtra os participantes; ?vazia=1 imprime só linhas em branco.
 * Depois de assinada, é digitalizada e anexada em Atividades práticas → Evidências.
 */
export default async function Ficha({ searchParams }: { searchParams: Promise<{ curso?: string; obra?: string; vazia?: string }> }) {
  const sp = await searchParams;
  const a = await exigirEquipe("curso.ver");
  const [cursos, obras] = await Promise.all([
    db.query.cursos.findMany({ where: eq(schema.cursos.ativo, true), orderBy: (k, { asc }) => asc(k.ordem) }),
    db.query.obras.findMany({ where: eq(schema.obras.ativa, true), orderBy: (o, { asc }) => asc(o.codigo) }),
  ]);
  const curso = cursos.find((k) => k.id === sp.curso) ?? null;
  const obra = obras.find((o) => o.id === sp.obra) ?? null;
  const vazia = sp.vazia === "1";

  let participantes: { nome: string; funcao: string; cpf: string; obra: string }[] = [];
  if (curso && !vazia) {
    const ms = await db.query.matriculas.findMany({
      where: and(eq(schema.matriculas.cursoId, curso.id), inArray(schema.matriculas.status, [...PENDENTES])),
      with: { colaborador: { with: { funcao: true, obra: true } } },
    });
    participantes = ms
      .filter((m) => !obra || m.colaborador.obraId === obra.id)
      .filter((m) => a.perfil !== "GESTOR_OBRA" || m.colaborador.obra?.gestorId === a.id)
      .map((m) => ({ nome: m.colaborador.nome + (m.colaborador.dadoFicticio ? " (teste)" : ""), funcao: m.colaborador.funcao.nome, cpf: mascararCpf(m.colaborador.cpfFinal), obra: m.colaborador.obra?.codigo ?? "—" }))
      .sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"));
  }
  const linhas = [...participantes, ...Array.from({ length: Math.max(LINHAS_MINIMAS - participantes.length, 3) }, () => null)];
  const conteudo = curso?.conteudoProgramatico.split("\n").map((s) => s.trim()).filter(Boolean) ?? [];
  const pratica = !!curso && (curso.exigePratica || curso.modalidade === "PRESENCIAL");

  return (
    <div className="mx-auto max-w-[820px] bg-white p-8 text-[12px] text-tinta print:p-0">
      <style>{`@page { size: A4; margin: 11mm } @media print { html, body { background: #fff !important } .nao-imprimir { display: none } tr { break-inside: avoid } }`}</style>

      <div className="nao-imprimir mb-6 space-y-3 rounded-lg border border-linha bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin/praticas" className="text-sm font-medium text-palla-azul">← Atividades práticas</Link>
          {curso && <BotaoImprimir />}
        </div>
        <form className="grid gap-3 text-sm sm:grid-cols-[2fr_1fr_auto]">
          <label className="block"><span className="block text-xs font-medium text-tinta-suave">Curso</span>
            <select name="curso" defaultValue={curso?.id ?? ""} required className="w-full rounded-lg border border-linha bg-white px-3 py-2">
              <option value="">Selecione…</option>
              {cursos.map((k) => <option key={k.id} value={k.id}>{k.codigo} · {k.titulo}</option>)}
            </select>
          </label>
          <label className="block"><span className="block text-xs font-medium text-tinta-suave">Obra</span>
            <select name="obra" defaultValue={obra?.id ?? ""} className="w-full rounded-lg border border-linha bg-white px-3 py-2">
              <option value="">Todas</option>
              {obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} — {o.nome}</option>)}
            </select>
          </label>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-1.5 pb-2 text-xs"><input type="checkbox" name="vazia" value="1" defaultChecked={vazia} /> Em branco</label>
            <button className="rounded-lg border border-linha bg-white px-3 py-2 font-medium text-palla-azul">Gerar</button>
          </div>
        </form>
        <p className="text-xs text-tinta-suave">A lista traz quem tem o curso pendente na trilha. Depois de assinada, digitalize e anexe em Atividades práticas → Evidências.</p>
      </div>

      {!curso ? (
        <p className="rounded-lg border border-linha p-6 text-center text-tinta-suave">Escolha o curso para gerar a ficha.</p>
      ) : (
        <>
          <header className="flex items-start justify-between border-b-2 border-palla-azul pb-3">
            <Marca className="h-10" />
            <div className="text-right text-xs text-tinta-suave">
              <p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>
              {process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}
            </div>
          </header>
          <h1 className="mt-3 text-center text-base font-bold uppercase tracking-wide text-palla-azul">Ficha de evidência de treinamento</h1>
          <p className="text-center text-[11px] text-tinta-suave">Registro de presença e realização · NR-1, item 1.7</p>

          <table className="mt-3 w-full border-collapse text-[11px]">
            <tbody>
              <tr><th className="w-24 border border-linha bg-slate-50 p-1.5 text-left uppercase">Curso</th><td colSpan={3} className="border border-linha p-1.5 font-semibold">{curso.codigo} · {curso.titulo}</td></tr>
              <tr><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Referência</th><td className="border border-linha p-1.5">{curso.normaReferencia}</td><th className="w-28 border border-linha bg-slate-50 p-1.5 text-left uppercase">Carga prevista</th><td className="w-32 border border-linha p-1.5">{fmtHoras(curso.cargaHoraria)} · {MODALIDADE[curso.modalidade]}</td></tr>
              <tr><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Obra / local</th><td className="border border-linha p-1.5">{obra ? `${obra.codigo} — ${obra.nome}` : ""}</td><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Data</th><td className="border border-linha p-1.5" /></tr>
              <tr><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Instrutor</th><td className="border border-linha p-1.5" /><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Horário</th><td className="border border-linha p-1.5">____:____ às ____:____</td></tr>
              <tr><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Qualificação</th><td className="border border-linha p-1.5" /><th className="border border-linha bg-slate-50 p-1.5 text-left uppercase">Carga realizada</th><td className="border border-linha p-1.5">______ h</td></tr>
            </tbody>
          </table>

          {conteudo.length > 0 && (
            <div className="mt-3 rounded border border-linha p-2">
              <p className="text-[10.5px] font-bold uppercase text-palla-azul">Conteúdo programático</p>
              <ul className="mt-1 columns-2 gap-6 text-[10.5px] leading-snug">{conteudo.map((t) => <li key={t} className="break-inside-avoid">• {t}</li>)}</ul>
            </div>
          )}

          <table className="mt-3 w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-palla-azul text-left text-white">
                <th className="w-7 p-1.5">Nº</th><th className="p-1.5">Nome completo</th><th className="w-28 p-1.5">Função</th><th className="w-24 p-1.5">CPF</th>
                <th className="w-12 p-1.5 text-center">Presença OK</th>{pratica && <th className="w-12 p-1.5 text-center">Prática OK</th>}<th className="w-36 p-1.5">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((p, i) => (
                <tr key={i} className="h-8 border-b border-linha">
                  <td className="p-1.5 tabular-nums">{i + 1}</td>
                  <td className="p-1.5">{p?.nome}{p && !obra ? <span className="ml-1 text-[9.5px] text-tinta-suave">({p.obra})</span> : null}</td>
                  <td className="p-1.5 text-[10.5px]">{p?.funcao}</td>
                  <td className="p-1.5 text-[10.5px] tabular-nums">{p?.cpf}</td>
                  <td className="p-1.5 text-center"><span className="inline-block h-4 w-4 border border-tinta" /></td>
                  {pratica && <td className="p-1.5 text-center"><span className="inline-block h-4 w-4 border border-tinta" /></td>}
                  <td className="border-l border-linha p-1.5" />
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 text-[10.5px] text-tinta-suave">
            Marque OK somente para quem cumpriu a carga integral{pratica ? " e executou a prática com resultado APTO" : ""}. Esta ficha é evidência do registro na plataforma; o certificado só é emitido após o registro, a avaliação e a aprovação do responsável técnico.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-10 text-center text-[11px]">
            <div className="border-t border-tinta pt-1">Instrutor — nome e registro</div>
            <div className="border-t border-tinta pt-1">Responsável técnico pelo treinamento</div>
          </div>
          <p className="mt-4 text-right text-[9.5px] text-tinta-suave">Gerada em {fmtData(new Date())} por {a.nome}</p>
        </>
      )}
    </div>
  );
}
