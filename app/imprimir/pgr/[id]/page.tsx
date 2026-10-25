import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { Marca } from "@/components/marca";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { fmtData, fmtDataHora } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { CATEGORIA_RISCO, carregarPgr, nivelDoRisco, STATUS_PROGRAMA, TIPO_MEDIDA } from "@/lib/servicos/pgr";

export const metadata = { title: "PGR — documento" };

const COR: Record<string, string> = { verde: "#d1fae5", amarelo: "#fef3c7", laranja: "#fed7aa", vermelho: "#fecaca" };

/** Documento do PGR para impressão/PDF e assinatura. ?contratante=1 imprime só o inventário e o plano de ação (NR-1, 1.5.8; NR-18, 18.4.4). */
export default async function DocumentoPgr({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ contratante?: string }> }) {
  const { id } = await params;
  const { contratante } = await searchParams;
  const a = await exigirEquipe("sst.ver");
  const p = await carregarPgr(id);
  if (!p) notFound();
  const funcoes = await db.query.funcoes.findMany();
  const nomeF = (fid: string) => funcoes.find((f) => f.id === fid)?.nome ?? "?";
  const c = p.criterio;
  const rascunho = p.status === "RASCUNHO" || p.status === "EM_REVISAO";
  const soInventario = contratante === "1";

  return (
    <div className="mx-auto max-w-[1050px] bg-white p-8 text-[11.5px] text-tinta print:p-0">
      <style>{`@page { size: A4 landscape; margin: 10mm } @media print { html, body { background: #fff !important } .nao-imprimir { display: none } tr { break-inside: avoid } .quebra { break-before: page } }`}</style>
      <div className="nao-imprimir mb-5 flex items-center justify-between gap-3 rounded-lg border border-linha bg-slate-50 p-3">
        <Link href={`/admin/sst/pgr/${id}`} className="text-sm font-medium text-palla-azul">← Voltar ao PGR</Link>
        <span className="text-xs text-tinta-suave">Imprima ou salve em PDF (A4 paisagem).</span>
        <BotaoImprimir rotulo="Imprimir / PDF" />
      </div>

      {rascunho && <p className="mb-3 rounded border border-amber-300 bg-amber-50 p-2 text-center text-xs font-semibold text-amber-900">VERSÃO PARA REVISÃO E ASSINATURA — {STATUS_PROGRAMA[p.status].rotulo.toUpperCase()}. Só vale depois de assinada pelo profissional responsável.</p>}

      <header className="flex items-start justify-between border-b-2 border-palla-azul pb-3">
        <Marca className="h-10" />
        <div className="text-right text-xs text-tinta-suave">
          <p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>
          {process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}
          <p>Gerado em {fmtDataHora(new Date())} por {a.nome}</p>
        </div>
      </header>
      <h1 className="mt-4 text-center text-lg font-bold uppercase tracking-wide text-palla-azul">{soInventario ? "Inventário de riscos e plano de ação — serviço contratado" : "Programa de Gerenciamento de Riscos — PGR"}</h1>
      <p className="text-center text-xs text-tinta-suave">{p.titulo} · versão {p.versao}{p.vigenciaInicio && ` · vigência a partir de ${fmtData(p.vigenciaInicio)}`}{p.proximaRevisao && ` · revisão até ${fmtData(p.proximaRevisao)}`}</p>
      {soInventario && <p className="mt-1 text-center text-xs">Informações fornecidas à contratante conforme NR-1, 1.5.8.1.1 e NR-18, 18.4.4, para inclusão no PGR do canteiro.</p>}

      <table className="mt-4 w-full border-collapse text-xs">
        <tbody>
          <tr><th className="w-44 border border-linha bg-slate-50 p-2 text-left">Estabelecimento</th><td className="border border-linha p-2" colSpan={3}>{p.estabelecimento}{p.obra && ` — Obra ${p.obra.codigo}: ${p.obra.nome}${p.obra.endereco ? `, ${p.obra.endereco}` : ""}`}</td></tr>
          <tr><th className="border border-linha bg-slate-50 p-2 text-left">Elaboração</th><td className="border border-linha p-2">{p.elaboradorNome ?? "________________"} — {p.elaboradorQualificacao ?? "qualificação"} — {p.elaboradorRegistro ?? "registro"}</td>
            <th className="w-44 border border-linha bg-slate-50 p-2 text-left">Responsável pela organização</th><td className="border border-linha p-2">{p.responsavelOrganizacao ?? "________________"}</td></tr>
          {p.motivoRevisao && <tr><th className="border border-linha bg-slate-50 p-2 text-left">Motivo da revisão</th><td className="border border-linha p-2" colSpan={3}>{p.motivoRevisao}</td></tr>}
        </tbody>
      </table>

      {!soInventario && (
        <>
          <h2 className="mt-5 text-sm font-bold uppercase text-palla-azul">1. Caracterização dos processos e ambientes</h2>
          <p className="mt-1 whitespace-pre-line">{p.descricaoProcessos ?? "—"}</p>

          <h2 className="mt-5 text-sm font-bold uppercase text-palla-azul">2. Critério de avaliação e classificação dos riscos (NR-1, 1.5.4.4.2)</h2>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <table className="w-full border-collapse text-[10.5px]"><thead><tr className="bg-palla-azul text-white"><th className="p-1">S</th><th className="p-1 text-left">Severidade</th></tr></thead>
              <tbody>{c.severidade.map((s) => <tr key={s.valor} className="border-b border-linha"><td className="p-1 text-center">{s.valor}</td><td className="p-1"><b>{s.rotulo}</b> — {s.descricao}</td></tr>)}</tbody></table>
            <table className="w-full border-collapse text-[10.5px]"><thead><tr className="bg-palla-azul text-white"><th className="p-1">P</th><th className="p-1 text-left">Probabilidade</th></tr></thead>
              <tbody>{c.probabilidade.map((s) => <tr key={s.valor} className="border-b border-linha"><td className="p-1 text-center">{s.valor}</td><td className="p-1"><b>{s.rotulo}</b> — {s.descricao}</td></tr>)}</tbody></table>
            <table className="w-full border-collapse text-[10.5px]"><thead><tr className="bg-palla-azul text-white"><th className="p-1">S×P</th><th className="p-1 text-left">Nível e decisão</th></tr></thead>
              <tbody>{c.niveis.map((n, i) => <tr key={n.nivel} className="border-b border-linha"><td className="p-1 text-center" style={{ background: COR[n.cor] }}>{i === 0 ? 1 : c.niveis[i - 1].ate + 1}–{n.ate}</td><td className="p-1"><b>{n.nivel}</b> — {n.decisao}</td></tr>)}</tbody></table>
          </div>

          <h2 className="mt-5 text-sm font-bold uppercase text-palla-azul">3. Grupos homogêneos de exposição</h2>
          <table className="mt-2 w-full border-collapse text-[10.5px]">
            <thead><tr className="bg-palla-azul text-left text-white"><th className="p-1.5">GHE</th><th className="p-1.5">Atividades</th><th className="p-1.5">Funções</th><th className="p-1.5">EPIs (NR-18, 18.4.3, e)</th></tr></thead>
            <tbody>{p.ghes.map((g) => <tr key={g.id} className="border-b border-linha align-top"><td className="p-1.5 font-semibold">{g.codigo} · {g.nome}{g.trabalhadores ? ` (${g.trabalhadores})` : ""}</td><td className="p-1.5">{g.descricaoAtividades}{g.ambientes && <span className="block text-tinta-suave">Ambientes: {g.ambientes}</span>}</td><td className="p-1.5">{g.funcoesIds.map(nomeF).join(", ")}</td><td className="whitespace-pre-line p-1.5">{g.epis ?? "—"}</td></tr>)}</tbody>
          </table>
        </>
      )}

      <h2 className="quebra mt-5 text-sm font-bold uppercase text-palla-azul">{soInventario ? "1" : "4"}. Inventário de riscos (NR-1, 1.5.7.3.2)</h2>
      <table className="mt-2 w-full border-collapse text-[10px]">
        <thead><tr className="bg-palla-azul text-left text-white"><th className="p-1.5">GHE</th><th className="p-1.5">Tipo</th><th className="p-1.5">Perigo e fonte</th><th className="p-1.5">Possíveis lesões</th><th className="p-1.5">Medidas implementadas</th><th className="p-1.5">Exposição / avaliação</th><th className="p-1.5 text-center">S</th><th className="p-1.5 text-center">P</th><th className="p-1.5">Nível</th></tr></thead>
        <tbody>
          {p.riscos.map((r) => { const n = nivelDoRisco(c, r.severidade, r.probabilidade); return (
            <tr key={r.id} className="border-b border-linha align-top">
              <td className="p-1.5">{p.ghes.find((g) => g.id === r.gheId)?.codigo}</td><td className="p-1.5">{CATEGORIA_RISCO[r.categoria]}</td>
              <td className="p-1.5"><b>{r.perigo}</b><span className="block">{r.fonte}</span></td><td className="p-1.5">{r.lesoes}</td><td className="p-1.5">{r.medidasExistentes}</td>
              <td className="p-1.5">{r.exposicao ?? "—"}{r.monitoramento && <span className="block">{r.monitoramento}</span>}</td>
              <td className="p-1.5 text-center">{r.severidade}</td><td className="p-1.5 text-center">{r.probabilidade}</td><td className="p-1.5 font-semibold" style={{ background: COR[n.cor] }}>{n.nivel}</td>
            </tr>
          ); })}
        </tbody>
      </table>

      <h2 className="mt-5 text-sm font-bold uppercase text-palla-azul">{soInventario ? "2" : "5"}. Plano de ação (NR-1, 1.5.5.2)</h2>
      {p.acoes.length === 0 ? <p className="mt-1">Sem ações registradas.</p> : (
        <table className="mt-2 w-full border-collapse text-[10.5px]">
          <thead><tr className="bg-palla-azul text-left text-white"><th className="p-1.5">Medida</th><th className="p-1.5">Tipo</th><th className="p-1.5">Risco</th><th className="p-1.5">Responsável</th><th className="p-1.5">Prazo</th><th className="p-1.5">Acompanhamento</th><th className="p-1.5">Situação</th></tr></thead>
          <tbody>{p.acoes.map((ac) => <tr key={ac.id} className="border-b border-linha align-top"><td className="p-1.5">{ac.medida}</td><td className="p-1.5">{TIPO_MEDIDA[ac.tipo]}</td><td className="p-1.5">{p.riscos.find((r) => r.id === ac.riscoId)?.perigo ?? "—"}</td><td className="p-1.5">{ac.responsavel}</td><td className="p-1.5">{fmtData(ac.prazo)}</td><td className="p-1.5">{ac.acompanhamento ?? "—"}</td><td className="p-1.5">{ac.status === "CONCLUIDA" ? `Concluída ${fmtData(ac.concluidaEm)}` : ac.status.replace("_", " ").toLowerCase()}</td></tr>)}</tbody>
        </table>
      )}

      {!soInventario && (
        <>
          <h2 className="mt-5 text-sm font-bold uppercase text-palla-azul">6. Documentos complementares (NR-18, 18.4.3)</h2>
          <p className="mt-1">Integram este PGR, em anexo, quando aplicáveis: a) projeto da área de vivência; b) projeto elétrico das instalações temporárias; c) projetos dos sistemas de proteção coletiva; d) projetos do SPIQ; e) relação de EPIs (item 3). Avaliações quantitativas e avaliação ergonômica (NR-17) referenciadas no inventário.</p>
        </>
      )}

      <div className="mt-10 grid grid-cols-2 gap-10 text-center text-xs">
        <div><div className="border-t border-tinta pt-1">{p.elaboradorNome ?? "Profissional legalmente habilitado"}</div><div className="text-tinta-suave">{p.elaboradorQualificacao} · {p.elaboradorRegistro}</div></div>
        <div><div className="border-t border-tinta pt-1">{p.responsavelOrganizacao ?? "Responsável pela organização"}</div><div className="text-tinta-suave">{process.env.EMPRESA_NOME ?? "Palla Construções"}</div></div>
      </div>
      <p className="mt-6 text-center text-[10px] text-tinta-suave">Documento gerado pela plataforma Grupo Palla | Treinamento e Integração. Assinaturas colhidas fora da plataforma (certificado ICP-Brasil ou manuscritas). Histórico de versões mantido por no mínimo 20 anos (NR-1, 1.5.7.3.3.1).</p>
    </div>
  );
}
