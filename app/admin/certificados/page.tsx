import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Filtros } from "@/components/filtros";
import { Formulario } from "@/components/formulario";
import { Cartao, Entrada, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { cancelarCertificadoAcao, reemitirCertificadoAcao } from "../acoes";

export const metadata = { title: "Certificados" };

export default async function Certificados({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const a = await exigirEquipe("colaborador.ver");
  const f = await searchParams;
  const todos = await db.query.certificados.findMany({
    orderBy: desc(schema.certificados.emitidoEm), limit: 300,
    with: { matricula: { with: { colaborador: true } }, aprovadoPor: true },
  });
  const em60 = Date.now() + 60 * 86400_000;
  const lista = todos.filter((c) =>
    (!f.obra || c.matricula.colaborador.obraId === f.obra) &&
    (!f.funcao || c.matricula.colaborador.funcaoId === f.funcao) &&
    (!f.curso || c.matricula.cursoId === f.curso) &&
    (!f.busca || c.dadosSnapshot.colaboradorNome.toLowerCase().includes(f.busca.toLowerCase())) &&
    (!f.de || c.emitidoEm >= new Date(f.de)) && (!f.ate || c.emitidoEm <= new Date(`${f.ate}T23:59:59`)),
  );
  return (
    <>
      <TituloPagina titulo="Certificados e comprovantes" subtitulo="Cancelamentos e reemissões ficam registrados e aparecem na verificação pública." />
      <Filtros valores={f} campos={["busca", "obra", "funcao", "curso", "periodo"]} />
      <Cartao>
        {lista.length === 0 ? <Vazio>Nenhum certificado.</Vazio> : (
          <Tabela cabecalho={["Número", "Colaborador", "Curso", "Emissão", "Validade", "Situação", ""]}>
            {lista.map((c) => {
              const venc = c.validoAte && c.validoAte < new Date();
              const prox = c.validoAte && !venc && +c.validoAte < em60;
              return (
                <tr key={c.id}>
                  <td className="px-5 py-2.5"><a href={`/api/certificados/${c.id}/pdf`} target="_blank" className="font-mono text-xs font-semibold text-palla-azul hover:underline">{c.numero}</a><span className="block text-xs text-tinta-suave">{c.tipo === "INTEGRAL" ? "Certificado" : "Comprovante de etapa"}</span></td>
                  <td className="px-5"><Link href={`/admin/colaboradores/${c.matricula.colaboradorId}`} className="hover:underline">{c.dadosSnapshot.colaboradorNome}</Link></td>
                  <td className="px-5 text-xs">{c.dadosSnapshot.cursoCodigo}</td>
                  <td className="px-5 text-xs">{fmtData(c.emitidoEm)}{c.aprovadoPor && <span className="block text-tinta-suave">{c.aprovadoPor.nome}</span>}</td>
                  <td className="px-5 text-xs">{c.validoAte ? fmtData(c.validoAte) : "—"}</td>
                  <td className="px-5">
                    {c.status !== "VALIDO" ? <Selo cor="vermelho">{c.status === "CANCELADO" ? "Cancelado" : "Substituído"}</Selo>
                      : venc ? <Selo cor="vermelho">Vencido</Selo> : prox ? <Selo cor="amarelo">Vence em breve</Selo> : <Selo cor="verde">Válido</Selo>}
                  </td>
                  <td className="px-5">
                    {c.status === "VALIDO" && c.tipo === "INTEGRAL" && (pode(a, "certificado.cancelar") || pode(a, "capacitacao.aprovar")) && (
                      <details className="text-xs"><summary className="cursor-pointer font-semibold text-palla-azul">Retificar</summary>
                        <div className="mt-2 w-64 space-y-2">
                          {pode(a, "capacitacao.aprovar") && <Formulario acao={reemitirCertificadoAcao.bind(null, c.id)} rotulo="Reemitir" variante="secundario" className="space-y-2"><Entrada name="motivo" placeholder="Motivo da reemissão" required /></Formulario>}
                          {pode(a, "certificado.cancelar") && <Formulario acao={cancelarCertificadoAcao.bind(null, c.id)} rotulo="Cancelar" variante="perigo" className="space-y-2"><Entrada name="motivo" placeholder="Motivo do cancelamento" required /></Formulario>}
                        </div>
                      </details>
                    )}
                  </td>
                </tr>
              );
            })}
          </Tabela>
        )}
      </Cartao>
    </>
  );
}
