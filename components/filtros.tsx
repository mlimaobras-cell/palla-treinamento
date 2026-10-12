import { db } from "@/db";
import { Botao, Entrada, Selecao } from "./ui";

/** Barra de filtros por obra, função, empresa, situação, curso e período (GET). */
export async function Filtros({ valores, campos = ["obra", "funcao", "empresa", "situacao", "busca"] }: {
  valores: Record<string, string | undefined>;
  campos?: ("obra" | "funcao" | "empresa" | "situacao" | "busca" | "curso" | "periodo")[];
}) {
  const [obras, funcoes, empresas, cursos] = await Promise.all([
    db.query.obras.findMany({ orderBy: (o, { asc }) => asc(o.codigo) }),
    db.query.funcoes.findMany({ orderBy: (f, { asc }) => asc(f.ordem) }),
    db.query.empresas.findMany(),
    db.query.cursos.findMany({ orderBy: (c, { asc }) => asc(c.ordem) }),
  ]);
  const tem = (c: string) => campos.includes(c as never);
  return (
    <form className="mb-5 grid gap-2 rounded-xl border border-linha bg-white p-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {tem("busca") && <Entrada name="busca" placeholder="Buscar colaborador" defaultValue={valores.busca} aria-label="Buscar colaborador" />}
      {tem("obra") && <Selecao name="obra" defaultValue={valores.obra ?? ""} aria-label="Obra"><option value="">Todas as obras</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} · {o.nome}</option>)}</Selecao>}
      {tem("funcao") && <Selecao name="funcao" defaultValue={valores.funcao ?? ""} aria-label="Função"><option value="">Todas as funções</option>{funcoes.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Selecao>}
      {tem("empresa") && <Selecao name="empresa" defaultValue={valores.empresa ?? ""} aria-label="Empresa"><option value="">Todas as empresas</option>{empresas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}</Selecao>}
      {tem("curso") && <Selecao name="curso" defaultValue={valores.curso ?? ""} aria-label="Treinamento"><option value="">Todos os treinamentos</option>{cursos.map((c) => <option key={c.id} value={c.id}>{c.codigo} · {c.titulo}</option>)}</Selecao>}
      {tem("situacao") && <Selecao name="situacao" defaultValue={valores.situacao ?? ""} aria-label="Situação documental"><option value="">Qualquer situação</option><option value="VERDE">Verde — conferida</option><option value="AMARELO">Amarelo — pendências</option><option value="VERMELHO">Vermelho — não liberado</option></Selecao>}
      {tem("periodo") && <><Entrada type="date" name="de" defaultValue={valores.de} aria-label="De" /><Entrada type="date" name="ate" defaultValue={valores.ate} aria-label="Até" /></>}
      <Botao type="submit" variante="secundario">Filtrar</Botao>
    </form>
  );
}
