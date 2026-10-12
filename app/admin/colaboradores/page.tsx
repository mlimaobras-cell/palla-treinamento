import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Filtros } from "@/components/filtros";
import { Cartao, LinkBotao, Selo, Semaforo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { listarColaboradores } from "@/lib/servicos/painel";

export const metadata = { title: "Colaboradores" };

export default async function Colaboradores({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const a = await exigirEquipe("colaborador.ver");
  const f = await searchParams;
  const obraGestor = a.perfil === "GESTOR_OBRA" ? (await db.query.obras.findFirst({ where: eq(schema.obras.gestorId, a.id) }))?.id ?? "—" : undefined;
  const lista = await listarColaboradores(f, obraGestor);
  return (
    <>
      <TituloPagina titulo="Colaboradores" subtitulo={`${lista.length} encontrado(s)`} acao={pode(a, "convite.criar") ? <LinkBotao href="/admin/obras">Gerar link de cadastro</LinkBotao> : null} />
      <Filtros valores={f} />
      <Cartao>
        {lista.length === 0 ? <Vazio>Nenhum colaborador com esses filtros.</Vazio> : (
          <Tabela cabecalho={["Colaborador", "Função", "Obra", "Treinamentos", "Situação", "Acesso"]}>
            {lista.map((c) => {
              const ex = c.matriculas.filter((m) => m.classificacao !== "RECOMENDADO" && m.status !== "CANCELADA");
              const ok = ex.filter((m) => m.status === "CAPACITADO").length;
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3"><Link href={`/admin/colaboradores/${c.id}`} className="font-medium text-palla-azul hover:underline">{c.nome}</Link>{c.dadoFicticio && <span className="ml-2"><Selo>teste</Selo></span>}<span className="block text-xs text-tinta-suave">{c.empresa.nome}</span></td>
                  <td className="px-5">{c.funcao.nome}</td>
                  <td className="px-5">{c.obra?.codigo ?? "—"}</td>
                  <td className="px-5 tabular-nums">{ok}/{ex.length}</td>
                  <td className="px-5"><Semaforo valor={c.semaforo} /></td>
                  <td className="px-5">{c.liberado ? <Selo cor={c.semaforo === "VERDE" ? "verde" : "vermelho"}>{c.semaforo === "VERDE" ? "Liberado" : "Liberado — revisar"}</Selo> : <Selo>Não liberado</Selo>}</td>
                </tr>
              );
            })}
          </Tabela>
        )}
      </Cartao>
    </>
  );
}
