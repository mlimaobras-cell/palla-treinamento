"use server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Estado } from "@/components/formulario";
import type { CriterioRisco } from "@/db/schema";
import { auditar } from "@/lib/auditoria";
import { dataOuNull, executar, txt } from "@/lib/acao";
import { exigirEquipe } from "@/lib/sessao";
import { aprovarModelo, conferirItemAdmissional, enviarItemAdmissional, invalidarAssinatura, novaVersaoModelo } from "@/lib/servicos/admissao";
import {
  aprovarPgr, atualizarPgr, criarPgr, enviarParaRevisao, excluirRisco, importarDaBiblioteca, revisarPgr, salvarAcao, salvarGhe, salvarRisco,
} from "@/lib/servicos/pgr";
import { excluirExame, registrarPcmso, salvarExame } from "@/lib/servicos/pcmso";
import { concluirPrazo, criarPrazo } from "@/lib/servicos/prazos";
import { salvarParceiro, salvarSignatario } from "@/lib/servicos/parceiros";
import { registrarDds, registrarEscuta, salvarIndicador, tratarRelato } from "@/lib/servicos/psicossocial";
import { alterarUsuarioEquipe, criarUsuarioEquipe } from "@/lib/servicos/equipe";
import { gerarLinkNovaSenha } from "@/lib/servicos/senha";
import type { Perfil } from "@/lib/permissoes";

async function arquivoDe(f: FormData, campo = "arquivo", obrigatorio = true) {
  const arq = f.get(campo);
  if (!(arq instanceof File) || arq.size === 0) {
    if (obrigatorio) throw new Error("Selecione o arquivo.");
    return null;
  }
  return { nome: arq.name, tipo: arq.type, bytes: Buffer.from(await arq.arrayBuffer()) };
}
const num = (f: FormData, k: string) => (txt(f, k) ? Number(txt(f, k)) : null);

// ------------------------------------------------ admissão
export async function enviarItemEquipeAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => {
    await enviarItemAdmissional(a, colaboradorId, txt(f, "itemId"), (await arquivoDe(f))!, dataOuNull(f, "validoAte"));
    return "Documento registrado no dossiê.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function conferirItemAcao(documentoId: string, colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => {
    await conferirItemAdmissional(a, documentoId, txt(f, "decisao") === "aprovar", txt(f, "observacao") || null);
    return "Conferência registrada.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function salvarContratoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => {
    const d1 = num(f, "experienciaDias"), d2 = num(f, "experienciaProrrogacaoDias");
    if ((d1 ?? 0) + (d2 ?? 0) > 90) throw new Error("O contrato de experiência não pode passar de 90 dias no total (CLT, art. 445, parágrafo único).");
    if (d2 && !d1) throw new Error("Informe o primeiro período antes da prorrogação.");
    await db.update(schema.colaboradores).set({ dataAdmissao: dataOuNull(f, "dataAdmissao"), experienciaDias: d1, experienciaProrrogacaoDias: d2 })
      .where(eq(schema.colaboradores.id, colaboradorId));
    await auditar(a, "admissao.contrato_atualizado", "colaborador", colaboradorId, { d1, d2 });
    return "Dados do contrato salvos.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function invalidarAssinaturaAcao(assinaturaId: string, colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => { await invalidarAssinatura(a, assinaturaId, txt(f, "motivo")); return "Assinatura invalidada; o colaborador vai assinar de novo."; }, [`/admin/colaboradores/${colaboradorId}`]);
}

// ------------------------------------------------ modelos de termo e lista de admissão
export async function aprovarModeloAcao(modeloId: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => { await aprovarModelo(a, modeloId); return "Modelo aprovado: passa a aparecer para os colaboradores."; }, ["/admin/sst/termos"]);
}

export async function editarModeloAcao(modeloId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    if (!txt(f, "texto")) throw new Error("O texto não pode ficar vazio.");
    await novaVersaoModelo(a, modeloId, String(f.get("texto")), txt(f, "titulo"));
    return "Texto salvo. Versões aprovadas geram nova versão para revisão.";
  }, ["/admin/sst/termos"]);
}

export async function alternarItemAdmissionalAcao(itemId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => {
    await db.update(schema.itensAdmissionais).set({ ativo: txt(f, "ativo") === "1", obrigatorio: txt(f, "obrigatorio") === "1" }).where(eq(schema.itensAdmissionais.id, itemId));
    await auditar(a, "admissao.item_alterado", "item_admissional", itemId, { ativo: txt(f, "ativo"), obrigatorio: txt(f, "obrigatorio") });
    return "Item atualizado.";
  }, ["/admin/sst/termos"]);
}

