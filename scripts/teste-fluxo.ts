// FASE 6 — Teste do fluxo completo com colaborador FICTÍCIO.
// Cadastro → função → matrícula → treinamento → avaliação → prática → aprovação → certificado → conferência documental
// + cenários de reprovação, pendência prática, certificado vencido e documentação irregular.
// Uso: npm run test:fluxo
import "../db/carregar-env";
import { mkdirSync, writeFileSync } from "node:fs";
import { and, eq, inArray } from "drizzle-orm";
import { db, encerrarDb, schema } from "../db";
import type { Ator } from "../lib/permissoes";
import { cadastrarPorConvite, criarConvite, esquemaCadastro } from "../lib/servicos/cadastro";
import { concluirAula, enviarAvaliacao, iniciarAvaliacao, iniciarDiagnostica, liberarReavaliacao, registrarTempo, segundosMinimos } from "../lib/servicos/aprendizagem";
import { registrarPratica } from "../lib/servicos/praticas";
import { gerarLinkNovaSenha, redefinirSenha } from "../lib/servicos/senha";
import bcrypt from "bcryptjs";
import {
  aprovarEEmitir, atualizarVencidos, cancelarCertificado, checklistEmissao, emitirComprovanteEtapa,
  pdfDoCertificado, reemitirCertificado, verificarPublico,
} from "../lib/servicos/certificacao";
import { avaliarColaborador } from "../lib/servicos/conformidade";
import { aprovarLiberacao, concederAutorizacao, conferirDocumento, enviarDocumento } from "../lib/servicos/documentos";

const resultados: { cenario: string; ok: boolean; detalhe: string }[] = [];
function checar(cenario: string, cond: boolean, detalhe = "") {
  resultados.push({ cenario, ok: cond, detalhe });
  console.log(`${cond ? "✔" : "✘"} ${cenario}${detalhe ? ` — ${detalhe}` : ""}`);
}
async function deveFalhar(cenario: string, fn: () => Promise<unknown>, trecho?: string) {
  try {
    await fn();
    checar(cenario, false, "deveria ter sido bloqueado");
  } catch (e) {
    const msg = (e as Error).message;
    checar(cenario, !trecho || msg.includes(trecho), msg);
  }
}

/** Gera CPF fictício com dígitos verificadores válidos (não pertence a ninguém conhecido). */
function cpfFicticio() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const dv = (base: number[]) => {
    const s = base.reduce((acc, d, i) => acc + d * (base.length + 1 - i), 0);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = dv(n);
  const d2 = dv([...n, d1]);
  return [...n, d1, d2].join("");
}

async function ator(email: string): Promise<Ator> {
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) });
  if (!u) throw new Error(`Rode o seed antes: ${email}`);
  return { id: u.id, nome: u.nome, perfil: u.perfil, colaboradorId: u.colaboradorId };
}

async function limparTestesAnteriores() {
  const ficticios = await db.query.colaboradores.findMany({ where: eq(schema.colaboradores.dadoFicticio, true) });
  const ids = ficticios.map((c) => c.id);
  if (ids.length) {
    const ms = await db.query.matriculas.findMany({ where: inArray(schema.matriculas.colaboradorId, ids) });
    if (ms.length) await db.delete(schema.certificados).where(inArray(schema.certificados.matriculaId, ms.map((m) => m.id)));
    await db.delete(schema.liberacoes).where(inArray(schema.liberacoes.colaboradorId, ids));
    await db.delete(schema.usuarios).where(inArray(schema.usuarios.colaboradorId, ids));
    await db.delete(schema.colaboradores).where(inArray(schema.colaboradores.id, ids));
  }
  const obraTeste = await db.query.obras.findFirst({ where: eq(schema.obras.codigo, "OBR-TESTE") });
  if (obraTeste) {
    await db.delete(schema.convites).where(eq(schema.convites.obraId, obraTeste.id));
    await db.delete(schema.obras).where(eq(schema.obras.id, obraTeste.id));
  }
}

