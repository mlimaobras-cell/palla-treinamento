import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Aviso, Campo, Cartao, Entrada, LinkBotao, Selecao, Selo, TituloPagina, Vazio } from "@/components/ui";
import { fmtData, fmtDataHora } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { registroCompleto } from "@/lib/servicos/parceiros";
import { exigirEquipe } from "@/lib/sessao";
import { CATEGORIA_RISCO, carregarPgr, nivelDoRisco, resumoNiveis, STATUS_PROGRAMA, TIPO_MEDIDA } from "@/lib/servicos/pgr";
import {
  aprovarPgrAcao, atualizarPgrAcao, enviarRevisaoAcao, excluirRiscoAcao, importarBibliotecaAcao, revisarPgrAcao, salvarAcaoPlanoAcao, salvarCriterioAcao,
  salvarGheAcao, salvarRiscoAcao,
} from "../../acoes";

export const metadata = { title: "PGR" };

const STATUS_ACAO: Record<string, { rotulo: string; cor: string }> = {
  PLANEJADA: { rotulo: "Planejada", cor: "cinza" }, EM_ANDAMENTO: { rotulo: "Em andamento", cor: "azul" }, CONCLUIDA: { rotulo: "Concluída", cor: "verde" }, CANCELADA: { rotulo: "Cancelada", cor: "cinza" },
};