export async function criarItemAdmissionalAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("admissao.gerir");
  return executar(async () => {
    if (!txt(f, "nome") || !txt(f, "base")) throw new Error("Informe o nome e a base (lei ou critério interno).");
    const codigo = txt(f, "codigo").toUpperCase() || `ITEM-${Date.now().toString(36).toUpperCase()}`;
    const n = (await db.query.itensAdmissionais.findMany()).length;
    const [i] = await db.insert(schema.itensAdmissionais).values({
      codigo, nome: txt(f, "nome"), orientacao: txt(f, "orientacao") || null, base: txt(f, "base"), origem: (txt(f, "origem") || "EMPREGADOR") as "EMPREGADOR",
      obrigatorio: txt(f, "obrigatorio") === "1", quemEnvia: (txt(f, "quemEnvia") || "COLABORADOR") as "COLABORADOR", exigeValidade: txt(f, "exigeValidade") === "1",
      sensivel: txt(f, "sensivel") === "1", ordem: n + 1,
    }).returning();
    await auditar(a, "admissao.item_criado", "item_admissional", i.id, { codigo });
    return "Item incluído na lista de admissão.";
  }, ["/admin/sst/termos"]);
}

// ------------------------------------------------ prazos
export async function criarPrazoAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("prazo.ver");
  return executar(async () => {
    const venceEm = dataOuNull(f, "venceEm");
    if (!venceEm) throw new Error("Informe a data.");
    await criarPrazo(a, { titulo: txt(f, "titulo"), venceEm, colaboradorId: txt(f, "colaboradorId") || null, obraId: txt(f, "obraId") || null, avisarDiasAntes: num(f, "avisar") ?? 30, observacao: txt(f, "observacao") || null });
    return "Prazo cadastrado.";
  }, ["/admin/sst/prazos", "/admin/sst"]);
}

export async function concluirPrazoAcao(id: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("prazo.ver");
  return executar(async () => { await concluirPrazo(a, id); return "Prazo concluído."; }, ["/admin/sst/prazos", "/admin/sst"]);
}

// ------------------------------------------------ PGR
export async function criarPgrAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  let id = "";
  const r = await executar(async () => {
    const p = await criarPgr(a, { obraId: txt(f, "obraId") || null, titulo: txt(f, "titulo"), estabelecimento: txt(f, "estabelecimento"), descricaoProcessos: txt(f, "descricaoProcessos") || null });
    id = p.id;
  }, ["/admin/sst/pgr"]);
  if (id) redirect(`/admin/sst/pgr/${id}`);
  return r;
}

