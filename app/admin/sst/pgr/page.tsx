import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Campo, Cartao, Entrada, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { STATUS_PROGRAMA } from "@/lib/servicos/pgr";
import { criarPgrAcao } from "../acoes";

export const metadata = { title: "PGR" };

export default async function ListaPgr() {
  const a = await exigirEquipe("sst.ver");
  const [pgrs, obras] = await Promise.all([
    db.query.pgrs.findMany({ with: { obra: true, ghes: { columns: { id: true } }, riscos: { columns: { id: true } } }, orderBy: [desc(schema.pgrs.criadoEm)] }),
    db.query.obras.findMany({ orderBy: (o, { asc }) => asc(o.codigo) }),
  ]);
  return (
    <>
      <TituloPagina titulo="Programa de Gerenciamento de Riscos (PGR)" subtitulo="Inventário de riscos por GHE e plano de ação. Cada revisão gera nova versão e o histórico é mantido (NR-1, 1.5.7.3.3.1)." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Cartao titulo="PGRs">
          {pgrs.length === 0 ? <Vazio>Nenhum PGR. Comece pelo PGR da empresa (fábrica/sede) ou pelo PGR de uma obra.</Vazio> : (
            <Tabela cabecalho={["PGR", "Local", "Versão", "Situação", "GHE / riscos", "Próxima revisão"]}>
              {pgrs.map((p) => (
                <tr key={p.id} className={p.status === "SUBSTITUIDO" ? "opacity-60" : ""}>
                  <td className="px-5 py-2.5"><Link href={`/admin/sst/pgr/${p.id}`} className="font-medium hover:underline">{p.titulo}</Link><span className="block text-xs text-tinta-suave">{p.estabelecimento}</span></td>
                  <td className="px-5 text-xs">{p.obra ? `${p.obra.codigo} · ${p.obra.nome}` : "Empresa"}</td>
                  <td className="px-5">v{p.versao}</td>
                  <td className="px-5"><Selo cor={STATUS_PROGRAMA[p.status].cor}>{STATUS_PROGRAMA[p.status].rotulo}</Selo></td>
                  <td className="px-5 text-xs">{p.ghes.length} / {p.riscos.length}</td>
                  <td className="px-5 text-xs">{fmtData(p.proximaRevisao)}</td>
                </tr>
              ))}
            </Tabela>
          )}
        </Cartao>
        {pode(a, "sst.editar") && (
          <Cartao titulo="Novo PGR">
            <Formulario acao={criarPgrAcao} rotulo="Criar e abrir">
              <Campo rotulo="Local"><Selecao name="obraId"><option value="">Empresa (sede, fábrica, escritório)</option>{obras.map((o) => <option key={o.id} value={o.id}>Obra {o.codigo} · {o.nome}</option>)}</Selecao></Campo>
              <Campo rotulo="Título"><Entrada name="titulo" placeholder="Ex.: PGR — Obra Galpão XPTO" required /></Campo>
              <Campo rotulo="Estabelecimento" ajuda="Razão social, CNPJ/CNO e endereço do canteiro ou da unidade."><Entrada name="estabelecimento" required /></Campo>
              <Campo rotulo="Processos e ambientes (resumo)" ajuda="NR-1, 1.5.7.3.2, a e b."><AreaTexto name="descricaoProcessos" rows={3} /></Campo>
            </Formulario>
          </Cartao>
        )}
      </div>
    </>
  );
}
