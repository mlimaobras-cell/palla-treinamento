import { eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Botao, Cartao, Selecao, TituloPagina } from "@/components/ui";
import { CLASSIFICACAO } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { definirMatrizAcao } from "../acoes";

export const metadata = { title: "Matriz por função" };

const SIGLA: Record<string, { s: string; c: string }> = {
  OBRIGATORIO: { s: "O", c: "bg-palla-azul text-white" },
  INTERNO: { s: "I", c: "bg-palla-azul-claro text-palla-azul" },
  RECOMENDADO: { s: "R", c: "bg-slate-100 text-slate-600" },
  CONDICIONAL: { s: "C", c: "bg-amber-100 text-amber-800" },
};

export default async function Matriz({ searchParams }: { searchParams: Promise<{ funcao?: string; obra?: string }> }) {
  const a = await exigirEquipe("curso.ver");
  const f = await searchParams;
  const [funcoes, cursos, obras, linhas] = await Promise.all([
    db.query.funcoes.findMany({ orderBy: (x, { asc }) => asc(x.ordem) }),
    db.query.cursos.findMany({ orderBy: (x, { asc }) => asc(x.ordem) }),
    db.query.obras.findMany(),
    db.query.matrizFuncao.findMany({ where: f.obra ? eq(schema.matrizFuncao.obraId, f.obra) : isNull(schema.matrizFuncao.obraId) }),
  ]);
  const valor = (fu: string, cu: string) => linhas.find((l) => l.funcaoId === fu && l.cursoId === cu)?.classificacao;
  const funcaoSel = funcoes.find((x) => x.id === f.funcao);
  const editar = pode(a, "matriz.editar");

  return (
    <>
      <TituloPagina titulo="Matriz de treinamentos por função" subtitulo="O = obrigatório por exposição · I = interno Palla · R = recomendado · C = condicional (só se a atividade existir)" />
      <form className="mb-4 flex flex-wrap gap-2">
        <Selecao name="obra" defaultValue={f.obra ?? ""} className="max-w-xs" aria-label="Matriz"><option value="">Matriz padrão</option>{obras.map((o) => <option key={o.id} value={o.id}>Ajustes da obra {o.codigo}</option>)}</Selecao>
        <Botao type="submit" variante="secundario">Ver</Botao>
      </form>
      {f.obra && <div className="mb-4"><Aviso tom="info">Ajustes da obra prevalecem sobre a matriz padrão. Células vazias seguem a matriz padrão.</Aviso></div>}
      <Cartao>
        <div className="-m-5 overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-medium text-tinta-suave">Função</th>
                {cursos.map((c) => <th key={c.id} className="h-36 min-w-9 px-1 align-bottom font-medium text-tinta-suave"><span className="inline-block whitespace-nowrap [writing-mode:vertical-rl] rotate-180" title={c.titulo}>{c.codigo}</span></th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {funcoes.map((fu) => (
                <tr key={fu.id} className={fu.id === f.funcao ? "bg-palla-azul-claro/50" : ""}>
                  <td className="sticky left-0 z-10 bg-white px-4 py-2 text-sm">
                    {editar ? <a href={`?funcao=${fu.id}${f.obra ? `&obra=${f.obra}` : ""}`} className="font-medium text-palla-azul hover:underline">{fu.nome}</a> : fu.nome}
                  </td>
                  {cursos.map((c) => {
                    const v = valor(fu.id, c.id);
                    return <td key={c.id} className="px-1 py-2 text-center">{v ? <span className={`inline-grid h-6 w-6 place-items-center rounded font-bold ${SIGLA[v].c}`} title={`${CLASSIFICACAO[v]} · ${c.titulo}`}>{SIGLA[v].s}</span> : <span className="text-slate-300">·</span>}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Cartao>

      {editar && funcaoSel && (
        <Cartao titulo={`Editar: ${funcaoSel.nome}${f.obra ? ` (obra ${obras.find((o) => o.id === f.obra)?.codigo})` : " (padrão)"}`} className="mt-5">
          <Formulario acao={definirMatrizAcao} rotulo="Salvar matriz">
            <input type="hidden" name="funcaoId" value={funcaoSel.id} />
            <input type="hidden" name="obraId" value={f.obra ?? ""} />
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {cursos.map((c) => (
                <label key={c.id} className="flex items-center justify-between gap-2 rounded-lg border border-linha p-2 text-sm">
                  <span className="min-w-0"><span className="font-mono text-xs text-tinta-suave">{c.codigo}</span><span className="block truncate">{c.titulo}</span></span>
                  <Selecao name={`c_${c.id}`} defaultValue={valor(funcaoSel.id, c.id) ?? ""} className="!w-36 !py-1.5 text-xs">
                    <option value="">{f.obra ? "Seguir padrão" : "Não se aplica"}</option>
                    {Object.entries(CLASSIFICACAO).map(([k, r]) => <option key={k} value={k}>{r}</option>)}
                  </Selecao>
                </label>
              ))}
            </div>
            <p className="text-xs text-tinta-suave">A matriz deve refletir o PGR, as atividades efetivamente realizadas e as exigências da obra e da contratante. Nem toda função precisa de todas as NR.</p>
          </Formulario>
        </Cartao>
      )}
    </>
  );
}