export async function atualizarPgrAcao(pgrId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await atualizarPgr(a, pgrId, {
      titulo: txt(f, "titulo"), estabelecimento: txt(f, "estabelecimento"), descricaoProcessos: txt(f, "descricaoProcessos") || null,
      elaboradorNome: txt(f, "elaboradorNome") || null, elaboradorQualificacao: txt(f, "elaboradorQualificacao") || null,
      elaboradorRegistro: txt(f, "elaboradorRegistro") || null, responsavelOrganizacao: txt(f, "responsavelOrganizacao") || null,
      elaboradorId: txt(f, "elaboradorId") || null, responsavelOrgId: txt(f, "responsavelOrgId") || null, parceiroId: txt(f, "parceiroId") || null,
    });
    return "Dados do PGR salvos.";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function salvarCriterioAcao(pgrId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    let c: CriterioRisco;
    try { c = JSON.parse(String(f.get("criterio"))); } catch { throw new Error("Critério inválido (JSON)."); }
    if (!c.severidade?.length || !c.probabilidade?.length || !c.niveis?.length) throw new Error("O critério precisa de severidade, probabilidade e níveis.");
    await atualizarPgr(a, pgrId, { criterio: c });
    return "Critério de risco salvo.";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function salvarGheAcao(pgrId: string, gheId: string | null, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await salvarGhe(a, pgrId, {
      id: gheId ?? undefined, codigo: txt(f, "codigo"), nome: txt(f, "nome"), descricaoAtividades: txt(f, "descricaoAtividades"),
      ambientes: txt(f, "ambientes") || null, funcoesIds: f.getAll("funcaoId").map(String), epis: txt(f, "epis") || null, trabalhadores: num(f, "trabalhadores"),
    });
    return "GHE salvo.";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function importarBibliotecaAcao(pgrId: string, gheId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    const n = await importarDaBiblioteca(a, pgrId, gheId, f.getAll("ambienteId").map(String));
    return n ? `${n} perigo(s) copiados da biblioteca. Revise cada linha com o profissional habilitado.` : "Nenhum perigo novo (já estavam no GHE).";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function salvarRiscoAcao(pgrId: string, riscoId: string | null, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await salvarRisco(a, pgrId, {
      id: riscoId ?? undefined, gheId: txt(f, "gheId"), categoria: txt(f, "categoria") as never, perigo: txt(f, "perigo"), fonte: txt(f, "fonte"),
      lesoes: txt(f, "lesoes"), medidasExistentes: txt(f, "medidasExistentes"), exposicao: txt(f, "exposicao") || null, monitoramento: txt(f, "monitoramento") || null,
      severidade: Number(txt(f, "severidade")), probabilidade: Number(txt(f, "probabilidade")), examesSugeridos: txt(f, "examesSugeridos") || null,
    });
    return "Risco salvo no inventário.";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function excluirRiscoAcao(pgrId: string, riscoId: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => { await excluirRisco(a, pgrId, riscoId); return "Linha excluída do inventário."; }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function salvarAcaoPlanoAcao(pgrId: string, acaoId: string | null, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await salvarAcao(a, pgrId, {
      id: acaoId ?? undefined, riscoId: txt(f, "riscoId") || null, medida: txt(f, "medida"), tipo: (txt(f, "tipo") || "ADMINISTRATIVA") as never,
      responsavel: txt(f, "responsavel"), prazo: dataOuNull(f, "prazo"), acompanhamento: txt(f, "acompanhamento") || null,
      status: (txt(f, "status") || "PLANEJADA") as never, evidencia: txt(f, "evidencia") || null,
    });
    return "Plano de ação atualizado.";
  }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function enviarRevisaoAcao(pgrId: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => { await enviarParaRevisao(a, pgrId); return "Enviado para revisão. Gere o documento, colete a assinatura do profissional e anexe para aprovar."; }, [`/admin/sst/pgr/${pgrId}`]);
}

export async function aprovarPgrAcao(pgrId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    const vig = dataOuNull(f, "vigenciaInicio");
    if (!vig) throw new Error("Informe o início da vigência.");
    await aprovarPgr(a, pgrId, { vigenciaInicio: vig, mesesRevisao: num(f, "mesesRevisao") ?? undefined, arquivo: (await arquivoDe(f))! });
    return "PGR aprovado. A versão anterior foi guardada no histórico.";
  }, [`/admin/sst/pgr/${pgrId}`, "/admin/sst/pgr"]);
}

export async function revisarPgrAcao(pgrId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  let novo = "";
  const r = await executar(async () => { novo = await revisarPgr(a, pgrId, txt(f, "motivo")); }, ["/admin/sst/pgr"]);
  if (novo) redirect(`/admin/sst/pgr/${novo}`);
  return r;
}

// ------------------------------------------------ PCMSO
export async function registrarPcmsoAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    const vig = dataOuNull(f, "vigenciaInicio");
    if (!vig) throw new Error("Informe o início da vigência.");
    if (!txt(f, "medicoId")) throw new Error("Escolha o médico do trabalho responsável (cadastre em Quem assina e parceiros).");
    await registrarPcmso(a, {
      titulo: txt(f, "titulo"), obraId: txt(f, "obraId") || null, pgrId: txt(f, "pgrId") || null, medicoNome: txt(f, "medicoNome"), medicoCrm: txt(f, "medicoCrm"),
      medicoId: txt(f, "medicoId") || null, parceiroId: txt(f, "parceiroId") || null,
      clinica: txt(f, "clinica") || null, vigenciaInicio: vig, observacao: txt(f, "observacao") || null, arquivo: (await arquivoDe(f))!,
    });
    return "PCMSO registrado. Agora transcreva os exames por GHE ou função.";
  }, ["/admin/sst/pcmso"]);
}

export async function salvarExameAcao(pcmsoId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    const alvo = txt(f, "alvo"); // ghe:<id> | funcao:<id>
    await salvarExame(a, pcmsoId, {
      gheId: alvo.startsWith("ghe:") ? alvo.slice(4) : null, funcaoId: alvo.startsWith("funcao:") ? alvo.slice(7) : null,
      exame: txt(f, "exame"), momentos: f.getAll("momento").map(String), periodicidadeMeses: num(f, "periodicidadeMeses"), observacao: txt(f, "observacao") || null,
    });
    return "Exame incluído.";
  }, ["/admin/sst/pcmso"]);
}

export async function excluirExameAcao(pcmsoId: string, exameId: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => { await excluirExame(a, pcmsoId, exameId); return "Exame excluído."; }, ["/admin/sst/pcmso"]);
}

