import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Marca } from "@/components/marca";
import { exigirEquipe } from "@/lib/sessao";
import { BotaoImprimir } from "./imprimir";

/**
 * Prova escrita para impressão (aplicação presencial ou conferência pelo instrutor).
 * ?tipo=diagnostica → só as questões da avaliação diagnóstica (antes do vídeo); padrão = banco completo.
 * ?gabarito=1 inclui a folha de gabarito comentado para o instrutor.
 */
export default async function Prova({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ gabarito?: string; tipo?: string }>;
}) {
  const { id } = await params;
  const { gabarito, tipo } = await searchParams;
  const diag = tipo === "diagnostica";
  await exigirEquipe("curso.ver");
  const c = await db.query.cursos.findFirst({ where: eq(schema.cursos.id, id), with: { questoes: true } });
  if (!c || c.questoes.length === 0) notFound();
  const qs = [...c.questoes]
    .filter((q) => q.ativa && (!diag || q.diagnostica))
    .sort((a, b) => (a.codigo && b.codigo ? a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true }) : a.enunciado.localeCompare(b.enunciado, "pt-BR")));
  if (qs.length === 0) notFound();
  const base = diag ? "?tipo=diagnostica" : "?";
  const presencial = c.modalidade === "PRESENCIAL";

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 text-[13px] text-tinta print:p-0">
      <style>{`@page { size: A4; margin: 14mm } @media print { .nao-imprimir { display: none } .quebra { break-before: page } li { break-inside: avoid } }`}</style>
      <div className="nao-imprimir mb-6 flex items-center justify-between gap-3 rounded-lg border border-linha bg-slate-50 p-3">
        <p className="text-sm">{diag ? "Avaliação diagnóstica" : "Banco completo"} · {qs.length} questões{gabarito ? " · com gabarito" : ""}</p>
        <div className="flex gap-2">
          <a href={gabarito ? base : `${base}${diag ? "&" : ""}gabarito=1`} className="rounded-lg border border-linha px-3 py-2 text-sm font-medium text-palla-azul">{gabarito ? "Sem gabarito" : "Incluir gabarito"}</a>
          <BotaoImprimir />
        </div>
      </div>

      <header className="flex items-start justify-between border-b-2 border-palla-azul pb-3">
        <Marca className="h-10" />
        <div className="text-right text-xs text-tinta-suave">
          <p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>
          {process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}
        </div>
      </header>
      <h1 className="mt-4 text-center text-lg font-bold uppercase text-palla-azul">{diag ? "Avaliação diagnóstica" : "Avaliação escrita"} · {c.titulo}</h1>
      <p className="text-center text-xs text-tinta-suave">
        {c.normaReferencia} · {diag ? "aplicar ANTES do vídeo — não conta para aprovação" : `${presencial ? "aplicação presencial · " : ""}nota mínima ${c.notaMinima}%`}
      </p>

      <table className="mt-4 w-full border-collapse text-xs">
        <tbody>
          {[["Nome", "CPF"], ["Função", "Data"], ["Instrutor", "Local"]].map(([a, b]) => (
            <tr key={a}>
              <th className="w-20 border border-linha bg-slate-50 p-2 text-left uppercase">{a}</th><td className="border border-linha p-2" />
              <th className="w-20 border border-linha bg-slate-50 p-2 text-left uppercase">{b}</th><td className="w-40 border border-linha p-2" />
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs">Marque <strong>uma</strong> alternativa por questão. Resposta rasurada é considerada errada.</p>

      <ol className="mt-4 space-y-4">
        {qs.map((q, i) => (
          <li key={q.id}>
            <p className="font-semibold">{i + 1}. {q.enunciado}</p>
            <ul className="mt-1 space-y-0.5 pl-4">
              {q.alternativas.map((al) => <li key={al.id}>( &nbsp; ) {al.id}) {al.texto}</li>)}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid grid-cols-3 gap-6 text-center text-xs">
        {["Acertos", "Nota (%)", "Assinatura do instrutor"].map((r) => <div key={r} className="border-t border-tinta pt-1">{r}</div>)}
      </div>

      {gabarito && (
        <section className="quebra mt-10">
          <h2 className="text-base font-bold uppercase text-palla-azul">Gabarito comentado (uso do instrutor)</h2>
          <table className="mt-3 w-full border-collapse text-xs">
            <thead><tr className="bg-palla-azul text-white"><th className="p-2 text-left">Nº</th><th className="p-2 text-left">Resposta</th><th className="p-2 text-left">Comentário</th></tr></thead>
            <tbody>
              {qs.map((q, i) => (
                <tr key={q.id} className="border-b border-linha align-top">
                  <td className="p-2">{i + 1}{q.codigo ? <span className="block text-[10px] text-tinta-suave">{q.codigo}</span> : null}</td><td className="p-2 font-semibold">{q.correta}</td><td className="p-2">{q.comentario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
