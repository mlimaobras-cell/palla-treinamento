import Link from "next/link";
import { db } from "@/db";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { exigirEquipe } from "@/lib/sessao";
import { listarPrazos, TIPO_ROTULO } from "@/lib/servicos/prazos";
import { concluirPrazoAcao, criarPrazoAcao } from "../sst/acoes";

export const metadata = { title: "Prazos e alertas" };

export default async function Prazos({ searchParams }: { searchParams: Promise<{ janela?: string; tipo?: string; obra?: string }> }) {
  const a = await exigirEquipe("prazo.ver");
  const sp = await searchParams;
  const janela = Number(sp.janela ?? 60);
  const obraGestor = a.perfil === "GESTOR_OBRA" ? (await db.query.obras.findFirst({ where: (o, { eq }) => eq(o.gestorId, a.id) }))?.id ?? "—" : undefined;
  const [lista, obras, colabs] = await Promise.all([
    listarPrazos({ janelaDias: janela, obraId: obraGestor ?? (sp.obra || null) }),
    db.query.obras.findMany({ orderBy: (o, { asc }) => asc(o.codigo) }),
    db.query.colaboradores.findMany({ columns: { id: true, nome: true }, orderBy: (c, { asc }) => asc(c.nome) }),
  ]);
  const filtrada = sp.tipo ? lista.filter((p) => p.tipo === sp.tipo) : lista;

  return (
    <>
      <TituloPagina titulo="Prazos e alertas" subtitulo="Exames periódicos, reciclagens, documentos com validade, experiência, revisão do PGR, relatório do PCMSO e plano de ação." />
      <form className="mb-5 flex flex-wrap gap-2 rounded-xl border border-linha bg-white p-3">
        <Selecao name="janela" defaultValue={String(janela)} className="w-auto" aria-label="Janela"><option value="15">Próximos 15 dias</option><option value="30">30 dias</option><option value="60">60 dias</option><option value="90">90 dias</option><option value="365">12 meses</option></Selecao>
        <Selecao name="tipo" defaultValue={sp.tipo ?? ""} className="w-auto" aria-label="Tipo"><option value="">Todos os tipos</option>{Object.entries(TIPO_ROTULO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao>
        {!obraGestor && <Selecao name="obra" defaultValue={sp.obra ?? ""} className="w-auto" aria-label="Obra"><option value="">Todas as obras</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo}</option>)}</Selecao>}
        <button className="rounded-lg border border-linha px-4 text-sm font-semibold text-palla-azul">Filtrar</button>
      </form>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Cartao titulo={`${filtrada.length} prazo(s)`}>
          {filtrada.length === 0 ? <Vazio>Nenhum prazo nesta janela.</Vazio> : (
            <Tabela cabecalho={["Vence", "O quê", "Tipo", "De onde vem a data", ""]}>
              {filtrada.map((p) => (
                <tr key={p.chave}>
                  <td className="px-5 py-2.5"><Selo cor={p.dias < 0 ? "vermelho" : p.dias <= 15 ? "amarelo" : "azul"}>{fmtData(p.venceEm)}</Selo><span className="block text-xs text-tinta-suave">{p.dias < 0 ? `vencido há ${-p.dias} dia(s)` : p.dias === 0 ? "hoje" : `em ${p.dias} dia(s)`}</span></td>
                  <td className="px-5">{p.href ? <Link href={p.href} className="font-medium hover:underline">{p.titulo}</Link> : <span className="font-medium">{p.titulo}</span>}</td>
                  <td className="px-5 text-xs">{TIPO_ROTULO[p.tipo]}</td>
                  <td className="px-5 text-xs text-tinta-suave">{p.origem}</td>
                  <td className="px-5">{p.prazoManualId && <Formulario acao={concluirPrazoAcao.bind(null, p.prazoManualId)} rotulo="Concluir" variante="secundario" className=""><span /></Formulario>}</td>
                </tr>
              ))}
            </Tabela>
          )}
        </Cartao>
        <Cartao titulo="Cadastrar outro prazo">
          <Formulario acao={criarPrazoAcao} rotulo="Cadastrar" limparAoConcluir>
            <Campo rotulo="O que vence"><Entrada name="titulo" placeholder="Ex.: laudo de aterramento do canteiro" required /></Campo>
            <Campo rotulo="Data"><Entrada type="date" name="venceEm" required /></Campo>
            <Campo rotulo="Avisar com antecedência (dias)"><Entrada type="number" name="avisar" defaultValue={30} min={0} /></Campo>
            <Campo rotulo="Obra (opcional)"><Selecao name="obraId"><option value="">—</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} · {o.nome}</option>)}</Selecao></Campo>
            <Campo rotulo="Colaborador (opcional)"><Selecao name="colaboradorId"><option value="">—</option>{colabs.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</Selecao></Campo>
            <Campo rotulo="Observação"><Entrada name="observacao" /></Campo>
          </Formulario>
        </Cartao>
      </div>
    </>
  );
}
