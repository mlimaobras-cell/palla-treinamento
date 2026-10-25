import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { CabecalhoPublico } from "@/components/marca";
import { Aviso } from "@/components/ui";
import { fmtData, fmtDataHora, nomeAbreviado } from "@/lib/formato";
import { crachaValido, situacaoPublica } from "@/lib/servicos/cracha";

export const metadata = { title: "Consulta do crachá", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Página aberta pelo QR do crachá (portaria e segurança). Sem login, sem CPF, sem dados de saúde. */
export default async function Cracha({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }) {
  const { id } = await params;
  const { t } = await searchParams;
  const existe = crachaValido(id, t) ? await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, id), with: { funcao: true } }) : null;
  if (!existe) {
    return (
      <>
        <CabecalhoPublico />
        <main className="mx-auto max-w-xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-palla-azul-escuro">Consulta do crachá</h1>
          <div className="mt-6"><Aviso tom="erro"><strong>Crachá não reconhecido.</strong> O código lido não corresponde a um colaborador cadastrado. Não libere a entrada e acione a Segurança do Trabalho.</Aviso></div>
        </main>
      </>
    );
  }
  const s = await situacaoPublica(id);
  const c = s.colaborador;
  const quadro = {
    LIBERADO: { tom: "sucesso" as const, titulo: `Acesso aprovado${c.obra ? ` — ${c.obra.codigo}` : ""}`, texto: s.liberacao ? `Aprovado em ${fmtDataHora(s.liberacao.aprovadaEm)}. Confira EPIs na entrada.` : "" },
    EM_REVISAO: { tom: "alerta" as const, titulo: "Liberação em revisão", texto: "A documentação mudou depois da aprovação. Consulte a Segurança do Trabalho antes de liberar." },
    NAO_LIBERADO: { tom: "erro" as const, titulo: "Sem liberação de acesso", texto: "Não há aprovação de acesso registrada para este colaborador. Não libere a entrada." },
  }[s.acesso];

  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-xl px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-tinta-suave">Consulta do crachá</p>
        <h1 className="mt-1 text-2xl font-semibold text-palla-azul-escuro">{nomeAbreviado(c.nome)}</h1>
        <p className="text-sm text-tinta-suave">{existe.funcao.nome}{c.obra ? ` · ${c.obra.codigo} — ${c.obra.nome}` : ""}</p>

        <div className="mt-5"><Aviso tom={quadro.tom}><strong className="block text-base">{quadro.titulo}</strong>{quadro.texto}</Aviso></div>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-palla-azul-escuro">Treinamentos com certificado válido ({s.treinamentos.filter((x) => !x.vencido).length})</h2>
          {s.treinamentos.length === 0 ? (
            <p className="mt-2 rounded-xl border border-linha bg-white p-4 text-sm text-tinta-suave">Nenhum certificado emitido.</p>
          ) : (
            <ul className="mt-2 divide-y divide-linha rounded-xl border border-linha bg-white text-sm">
              {s.treinamentos.map((k) => (
                <li key={k.numero} className="flex items-start justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="font-medium">{k.curso}</span>
                    <Link href={`/verificar/${k.codigoVerificacao}`} className="block text-xs text-palla-azul underline">{k.numero}</Link>
                  </span>
                  <span className={`shrink-0 text-right text-xs font-semibold ${k.vencido ? "text-red-700" : k.venceEmBreve ? "text-amber-700" : "text-emerald-700"}`}>
                    {k.vencido ? "VENCIDO" : "Válido"}
                    <span className="block font-normal text-tinta-suave">{k.validoAte ? `até ${fmtData(k.validoAte)}` : "sem prazo fixo"}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {s.autorizacoes.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-palla-azul-escuro">Autorizações vigentes</h2>
            <ul className="mt-2 divide-y divide-linha rounded-xl border border-linha bg-white text-sm">
              {s.autorizacoes.map((x) => <li key={x.atividade} className="flex justify-between gap-3 px-4 py-3"><span>{x.atividade}</span><span className="text-xs text-tinta-suave">{x.validoAte ? `até ${fmtData(x.validoAte)}` : "sem prazo"}</span></li>)}
            </ul>
          </section>
        )}

        <p className="mt-6 text-xs text-tinta-suave">Consulta em {fmtDataHora(new Date())}. Por proteção de dados, esta página não mostra CPF, nome completo nem informações médicas.</p>
      </main>
    </>
  );
}
