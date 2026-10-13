import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada, Selecao, Selo, Semaforo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { mascararCpf } from "@/lib/cripto";
import { CLASSIFICACAO, fmtData, fmtDataHora, STATUS_MATRICULA, TIPO_DOC } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { avaliarColaborador, SEMAFORO_TEXTO } from "@/lib/servicos/conformidade";
import { matrizEfetiva } from "@/lib/servicos/cadastro";
import {
  alterarFuncaoObraAcao, aprovarLiberacaoAcao, concederAutorizacaoAcao, conferirDocumentoAcao, enviarDocumentoEquipeAcao,
  gerarLinkSenhaAcao, liberarReavaliacaoAcao, matricularAvulsoAcao, matricularCondicionalAcao, reaplicarMatrizAcao, registrarAfastamentoAcao, revogarAutorizacaoAcao, revogarLiberacaoAcao,
} from "../../acoes";

export default async function Colaborador({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirEquipe("colaborador.ver");
  const existe = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, id) });
  if (!existe) notFound();
  const { colaborador: c, itens, semaforo, liberacaoAtiva } = await avaliarColaborador(id);
  if (a.perfil === "GESTOR_OBRA" && c.obra?.gestorId !== a.id) notFound();
  const usuario = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.colaboradorId, id) });
  const [funcao, funcoes, obras, docs, autorizacoes, matriz, cursos] = await Promise.all([
    db.query.funcoes.findFirst({ where: eq(schema.funcoes.id, c.funcaoId) }),
    db.query.funcoes.findMany({ orderBy: (f, { asc }) => asc(f.ordem) }),
    db.query.obras.findMany(),
    db.query.documentos.findMany({ where: eq(schema.documentos.colaboradorId, id), orderBy: desc(schema.documentos.enviadoEm), with: { conferidoPor: true } }),
    db.query.autorizacoes.findMany({ where: eq(schema.autorizacoes.colaboradorId, id), with: { concedidaPor: true } }),
    matrizEfetiva(c.funcaoId, c.obraId),
    db.query.cursos.findMany({ where: eq(schema.cursos.ativo, true), orderBy: (k, { asc }) => asc(k.ordem) }),
  ]);
  const mats = c.matriculas.filter((m) => m.status !== "CANCELADA").sort((x, y) => x.curso.ordem - y.curso.ordem);
  const condicionais = matriz.filter((l) => l.classificacao === "CONDICIONAL" && !mats.some((m) => m.cursoId === l.cursoId));
  const avulsos = cursos.filter((k) => !mats.some((m) => m.cursoId === k.id) && !matriz.some((l) => l.cursoId === k.id));
  const atividades = [...new Set(mats.map((m) => m.curso.exigeAutorizacao).filter(Boolean) as string[])];
  const aptidoes = [...new Set(mats.map((m) => m.curso.exigeAptidaoAso).filter(Boolean) as string[])];

  return (
    <>
      <Link href="/admin/colaboradores" className="text-sm font-medium text-palla-azul">← Colaboradores</Link>
      <div className="mt-2"><TituloPagina titulo={c.nome} subtitulo={`${funcao?.nome} · ${c.obra ? `${c.obra.codigo} — ${c.obra.nome}` : "sem obra"} · CPF ${mascararCpf(c.cpfFinal)}`} acao={<Semaforo valor={semaforo} grande />} /></div>
      {c.dadoFicticio && <div className="mb-4"><Aviso tom="alerta">Registro de teste com dados fictícios.</Aviso></div>}
      {usuario && ["ADMIN", "RH", "SST"].includes(a.perfil) && (
        <details className="mb-5 rounded-xl border border-linha bg-white px-5 py-3 text-sm">
          <summary className="cursor-pointer font-medium text-palla-azul-escuro">Acesso à plataforma · {usuario.email}<span className="ml-2 text-xs font-normal text-tinta-suave">último acesso: {usuario.ultimoAcessoEm ? fmtDataHora(usuario.ultimoAcessoEm) : "nunca"}</span></summary>
          <p className="mt-2 text-tinta-suave">Esqueceu a senha? Gere um link e mande para o colaborador (WhatsApp, por exemplo). Ele cria a nova senha pelo celular; o histórico de aulas e avaliações não muda.</p>
          <Formulario acao={gerarLinkSenhaAcao.bind(null, id)} rotulo="Gerar link de nova senha" variante="secundario" className="mt-3 space-y-3"><span /></Formulario>
        </details>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Cartao titulo="Conferência para acesso à obra">
            <p className="mb-3 text-sm text-tinta-suave">{SEMAFORO_TEXTO[semaforo].descricao}</p>
            <ul className="divide-y divide-linha text-sm">
              {itens.map((i) => (
                <li key={i.grupo + i.descricao} className="flex items-start justify-between gap-3 py-2">
                  <span><span className="text-xs uppercase text-tinta-suave">{i.grupo}</span><span className="block">{i.descricao}</span>{i.detalhe && <span className="block text-xs text-tinta-suave">{i.detalhe}</span>}</span>
                  <Selo cor={i.situacao === "OK" ? "verde" : i.situacao === "PENDENTE" ? "amarelo" : "vermelho"}>{i.situacao === "OK" ? "OK" : i.situacao === "PENDENTE" ? "Pendente" : "Impede"}</Selo>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-linha pt-4">
              {liberacaoAtiva ? (
                <div className="space-y-3">
                  <Aviso tom={semaforo === "VERDE" ? "sucesso" : "erro"}>Liberado em {fmtDataHora(liberacaoAtiva.aprovadaEm)}.{semaforo !== "VERDE" && " A situação mudou depois da liberação: revise."}</Aviso>
                  {pode(a, "liberacao.aprovar") && (
                    <Formulario acao={revogarLiberacaoAcao.bind(null, id)} rotulo="Revogar liberação" variante="perigo" className="flex flex-wrap items-end gap-2">
                      <div className="min-w-60 flex-1"><Entrada name="motivo" placeholder="Motivo da revogação" required /></div>
                    </Formulario>
                  )}
                </div>
              ) : pode(a, "liberacao.aprovar") ? (
                semaforo === "VERDE" ? (
                  <Formulario acao={aprovarLiberacaoAcao.bind(null, id)} rotulo="Aprovar acesso à obra">
                    <Campo rotulo="Observação (opcional)"><Entrada name="observacao" /></Campo>
                  </Formulario>
                ) : <p className="text-sm text-tinta-suave">A aprovação de acesso fica disponível quando a documentação estiver conferida (verde).</p>
              ) : <p className="text-sm text-tinta-suave">Liberação feita pela SST ou pelo gestor da obra.</p>}
            </div>
          </Cartao>

          <Cartao titulo="Trilha de treinamentos" acao={pode(a, "matriz.editar") ? <Formulario acao={reaplicarMatrizAcao.bind(null, id)} rotulo="Reaplicar matriz" variante="secundario" className="flex items-center gap-2"><span /></Formulario> : null}>
            <Tabela cabecalho={["Curso", "Tipo", "Situação", "Validade", ""]}>
              {mats.map((m) => (
                <tr key={m.id}>
                  <td className="px-5 py-2.5"><Link href={`/admin/colaboradores/${id}/matricula/${m.id}`} className="font-medium hover:underline">{m.curso.titulo}</Link><span className="block text-xs text-tinta-suave">{m.curso.codigo} · <Link href={`/admin/colaboradores/${id}/matricula/${m.id}`} className="text-palla-azul">ficha: aulas e respostas</Link></span></td>
                  <td className="px-5 text-xs">{CLASSIFICACAO[m.classificacao]}</td>
                  <td className="px-5"><Selo cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo></td>
                  <td className="px-5 text-xs">{m.validoAte ? fmtData(m.validoAte) : "—"}</td>
                  <td className="px-5">
                    {m.status === "REPROVADO" && ["SST", "RESPONSAVEL_TECNICO", "ADMIN"].includes(a.perfil) && (
                      <details><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Liberar reavaliação</summary>
                        <Formulario acao={liberarReavaliacaoAcao.bind(null, m.id, id)} rotulo="Liberar" className="mt-2 space-y-2"><Entrada name="motivo" placeholder="Reforço realizado em…" required /></Formulario>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </Tabela>
            {condicionais.length > 0 && pode(a, "matriz.editar") && (
              <details className="mt-4 rounded-lg border border-linha p-3 text-sm">
                <summary className="cursor-pointer font-semibold text-palla-azul">Incluir curso condicional ({condicionais.length} disponíveis)</summary>
                <Formulario acao={matricularCondicionalAcao.bind(null, id)} rotulo="Incluir na trilha" className="mt-3 space-y-3">
                  <Campo rotulo="Curso"><Selecao name="cursoId">{condicionais.map((l) => <option key={l.cursoId} value={l.cursoId}>{l.curso.codigo} · {l.curso.titulo}</option>)}</Selecao></Campo>
                  <Campo rotulo="Atividade que torna o curso aplicável" ajuda="Ex.: atuará em montagem dentro de reservatório (espaço confinado)."><Entrada name="justificativa" required /></Campo>
                </Formulario>
              </details>
            )}
            {avulsos.length > 0 && pode(a, "matriz.editar") && (
              <details className="mt-3 rounded-lg border border-linha p-3 text-sm">
                <summary className="cursor-pointer font-semibold text-palla-azul">Incluir outro curso, fora da trilha da função ({avulsos.length} disponíveis)</summary>
                <p className="mt-2 text-xs text-tinta-suave">Entra como <strong>recomendado</strong>: o colaborador faz o curso e tudo fica registrado, mas ele não conta para a liberação de acesso à obra.</p>
                <Formulario acao={matricularAvulsoAcao.bind(null, id)} rotulo="Incluir na trilha" className="mt-3 space-y-3">
                  <fieldset className="max-h-64 space-y-1.5 overflow-y-auto rounded-md border border-linha p-2">
                    {avulsos.map((k) => (
                      <label key={k.id} className="flex items-start gap-2"><input type="checkbox" name="cursoId" value={k.id} className="mt-1" /><span><span className="font-mono text-xs text-tinta-suave">{k.codigo}</span> {k.titulo}</span></label>
                    ))}
                  </fieldset>
                  <Campo rotulo="Motivo" ajuda="Ex.: acompanhar o conteúdo do mini curso da equipe de montagem."><Entrada name="motivo" required /></Campo>
                </Formulario>
              </details>
            )}
          </Cartao>
        </div>

        <div className="space-y-5">
          <Cartao titulo="Documentos">
            {docs.length === 0 ? <Vazio>Nenhum documento.</Vazio> : (
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li key={d.id} className="rounded-lg border border-linha p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <span><span className="font-medium">{TIPO_DOC[d.tipo]}</span> · {d.descricao}
                        <span className="block text-xs text-tinta-suave">Enviado {fmtData(d.enviadoEm)}{d.validoAte && ` · válido até ${fmtData(d.validoAte)}`}{d.aptidoes && ` · aptidões: ${d.aptidoes.replaceAll(";", ", ")}`}{d.conferidoPor && ` · conferido por ${d.conferidoPor.nome}`}</span>
                      </span>
                      <Selo cor={d.status === "CONFERIDO" ? "verde" : d.status === "REJEITADO" ? "vermelho" : "amarelo"}>{d.status === "CONFERIDO" ? "Conferido" : d.status === "REJEITADO" ? "Rejeitado" : "A conferir"}</Selo>
                    </div>
                    {d.arquivoPath && <a href={`/api/documentos/${d.id}`} target="_blank" className="mt-2 inline-block text-xs font-semibold text-palla-azul">Abrir arquivo (acesso registrado)</a>}
                    {d.status === "PENDENTE_CONFERENCIA" && pode(a, "documento.conferir") && (
                      <Formulario acao={conferirDocumentoAcao.bind(null, d.id, id)} rotulo="Registrar conferência" className="mt-3 space-y-2 border-t border-linha pt-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Campo rotulo="Decisão"><Selecao name="decisao"><option value="aprovar">Conferido</option><option value="rejeitar">Rejeitar</option></Selecao></Campo>
                          <Campo rotulo="Válido até"><Entrada type="date" name="validoAte" /></Campo>
                        </div>
                        {d.tipo === "ASO" && aptidoes.length > 0 && (
                          <fieldset className="text-sm"><legend className="mb-1 font-medium">Aptidões registradas no ASO</legend>
                            {aptidoes.map((ap) => <label key={ap} className="mr-4 inline-flex items-center gap-2"><input type="checkbox" name="aptidao" value={ap} /> {ap}</label>)}
                          </fieldset>
                        )}
                        <Entrada name="observacao" placeholder="Observação" />
                      </Formulario>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {pode(a, "documento.ver") && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-semibold text-palla-azul">Registrar documento</summary>
                <Formulario acao={enviarDocumentoEquipeAcao.bind(null, id)} rotulo="Registrar" className="mt-3 space-y-3" limparAoConcluir>
                  <Campo rotulo="Tipo"><Selecao name="tipo">{Object.entries(TIPO_DOC).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
                  <Campo rotulo="Descrição"><Entrada name="descricao" /></Campo>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Campo rotulo="Emitido em"><Entrada type="date" name="emitidoEm" /></Campo>
                    <Campo rotulo="Médico emitente (ASO)"><Entrada name="emitente" placeholder="Nome e CRM" /></Campo>
                  </div>
                  <Campo rotulo="Arquivo"><Entrada type="file" name="arquivo" accept="application/pdf,image/*" /></Campo>
                  <p className="text-xs text-tinta-suave">O ASO é emitido por médico e apenas anexado aqui. A plataforma nunca gera ASO.</p>
                </Formulario>
              </details>
            )}
          </Cartao>

          <Cartao titulo="Autorizações formais">
            {autorizacoes.length === 0 ? <p className="text-sm text-tinta-suave">Nenhuma autorização.</p> : (
              <ul className="space-y-2 text-sm">
                {autorizacoes.map((au) => (
                  <li key={au.id} className="rounded-lg border border-linha p-3">
                    <div className="flex justify-between gap-2"><span className="font-medium">{au.atividade}</span><Selo cor={au.revogadaEm ? "vermelho" : "verde"}>{au.revogadaEm ? "Revogada" : "Ativa"}</Selo></div>
                    <p className="text-xs text-tinta-suave">Por {au.concedidaPor.nome} em {fmtData(au.concedidaEm)}{au.validoAte && ` · até ${fmtData(au.validoAte)}`}</p>
                    {!au.revogadaEm && pode(a, "autorizacao.conceder") && (
                      <Formulario acao={revogarAutorizacaoAcao.bind(null, au.id, id)} rotulo="Revogar" variante="secundario" className="mt-2 flex gap-2"><Entrada name="motivo" placeholder="Motivo" required /></Formulario>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {pode(a, "autorizacao.conceder") && atividades.length > 0 && (
              <Formulario acao={concederAutorizacaoAcao.bind(null, id)} rotulo="Conceder autorização" className="mt-4 space-y-3 border-t border-linha pt-4">
                <Campo rotulo="Atividade"><Selecao name="atividade">{atividades.map((x) => <option key={x}>{x}</option>)}</Selecao></Campo>
                <Campo rotulo="Válida até (opcional)"><Entrada type="date" name="validoAte" /></Campo>
                <p className="text-xs text-tinta-suave">Exige capacitação integral válida e ASO conferido com a aptidão. A autorização é separada do certificado.</p>
              </Formulario>
            )}
          </Cartao>

          {pode(a, "colaborador.cadastrar") && (
            <Cartao titulo="Cadastro">
              <dl className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-xs text-tinta-suave">Celular</dt><dd>{c.telefone ?? "—"}</dd></div>
                <div><dt className="text-xs text-tinta-suave">E-mail</dt><dd className="truncate">{c.email ?? "—"}</dd></div>
                <div><dt className="text-xs text-tinta-suave">Consentimento LGPD</dt><dd>{fmtData(c.consentimentoLgpdEm)} (v. {c.versaoAvisoPrivacidade ?? "—"})</dd></div>
                <div><dt className="text-xs text-tinta-suave">Cadastro</dt><dd>{fmtData(c.criadoEm)}</dd></div>
              </dl>
              <Formulario acao={alterarFuncaoObraAcao.bind(null, id)} rotulo="Alterar função/obra" variante="secundario" className="space-y-3">
                <Campo rotulo="Função"><Selecao name="funcaoId" defaultValue={c.funcaoId}>{funcoes.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}</Selecao></Campo>
                <Campo rotulo="Obra"><Selecao name="obraId" defaultValue={c.obraId ?? ""}><option value="">Sem obra</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.codigo} · {o.nome}</option>)}</Selecao></Campo>
              </Formulario>
              <Formulario acao={registrarAfastamentoAcao.bind(null, id)} rotulo="Salvar afastamento" variante="secundario" className="mt-4 space-y-2 border-t border-linha pt-4">
                <Campo rotulo="Afastado desde" ajuda="Retorno após mais de 180 dias exige treinamento eventual (NR-1, 1.7.1.2.3)."><Entrada type="date" name="afastadoDesde" defaultValue={c.afastadoDesde?.toISOString().slice(0, 10)} /></Campo>
              </Formulario>
            </Cartao>
          )}
        </div>
      </div>
    </>
  );
}