// ------------------------------------------------ parceiros e signatários
export async function salvarParceiroAcao(parceiroId: string | null, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await salvarParceiro(a, {
      id: parceiroId ?? undefined, nome: txt(f, "nome"), cnpj: txt(f, "cnpj") || null, tipo: txt(f, "tipo"), contato: txt(f, "contato") || null,
      ativo: parceiroId ? txt(f, "ativo") === "1" : true, logo: await arquivoDe(f, "logo", false), removerLogo: txt(f, "removerLogo") === "1",
    });
    return "Empresa salva.";
  }, ["/admin/sst/responsaveis"]);
}

export async function salvarSignatarioAcao(signatarioId: string | null, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.editar");
  return executar(async () => {
    await salvarSignatario(a, {
      id: signatarioId ?? undefined, nome: txt(f, "nome"), tipo: txt(f, "tipo"), qualificacao: txt(f, "qualificacao"), conselho: txt(f, "conselho") || null,
      registro: txt(f, "registro"), uf: txt(f, "uf") || null, cargo: txt(f, "cargo") || null, parceiroId: txt(f, "parceiroId") || null,
      email: txt(f, "email") || null, telefone: txt(f, "telefone") || null, ativo: signatarioId ? txt(f, "ativo") === "1" : true,
    });
    return "Dados de quem assina salvos.";
  }, ["/admin/sst/responsaveis"]);
}

// ------------------------------------------------ equipe
export async function criarUsuarioAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("painel.ver");
  return executar(async () => {
    const r = await criarUsuarioEquipe(a, { nome: txt(f, "nome"), email: txt(f, "email"), perfil: txt(f, "perfil") as Perfil, qualificacao: txt(f, "qualificacao"), registro: txt(f, "registro") });
    return `Usuário criado. Mande este link para ${r.nome} criar a senha (vale 48 h, uma vez): ${r.url}`;
  }, ["/admin/equipe"]);
}

export async function alterarUsuarioAcao(id: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("painel.ver");
  return executar(async () => {
    await alterarUsuarioEquipe(a, id, { perfil: txt(f, "perfil") as Perfil, qualificacao: txt(f, "qualificacao"), registro: txt(f, "registro"), ativo: txt(f, "ativo") === "1" });
    return "Alterado.";
  }, ["/admin/equipe"]);
}

export async function linkSenhaEquipeAcao(id: string, _: Estado): Promise<Estado> {
  const a = await exigirEquipe("painel.ver");
  return executar(async () => { const r = await gerarLinkNovaSenha(a, id); return `Link de nova senha para ${r.nome} (48 h, uma vez): ${r.url}`; }, ["/admin/equipe"]);
}

// ------------------------------------------------ fatores psicossociais
export async function tratarRelatoAcao(id: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("relato.tratar");
  return executar(async () => { await tratarRelato(a, id, { status: txt(f, "status"), resposta: txt(f, "resposta") || null, medidas: txt(f, "medidas") || null }); return "Relato atualizado."; }, ["/admin/psicossocial"]);
}

export async function registrarEscutaAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.ver");
  return executar(async () => {
    const data = dataOuNull(f, "data");
    if (!data) throw new Error("Informe a data.");
    await registrarEscuta(a, { obraId: txt(f, "obraId") || null, tipo: (txt(f, "tipo") || "RODA") as "RODA", data, participantes: Number(txt(f, "participantes")), conduzidoPor: txt(f, "conduzidoPor"), temas: txt(f, "temas"), encaminhamentos: txt(f, "encaminhamentos") || null });
    return "Escuta registrada. Leve os temas para o inventário e o plano de ação do PGR da obra.";
  }, ["/admin/psicossocial"]);
}

export async function registrarDdsAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("colaborador.ver");
  return executar(async () => {
    const data = dataOuNull(f, "data");
    if (!data) throw new Error("Informe a data.");
    await registrarDds(a, { obraId: txt(f, "obraId"), data, tema: txt(f, "tema"), psicossocial: txt(f, "psicossocial") === "1", conteudo: txt(f, "conteudo") || null, conduzidoPor: txt(f, "conduzidoPor"), presentesIds: f.getAll("presente").map(String) });
    return "DDS registrado. Os colaboradores da obra podem confirmar a presença pelo celular por 3 dias.";
  }, ["/admin/psicossocial"]);
}

export async function salvarIndicadorAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("sst.ver");
  return executar(async () => {
    await salvarIndicador(a, { obraId: txt(f, "obraId"), mes: txt(f, "mes"), efetivo: num(f, "efetivo"), horasExtrasMedia: num(f, "horasExtrasMedia"), faltas: num(f, "faltas"), afastamentos: num(f, "afastamentos"), desligamentos: num(f, "desligamentos"), quaseAcidentes: num(f, "quaseAcidentes"), observacao: txt(f, "observacao") || null });
    return "Indicadores do mês salvos.";
  }, ["/admin/psicossocial"]);
}
