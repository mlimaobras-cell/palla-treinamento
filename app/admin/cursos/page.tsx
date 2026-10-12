import Link from "next/link";
import { db } from "@/db";
import { Cartao, Selo, Tabela, TituloPagina } from "@/components/ui";
import { fmtHoras, MODALIDADE, TIPO_CURSO } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";

export const metadata = { title: "Cursos" };

const CONTEUDO = { RASCUNHO: ["Em desenvolvimento", "cinza"], EM_REVISAO: ["Em revisão técnica", "amarelo"], APROVADO: ["Aprovado", "verde"] } as const;
const ORIG = { LEGAL: ["Norma", "azul"], EMPREGADOR: ["Interno", "cinza"], A_VALIDAR: ["Validar", "vermelho"] } as const;

export default async function Cursos() {
  await exigirEquipe("curso.ver");
  const cursos = await db.query.cursos.findMany({ with: { capitulos: { with: { aulas: true } }, questoes: true }, orderBy: (c, { asc }) => asc(c.ordem) });
  return (
    <>
      <TituloPagina titulo="Catálogo de cursos" subtitulo="Cada parâmetro mostra se vem da norma, de critério interno da Palla ou se ainda precisa de validação." />
      <Cartao>
        <Tabela cabecalho={["Curso", "Natureza", "Carga", "Reciclagem", "Modalidade", "Prática", "Conteúdo"]}>
          {cursos.map((c) => {
            const aulas = c.capitulos.flatMap((x) => x.aulas).length;
            return (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3"><Link href={`/admin/cursos/${c.id}`} className="font-medium text-palla-azul hover:underline">{c.titulo}</Link><span className="block font-mono text-xs text-tinta-suave">{c.codigo} · {c.normaReferencia.slice(0, 48)}</span></td>
                <td className="px-5 text-xs">{TIPO_CURSO[c.tipo]}</td>
                <td className="px-5"><span className="whitespace-nowrap">{fmtHoras(c.cargaHoraria)}</span> <Selo cor={ORIG[c.cargaOrigem][1]}>{ORIG[c.cargaOrigem][0]}</Selo></td>
                <td className="px-5"><span className="whitespace-nowrap">{c.validadeMeses ? `${c.validadeMeses} meses` : "Sem prazo fixo"}</span> <Selo cor={ORIG[c.validadeOrigem][1]}>{ORIG[c.validadeOrigem][0]}</Selo></td>
                <td className="px-5 text-xs">{MODALIDADE[c.modalidade]}</td>
                <td className="px-5 text-xs">{c.exigePratica ? "Sim" : "Não"}</td>
                <td className="px-5"><Selo cor={CONTEUDO[c.statusConteudo][1]}>{CONTEUDO[c.statusConteudo][0]}</Selo><span className="block text-xs text-tinta-suave">{aulas} aulas · {c.questoes.length} questões</span></td>
              </tr>
            );
          })}
        </Tabela>
      </Cartao>
    </>
  );
}