export default async function Pgr({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirEquipe("sst.ver");
  const p = await carregarPgr(id);
  if (!p) notFound();
  const [funcoes, ambientes, historico, signatarios, parceiros] = await Promise.all([
    db.query.funcoes.findMany({ orderBy: (f, { asc }) => asc(f.ordem) }),
    db.query.ambientesBiblioteca.findMany({ orderBy: (x, { asc }) => asc(x.ordem), with: { perigos: { columns: { id: true } } } }),
    db.query.pgrs.findMany({ where: p.obraId ? eq(schema.pgrs.obraId, p.obraId) : isNull(schema.pgrs.obraId), orderBy: (x, { desc }) => desc(x.criadoEm) }),
    db.query.signatarios.findMany({ where: eq(schema.signatarios.ativo, true), orderBy: (x, { asc }) => asc(x.nome) }),
    db.query.parceiros.findMany({ where: eq(schema.parceiros.ativo, true), orderBy: (x, { asc }) => asc(x.nome) }),
  ]);
  const profissionais = signatarios.filter((x) => x.tipo === "PROFISSIONAL_SST");
  const responsaveisOrg = signatarios.filter((x) => x.tipo === "RESPONSAVEL_ORGANIZACAO");
  const editar = pode(a, "sst.editar") && (p.status === "RASCUNHO" || p.status === "EM_REVISAO");
  const acompanhar = pode(a, "sst.editar") && p.status === "APROVADO";
  const nomeFuncao = (fid: string) => funcoes.find((f) => f.id === fid)?.nome ?? "?";
  const c = p.criterio;
  const resumo = resumoNiveis(c, p.riscos);

  return (
    <>
      <Link href="/admin/sst/pgr" className="text-sm font-medium text-palla-azul">← PGR</Link>
      <div className="mt-2"><TituloPagina titulo={`${p.titulo} — v${p.versao}`} subtitulo={`${p.obra ? `Obra ${p.obra.codigo} · ${p.obra.nome}` : "Empresa"} · ${p.estabelecimento}`}
        acao={<Selo cor={STATUS_PROGRAMA[p.status].cor}>{STATUS_PROGRAMA[p.status].rotulo}</Selo>} /></div>

      <div className="mb-5 flex flex-wrap gap-2">
        <LinkBotao href={`/imprimir/pgr/${p.id}`} variante="secundario">Gerar documento para assinatura</LinkBotao>
        <LinkBotao href={`/imprimir/pgr/${p.id}?contratante=1`} variante="secundario">Inventário para a contratante (NR-1, 1.5.8)</LinkBotao>
        {p.arquivoAssinadoPath && <a href={`/api/sst/arquivo/pgr/${p.id}`} target="_blank" className="inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold text-palla-azul ring-1 ring-inset ring-linha">PDF assinado</a>}
      </div>

      {p.status === "SUBSTITUIDO" && <div className="mb-4"><Aviso tom="alerta">Versão substituída: guardada apenas como histórico.</Aviso></div>}
      {p.status === "APROVADO" && <div className="mb-4"><Aviso tom="sucesso">Vigente desde {fmtData(p.vigenciaInicio)}. Próxima revisão até {fmtData(p.proximaRevisao)} (ou antes, nos casos da NR-1, 1.5.4.4.6). Aprovado em {fmtDataHora(p.aprovadoEm)}{p.aprovadoPor && ` por ${p.aprovadoPor.nome}`}. Hash do PDF: <span className="font-mono text-xs">{p.arquivoAssinadoHash?.slice(0, 16)}…</span></Aviso></div>}
      {p.motivoRevisao && <div className="mb-4"><Aviso tom="info">Motivo desta revisão: {p.motivoRevisao}</Aviso></div>}

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {resumo.map((n) => (
          <div key={n.nivel} className="rounded-xl border border-linha bg-white p-4"><Selo cor={n.cor}>{n.nivel}</Selo><div className="mt-1 text-2xl font-semibold tabular-nums text-palla-azul-escuro">{n.total}</div><div className="text-xs text-tinta-suave">{n.decisao}</div></div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          {p.ghes.length === 0 && <Vazio>Cadastre o primeiro grupo homogêneo de exposição (GHE) ao lado.</Vazio>}
          {p.ghes.map((g) => {
            const riscos = p.riscos.filter((r) => r.gheId === g.id);
            return (
              <Cartao key={g.id} titulo={<>{g.codigo} · {g.nome}</>} acao={<span className="text-xs text-tinta-suave">{riscos.length} risco(s)</span>}>
                <p className="text-sm">{g.descricaoAtividades}</p>
                <p className="mt-1 text-xs text-tinta-suave">Funções: {g.funcoesIds.map(nomeFuncao).join(", ") || "—"}{g.trabalhadores ? ` · ${g.trabalhadores} trabalhador(es)` : ""}{g.ambientes && ` · Ambientes: ${g.ambientes}`}</p>
                {g.epis && <p className="mt-1 whitespace-pre-line text-xs text-tinta-suave">EPIs: {g.epis}</p>}

                <div className="-mx-5 mt-3 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead><tr className="border-y border-linha text-xs uppercase tracking-wide text-tinta-suave"><th className="px-5 py-2">Perigo / fonte</th><th className="px-2">Lesões</th><th className="px-2">Medidas existentes</th><th className="px-2">S×P</th><th className="px-2">Nível</th></tr></thead>
                    <tbody className="divide-y divide-linha">
                      {riscos.map((r) => {
                        const n = nivelDoRisco(c, r.severidade, r.probabilidade);
                        return (
                          <tr key={r.id} className="align-top">
                            <td className="px-5 py-2"><span className="text-xs text-tinta-suave">{CATEGORIA_RISCO[r.categoria]}</span><span className="block font-medium">{r.perigo}</span><span className="block text-xs text-tinta-suave">{r.fonte}</span>
                              {r.examesSugeridos && <span className="mt-1 block text-xs text-indigo-700">Para o médico avaliar: {r.examesSugeridos}</span>}
                              {editar && (
                                <details className="mt-1"><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Editar</summary>
                                  <FormRisco pgrId={p.id} riscoId={r.id} gheId={g.id} r={r} c={c} />
                                  <Formulario acao={excluirRiscoAcao.bind(null, p.id, r.id)} rotulo="Excluir linha" variante="perigo" className="mt-2"><span /></Formulario>
                                </details>
                              )}
                            </td>
                            <td className="px-2 py-2 text-xs">{r.lesoes}</td>
                            <td className="px-2 py-2 text-xs">{r.medidasExistentes}{r.exposicao && <span className="block text-tinta-suave">Exposição: {r.exposicao}</span>}{r.monitoramento && <span className="block text-tinta-suave">Avaliação: {r.monitoramento}</span>}</td>
                            <td className="px-2 py-2 tabular-nums">{r.severidade}×{r.probabilidade}</td>
                            <td className="px-2 py-2"><Selo cor={n.cor}>{n.nivel}</Selo></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {riscos.length === 0 && <p className="mt-2 text-sm text-tinta-suave">Sem riscos. Importe da biblioteca ou inclua manualmente.</p>}

                {editar && (
                  <div className="mt-4 grid gap-3 border-t border-linha pt-4 lg:grid-cols-2">
                    <details className="text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Importar perigos da biblioteca</summary>
                      <Formulario acao={importarBibliotecaAcao.bind(null, p.id, g.id)} rotulo="Importar" className="mt-2 space-y-2">
                        <fieldset className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-linha p-2">
                          {ambientes.map((am) => <label key={am.id} className="flex items-start gap-2"><input type="checkbox" name="ambienteId" value={am.id} className="mt-1" /><span>{am.nome} <span className="text-xs text-tinta-suave">({am.perigos.length})</span></span></label>)}
                        </fieldset>
                        <p className="text-xs text-tinta-suave">As linhas entram como ponto de partida e devem ser confirmadas no local pelo profissional habilitado.</p>
                      </Formulario>
                    </details>
                    <details className="text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Incluir risco</summary><FormRisco pgrId={p.id} riscoId={null} gheId={g.id} c={c} /></details>
                    <details className="text-sm lg:col-span-2"><summary className="cursor-pointer font-semibold text-palla-azul">Editar GHE</summary><FormGhe pgrId={p.id} g={g} funcoes={funcoes} /></details>
                  </div>
                )}
              </Cartao>
            );
          })}

          <Cartao titulo="Plano de ação">
            <div id="plano" />
            {p.acoes.length === 0 ? <Vazio>Nenhuma ação. Riscos de nível moderado ou acima pedem medidas com responsável e prazo (NR-1, 1.5.5.2).</Vazio> : (
              <ul className="divide-y divide-linha text-sm">
                {p.acoes.map((ac) => {
                  const r = p.riscos.find((x) => x.id === ac.riscoId);
                  return (
                    <li key={ac.id} className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <span><span className="font-medium">{ac.medida}</span><span className="block text-xs text-tinta-suave">{TIPO_MEDIDA[ac.tipo]} · {ac.responsavel}{ac.prazo && ` · prazo ${fmtData(ac.prazo)}`}{r && ` · risco: ${r.perigo}`}</span>
                          {ac.acompanhamento && <span className="block text-xs text-tinta-suave">Acompanhamento: {ac.acompanhamento}</span>}{ac.evidencia && <span className="block text-xs text-tinta-suave">Evidência: {ac.evidencia}</span>}</span>
                        <Selo cor={STATUS_ACAO[ac.status].cor}>{STATUS_ACAO[ac.status].rotulo}</Selo>
                      </div>
                      {(editar || acompanhar) && (
                        <Formulario acao={salvarAcaoPlanoAcao.bind(null, p.id, ac.id)} rotulo="Atualizar" variante="secundario" className="mt-2 flex flex-wrap items-end gap-2">
                          <input type="hidden" name="medida" value={ac.medida} /><input type="hidden" name="responsavel" value={ac.responsavel} /><input type="hidden" name="tipo" value={ac.tipo} />
                          <input type="hidden" name="riscoId" value={ac.riscoId ?? ""} /><input type="hidden" name="prazo" value={ac.prazo?.toISOString().slice(0, 10) ?? ""} /><input type="hidden" name="acompanhamento" value={ac.acompanhamento ?? ""} />
                          <Selecao name="status" defaultValue={ac.status} className="w-auto">{Object.entries(STATUS_ACAO).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}</Selecao>
                          <div className="min-w-48 flex-1"><Entrada name="evidencia" defaultValue={ac.evidencia ?? ""} placeholder="Evidência (ex.: foto, nota, laudo)" /></div>
                        </Formulario>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {editar && (
              <details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Incluir ação</summary>
                <Formulario acao={salvarAcaoPlanoAcao.bind(null, p.id, null)} rotulo="Incluir" className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir>
                  <div className="sm:col-span-2"><Campo rotulo="Medida"><Entrada name="medida" required /></Campo></div>
                  <Campo rotulo="Tipo (hierarquia, NR-1, 1.5.5.1)"><Selecao name="tipo">{Object.entries(TIPO_MEDIDA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
                  <Campo rotulo="Risco relacionado"><Selecao name="riscoId"><option value="">—</option>{p.riscos.map((r) => <option key={r.id} value={r.id}>{p.ghes.find((g) => g.id === r.gheId)?.codigo} · {r.perigo}</option>)}</Selecao></Campo>
                  <Campo rotulo="Responsável"><Entrada name="responsavel" required /></Campo>
                  <Campo rotulo="Prazo"><Entrada type="date" name="prazo" /></Campo>
                  <div className="sm:col-span-2"><Campo rotulo="Forma de acompanhamento e aferição"><Entrada name="acompanhamento" /></Campo></div>
                </Formulario>
              </details>
            )}
          </Cartao>
        </div>

        <div className="space-y-5">
          {editar && (
            <Cartao titulo="Novo GHE">
              <FormGhe pgrId={p.id} funcoes={funcoes} />
            </Cartao>
          )}

          <Cartao titulo="Dados do documento">
            {editar ? (
              <Formulario acao={atualizarPgrAcao.bind(null, p.id)} rotulo="Salvar" variante="secundario" className="space-y-3">
                <Campo rotulo="Título"><Entrada name="titulo" defaultValue={p.titulo} /></Campo>
                <Campo rotulo="Estabelecimento"><Entrada name="estabelecimento" defaultValue={p.estabelecimento} /></Campo>
                <Campo rotulo="Processos e ambientes"><AreaTexto name="descricaoProcessos" rows={4} defaultValue={p.descricaoProcessos ?? ""} /></Campo>
                <Campo rotulo="Profissional que elabora e assina" ajuda="Legalmente habilitado em segurança do trabalho (NR-18, 18.4.2).">
                  <Selecao name="elaboradorId" defaultValue={p.elaboradorId ?? ""}><option value="">Escolha…</option>{profissionais.map((x) => <option key={x.id} value={x.id}>{x.nome} — {x.qualificacao} · {registroCompleto(x)}</option>)}</Selecao>
                </Campo>
                <Campo rotulo="Responsável pela organização">
                  <Selecao name="responsavelOrgId" defaultValue={p.responsavelOrgId ?? ""}><option value="">Escolha…</option>{responsaveisOrg.map((x) => <option key={x.id} value={x.id}>{x.nome}{x.cargo ? ` — ${x.cargo}` : ""}</option>)}</Selecao>
                </Campo>
                <Campo rotulo="Logotipo da empresa parceira no documento (opcional)">
                  <Selecao name="parceiroId" defaultValue={p.parceiroId ?? ""}><option value="">Só o logotipo da Palla</option>{parceiros.map((x) => <option key={x.id} value={x.id}>{x.nome}{x.logoPath ? "" : " (sem logotipo)"}</option>)}</Selecao>
                </Campo>
                <p className="text-xs text-tinta-suave">Não está na lista? <Link href="/admin/sst/responsaveis" className="font-semibold text-palla-azul">Cadastre quem assina e a empresa parceira</Link>.</p>
              </Formulario>
            ) : (
              <dl className="space-y-2 text-sm">
                <div><dt className="text-xs text-tinta-suave">Elaborado por</dt><dd>{p.elaboradorNome ?? "—"} · {p.elaboradorQualificacao} · {p.elaboradorRegistro}</dd></div>
                <div><dt className="text-xs text-tinta-suave">Responsável pela organização</dt><dd>{p.responsavelOrganizacao ?? "—"}</dd></div>
                {p.parceiro && <div><dt className="text-xs text-tinta-suave">Empresa parceira no documento</dt><dd>{p.parceiro.nome}</dd></div>}
                <div><dt className="text-xs text-tinta-suave">Processos</dt><dd className="whitespace-pre-line">{p.descricaoProcessos ?? "—"}</dd></div>
              </dl>
            )}
          </Cartao>

          <Cartao titulo="Critério de risco (NR-1, 1.5.4.4.2)">
            <div className="overflow-x-auto">
              <table className="text-center text-xs">
                <thead><tr><th className="p-1 text-left">S \ P</th>{c.probabilidade.map((pr) => <th key={pr.valor} className="p-1" title={pr.descricao}>{pr.valor}</th>)}</tr></thead>
                <tbody>{[...c.severidade].reverse().map((sv) => (
                  <tr key={sv.valor}><th className="p-1 text-left" title={sv.descricao}>{sv.valor} {sv.rotulo}</th>
                    {c.probabilidade.map((pr) => { const n = nivelDoRisco(c, sv.valor, pr.valor); return <td key={pr.valor} className="p-0.5"><Selo cor={n.cor}>{sv.valor * pr.valor}</Selo></td>; })}</tr>
                ))}</tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-tinta-suave">Critério sugerido pela plataforma. A Palla precisa aprovar ou ajustar e documentar no PGR.</p>
            {editar && (
              <details className="mt-2 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Ajustar critério (avançado)</summary>
                <Formulario acao={salvarCriterioAcao.bind(null, p.id)} rotulo="Salvar critério" variante="secundario" className="mt-2 space-y-2">
                  <AreaTexto name="criterio" rows={12} defaultValue={JSON.stringify(c, null, 2)} className="font-mono text-[11px]" />
                </Formulario>
              </details>
            )}
          </Cartao>

          {pode(a, "sst.editar") && p.status === "RASCUNHO" && (
            <Cartao titulo="Enviar para revisão">
              <Formulario acao={enviarRevisaoAcao.bind(null, p.id)} rotulo="Enviar para revisão" className="space-y-2"><p className="text-sm text-tinta-suave">Confere se todo GHE tem função e riscos. Depois gere o documento e colete a assinatura.</p></Formulario>
            </Cartao>
          )}
          {pode(a, "sst.editar") && p.status === "EM_REVISAO" && (
            <Cartao titulo="Aprovar (anexar PDF assinado)">
              <Formulario acao={aprovarPgrAcao.bind(null, p.id)} rotulo="Aprovar versão" className="space-y-3">
                <Campo rotulo="Início da vigência"><Entrada type="date" name="vigenciaInicio" required /></Campo>
                <Campo rotulo="Revisar em (meses)" ajuda="Máximo 24 (NR-1, 1.5.4.4.6)."><Entrada type="number" name="mesesRevisao" min={1} max={24} defaultValue={24} /></Campo>
                <Campo rotulo="PDF assinado pelo profissional"><Entrada type="file" name="arquivo" accept="application/pdf" required /></Campo>
                <p className="text-xs text-tinta-suave">Gere o documento em "Gerar documento para assinatura", salve em PDF, colete a assinatura (certificado ICP-Brasil ou à mão e digitalizado) e anexe aqui.</p>
              </Formulario>
            </Cartao>
          )}
          {acompanhar && (
            <Cartao titulo="Revisar o PGR">
              <Formulario acao={revisarPgrAcao.bind(null, p.id)} rotulo="Criar revisão" variante="secundario" className="space-y-2">
                <Campo rotulo="Motivo" ajuda="Ex.: nova etapa da obra (NR-18, 18.4.3.1), acidente, mudança de processo, revisão de 2 anos."><Entrada name="motivo" required /></Campo>
              </Formulario>
            </Cartao>
          )}

          <Cartao titulo="Versões deste local">
            <ul className="space-y-1 text-sm">
              {historico.map((h) => <li key={h.id} className="flex justify-between gap-2"><Link href={`/admin/sst/pgr/${h.id}`} className={h.id === p.id ? "font-semibold" : "text-palla-azul"}>{h.titulo} v{h.versao}</Link><span className="text-xs text-tinta-suave">{STATUS_PROGRAMA[h.status].rotulo} · {fmtData(h.aprovadoEm ?? h.criadoEm)}</span></li>)}
            </ul>
          </Cartao>
        </div>
      </div>
    </>
  );
}

function FormGhe({ pgrId, g, funcoes }: { pgrId: string; g?: typeof schema.ghes.$inferSelect; funcoes: { id: string; nome: string }[] }) {
  return (
    <Formulario acao={salvarGheAcao.bind(null, pgrId, g?.id ?? null)} rotulo={g ? "Salvar GHE" : "Criar GHE"} variante={g ? "secundario" : "primario"} className="mt-2 space-y-3" limparAoConcluir={!g}>
      <div className="grid gap-2 sm:grid-cols-[110px_1fr]">
        <Campo rotulo="Código"><Entrada name="codigo" defaultValue={g?.codigo} placeholder="GHE-01" required /></Campo>
        <Campo rotulo="Nome"><Entrada name="nome" defaultValue={g?.nome} placeholder="Montagem em altura" required /></Campo>
      </div>
      <Campo rotulo="Atividades do grupo"><AreaTexto name="descricaoAtividades" rows={2} defaultValue={g?.descricaoAtividades} required /></Campo>
      <fieldset className="text-sm"><legend className="mb-1 font-medium">Funções expostas</legend>
        <div className="grid max-h-44 gap-1 overflow-y-auto rounded-md border border-linha p-2 sm:grid-cols-2">
          {funcoes.map((f) => <label key={f.id} className="flex items-center gap-2"><input type="checkbox" name="funcaoId" value={f.id} defaultChecked={g?.funcoesIds.includes(f.id)} /> {f.nome}</label>)}
        </div>
      </fieldset>
      <Campo rotulo="EPIs do grupo (NR-18, 18.4.3, e)" ajuda="Um por linha, com a especificação técnica. Vai para a ordem de serviço."><AreaTexto name="epis" rows={3} defaultValue={g?.epis ?? ""} placeholder={"- Capacete classe B com jugular\n- Cinto tipo paraquedista com talabarte duplo"} /></Campo>
      <Campo rotulo="Nº de trabalhadores (opcional)"><Entrada type="number" name="trabalhadores" min={0} defaultValue={g?.trabalhadores ?? ""} /></Campo>
    </Formulario>
  );
}

function FormRisco({ pgrId, riscoId, gheId, r, c }: { pgrId: string; riscoId: string | null; gheId: string; r?: typeof schema.riscosInventario.$inferSelect; c: typeof schema.pgrs.$inferSelect["criterio"] }) {
  return (
    <Formulario acao={salvarRiscoAcao.bind(null, pgrId, riscoId)} rotulo="Salvar" variante="secundario" className="mt-2 grid gap-2 sm:grid-cols-2" limparAoConcluir={!riscoId}>
      <input type="hidden" name="gheId" value={gheId} />
      <Campo rotulo="Categoria"><Selecao name="categoria" defaultValue={r?.categoria ?? "ACIDENTE"}>{Object.entries(CATEGORIA_RISCO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
      <Campo rotulo="Perigo"><Entrada name="perigo" defaultValue={r?.perigo} required /></Campo>
      <Campo rotulo="Fonte ou circunstância"><Entrada name="fonte" defaultValue={r?.fonte} required /></Campo>
      <Campo rotulo="Possíveis lesões ou agravos"><Entrada name="lesoes" defaultValue={r?.lesoes} required /></Campo>
      <div className="sm:col-span-2"><Campo rotulo="Medidas de prevenção implementadas"><AreaTexto name="medidasExistentes" rows={2} defaultValue={r?.medidasExistentes} required /></Campo></div>
      <Campo rotulo="Caracterização da exposição"><Entrada name="exposicao" defaultValue={r?.exposicao ?? ""} placeholder="Ex.: habitual e intermitente, 4 h/dia" /></Campo>
      <Campo rotulo="Avaliação / monitoramento"><Entrada name="monitoramento" defaultValue={r?.monitoramento ?? ""} placeholder="Ex.: dosimetria de ruído 03/2026, 88 dB(A)" /></Campo>
      <Campo rotulo="Severidade"><Selecao name="severidade" defaultValue={String(r?.severidade ?? 3)}>{c.severidade.map((s) => <option key={s.valor} value={s.valor}>{s.valor} — {s.rotulo}</option>)}</Selecao></Campo>
      <Campo rotulo="Probabilidade"><Selecao name="probabilidade" defaultValue={String(r?.probabilidade ?? 3)}>{c.probabilidade.map((s) => <option key={s.valor} value={s.valor}>{s.valor} — {s.rotulo}</option>)}</Selecao></Campo>
      <div className="sm:col-span-2"><Campo rotulo="Exames para o médico do PCMSO avaliar (sugestão)"><Entrada name="examesSugeridos" defaultValue={r?.examesSugeridos ?? ""} /></Campo></div>
    </Formulario>
  );
}
