import { db } from "@/db";
import { Aviso, Cartao, Selo, TituloPagina } from "@/components/ui";
import { criterioPadrao, nivelDoRisco } from "@/db/conteudo/sst-admissao";
import { exigirEquipe } from "@/lib/sessao";
import { CATEGORIA_RISCO } from "@/lib/servicos/pgr";

export const metadata = { title: "Biblioteca de riscos" };

export default async function Biblioteca() {
  await exigirEquipe("sst.ver");
  const ambientes = await db.query.ambientesBiblioteca.findMany({ orderBy: (a, { asc }) => asc(a.ordem), with: { perigos: { orderBy: (p, { asc }) => asc(p.ordem) } } });
  return (
    <>
      <TituloPagina titulo="Biblioteca de ambientes e riscos" subtitulo={`${ambientes.length} ambientes e atividades · ${ambientes.reduce((s, a) => s + a.perigos.length, 0)} perigos típicos`} />
      <div className="mb-5"><Aviso tom="alerta">Ponto de partida para montar o inventário de riscos. <strong>Não é o PGR</strong>: cada obra é avaliada no local pelo profissional legalmente habilitado, que confirma, ajusta ou exclui cada linha. Os exames são apenas sugestões para o médico do PCMSO. Situação: em revisão técnica.</Aviso></div>
      <div className="space-y-4">
        {ambientes.map((a) => (
          <Cartao key={a.id} titulo={a.nome} acao={<span className="text-xs text-tinta-suave">{a.perigos.length} perigos</span>}>
            <p className="text-sm text-tinta-suave">{a.descricao} Atividades: {a.atividades}.</p>
            <details className="mt-2"><summary className="cursor-pointer text-sm font-semibold text-palla-azul">Ver perigos</summary>
              <ul className="mt-2 divide-y divide-linha text-sm">
                {a.perigos.map((p) => { const n = nivelDoRisco(criterioPadrao, p.severidade, p.probabilidade); return (
                  <li key={p.id} className="py-2">
                    <div className="flex items-start justify-between gap-2"><span><span className="text-xs text-tinta-suave">{CATEGORIA_RISCO[p.categoria]}</span> <span className="font-medium">{p.perigo}</span></span><Selo cor={n.cor}>{p.severidade}×{p.probabilidade} {n.nivel}</Selo></div>
                    <p className="text-xs text-tinta-suave">Fonte: {p.fonte}. Lesões: {p.lesoes}.</p>
                    <p className="text-xs">Medidas: {p.medidas}</p>
                    {(p.examesSugeridos || p.cursosRelacionados || p.referencia) && <p className="text-xs text-tinta-suave">{p.examesSugeridos && `Para o médico avaliar: ${p.examesSugeridos}. `}{p.cursosRelacionados && `Treinamentos: ${p.cursosRelacionados}. `}{p.referencia && `Ref.: ${p.referencia}.`}</p>}
                  </li>
                ); })}
              </ul>
            </details>
          </Cartao>
        ))}
      </div>
    </>
  );
}
