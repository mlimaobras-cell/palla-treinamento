import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Filtros } from "@/components/filtros";
import { Aviso, Cartao, Indicador, Semaforo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { exigirEquipe } from "@/lib/sessao";
import { atualizarVencidos } from "@/lib/servicos/certificacao";
import { indicadores } from "@/lib/servicos/painel";

export const metadata = { title: "Painel" };

export default async function Painel({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const a = await exigirEquipe();
  const f = await searchParams;
  await atualizarVencidos();
  const obraGestor = a.perfil === "GESTOR_OBRA" ? (await db.query.obras.findFirst({ where: eq(schema.obras.gestorId, a.id) }))?.id ?? "—" : undefined;
  const i = await indicadores(f, obraGestor);
  const atencao = i.lista.filter((c) => c.liberado && c.semaforo !== "VERDE");
  const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <TituloPagina titulo="Painel de treinamento e acesso" subtitulo={obraGestor ? "Visão da sua obra" : "Todas as obras e equipes"} />
      {f.erro === "permissao" && <div className="mb-4"><Aviso tom="erro">Seu perfil não tem acesso a essa área.</Aviso></div>}
      <Filtros valores={f} campos={["obra", "funcao", "empresa", "curso", "periodo"]} />

      {atencao.length > 0 && (
        <div className="mb-5"><Aviso tom="erro"><strong>{atencao.length} colaborador(es) liberado(s) com situação alterada.</strong> Revise: {atencao.map((c) => <Link key={c.id} href={`/admin/colaboradores/${c.id}`} className="ml-1 underline">{c.nome}</Link>)}</Aviso></div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Indicador rotulo="Colaboradores" valor={i.total} href={`/admin/colaboradores?${q}`} />
        <Indicador rotulo="Em treinamento" valor={i.emTreinamento} />
        <Indicador rotulo="Trilha concluída" valor={i.concluidos} tom="verde" />
        <Indicador rotulo="Capacitações pendentes" valor={i.capacitacoesPendentes} tom="amarelo" detalhe={`${i.pendentesPratica} aguardam prática · ${i.aguardandoAprovacao} aguardam aprovação`} />
        <Indicador rotulo="Certificados emitidos" valor={i.certificadosEmitidos} href="/admin/certificados" />
        <Indicador rotulo="Vencem em 60 dias" valor={i.proximosVencimento} tom="amarelo" detalhe={`${i.vencidos} já vencidos`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Cartao titulo="Situação documental">
          <ul className="space-y-3">
            {(["VERDE", "AMARELO", "VERMELHO"] as const).map((s) => (
              <li key={s}>
                <Link href={`/admin/colaboradores?situacao=${s}${q ? `&${q}` : ""}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                  <Semaforo valor={s} /><span className="text-2xl font-semibold tabular-nums text-palla-azul-escuro">{i.semaforo[s]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-tinta-suave">{i.docPendente} com documentação pendente. Verde indica documentação conferida; a liberação depende de aprovação registrada.</p>
        </Cartao>
        <Cartao titulo="Liberados por obra" className="lg:col-span-2">
          {i.liberadosObra.length === 0 ? <Vazio>Nenhum colaborador vinculado a obras.</Vazio> : (
            <ul className="space-y-3">
              {i.liberadosObra.map((o) => (
                <li key={o.nome}>
                  <div className="mb-1 flex justify-between text-sm"><span>{o.nome}</span><span className="font-semibold tabular-nums">{o.liberados} de {o.total}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${o.total ? (o.liberados / o.total) * 100 : 0}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Cartao>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Cartao titulo="Indicadores por função">
          {i.porFuncao.length === 0 ? <Vazio>Sem dados.</Vazio> : (
            <Tabela cabecalho={["Função", "Total", "Verde", "Amarelo", "Vermelho"]}>
              {i.porFuncao.map((p) => (
                <tr key={p.nome}><td className="px-5 py-2.5">{p.nome}</td><td className="px-5 tabular-nums">{p.total}</td><td className="px-5 tabular-nums text-emerald-700">{p.verde}</td><td className="px-5 tabular-nums text-amber-700">{p.amarelo}</td><td className="px-5 tabular-nums text-red-700">{p.vermelho}</td></tr>
              ))}
            </Tabela>
          )}
        </Cartao>
        <Cartao titulo="Indicadores por empresa">
          {i.porEmpresa.length === 0 ? <Vazio>Sem dados.</Vazio> : (
            <Tabela cabecalho={["Empresa", "Colaboradores", "Documentação conferida"]}>
              {i.porEmpresa.map((p) => <tr key={p.nome}><td className="px-5 py-2.5">{p.nome}</td><td className="px-5 tabular-nums">{p.total}</td><td className="px-5 tabular-nums">{p.verde}</td></tr>)}
            </Tabela>
          )}
        </Cartao>
      </div>
    </>
  );
}
