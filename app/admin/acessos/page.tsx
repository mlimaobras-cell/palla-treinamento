import Link from "next/link";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { Cartao, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtDataHora } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { chavePublicaPush, PERFIS_AVISO } from "@/lib/servicos/avisos";
import { AvisosPush } from "./avisos";

export const metadata = { title: "Acessos e avisos" };

const COMO: Record<string, string> = { login: "Entrou", "usuario.senha_redefinida": "Criou nova senha", "colaborador.cadastro_por_convite": "Fez o cadastro" };

export default async function Acessos() {
  const a = await exigirEquipe("colaborador.ver");
  const desde = new Date(Date.now() - 30 * 86400_000);
  const colabs = await db.query.usuarios.findMany({ where: eq(schema.usuarios.perfil, "COLABORADOR"), with: { colaborador: { with: { funcao: true, obra: true } } } });
  const ids = colabs.map((u) => u.id);
  const eventos = ids.length
    ? await db.query.auditoria.findMany({
        where: and(inArray(schema.auditoria.usuarioId, ids), inArray(schema.auditoria.acao, Object.keys(COMO)), gte(schema.auditoria.quando, desde)),
        orderBy: desc(schema.auditoria.quando), limit: 200,
      })
    : [];
  const recebe = (PERFIS_AVISO as readonly string[]).includes(a.perfil);
  const aparelhos = recebe ? await db.query.inscricoesPush.findMany({ where: eq(schema.inscricoesPush.usuarioId, a.id) }) : [];
  return (
    <>
      <TituloPagina titulo="Acessos e avisos" subtitulo="Quem entrou na plataforma nos últimos 30 dias e o aviso no seu celular ou notebook a cada login de colaborador." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Cartao titulo={`Entradas de colaboradores (${eventos.length})`}>
          {eventos.length === 0 ? <Vazio>Nenhum colaborador entrou nos últimos 30 dias.</Vazio> : (
            <Tabela cabecalho={["Quando", "Colaborador", "Função · obra", "O quê"]}>
              {eventos.map((e) => {
                const u = colabs.find((x) => x.id === e.usuarioId);
                const c = u?.colaborador;
                return (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap px-5 py-2.5 text-xs">{fmtDataHora(e.quando)}</td>
                    <td className="px-5 text-sm">{c ? <Link href={`/admin/colaboradores/${c.id}`} className="font-medium text-palla-azul hover:underline">{u!.nome}</Link> : e.usuarioNome}</td>
                    <td className="px-5 text-xs text-tinta-suave">{[c?.funcao?.nome, c?.obra?.codigo].filter(Boolean).join(" · ")}</td>
                    <td className="px-5 text-xs">{COMO[e.acao] ?? e.acao}</td>
                  </tr>
                );
              })}
            </Tabela>
          )}
        </Cartao>
        <div className="space-y-5">
          <Cartao titulo="Aviso de login no seu aparelho">
            {recebe ? (
              <>
                <p className="mb-3 text-sm text-tinta-suave">Ligue em cada aparelho onde quer receber (celular, notebook). Chega como notificação, igual a mensagem de aplicativo; tocando nela abre a ficha do colaborador.</p>
                {chavePublicaPush() ? <AvisosPush chave={chavePublicaPush()} /> : <p className="text-sm text-red-700">Avisos ainda não configurados no servidor.</p>}
                {aparelhos.length > 0 && <p className="mt-3 text-xs text-tinta-suave">Aparelhos com aviso ligado na sua conta: {aparelhos.length}.</p>}
              </>
            ) : <p className="text-sm text-tinta-suave">Os avisos de login são para Administrador, RH e Segurança do Trabalho.</p>}
          </Cartao>
        </div>
      </div>
    </>
  );
}
