import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Cartao, Tabela, TituloPagina } from "@/components/ui";
import { fmtDataHora } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";

export const metadata = { title: "Auditoria" };

export default async function Auditoria() {
  await exigirEquipe("auditoria.ver");
  const eventos = await db.query.auditoria.findMany({ orderBy: desc(schema.auditoria.quando), limit: 200 });
  return (
    <>
      <TituloPagina titulo="Registro de auditoria" subtitulo="Últimos 200 eventos. O registro é somente de inclusão." />
      <Cartao>
        <Tabela cabecalho={["Quando", "Quem", "Ação", "Entidade", "Detalhes"]}>
          {eventos.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap px-5 py-2 text-xs">{fmtDataHora(e.quando)}</td>
              <td className="px-5 text-xs">{e.usuarioNome}</td>
              <td className="px-5 font-mono text-xs">{e.acao}</td>
              <td className="px-5 text-xs">{e.entidade}</td>
              <td className="max-w-md truncate px-5 font-mono text-[11px] text-tinta-suave" title={JSON.stringify(e.detalhes)}>{e.detalhes ? JSON.stringify(e.detalhes) : ""}</td>
            </tr>
          ))}
        </Tabela>
      </Cartao>
    </>
  );
}
