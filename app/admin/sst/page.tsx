import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Aviso, Cartao, Indicador, LinkBotao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { listarPrazos } from "@/lib/servicos/prazos";
import { STATUS_PROGRAMA } from "@/lib/servicos/pgr";

export const metadata = { title: "Saúde e Segurança" };

export default async function Sst() {
  const a = await exigirEquipe("sst.ver");
  const [pgrs, pcmsos, prazos, modelos, assinaturas, colabs] = await Promise.all([
    db.query.pgrs.findMany({ with: { obra: true }, orderBy: desc(schema.pgrs.criadoEm) }),
    db.query.pcmsos.findMany({ with: { obra: true }, orderBy: desc(schema.pcmsos.criadoEm) }),
    listarPrazos({ janelaDias: 30 }),
    db.query.modelosTermo.findMany(),
    db.query.assinaturasTermo.findMany({ columns: { id: true } }),
    db.query.colaboradores.findMany({ columns: { id: true } }),
  ]);
  const vigentes = pgrs.filter((p) => p.status === "APROVADO");
  const vencidos = prazos.filter((p) => p.dias < 0).length;
  const modelosPend = modelos.filter((m) => m.status !== "APROVADO" && m.ativo).length;

  return (
    <>
      <TituloPagina titulo="Saúde e Segurança" subtitulo="PGR, PCMSO, termos assinados e documentos de admissão — tudo ligado à matriz de treinamentos e ao acesso às obras."
        acao={<div className="flex flex-wrap gap-2"><LinkBotao href="/admin/sst/pgr" variante="secundario">PGR</LinkBotao><LinkBotao href="/admin/sst/pcmso" variante="secundario">PCMSO</LinkBotao><LinkBotao href="/admin/sst/termos" variante="secundario">Termos e admissão</LinkBotao><LinkBotao href="/admin/sst/biblioteca" variante="secundario">Biblioteca de riscos</LinkBotao></div>} />
      <div className="mb-5"><Aviso tom="info">
        <strong>Responsabilidades:</strong> o PGR da obra é elaborado e assinado por profissional legalmente habilitado em segurança do trabalho (NR-18, 18.4.2) e o PCMSO pelo médico do trabalho (NR-7).
        A plataforma organiza o inventário de riscos, o plano de ação, a matriz de exames, os prazos e o histórico — não substitui essas assinaturas.
      </Aviso></div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Indicador rotulo="PGR vigentes" valor={vigentes.length} tom={vigentes.length ? "verde" : "amarelo"} href="/admin/sst/pgr" detalhe={`${pgrs.filter((p) => p.status === "RASCUNHO" || p.status === "EM_REVISAO").length} em elaboração`} />
        <Indicador rotulo="PCMSO vigentes" valor={pcmsos.filter((p) => p.status === "APROVADO").length} href="/admin/sst/pcmso" />
        <Indicador rotulo="Prazos em 30 dias" valor={prazos.length} tom={prazos.length ? "amarelo" : "neutro"} href="/admin/prazos" />
        <Indicador rotulo="Vencidos" valor={vencidos} tom={vencidos ? "vermelho" : "verde"} href="/admin/prazos" />
        <Indicador rotulo="Termos assinados" valor={assinaturas.length} detalhe={`${colabs.length} colaboradores`} />
        <Indicador rotulo="Modelos a aprovar" valor={modelosPend} tom={modelosPend ? "amarelo" : "verde"} href="/admin/sst/termos" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Cartao titulo="Programas" acao={pode(a, "sst.editar") ? <Link href="/admin/sst/pgr" className="text-sm font-semibold text-palla-azul">Novo PGR</Link> : null}>
          {pgrs.length + pcmsos.length === 0 ? <Vazio>Nenhum PGR ou PCMSO cadastrado ainda.</Vazio> : (
            <Tabela cabecalho={["Programa", "Local", "Situação", "Revisão"]}>
              {pgrs.map((p) => (
                <tr key={p.id}><td className="px-5 py-2.5"><Link href={`/admin/sst/pgr/${p.id}`} className="font-medium hover:underline">PGR · {p.titulo}</Link> <span className="text-xs text-tinta-suave">v{p.versao}</span></td>
                  <td className="px-5 text-xs">{p.obra ? p.obra.codigo : "Empresa"}</td><td className="px-5"><Selo cor={STATUS_PROGRAMA[p.status].cor}>{STATUS_PROGRAMA[p.status].rotulo}</Selo></td><td className="px-5 text-xs">{fmtData(p.proximaRevisao)}</td></tr>
              ))}
              {pcmsos.map((p) => (
                <tr key={p.id}><td className="px-5 py-2.5"><Link href="/admin/sst/pcmso" className="font-medium hover:underline">PCMSO · {p.titulo}</Link> <span className="text-xs text-tinta-suave">v{p.versao}</span></td>
                  <td className="px-5 text-xs">{p.obra ? p.obra.codigo : "Empresa"}</td><td className="px-5"><Selo cor={STATUS_PROGRAMA[p.status].cor}>{p.status === "APROVADO" ? "Vigente" : STATUS_PROGRAMA[p.status].rotulo}</Selo></td><td className="px-5 text-xs">{fmtData(p.proximoRelatorioAnual)}</td></tr>
              ))}
            </Tabela>
          )}
        </Cartao>
        <Cartao titulo="Próximos prazos" acao={<Link href="/admin/prazos" className="text-sm font-semibold text-palla-azul">Todos</Link>}>
          {prazos.length === 0 ? <Vazio>Nada vence nos próximos 30 dias.</Vazio> : (
            <ul className="divide-y divide-linha text-sm">
              {prazos.slice(0, 10).map((p) => (
                <li key={p.chave} className="flex items-center justify-between gap-3 py-2">
                  <span>{p.href ? <Link href={p.href} className="hover:underline">{p.titulo}</Link> : p.titulo}<span className="block text-xs text-tinta-suave">{p.origem}</span></span>
                  <Selo cor={p.dias < 0 ? "vermelho" : p.dias <= 15 ? "amarelo" : "azul"}>{p.dias < 0 ? `venceu há ${-p.dias} d` : p.dias === 0 ? "hoje" : `${p.dias} d · ${fmtData(p.venceEm)}`}</Selo>
                </li>
              ))}
            </ul>
          )}
        </Cartao>
      </div>
    </>
  );
}
