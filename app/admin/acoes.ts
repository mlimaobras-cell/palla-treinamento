"use server";
import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Estado } from "@/components/formulario";
import { auditar } from "@/lib/auditoria";
import { dataOuNull, executar, txt } from "@/lib/acao";
import { exigir } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { alterarFuncaoObra, criarConvite, matricularAvulso, matricularCondicional, matricularPelaMatriz } from "@/lib/servicos/cadastro";
import { liberarReavaliacao } from "@/lib/servicos/aprendizagem";
import { registrarPratica } from "@/lib/servicos/praticas";
import { gerarLinkNovaSenha } from "@/lib/servicos/senha";
import { aprovarEEmitir, cancelarCertificado, reemitirCertificado } from "@/lib/servicos/certificacao";
import {
  aprovarLiberacao, concederAutorizacao, conferirDocumento, enviarDocumento, revogarAutorizacao, revogarLiberacao, salvarArquivo,
} from "@/lib/servicos/documentos";

// ------------------------------------------------ obras e convites
export async function criarObraAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("obra.gerir");
  return executar(async () => {
    if (!txt(f, "codigo") || !txt(f, "nome")) throw new Error("Informe código e nome da obra.");
    let contratanteId: string | null = null;
    if (txt(f, "contratante")) {
      const [c] = await db.insert(schema.contratantes).values({ nome: txt(f, "contratante") }).returning();
      contratanteId = c.id;
    }
    const [o] = await db.insert(schema.obras).values({
      codigo: txt(f, "codigo").toUpperCase(), nome: txt(f, "nome"), endereco: txt(f, "endereco") || null,
      contratanteId, gestorId: txt(f, "gestorId") || null,
      exigenciasExtras: txt(f, "exigenciasExtras") || null, textoIntegracao: txt(f, "textoIntegracao") || null,
    }).returning();
    await auditar(a, "obra.criada", "obra", o.id, { codigo: o.codigo });
    return `Obra ${o.codigo} cadastrada.`;
  }, ["/admin/obras"]);
}

export async function criarConviteAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("convite.criar");
  return executar(async () => {
    const c = await criarConvite(a, {
      obraId: txt(f, "obraId"), funcaoId: txt(f, "funcaoId"), empresaId: txt(f, "empresaId"),
      nomeSugerido: txt(f, "nomeSugerido"), validadeDias: Number(txt(f, "validadeDias") || 15),
    });
    const nome = txt(f, "nomeSugerido").trim().toLowerCase();
    const mesmoNome = nome ? (await db.query.colaboradores.findMany({ columns: { nome: true } })).some((x) => x.nome.trim().toLowerCase() === nome) : false;
    const aviso = mesmoNome ? "Atenção: já existe colaborador cadastrado com este nome. Se a pessoa só esqueceu a senha, use \"Link de nova senha\" nesta página: o link de cadastro vai recusar o CPF já cadastrado. " : "";
    return `${aviso}Link gerado: ${(process.env.APP_URL ?? "").replace(/\/$/, "")}/convite/${c.token}`;
  }, ["/admin/obras"]);
}

/** Link de nova senha a partir da tela de obras e convites, para quem já tem cadastro. */
export async function linkSenhaPorColaboradorAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("colaborador.ver");
  return executar(async () => {
    const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.colaboradorId, txt(f, "colaboradorId")) });
    if (!u) throw new Error("Escolha um colaborador que já tenha acesso à plataforma.");
    const r = await gerarLinkNovaSenha(a, u.id);
    return `Link de nova senha para ${r.nome} (entra com ${r.email}; vale 48 h, uma vez): ${r.url}`;
  }, ["/admin/obras"]);
}

// ------------------------------------------------ matriz
export async function definirMatrizAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("matriz.editar");
  return executar(async () => {
    const funcaoId = txt(f, "funcaoId");
    const obraId = txt(f, "obraId") || null;
    let n = 0;
    for (const [k, v] of f.entries()) {
      if (!k.startsWith("c_")) continue;
      const cursoId = k.slice(2);
      const valor = String(v);
      const onde = and(eq(schema.matrizFuncao.funcaoId, funcaoId), eq(schema.matrizFuncao.cursoId, cursoId), obraId ? eq(schema.matrizFuncao.obraId, obraId) : isNull(schema.matrizFuncao.obraId));
      const atual = await db.query.matrizFuncao.findFirst({ where: onde });
      if (!valor) { if (atual) { await db.delete(schema.matrizFuncao).where(eq(schema.matrizFuncao.id, atual.id)); n++; } continue; }
      if (atual?.classificacao === valor) continue;
      if (atual) await db.update(schema.matrizFuncao).set({ classificacao: valor as never }).where(eq(schema.matrizFuncao.id, atual.id));
      else await db.insert(schema.matrizFuncao).values({ funcaoId, cursoId, obraId, classificacao: valor as never });
      n++;
    }
    await auditar(a, "matriz.alterada", "funcao", funcaoId, { obraId, alteracoes: n });
    return n ? `${n} alteração(ões) salva(s). Novas matrículas acontecem no próximo cadastro ou ao reaplicar a matriz.` : "Nada mudou.";
  }, ["/admin/matriz"]);
}

