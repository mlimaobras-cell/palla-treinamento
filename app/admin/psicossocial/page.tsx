import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Aviso, Campo, Cartao, Entrada, Indicador, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { CATEGORIA_RELATO, MIN_PESQUISA, painelMensal, STATUS_RELATO } from "@/lib/servicos/psicossocial";
import { registrarDdsAcao, registrarEscutaAcao, salvarIndicadorAcao, tratarRelatoAcao } from "../sst/acoes";

export const metadata = { title: "Riscos psicossociais" };

const mesAtual = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 7);

export default async function Psicossocial({ searchParams }: { searchParams: Promise<{ mes?: string; obra?: string }> }) {
  const a = await exigirEquipe("sst.ver");
  const sp = await searchParams;
  const mes = /^\d{4}-\d{2}$/.test(sp.mes ?? "") ? sp.mes! : mesAtual();
  const obraGestor = a.perfil === "GESTOR_OBRA" ? (await db.query.obras.findFirst({ where: (o, { eq }) => eq(o.gestorId, a.id) }))?.id ?? "—" : undefined;
  const obraId = obraGestor ?? (sp.obra || null);
  const verRelatos = pode(a, "relato.tratar");
  const lancar = ["SST", "RH", "ADMIN"].includes(a.perfil);
  const registraDds = ["SST", "ADMIN", "GESTOR_OBRA", "INSTRUTOR"].includes(a.perfil);
  const [p, obras, relatos, escutas, ddsLista, colabs] = await Promise.all([
    painelMensal(mes, obraId),
    db.query.obras.findMany({ where: (o, { eq }) => eq(o.ativa, true), orderBy: (o, { asc }) => asc(o.codigo) }),
    verRelatos ? db.query.relatos.findMany({ orderBy: desc(schema.relatos.criadoEm), with: { obra: true }, limit: 50 }) : Promise.resolve([]),
    db.query.escutas.findMany({ orderBy: desc(schema.escutas.data), with: { obra: true }, limit: 20 }),
    db.query.dds.findMany({ orderBy: desc(schema.dds.data), with: { obra: true, presencas: true }, limit: 20 }),
    db.query.colaboradores.findMany({ columns: { id: true, nome: true, obraId: true }, orderBy: (c, { asc }) => asc(c.nome) }),
  ]);
  const nomeObra = (id: string | null) => obras.find((o) => o.id === id)?.codigo ?? "—";

  return (
    <>
      <TituloPagina titulo="Riscos psicossociais" subtitulo="Canal de relato, escutas por equipe, DDS e indicadores por obra — as evidências do gerenciamento dos fatores psicossociais (NR-1, 1.5.3.1.4)." />
      <div className="mb-5"><Aviso tom="info">A empresa gere os fatores do <strong>trabalho</strong> (prazo, jornada, relações, alojamento). Ninguém é diagnosticado aqui e nenhum dado de saúde mental individual é guardado. Os temas levantados viram linhas do inventário e ações do plano no PGR da obra.</Aviso></div>

      <form className="mb-5 flex flex-col gap-2 rounded-xl border border-linha bg-white p-3 sm:flex-row">
        <Entrada type="month" name="mes" defaultValue={mes} className="sm:!w-48" aria-label="Mês" />
        {!obraGestor && <Selecao name="obra" defaultValue={sp.obra ?? ""} className="sm:!w-56" aria-label="Obra"><option value="">Todas as obras</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo}</option>)}</Selecao>}
        <button className="rounded-lg border border-linha px-4 text-sm font-semibold text-palla-azul">Ver mês</button>
      </form>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Indicador rotulo="Relatos no mês" valor={p.relatosNoMes} detalhe={verRelatos ? `${p.relatosAbertos} em aberto` : "detalhes só com o RH"} />
        <Indicador rotulo="Relatos fora do prazo" valor={p.relatosVencidos} tom={p.relatosVencidos ? "vermelho" : "verde"} />
        <Indicador rotulo="Escutas no mês" valor={p.escutas.length} tom={p.escutas.length ? "verde" : "amarelo"} detalhe={`${p.escutas.reduce((s, e) => s + e.participantes, 0)} participantes`} />
        <Indicador rotulo="DDS no mês" valor={p.dds.length} detalhe={`${p.ddsPsicossocial} com tema psicossocial`} />
        <Indicador rotulo="Presenças em DDS" valor={p.presencas} />
        <Indicador rotulo="Indicadores lançados" valor={p.indicadores.length} detalhe={`de ${obraId ? 1 : p.obras.length} obra(s)`} tom={p.indicadores.length ? "verde" : "amarelo"} />
      </div>
      {p.porCategoria.length > 0 && <p className="mt-3 text-sm text-tinta-suave">Relatos do mês por assunto: {p.porCategoria.map((c) => `${CATEGORIA_RELATO[c.categoria].split(" (")[0]}: ${c.total}`).join(" · ")}</p>}

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {verRelatos && (
          <Cartao titulo="Canal de relato (confidencial)" className="xl:col-span-2">
            {relatos.length === 0 ? <Vazio>Nenhum relato recebido.</Vazio> : (
              <ul className="space-y-3">
                {relatos.map((r) => (
                  <li key={r.id} className="rounded-lg border border-linha p-3 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span><span className="font-mono text-xs">{r.protocolo}</span> · <span className="font-medium">{CATEGORIA_RELATO[r.categoria]}</span>
                        <span className="block text-xs text-tinta-suave">{fmtData(r.criadoEm)} · obra {r.obra?.codigo ?? "—"} · {r.anonimo ? "anônimo" : "identificado"} · prazo {fmtData(r.prazoApuracao)}</span></span>
                      <Selo cor={r.prazoApuracao < new Date() && ["RECEBIDO", "EM_APURACAO"].includes(r.status) ? "vermelho" : STATUS_RELATO[r.status].cor}>{STATUS_RELATO[r.status].rotulo}</Selo>
                    </div>
                    <p className="mt-2 whitespace-pre-line">{r.descricao}</p>
                    <details className="mt-2"><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Tratar</summary>
                      <Formulario acao={tratarRelatoAcao.bind(null, r.id)} rotulo="Salvar" variante="secundario" className="mt-2 space-y-2">
                        <Campo rotulo="Situação"><Selecao name="status" defaultValue={r.status}>{Object.entries(STATUS_RELATO).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}</Selecao></Campo>
                        <Campo rotulo="Medidas tomadas (registro interno)"><AreaTexto name="medidas" rows={2} defaultValue={r.medidas ?? ""} /></Campo>
                        <Campo rotulo="Devolutiva para quem relatou" ajuda="Aparece para quem consultar o protocolo. Não cite nomes."><AreaTexto name="resposta" rows={2} defaultValue={r.resposta ?? ""} /></Campo>
                      </Formulario>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        )}

        <Cartao titulo="Escutas por equipe e pesquisas">
          {escutas.length === 0 ? <Vazio>Nenhuma escuta registrada.</Vazio> : (
            <ul className="divide-y divide-linha text-sm">
              {escutas.map((e) => (
                <li key={e.id} className="py-2"><span className="font-medium">{fmtData(e.data)} · {e.tipo === "RODA" ? "Roda de conversa" : "Pesquisa anônima"} · obra {e.obra?.codigo ?? "empresa"}</span>
                  <span className="block text-xs text-tinta-suave">{e.participantes} participantes · conduzido por {e.conduzidoPor}</span>
                  <span className="block text-xs">Temas: {e.temas}</span>{e.encaminhamentos && <span className="block text-xs">Encaminhamentos: {e.encaminhamentos}</span>}</li>
              ))}
            </ul>
          )}
          {lancar && (
            <details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Registrar escuta</summary>
              <Formulario acao={registrarEscutaAcao} rotulo="Registrar" className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir>
                <Campo rotulo="Tipo"><Selecao name="tipo"><option value="RODA">Roda de conversa</option><option value="PESQUISA">Pesquisa anônima</option></Selecao></Campo>
                <Campo rotulo="Obra"><Selecao name="obraId"><option value="">Empresa (sede, fábrica)</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo}</option>)}</Selecao></Campo>
                <Campo rotulo="Data"><Entrada type="date" name="data" required /></Campo>
                <Campo rotulo="Participantes" ajuda={`Pesquisa: mínimo ${MIN_PESQUISA}.`}><Entrada type="number" name="participantes" min={1} required /></Campo>
                <div className="sm:col-span-2"><Campo rotulo="Conduzido por"><Entrada name="conduzidoPor" required /></Campo></div>
                <div className="sm:col-span-2"><Campo rotulo="Temas levantados (sem nomes)" ajuda="Ex.: pressão para terminar a cobertura antes da chuva; alojamento sem água quente; encarregado grita em público."><AreaTexto name="temas" rows={3} required /></Campo></div>
                <div className="sm:col-span-2"><Campo rotulo="Encaminhamentos"><AreaTexto name="encaminhamentos" rows={2} placeholder="Ex.: incluir no plano de ação do PGR; conversa com o encarregado; troca do chuveiro" /></Campo></div>
              </Formulario>
            </details>
          )}
        </Cartao>

        <Cartao titulo="DDS">
          {ddsLista.length === 0 ? <Vazio>Nenhum DDS registrado.</Vazio> : (
            <ul className="divide-y divide-linha text-sm">
              {ddsLista.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-2 py-2">
                  <span><span className="font-medium">{fmtData(d.data)} · {d.tema}</span><span className="block text-xs text-tinta-suave">obra {d.obra.codigo} · {d.conduzidoPor}</span></span>
                  <span className="flex items-center gap-2">{d.psicossocial && <Selo cor="azul">psicossocial</Selo>}<Selo>{d.presencas.length} presentes</Selo></span>
                </li>
              ))}
            </ul>
          )}
          {registraDds && (
            <details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Registrar DDS</summary>
              <Formulario acao={registrarDdsAcao} rotulo="Registrar" className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir>
                <Campo rotulo="Obra"><Selecao name="obraId" required defaultValue={obraGestor ?? ""}><option value="" disabled>Escolha</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} · {o.nome}</option>)}</Selecao></Campo>
                <Campo rotulo="Data"><Entrada type="date" name="data" required /></Campo>
                <div className="sm:col-span-2"><Campo rotulo="Tema"><Entrada name="tema" required placeholder="Ex.: Pressa não entra na obra — como pedir mais tempo" /></Campo></div>
                <Campo rotulo="Conduzido por"><Entrada name="conduzidoPor" required /></Campo>
                <label className="flex items-center gap-2 pt-6"><input type="checkbox" name="psicossocial" value="1" /> Tema psicossocial</label>
                <div className="sm:col-span-2"><Campo rotulo="Resumo do conteúdo"><AreaTexto name="conteudo" rows={2} /></Campo></div>
                <fieldset className="sm:col-span-2"><legend className="mb-1 font-medium">Presentes sem celular (a equipe marca; os demais confirmam no celular)</legend>
                  <div className="grid max-h-40 gap-1 overflow-y-auto rounded-md border border-linha p-2 sm:grid-cols-2">{colabs.filter((c) => !obraGestor || c.obraId === obraGestor).map((c) => <label key={c.id} className="flex items-center gap-2"><input type="checkbox" name="presente" value={c.id} /> {c.nome} <span className="text-xs text-tinta-suave">{nomeObra(c.obraId)}</span></label>)}</div>
                </fieldset>
              </Formulario>
            </details>
          )}
        </Cartao>

        <Cartao titulo={`Indicadores de ${mes.split("-").reverse().join("/")}`} className="xl:col-span-2">
          {p.indicadores.length === 0 ? <Vazio>Nenhum indicador lançado neste mês.</Vazio> : (
            <Tabela cabecalho={["Obra", "Efetivo", "Horas extras (média/pessoa)", "Faltas", "Afastamentos", "Desligamentos", "Quase acidentes", "Observação"]}>
              {p.indicadores.map((i) => (
                <tr key={i.id}><td className="px-5 py-2 font-medium">{nomeObra(i.obraId)}</td><td className="px-5">{i.efetivo ?? "—"}</td><td className="px-5">{i.horasExtrasMedia ?? "—"}</td><td className="px-5">{i.faltas ?? "—"}</td><td className="px-5">{i.afastamentos ?? "—"}</td><td className="px-5">{i.desligamentos ?? "—"}</td><td className="px-5">{i.quaseAcidentes ?? "—"}</td><td className="px-5 text-xs">{i.observacao}</td></tr>
              ))}
            </Tabela>
          )}
          {lancar && (
            <details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Lançar ou corrigir indicadores do mês</summary>
              <Formulario acao={salvarIndicadorAcao} rotulo="Salvar" className="mt-3 grid gap-3 sm:grid-cols-4">
                <Campo rotulo="Obra"><Selecao name="obraId" required>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo}</option>)}</Selecao></Campo>
                <Campo rotulo="Mês"><Entrada type="month" name="mes" defaultValue={mes} required /></Campo>
                <Campo rotulo="Efetivo"><Entrada type="number" name="efetivo" min={0} /></Campo>
                <Campo rotulo="Horas extras (média por pessoa)"><Entrada type="number" step="0.1" name="horasExtrasMedia" min={0} /></Campo>
                <Campo rotulo="Faltas"><Entrada type="number" name="faltas" min={0} /></Campo>
                <Campo rotulo="Afastamentos" ajuda="Só o número, informado pelo médico/RH."><Entrada type="number" name="afastamentos" min={0} /></Campo>
                <Campo rotulo="Desligamentos"><Entrada type="number" name="desligamentos" min={0} /></Campo>
                <Campo rotulo="Quase acidentes"><Entrada type="number" name="quaseAcidentes" min={0} /></Campo>
                <div className="sm:col-span-4"><Campo rotulo="Observação"><Entrada name="observacao" /></Campo></div>
              </Formulario>
            </details>
          )}
        </Cartao>
      </div>
    </>
  );
}