async function assistirTudo(colab: Ator, matriculaId: string) {
  const m = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.id, matriculaId),
    with: { curso: { with: { capitulos: { with: { aulas: true } } } } },
  });
  for (const aula of m!.curso.capitulos.flatMap((c) => c.aulas)) {
    // simula os pulsos de 30 s do player até o tempo mínimo
    const alvo = segundosMinimos(aula, m!.curso.tempoMinimoAulaPct);
    for (let s = 0; s < alvo; s += 30) await registrarTempo(colab, matriculaId, aula.id, 30, s + 30);
    await concluirAula(colab, matriculaId, aula.id);
  }
}

async function responder(colab: Ator, matriculaId: string, acertar: boolean) {
  const t = await iniciarAvaliacao(colab, matriculaId, "teste-fluxo");
  const qs = await db.query.questoes.findMany({ where: inArray(schema.questoes.id, t.questoes.map((q) => q.questaoId)) });
  const marcadas: Record<string, string> = {};
  for (const q of qs) marcadas[q.id] = acertar ? q.correta : q.alternativas.find((a) => a.id !== q.correta)!.id;
  return enviarAvaliacao(colab, t.id, marcadas);
}

async function main() {
  mkdirSync("saida-testes", { recursive: true });
  await limparTestesAnteriores();
  const rh = await ator("rh@palla.teste");
  const sst = await ator("sst@palla.teste");
  const instrutor = await ator("instrutor@palla.teste");
  const rt = await ator("rt@palla.teste");
  const gestor = await ator("gestor@palla.teste");

  // ------------------------------------------------ preparação: obra de teste com ajuste de matriz
  const palla = (await db.query.empresas.findFirst({ where: eq(schema.empresas.propria, true) }))!;
  const montador = (await db.query.funcoes.findFirst({ where: eq(schema.funcoes.codigo, "MONTADOR") }))!;
  const [obra] = await db.insert(schema.obras).values({ codigo: "OBR-TESTE", nome: "Obra de teste automatizado (fictícia)", gestorId: gestor.id }).returning();
  const cursos = await db.query.cursos.findMany();
  const cod = (c: string) => cursos.find((x) => x.codigo === c)!;
  const padrao = await db.query.matrizFuncao.findMany({ where: and(eq(schema.matrizFuncao.funcaoId, montador.id)) });
  // Na obra de teste, só INT-01, PAL-52 e NR35-ALT são exigidos; o restante vira recomendado (ajuste por obra).
  const exigidos = new Set(["INT-01", "PAL-52", "NR35-ALT"]);
  for (const l of padrao.filter((l) => !l.obraId)) {
    const c = cursos.find((x) => x.id === l.cursoId)!;
    await db.insert(schema.matrizFuncao).values({
      funcaoId: montador.id, cursoId: l.cursoId, obraId: obra.id,
      classificacao: exigidos.has(c.codigo) ? l.classificacao : "RECOMENDADO",
    });
  }
  // Ambiente de teste: simula a aprovação de conteúdo pelo responsável técnico.
  await db.update(schema.cursos).set({ statusConteudo: "APROVADO" }).where(inArray(schema.cursos.codigo, [...exigidos]));

  // ------------------------------------------------ 1. cadastro pelo link
  const convite = await criarConvite(rh, { obraId: obra.id, funcaoId: montador.id, empresaId: palla.id, nomeSugerido: "Colaborador Fictício" });
  const cpf = cpfFicticio();
  const { colab: c, usuario } = await cadastrarPorConvite(convite.token, {
    nome: "João Fictício da Silva Teste", cpf, telefone: "11999990000", email: `joao.${Date.now()}@ficticio.teste`,
    senha: "SenhaTeste123", consentimento: true, ficticio: true, dataNascimento: "15/03/1990",
  });
  checar("Cadastro por convite cria colaborador e login", !!c.id && usuario.perfil === "COLABORADOR");
  checar("CPF guardado cifrado (não aparece em claro no banco)", !c.cpfCifrado.includes(cpf) && c.cpfFinal === cpf.slice(-2));
  await deveFalhar("Convite não pode ser reutilizado", () => cadastrarPorConvite(convite.token, {
    nome: "Outra Pessoa Fictícia", cpf: cpfFicticio(), telefone: "11999990001", email: "outra@ficticio.teste", senha: "SenhaTeste123", consentimento: true,
  }), "já foi utilizado");

  checar("Data de nascimento digitada (dd/mm/aaaa) é gravada", c.dataNascimento?.toISOString().slice(0, 10) === "1990-03-15");
  const dataRuim = esquemaCadastro.safeParse({
    nome: "Outra Pessoa Fictícia", cpf: cpfFicticio(), telefone: "11999990001", email: "data@ficticio.teste", senha: "SenhaTeste123", consentimento: true, dataNascimento: "31/02/1990",
  });
  checar("Data de nascimento impossível é recusada", !dataRuim.success && dataRuim.error.issues.some((i) => i.message.includes("Data de nascimento")));
  // Nova senha por link gerado pela equipe (sem e-mail automático)
  const link1 = await gerarLinkNovaSenha(rh, usuario.id);
  const link2 = await gerarLinkNovaSenha(rh, usuario.id);
  const tk = (u: string) => u.split("/redefinir-senha/")[1];
  await deveFalhar("Link anterior deixa de valer quando outro é gerado", () => redefinirSenha(tk(link1.url), "NovaSenha123", "NovaSenha123"), "já foi usado");
  await deveFalhar("Senha curta recusada", () => redefinirSenha(tk(link2.url), "curta", "curta"), "pelo menos");
  await redefinirSenha(tk(link2.url), "NovaSenha123", "NovaSenha123");
  const uNovo = (await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, usuario.id) }))!;
  checar("Nova senha gravada pelo link", await bcrypt.compare("NovaSenha123", uNovo.senhaHash));
  await deveFalhar("Link de nova senha só vale uma vez", () => redefinirSenha(tk(link2.url), "OutraSenha123", "OutraSenha123"), "já foi usado");
  const admin = (await db.query.usuarios.findFirst({ where: eq(schema.usuarios.perfil, "ADMIN") }))!;
  await deveFalhar("RH não gera link de senha de usuário da equipe", () => gerarLinkNovaSenha(rh, admin.id), "Sem permissão");

  const colab: Ator = { id: usuario.id, nome: usuario.nome, perfil: "COLABORADOR", colaboradorId: c.id };
  const ms = await db.query.matriculas.findMany({ where: eq(schema.matriculas.colaboradorId, c.id), with: { curso: true } });
  const mat = (codigo: string) => ms.find((m) => m.curso.codigo === codigo)!;
  checar("Matrícula automática pela matriz da função/obra", ms.length >= 3 && !!mat("INT-01") && !!mat("PAL-52") && !!mat("NR35-ALT"), `${ms.length} matrículas`);
  checar("Curso condicional não é matriculado automaticamente", !ms.some((m) => m.classificacao === "CONDICIONAL"));

  let av = await avaliarColaborador(c.id);
  checar("Recém-cadastrado aparece VERMELHO (sem ASO, sem EPI)", av.semaforo === "VERMELHO");

  // ------------------------------------------------ 2. integração: reprovação e reavaliação controlada
  const integ = mat("INT-01");
  await deveFalhar("Avaliação bloqueada antes de concluir as aulas", () => iniciarAvaliacao(colab, integ.id), "Conclua todas as aulas");
  const primeiraAula = (await db.query.capitulos.findFirst({ where: eq(schema.capitulos.cursoId, integ.cursoId), with: { aulas: true } }))!.aulas[0];
  await registrarTempo(colab, integ.id, primeiraAula.id, 30);
  await deveFalhar("Aula não é concluída por mera abertura (tempo mínimo)", () => concluirAula(colab, integ.id, primeiraAula.id), "Faltam");
  await deveFalhar("Pulso de tempo não permite fraude (teto por pulso)", async () => {
    await registrarTempo(colab, integ.id, primeiraAula.id, 99999);
    await concluirAula(colab, integ.id, primeiraAula.id);
  }, "Faltam");
  await assistirTudo(colab, integ.id);
  for (let i = 1; i <= 3; i++) {
    const r = await responder(colab, integ.id, false);
    checar(`Tentativa ${i} reprovada registra nota`, !r.aprovado && r.nota < 70, `nota ${r.nota}%`);
  }
  let mInt = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, integ.id) }))!;
  checar("Após 3 reprovações, matrícula fica REPROVADO", mInt.status === "REPROVADO");
  await deveFalhar("Sem liberação, não há 4ª tentativa", () => iniciarAvaliacao(colab, integ.id));
  await deveFalhar("Instrutor não pode liberar reavaliação", () => liberarReavaliacao(instrutor, integ.id, "x"));
  await liberarReavaliacao(sst, integ.id, "Reforço de conteúdo realizado com o encarregado");
  const ok = await responder(colab, integ.id, true);
  checar("Reavaliação controlada aprovada", !!ok.aprovado, `nota ${ok.nota}%`);
  mInt = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, integ.id) }))!;
  checar("Curso sem prática vai para AGUARDANDO_APROVACAO", mInt.status === "AGUARDANDO_APROVACAO");
  await deveFalhar("Comprovante de etapa não existe para curso sem prática", () => emitirComprovanteEtapa(colab, integ.id));
  await deveFalhar("Instrutor não pode aprovar capacitação", () => aprovarEEmitir(instrutor, integ.id, "EAD"), "Sem permissão");
  const certInt = await aprovarEEmitir(rt, integ.id, "Plataforma Grupo Palla | Treinamento e Integração (EAD)");
  checar("Responsável técnico aprova e emite certificado integral", certInt.tipo === "INTEGRAL" && /^PALLA-\d{4}-\d{6}$/.test(certInt.numero), certInt.numero);

  // ------------------------------------------------ 3. curso com prática: pendência e comprovante de etapa
  const seg = mat("PAL-52");
  await assistirTudo(colab, seg.id);
  const rSeg = await responder(colab, seg.id, true);
  let mSeg = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, seg.id) }))!;
  checar("Teoria aprovada em curso com prática fica PENDENTE_PRATICA", !!rSeg.aprovado && mSeg.status === "PENDENTE_PRATICA");
  const comprovante = await emitirComprovanteEtapa(colab, seg.id);
  checar("Comprovante de etapa emitido e identificado como tal", comprovante.tipo === "COMPROVANTE_ETAPA" && comprovante.numero.startsWith("PALLA-ETAPA"), comprovante.numero);
  const ck = await checklistEmissao(seg.id);
  checar("Checklist bloqueia emissão sem prática", ck.some((i) => i.item.includes("prática") && !i.ok));
  await deveFalhar("Certificado integral bloqueado com prática pendente", () => aprovarEEmitir(rt, seg.id, "Obra"), "Requisitos não atendidos");
  await registrarPratica(instrutor, {
    matriculaId: seg.id, data: new Date(), local: "OBR-TESTE — frente de montagem", equipamento: "Guindaste fictício",
    conteudo: "Inspeção da frente de montagem, isolamento, estabilidade provisória e simulação de comunicação de içamento.",
    duracaoMin: 90, resultado: "NAO_APTO", observacoes: "Não isolou o raio de giro.",
  });
  mSeg = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, seg.id) }))!;
  checar("Prática NÃO APTO mantém pendência", mSeg.status === "PENDENTE_PRATICA");
  await registrarPratica(instrutor, {
    matriculaId: seg.id, data: new Date(), local: "OBR-TESTE — frente de montagem", equipamento: "Guindaste fictício",
    conteudo: "Nova avaliação prática: isolamento completo e comunicação correta.", duracaoMin: 90, resultado: "APTO",
  });
  const certSeg = await aprovarEEmitir(rt, seg.id, "OBR-TESTE (teoria EAD + prática presencial)");
  checar("Após prática APTO e aprovação, certificado integral emitido", certSeg.tipo === "INTEGRAL", certSeg.numero);

  // ------------------------------------------------ 4. NR-35: curso somente presencial
  const alt = mat("NR35-ALT");
  await deveFalhar("NR-35 não aceita carga horária online", () => registrarTempo(colab, alt.id, primeiraAula.id, 30), "presencial");
  const altCurso = await db.query.cursos.findFirst({ where: eq(schema.cursos.codigo, "NR35-ALT"), with: { capitulos: { with: { aulas: true } }, questoes: true } });
  const aulaApoio = altCurso!.capitulos.flatMap((x) => x.aulas)[0];
  checar("NR-35 tem material de apoio e banco para prova presencial", !!aulaApoio && altCurso!.questoes.length >= 20, `${altCurso!.capitulos.length} capítulos, ${altCurso!.questoes.length} questões`);
  await deveFalhar("Material de apoio da NR-35 não conta como carga horária", () => registrarTempo(colab, alt.id, aulaApoio.id, 30), "presencial");
  await deveFalhar("Registro presencial exige carga completa (8 h)", () => registrarPratica(instrutor, {
    matriculaId: alt.id, data: new Date(), local: "Centro de treinamento", conteudo: "Teoria e prática NR-35 conforme plano.", duracaoMin: 240, notaAvaliacao: 90, resultado: "APTO",
  }), "menor que a do curso");
  await registrarPratica(instrutor, {
    matriculaId: alt.id, data: new Date(), local: "Centro de treinamento (fictício)", equipamento: "Torre de treinamento, cinto, talabarte duplo, trava-quedas",
    conteudo: "Teoria e prática NR-35 conforme conteúdo do item 35.4.2.1, incluindo resgate.", duracaoMin: 480, notaAvaliacao: 85, resultado: "APTO",
  });
  const certAlt = await aprovarEEmitir(rt, alt.id, "Centro de treinamento (fictício) — presencial");
  checar("NR-35 presencial certificada com validade de 24 meses", !!certAlt.validoAte && Math.round((+certAlt.validoAte - +certAlt.dataConclusao) / (30.4 * 86400_000)) === 24);

  // ------------------------------------------------ 4b. mini curso: diagnóstica antes do vídeo → final depois
  const mc = cod("MC-M3");
  const mcAula = (await db.query.capitulos.findFirst({ where: eq(schema.capitulos.cursoId, mc.id), with: { aulas: true } }))!.aulas[0];
  checar("Mini curso M3 tem videoaula e legenda", !!mcAula?.videoUrl?.endsWith(".mp4") && !!mcAula.legendaUrl, mcAula?.videoUrl ?? "");
  const [mm] = await db.insert(schema.matriculas).values({ colaboradorId: c.id, cursoId: mc.id, classificacao: "RECOMENDADO" }).returning();
  await deveFalhar("Vídeo bloqueado antes da diagnóstica", () => registrarTempo(colab, mm.id, mcAula.id, 30), "diagnóstica");
  await deveFalhar("Avaliação final bloqueada antes da diagnóstica", () => iniciarAvaliacao(colab, mm.id), "diagnóstica");
  const td = await iniciarDiagnostica(colab, mm.id, "teste-fluxo");
  const qd = await db.query.questoes.findMany({ where: inArray(schema.questoes.id, td.questoes.map((q) => q.questaoId)) });
  checar("Diagnóstica usa só questões marcadas (8 a 10)", qd.every((q) => q.diagnostica) && qd.length >= 8 && qd.length <= 10, `${qd.length} questões`);
  checar("Diagnóstica exclui a M3-16 [VALIDAR]", !(await db.query.questoes.findFirst({ where: and(eq(schema.questoes.cursoId, mc.id), eq(schema.questoes.codigo, "M3-16")) })));
  const marcD: Record<string, string> = {};
  qd.forEach((q, i) => { marcD[q.id] = i % 2 ? q.correta : q.alternativas.find((x) => x.id !== q.correta)!.id; });
  const rD = await enviarAvaliacao(colab, td.id, marcD);
  const mmAtual = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, mm.id) }))!;
  checar("Diagnóstica não aprova nem reprova", rD.aprovado === null && mmAtual.status === "EM_ANDAMENTO", `nota ${rD.nota}%`);
  await deveFalhar("Diagnóstica é feita uma única vez", () => iniciarDiagnostica(colab, mm.id), "já foi feita");
  const mcAulas = (await db.query.capitulos.findMany({ where: eq(schema.capitulos.cursoId, mc.id), with: { aulas: true } })).flatMap((k) => k.aulas);
  checar("M3 tem as 6 videoaulas v2, com duração real do vídeo", mcAulas.length === 6 && mcAulas.every((x) => x.videoUrl?.startsWith("/videos/v2/") && (x.duracaoSeg ?? 0) > 60), `${mcAulas.length} aulas`);
  await registrarTempo(colab, mm.id, mcAula.id, 30, 9999);
  const pSalto = (await db.query.progressoAulas.findFirst({ where: and(eq(schema.progressoAulas.matriculaId, mm.id), eq(schema.progressoAulas.aulaId, mcAula.id)) }))!;
  checar("Pular o vídeo não conta: o ponto assistido avança só o tempo do pulso", pSalto.posicaoMaxSeg <= 35, `posição ${pSalto.posicaoMaxSeg} s`);
  const minAula = segundosMinimos(mcAula, mc.tempoMinimoAulaPct);
  for (let s2 = 30; s2 < minAula; s2 += 30) await registrarTempo(colab, mm.id, mcAula.id, 30, 35);
  await deveFalhar("Tempo sem assistir o vídeo até o fim não conclui a aula", () => concluirAula(colab, mm.id, mcAula.id), "até o fim");
  await assistirTudo(colab, mm.id);
  const rF = await responder(colab, mm.id, true);
  const mmFim = (await db.query.matriculas.findFirst({ where: eq(schema.matriculas.id, mm.id), with: { tentativas: true } }))!;
  checar("Final aprovada leva a PENDENTE_PRATICA (parte presencial)", !!rF.aprovado && mmFim.status === "PENDENTE_PRATICA", `diagnóstica ${rD.nota}% → final ${rF.nota}%`);
  checar("Diagnóstica não conta como tentativa da final", mmFim.tentativas.filter((t) => t.tipo === "FINAL").length === 1 && mmFim.tentativas.find((t) => t.tipo === "FINAL")!.numero === 1);

  // ------------------------------------------------ 5. conferência documental e liberação
  av = await avaliarColaborador(c.id);
  checar("Treinamentos ok, mas sem ASO/EPI continua VERMELHO", av.semaforo === "VERMELHO");
  const aso = await enviarDocumento(colab, {
    colaboradorId: c.id, tipo: "ASO", descricao: "ASO admissional (fictício)", emitidoEm: new Date(), emitente: "Médico fictício CRM 00000",
    arquivo: { nome: "aso.pdf", tipo: "application/pdf", bytes: Buffer.from("%PDF-1.4 arquivo fictício de teste") },
  });
  const epi = await enviarDocumento(rh, { colaboradorId: c.id, tipo: "FICHA_EPI", descricao: "Ficha de entrega de EPI (fictícia)", emitidoEm: new Date() });
  av = await avaliarColaborador(c.id);
  checar("Documentos enviados e não conferidos → AMARELO", av.semaforo === "AMARELO");
  await deveFalhar("ASO não é conferido sem validade", () => conferirDocumento(sst, aso.id, { aprovado: true }), "validade");
  await conferirDocumento(sst, aso.id, { aprovado: true, validoAte: new Date(Date.now() + 365 * 86400_000), aptidoes: "altura" });
  await conferirDocumento(sst, epi.id, { aprovado: true });
  av = await avaliarColaborador(c.id);
  checar("Falta autorização formal NR-35 → AMARELO", av.semaforo === "AMARELO" && av.itens.some((i) => i.grupo === "Autorizações" && i.situacao === "PENDENTE"));
  await deveFalhar("Liberação bloqueada fora do verde", () => aprovarLiberacao(gestor, c.id), "verde");
  await concederAutorizacao(sst, c.id, "Trabalho em altura (NR-35)");
  av = await avaliarColaborador(c.id);
  checar("Tudo conferido → VERDE", av.semaforo === "VERDE");
  checar("VERDE não libera automaticamente", !av.liberacaoAtiva);
  const lib = await aprovarLiberacao(gestor, c.id, "Conferido no painel");
  checar("Liberação registrada por aprovação humana do gestor da obra", lib.aprovadaPorId === gestor.id);

  // ------------------------------------------------ 6. autenticidade, cancelamento e reemissão
  const v = await verificarPublico(certAlt.codigoVerificacao);
  checar("Verificação pública encontra o certificado", v?.c.status === "VALIDO");
  checar("Página pública não expõe CPF integral", !JSON.stringify(v).includes(cpf));
  const novo = await reemitirCertificado(rt, certAlt.id, "Correção do local de realização");
  const vAntigo = await verificarPublico(certAlt.codigoVerificacao);
  checar("Reemissão marca o anterior como SUBSTITUÍDO e aponta o novo", vAntigo?.c.status === "SUBSTITUIDO" && vAntigo.substituto?.numero === novo.numero);
  await cancelarCertificado(rt, certSeg.id, "Teste de cancelamento");
  checar("Cancelamento aparece na verificação", (await verificarPublico(certSeg.codigoVerificacao))?.c.status === "CANCELADO");
  av = await avaliarColaborador(c.id);
  checar("Certificado cancelado volta o colaborador para pendência", av.semaforo !== "VERDE");

  // reemite o curso cancelado para seguir os cenários
  await aprovarEEmitir(rt, seg.id, "OBR-TESTE (teoria EAD + prática presencial)");

  // ------------------------------------------------ 7. certificado vencido e documentação irregular
  await db.update(schema.matriculas).set({ validoAte: new Date(Date.now() - 86400_000) }).where(eq(schema.matriculas.id, integ.id));
  const qtd = await atualizarVencidos();
  av = await avaliarColaborador(c.id);
  checar("Certificado vencido → VENCIDO e semáforo VERMELHO", qtd >= 1 && av.semaforo === "VERMELHO" && av.itens.some((i) => i.detalhe?.includes("vencido")));
  await db.update(schema.matriculas).set({ status: "CAPACITADO", validoAte: new Date(Date.now() + 365 * 86400_000) }).where(eq(schema.matriculas.id, integ.id));
  await db.update(schema.documentos).set({ validoAte: new Date(Date.now() - 86400_000) }).where(eq(schema.documentos.id, aso.id));
  av = await avaliarColaborador(c.id);
  checar("ASO vencido → VERMELHO", av.semaforo === "VERMELHO" && av.itens.some((i) => i.descricao === "ASO" && i.detalhe === "Vencido"));
  checar("Liberação existente aparece para revisão quando o semáforo muda", !!av.liberacaoAtiva && av.semaforo === "VERMELHO");

  // ------------------------------------------------ 8. PDFs e auditoria
  for (const cert of [certInt, comprovante, novo]) {
    const { pdf } = await pdfDoCertificado(cert.id);
    writeFileSync(`saida-testes/${cert.numero}.pdf`, pdf);
  }
  checar("PDFs gerados (certificado integral e comprovante de etapa)", true, "pasta saida-testes/");
  const eventos = await db.query.auditoria.findMany();
  checar("Auditoria registra as ações sensíveis", eventos.some((e) => e.acao === "certificado.emitido") && eventos.some((e) => e.acao === "liberacao.aprovada"), `${eventos.length} eventos`);

  const falhas = resultados.filter((r) => !r.ok);
  writeFileSync("saida-testes/relatorio.json", JSON.stringify({ quando: new Date(), total: resultados.length, falhas: falhas.length, resultados }, null, 2));
  console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações aprovadas.`);
  await encerrarDb();
  if (falhas.length) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await encerrarDb();
  process.exit(1);
});
