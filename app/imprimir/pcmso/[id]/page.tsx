import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { CabecalhoDocumento } from "@/components/cabecalho-documento";
import { fmtData, fmtDataHora } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { TIPO_EXAME } from "@/lib/servicos/pcmso";
import { CATEGORIA_RISCO } from "@/lib/servicos/pgr";

export const metadata = { title: "PCMSO — matriz de exames" };

/** Matriz de exames por GHE (transcrita do PCMSO) com os riscos do PGR de base — para conferência com a clínica. */
export default async function MatrizPcmso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirEquipe("sst.ver");
  const p = await db.query.pcmsos.findFirst({
    where: eq(schema.pcmsos.id, id),
    with: { obra: true, parceiro: true, pgr: { with: { ghes: true, riscos: true } }, exames: { with: { ghe: true, funcao: true } } },
  });
  if (!p) notFound();
  const funcoes = await db.query.funcoes.findMany();
  const nomeF = (fid: string) => funcoes.find((f) => f.id === fid)?.nome ?? "?";
  const grupos = new Map<string, { titulo: string; funcoes: string; riscos: { categoria: string; perigo: string }[]; exames: typeof p.exames }>();
  for (const e of p.exames) {
    const k = e.gheId ?? `f-${e.funcaoId}`;
    if (!grupos.has(k)) {
      const ghe = e.ghe;
      grupos.set(k, {
        titulo: ghe ? `${ghe.codigo} · ${ghe.nome}` : `Função: ${e.funcao?.nome}`,
        funcoes: ghe ? ghe.funcoesIds.map(nomeF).join(", ") : e.funcao?.nome ?? "",
        riscos: ghe ? (p.pgr?.riscos ?? []).filter((r) => r.gheId === ghe.id) : [],
        exames: [],
      });
    }
    grupos.get(k)!.exames.push(e);
  }

  return (
    <div className="mx-auto max-w-[1050px] bg-white p-8 text-[11.5px] text-tinta print:p-0">
      <style>{`@page { size: A4 landscape; margin: 10mm } @media print { html, body { background: #fff !important } .nao-imprimir { display: none } section { break-inside: avoid } }`}</style>
      <div className="nao-imprimir mb-5 flex items-center justify-between gap-3 rounded-lg border border-linha bg-slate-50 p-3">
        <Link href="/admin/sst/pcmso" className="text-sm font-medium text-palla-azul">← PCMSO</Link>
        <BotaoImprimir rotulo="Imprimir / PDF" />
      </div>
      <CabecalhoDocumento parceiro={p.parceiro} papel="Medicina do trabalho" extra={<p>Gerado em {fmtDataHora(new Date())} por {a.nome}</p>} />
      <h1 className="mt-4 text-center text-lg font-bold uppercase tracking-wide text-palla-azul">PCMSO — matriz de exames ocupacionais por grupo</h1>
      <p className="text-center text-xs text-tinta-suave">{p.titulo} · versão {p.versao} · {p.obra ? `Obra ${p.obra.codigo} — ${p.obra.nome}` : "Empresa"} · vigência desde {fmtData(p.vigenciaInicio)}</p>
      <p className="mt-1 text-center text-xs">Médico do trabalho responsável: <b>{p.medicoNome}</b> · {p.medicoCrm}{p.clinica && ` · ${p.clinica}`}</p>
      <p className="mt-2 rounded border border-linha bg-slate-50 p-2 text-center text-[10.5px]">Transcrição para conferência. O documento que vale é o PCMSO assinado pelo médico (NR-7). Riscos conforme {p.pgr ? `${p.pgr.titulo}, versão ${p.pgr.versao}` : "o PGR vigente"}.</p>

      {grupos.size === 0 ? <p className="mt-6 text-center">Nenhum exame transcrito.</p> : [...grupos.values()].map((g) => (
        <section key={g.titulo} className="mt-5">
          <h2 className="text-sm font-bold text-palla-azul">{g.titulo}</h2>
          <p className="text-[10.5px] text-tinta-suave">Funções: {g.funcoes}</p>
          {g.riscos.length > 0 && <p className="mt-1 text-[10.5px]"><b>Riscos do PGR:</b> {g.riscos.map((r) => `${r.perigo} (${CATEGORIA_RISCO[r.categoria]})`).join("; ")}.</p>}
          <table className="mt-2 w-full border-collapse text-[10.5px]">
            <thead><tr className="bg-palla-azul text-left text-white"><th className="p-1.5">Exame</th>{Object.values(TIPO_EXAME).map((t) => <th key={t} className="p-1.5 text-center">{t}</th>)}<th className="p-1.5">Periodicidade</th><th className="p-1.5">Observação</th></tr></thead>
            <tbody>{g.exames.map((e) => (
              <tr key={e.id} className="border-b border-linha"><td className="p-1.5 font-medium">{e.exame}</td>
                {Object.keys(TIPO_EXAME).map((k) => <td key={k} className="p-1.5 text-center">{e.momentos.includes(k) ? "●" : ""}</td>)}
                <td className="p-1.5">{e.periodicidadeMeses ? `${e.periodicidadeMeses} meses` : "—"}</td><td className="p-1.5">{e.observacao ?? ""}</td></tr>
            ))}</tbody>
          </table>
        </section>
      ))}
      <p className="mt-8 text-center text-[10px] text-tinta-suave">Grupo Palla | Treinamento e Integração. Prontuários e resultados de exames ficam sob a guarda do médico responsável e não são armazenados na plataforma.</p>
    </div>
  );
}