// ------------------------------------------------ colaborador
export async function reaplicarMatrizAcao(colaboradorId: string): Promise<Estado> {
  const a = await exigirEquipe("matriz.editar");
  return executar(async () => `${await matricularPelaMatriz(colaboradorId, a)} nova(s) matrícula(s).`, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function alterarFuncaoObraAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("colaborador.cadastrar");
  return executar(async () => {
    const n = await alterarFuncaoObra(a, colaboradorId, txt(f, "funcaoId"), txt(f, "obraId") || null);
    return `Atualizado. ${n} nova(s) matrícula(s) pela matriz.`;
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function matricularCondicionalAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("matriz.editar");
  return executar(async () => {
    await matricularCondicional(a, colaboradorId, txt(f, "cursoId"), txt(f, "justificativa"));
    return "Curso condicional incluído na trilha.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function matricularAvulsoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("matriz.editar");
  const cursoIds = f.getAll("cursoId").map(String).filter(Boolean);
  return executar(async () => {
    if (!cursoIds.length) throw new Error("Escolha ao menos um curso.");
    for (const c of cursoIds) await matricularAvulso(a, colaboradorId, c, txt(f, "motivo"));
    return `${cursoIds.length} curso(s) incluído(s) como recomendado(s).`;
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function liberarReavaliacaoAcao(matriculaId: string, colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe();
  return executar(async () => { await liberarReavaliacao(a, matriculaId, txt(f, "motivo")); return "Nova avaliação liberada."; }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function registrarAfastamentoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("colaborador.cadastrar");
  return executar(async () => {
    const d = dataOuNull(f, "afastadoDesde");
    await db.update(schema.colaboradores).set({ afastadoDesde: d }).where(eq(schema.colaboradores.id, colaboradorId));
    await auditar(a, "colaborador.afastamento", "colaborador", colaboradorId, { afastadoDesde: d });
    return d ? "Afastamento registrado." : "Afastamento removido.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

// ------------------------------------------------ documentos, autorizações e liberação
export async function enviarDocumentoEquipeAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("documento.ver");
  return executar(async () => {
    const arq = f.get("arquivo");
    await enviarDocumento(a, {
      colaboradorId, tipo: txt(f, "tipo") as never, descricao: txt(f, "descricao") || txt(f, "tipo"),
      emitidoEm: dataOuNull(f, "emitidoEm"), validoAte: dataOuNull(f, "validoAte"), emitente: txt(f, "emitente") || null,
      arquivo: arq instanceof File && arq.size > 0 ? { nome: arq.name, tipo: arq.type, bytes: Buffer.from(await arq.arrayBuffer()) } : null,
    });
    return "Documento registrado. Aguarda conferência.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function conferirDocumentoAcao(documentoId: string, colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("documento.conferir");
  return executar(async () => {
    const aptidoes = f.getAll("aptidao").map(String).join(";") || null;
    await conferirDocumento(a, documentoId, {
      aprovado: txt(f, "decisao") === "aprovar", validoAte: dataOuNull(f, "validoAte"), aptidoes, observacao: txt(f, "observacao") || null,
      asoTipoExame: (txt(f, "asoTipoExame") || null) as never, asoResultado: (txt(f, "asoResultado") || null) as "APTO" | "INAPTO" | null,
      emitidoEm: dataOuNull(f, "emitidoEm"),
    });
    return "Conferência registrada.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function concederAutorizacaoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("autorizacao.conceder");
  return executar(async () => {
    await concederAutorizacao(a, colaboradorId, txt(f, "atividade"), dataOuNull(f, "validoAte"), txt(f, "observacao"));
    return "Autorização registrada.";
  }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function revogarAutorizacaoAcao(autorizacaoId: string, colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("autorizacao.conceder");
  return executar(async () => { await revogarAutorizacao(a, autorizacaoId, txt(f, "motivo") || "Revogada"); return "Autorização revogada."; }, [`/admin/colaboradores/${colaboradorId}`]);
}

export async function aprovarLiberacaoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("liberacao.aprovar");
  return executar(async () => { await aprovarLiberacao(a, colaboradorId, txt(f, "observacao")); return "Acesso à obra liberado e registrado."; }, [`/admin/colaboradores/${colaboradorId}`, "/admin"]);
}

export async function revogarLiberacaoAcao(colaboradorId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("liberacao.aprovar");
  return executar(async () => {
    if (!txt(f, "motivo")) throw new Error("Informe o motivo.");
    await revogarLiberacao(a, colaboradorId, txt(f, "motivo"));
    return "Liberação revogada.";
  }, [`/admin/colaboradores/${colaboradorId}`, "/admin"]);
}

// ------------------------------------------------ práticas, aprovação e certificados
export async function registrarPraticaAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("pratica.registrar");
  return executar(async () => {
    const m = await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, txt(f, "matriculaId")) });
    if (!m) throw new Error("Selecione o participante.");
    const evidencias: string[] = [];
    for (const arq of f.getAll("evidencias")) {
      if (arq instanceof File && arq.size > 0) evidencias.push(await salvarArquivo(m.colaboradorId, { nome: arq.name, tipo: arq.type, bytes: Buffer.from(await arq.arrayBuffer()) }));
    }
    await registrarPratica(a, {
      matriculaId: m.id, data: txt(f, "data"), local: txt(f, "local"), equipamento: txt(f, "equipamento"),
      conteudo: txt(f, "conteudo"), duracaoMin: txt(f, "duracaoMin"), notaAvaliacao: txt(f, "notaAvaliacao") || undefined,
      resultado: txt(f, "resultado") as "APTO" | "NAO_APTO", observacoes: txt(f, "observacoes"), evidencias,
    });
    return "Registro prático salvo.";
  }, ["/admin/praticas"]);
}

export async function aprovarAcao(matriculaId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("capacitacao.aprovar");
  return executar(async () => {
    if (f.get("confirmo") !== "on") throw new Error("Confirme que conferiu os registros.");
    const c = await aprovarEEmitir(a, matriculaId, txt(f, "local"));
    return `Capacitação aprovada. Certificado ${c.numero} emitido.`;
  }, ["/admin/aprovacoes"]);
}

export async function aprovarConteudoAcao(cursoId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("capacitacao.aprovar");
  return executar(async () => {
    exigir(a, "curso.editar");
    if (f.get("confirmo") !== "on") throw new Error("Confirme a revisão técnica do conteúdo.");
    const c = await db.query.cursos.findFirst({ where: eq(schema.cursos.id, cursoId) });
    if (!c) throw new Error("Curso não encontrado.");
    if (c.responsavelTecnicoId && c.responsavelTecnicoId !== a.id) throw new Error("Somente o responsável técnico do curso aprova o conteúdo.");
    if (c.cargaOrigem === "A_VALIDAR" || c.validadeOrigem === "A_VALIDAR") throw new Error("Valide primeiro a carga horária e a periodicidade no texto oficial da norma.");
    const validade = new Date(); validade.setFullYear(validade.getFullYear() + 2);
    await db.update(schema.cursos).set({ statusConteudo: "APROVADO", projetoPedagogicoValidoAte: validade }).where(eq(schema.cursos.id, cursoId));
    await auditar(a, "curso.conteudo_aprovado", "curso", cursoId, { codigo: c.codigo, projetoPedagogicoValidoAte: validade });
    return "Conteúdo aprovado. Revisão obrigatória em 2 anos ou quando a norma mudar (NR-1, Anexo II, 3.3).";
  }, ["/admin/cursos"]);
}

export async function validarParametrosAcao(cursoId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("curso.editar");
  return executar(async () => {
    const carga = txt(f, "cargaHoraria");
    const validade = txt(f, "validadeMeses");
    await db.update(schema.cursos).set({
      cargaHoraria: carga ? Number(carga.replace(",", ".")) : null,
      cargaOrigem: txt(f, "cargaOrigem") as never,
      validadeMeses: validade ? Number(validade) : null,
      validadeOrigem: txt(f, "validadeOrigem") as never,
      normaVersao: txt(f, "normaVersao"),
      modalidade: txt(f, "modalidade") as never,
    }).where(eq(schema.cursos.id, cursoId));
    await auditar(a, "curso.parametros_alterados", "curso", cursoId, { carga, validade, cargaOrigem: txt(f, "cargaOrigem"), normaVersao: txt(f, "normaVersao") });
    return "Parâmetros atualizados.";
  }, ["/admin/cursos"]);
}

export async function cancelarCertificadoAcao(certId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("certificado.cancelar");
  return executar(async () => { await cancelarCertificado(a, certId, txt(f, "motivo")); return "Certificado cancelado."; }, ["/admin/certificados"]);
}

export async function reemitirCertificadoAcao(certId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirEquipe("capacitacao.aprovar");
  return executar(async () => { const n = await reemitirCertificado(a, certId, txt(f, "motivo")); return `Reemitido como ${n.numero}.`; }, ["/admin/certificados"]);
}

// ------------------------------------------------ acesso: link de nova senha (sem e-mail automático)
export async function gerarLinkSenhaAcao(colaboradorId: string, _: Estado, _f: FormData): Promise<Estado> {
  const a = await exigirEquipe("colaborador.ver");
  return executar(async () => {
    const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.colaboradorId, colaboradorId) });
    if (!u) throw new Error("Este colaborador ainda não tem acesso à plataforma.");
    const r = await gerarLinkNovaSenha(a, u.id);
    return `Link de nova senha (vale 48 h, uma vez): ${r.url}`;
  }, [`/admin/colaboradores/${colaboradorId}`]);
}
