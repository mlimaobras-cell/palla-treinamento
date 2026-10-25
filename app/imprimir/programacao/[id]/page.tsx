import Link from "next/link";
import { notFound } from "next/navigation";
import { Marca } from "@/components/marca";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { mascararCpf } from "@/lib/cripto";
import { fmtData, fmtHoras, MODALIDADE } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { feriadosNoPeriodo, HORAS_POR_DIA, programacaoDoColaborador } from "@/lib/servicos/programacao";

export const metadata = { title: "Programação de treinamento" };

const SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const hojeSP = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
const dataBR = (iso: string) => iso.split("-").reverse().join("/");
const diaSemana = (iso: string) => SEMANA[new Date(`${iso}T12:00:00Z`).getUTCDay()];
const horas = (h: number) => `${String(Math.round(h * 100) / 100).replace(".", ",")} h`;

/**
 * Programação de treinamento (planejamento) de um colaborador.
 * ?inicio=AAAA-MM-DD define a data de início; ?recomendados=1 inclui os cursos recomendados.
 */
export default async function Programacao({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ inicio?: string; recomendados?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const a = await exigirEquipe("colaborador.ver");
  const inicio = /^\d{4}-\d{2}-\d{2}$/.test(sp.inicio ?? "") ? sp.inicio! : hojeSP();
  const comRecomendados = sp.recomendados === "1";
  const p = await programacaoDoColaborador(id, inicio, comRecomendados);
  if (!p) notFound();
  const { colaborador: c, itens, recomendadosFora } = p;
  if (a.perfil === "GESTOR_OBRA" && c.obra?.gestorId !== a.id) notFound();

  const totalHoras = itens.reduce((s, i) => s + i.horasPlanejadas, 0);
  const dias = [...new Set(itens.flatMap((i) => i.blocos.map((b) => b.data)))];
  const fim = itens.length ? itens[itens.length - 1].fim : inicio;
  const feriados = itens.length ? feriadosNoPeriodo(inicio, fim) : [];
  const agenda = dias.map((d) => ({ data: d, itens: itens.flatMap((i) => i.blocos.filter((b) => b.data === d).map((b) => ({ codigo: i.codigo, titulo: i.titulo, horas: b.horas }))) }));

  return (
    <div className="mx-auto max-w-[820px] bg-white p-8 text-[12.5px] text-tinta print:p-0">
      <style>{`@page { size: A4; margin: 12mm } @media print { html, body { background: #fff !important } .nao-imprimir { display: none } tr, li { break-inside: avoid } .quebra { break-before: page } }`}</style>

      <div className="nao-imprimir mb-6 space-y-3 rounded-lg border border-linha bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/admin/colaboradores/${id}`} className="text-sm font-medium text-palla-azul">← {c.nome}</Link>
          <BotaoImprimir />
        </div>
        <form className="flex flex-wrap items-end gap-3 text-sm">
          <label className="block"><span className="block text-xs font-medium text-tinta-suave">Data de início</span>
            <input type="date" name="inicio" defaultValue={inicio} className="rounded-lg border border-linha bg-white px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 pb-2"><input type="checkbox" name="recomendados" value="1" defaultChecked={comRecomendados} /> Incluir recomendados</label>
          <button className="rounded-lg border border-linha bg-white px-3 py-2 font-medium text-palla-azul">Recalcular</button>
        </form>
        <p className="text-xs text-tinta-suave">{HORAS_POR_DIA} h por dia, sem sábados, domingos e feriados nacionais. Feriados estaduais e municipais da obra precisam ser ajustados à mão.</p>
      </div>

      <header className="flex items-start justify-between border-b-2 border-palla-azul pb-3">
        <Marca className="h-10" />
        <div className="text-right text-xs text-tinta-suave">
          <p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>
          {process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}
        </div>
      </header>
      <h1 className="mt-4 text-center text-lg font-bold uppercase tracking-wide text-palla-azul">Programação de treinamento</h1>
      <p className="text-center text-xs text-tinta-suave">Documento de planejamento · não substitui o certificado</p>

      <table className="mt-4 w-full border-collapse text-xs">
        <tbody>
          {[
            ["Colaborador", c.nome, "CPF", mascararCpf(c.cpfFinal)],
            ["Função", c.funcao.nome, "Empresa", c.empresa.nome],
            ["Obra", c.obra ? `${c.obra.codigo} — ${c.obra.nome}` : "—", "Início", dataBR(itens[0]?.inicio ?? inicio)],
            ["Carga total", horas(totalHoras), "Término previsto", dataBR(fim)],
          ].map(([k1, v1, k2, v2]) => (
            <tr key={k1}>
              <th className="w-28 border border-linha bg-slate-50 p-2 text-left uppercase">{k1}</th><td className="border border-linha p-2">{v1}</td>
              <th className="w-32 border border-linha bg-slate-50 p-2 text-left uppercase">{k2}</th><td className="w-36 border border-linha p-2">{v2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {itens.length === 0 ? (
        <p className="mt-6 rounded-lg border border-linha p-4 text-center">Nenhum treinamento pendente na trilha deste colaborador.</p>
      ) : (
        <>
          <h2 className="mt-6 text-sm font-bold uppercase text-palla-azul">Sequência dos treinamentos ({itens.length})</h2>
          <table className="mt-2 w-full border-collapse text-xs">
            <thead><tr className="bg-palla-azul text-left text-white"><th className="p-2">Nº</th><th className="p-2">Treinamento</th><th className="p-2">Modalidade</th><th className="p-2 text-right">Carga</th><th className="p-2">Início</th><th className="p-2">Término</th></tr></thead>
            <tbody>
              {itens.map((i, n) => (
                <tr key={i.id} className="border-b border-linha align-top">
                  <td className="p-2 tabular-nums">{n + 1}</td>
                  <td className="p-2"><span className="font-semibold">{i.titulo}</span><span className="block text-[10.5px] text-tinta-suave">{i.codigo}{i.exigePratica ? " · com prática presencial" : ""}</span></td>
                  <td className="p-2">{MODALIDADE[i.modalidade]}</td>
                  <td className="p-2 text-right tabular-nums">{i.cargaADefinir ? <span title="Carga não fixada no catálogo">8 h*</span> : fmtHoras(i.horasPlanejadas)}</td>
                  <td className="p-2 tabular-nums">{dataBR(i.inicio)} <span className="text-tinta-suave">{diaSemana(i.inicio)}</span></td>
                  <td className="p-2 tabular-nums">{dataBR(i.fim)} <span className="text-tinta-suave">{diaSemana(i.fim)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {itens.some((i) => i.cargaADefinir) && <p className="mt-1 text-[10.5px] text-tinta-suave">* Carga não fixada no catálogo: reservado 1 dia até o responsável técnico definir.</p>}

          <h2 className="mt-6 text-sm font-bold uppercase text-palla-azul">Agenda dia a dia ({dias.length} {dias.length === 1 ? "dia útil" : "dias úteis"})</h2>
          <table className="mt-2 w-full border-collapse text-xs">
            <thead><tr className="bg-slate-100 text-left"><th className="w-28 p-2">Data</th><th className="p-2">Treinamento</th><th className="w-16 p-2 text-right">Horas</th><th className="w-14 p-2 text-center">OK</th></tr></thead>
            <tbody>
              {agenda.map((d) => d.itens.map((it, k) => (
                <tr key={d.data + it.codigo} className={`align-top ${k === d.itens.length - 1 ? "border-b border-linha" : ""}`}>
                  <td className="p-2 tabular-nums">{k === 0 ? <>{dataBR(d.data)} <span className="text-tinta-suave">{diaSemana(d.data)}</span></> : null}</td>
                  <td className="p-2">{it.codigo} · {it.titulo}</td>
                  <td className="p-2 text-right tabular-nums">{horas(it.horas)}</td>
                  <td className="p-2 text-center"><span className="inline-block h-3.5 w-3.5 border border-tinta" /></td>
                </tr>
              )))}
            </tbody>
          </table>
          {feriados.length > 0 && <p className="mt-2 text-[10.5px] text-tinta-suave">Feriados nacionais desconsiderados no período: {feriados.map((f) => `${dataBR(f.data)} (${f.nome})`).join("; ")}.</p>}
        </>
      )}
      {recomendadosFora > 0 && <p className="mt-2 text-[10.5px] text-tinta-suave">{recomendadosFora} curso(s) recomendado(s) fora desta programação (não contam para a liberação).</p>}

      <p className="mt-5 text-[11px] text-tinta-suave">O certificado de cada treinamento só é emitido depois do registro de realização, da avaliação e da aprovação do responsável técnico na plataforma. Emitido em {fmtData(new Date())}.</p>
      <div className="mt-10 grid grid-cols-2 gap-10 text-center text-xs">
        <div className="border-t border-tinta pt-1">Responsável pelos treinamentos</div>
        <div className="border-t border-tinta pt-1">Colaborador — ciente da programação</div>
      </div>
    </div>
  );
}
