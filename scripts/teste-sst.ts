// Teste do módulo Saúde e Segurança com dados FICTÍCIOS:
// PGR (GHE, biblioteca, inventário, revisão, aprovação com PDF, versão) → termos (ordem de serviço com riscos do PGR, assinatura)
// → dossiê admissional → PCMSO (periodicidade) → ASO (próximo exame calculado, inapto) → prazos e alertas.
// Uso: npm run test:sst  (depois de npm run db:seed)
import "../db/carregar-env";
import { eq, inArray } from "drizzle-orm";
import { db, encerrarDb, schema } from "../db";
import type { Ator } from "../lib/permissoes";
import { cadastrarPorConvite, criarConvite } from "../lib/servicos/cadastro";
import { avaliarColaborador } from "../lib/servicos/conformidade";
import { conferirDocumento, enviarDocumento } from "../lib/servicos/documentos";
import { aprovarModelo, assinarTermo, conferirItemAdmissional, dossieAdmissional, enviarItemAdmissional, montarTermo, novaVersaoModelo, termosDoColaborador } from "../lib/servicos/admissao";
import { aprovarPgr, atualizarPgr, criarPgr, enviarParaRevisao, importarDaBiblioteca, revisarPgr, riscosDaFuncao, salvarAcao, salvarGhe, salvarRisco } from "../lib/servicos/pgr";
import { examesDaFuncao, registrarPcmso, salvarExame } from "../lib/servicos/pcmso";
import { listarPrazos } from "../lib/servicos/prazos";
import { salvarParceiro, salvarSignatario } from "../lib/servicos/parceiros";

const res: boolean[] = [];
const checar = (nome: string, ok: boolean, det = "") => { res.push(ok); console.log(`${ok ? "✔" : "✘"} ${nome}${det ? ` — ${det}` : ""}`); };
async function deveFalhar(nome: string, fn: () => Promise<unknown>, trecho?: string) {
  try { await fn(); checar(nome, false, "deveria ter sido bloqueado"); } catch (e) { const m = (e as Error).message; checar(nome, !trecho || m.includes(trecho), m); }
}
async function ator(email: string): Promise<Ator> {
  const u = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, email) });
  if (!u) throw new Error(`Rode o seed antes: ${email}`);
  return { id: u.id, nome: u.nome, perfil: u.perfil, colaboradorId: u.colaboradorId };
}
function cpfFicticio() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const dv = (b: number[]) => { const r = (b.reduce((a, d, i) => a + d * (b.length + 1 - i), 0) * 10) % 11; return r === 10 ? 0 : r; };
  const d1 = dv(n); return [...n, d1, dv([...n, d1])].join("");
}
const PDF = { nome: "assinado.pdf", tipo: "application/pdf", bytes: Buffer.from("%PDF-1.4\n% documento fictício de teste\n") };
const IMG = { nome: "foto.jpg", tipo: "image/jpeg", bytes: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]) };
const DIA = 86400_000;
let medicoTesteId = "";
const parceirosTeste: string[] = [], signatariosTeste: string[] = [];

async function limpar() {
  const obra = await db.query.obras.findFirst({ where: eq(schema.obras.codigo, "OBR-TESTE-SST") });
  if (obra) {
    const colabs = await db.query.colaboradores.findMany({ where: eq(schema.colaboradores.obraId, obra.id) });
    const ids = colabs.map((c) => c.id);
    if (ids.length) {
      await db.delete(schema.assinaturasTermo).where(inArray(schema.assinaturasTermo.colaboradorId, ids));
      await db.delete(schema.usuarios).where(inArray(schema.usuarios.colaboradorId, ids));
      await db.delete(schema.colaboradores).where(inArray(schema.colaboradores.id, ids));
    }
    await db.delete(schema.pcmsos).where(eq(schema.pcmsos.obraId, obra.id));
    await db.delete(schema.pgrs).where(eq(schema.pgrs.obraId, obra.id));
    await db.delete(schema.convites).where(eq(schema.convites.obraId, obra.id));
    await db.delete(schema.obras).where(eq(schema.obras.id, obra.id));
  }
}

async function main() {
  await limpar();
  const sst = await ator("sst@palla.teste"), rh = await ator("rh@palla.teste"), gestor = await ator("gestor@palla.teste");
  const palla = (await db.query.empresas.findFirst({ where: eq(schema.empresas.propria, true) }))!;
  const montador = (await db.query.funcoes.findFirst({ where: eq(schema.funcoes.codigo, "MONTADOR") }))!;
  const [obra] = await db.insert(schema.obras).values({ codigo: "OBR-TESTE-SST", nome: "Obra fictícia — teste SST" }).returning();
  const modelosAntes = await db.query.modelosTermo.findMany();

  // ------------------------------------------------ PGR
  await deveFalhar("RH não monta PGR (só SST)", () => criarPgr(rh, { obraId: obra.id, titulo: "x", estabelecimento: "y" }), "Sem permissão");
  const pgr = await criarPgr(sst, { obraId: obra.id, titulo: "PGR teste SST", estabelecimento: "Palla Construções — canteiro fictício", descricaoProcessos: "Montagem de galpão metálico (fictício)." });
  checar("PGR nasce em rascunho com critério 5×5 sugerido", pgr.status === "RASCUNHO" && pgr.criterio.severidade.length === 5);
  await deveFalhar("Revisão exige ao menos um GHE", () => enviarParaRevisao(sst, pgr.id), "GHE");
  const gheId = await salvarGhe(sst, pgr.id, { codigo: "ghe-01", nome: "Montagem em altura", descricaoAtividades: "Montagem e aparafusamento de vigas", funcoesIds: [montador.id], epis: "- Capacete com jugular\n- Cinto paraquedista com talabarte duplo" });
  await deveFalhar("GHE sem riscos não vai para revisão", () => enviarParaRevisao(sst, pgr.id), "sem riscos");
  const amb = await db.query.ambientesBiblioteca.findMany({ where: inArray(schema.ambientesBiblioteca.codigo, ["ALTURA", "ICAMENTO"]) });
  const n = await importarDaBiblioteca(sst, pgr.id, gheId, amb.map((a) => a.id));
  checar("Biblioteca copia perigos para o GHE", n >= 8, `${n} linhas`);
  checar("Importar de novo não duplica", (await importarDaBiblioteca(sst, pgr.id, gheId, amb.map((a) => a.id))) === 0);
  await deveFalhar("Severidade fora da escala é recusada", () => salvarRisco(sst, pgr.id, { gheId, categoria: "FISICO", perigo: "Ruído", fonte: "x", lesoes: "y", medidasExistentes: "z", severidade: 9, probabilidade: 1 }), "escala");
  const riscoId = await salvarRisco(sst, pgr.id, { gheId, categoria: "FISICO", perigo: "Ruído de chave de impacto", fonte: "Chaves de impacto", lesoes: "PAIR", medidasExistentes: "Protetor auditivo", severidade: 3, probabilidade: 3, monitoramento: "Dosimetria fictícia" });
  await salvarAcao(sst, pgr.id, { riscoId, medida: "Avaliação quantitativa de ruído", tipo: "ADMINISTRATIVA", responsavel: "SST", prazo: new Date(Date.now() + 20 * DIA) });
  await enviarParaRevisao(sst, pgr.id);
  await deveFalhar("Aprovar exige profissional habilitado identificado", () => aprovarPgr(sst, pgr.id, { vigenciaInicio: new Date(), arquivo: PDF }), "NR-18");
  checar("Antes da aprovação, a ordem de serviço não tem riscos para a função", (await riscosDaFuncao(montador.id, obra.id)) === null);
  // cadastro de quem assina e da empresa parceira (logotipo)
  const PNG = { nome: "logo.png", tipo: "image/png", bytes: Buffer.from("89504e470d0a1a0a", "hex") };
  await deveFalhar("Logotipo em formato não aceito é recusado", () => salvarParceiro(sst, { nome: "Consultoria Fictícia SST", tipo: "SEGURANCA", logo: { ...PNG, tipo: "image/svg+xml" } }), "PNG");
  const consultoria = await salvarParceiro(sst, { nome: "Consultoria Fictícia SST", tipo: "SEGURANCA", logo: PNG });
  const clinica = await salvarParceiro(sst, { nome: "Clínica Fictícia Ocupacional", tipo: "CLINICA", logo: PNG });
  await deveFalhar("RH não cadastra quem assina", () => salvarSignatario(rh, { nome: "x", tipo: "PROFISSIONAL_SST", qualificacao: "x", registro: "1" }), "Sem permissão");
  await deveFalhar("Médico sem CRM é recusado", () => salvarSignatario(sst, { nome: "Médico Fictício", tipo: "MEDICO_TRABALHO", qualificacao: "Médico do Trabalho", conselho: "CREA", registro: "1" }), "CRM");
  const eng = await salvarSignatario(sst, { nome: "Engenheira Fictícia de Segurança", tipo: "PROFISSIONAL_SST", qualificacao: "Engenheira de Segurança do Trabalho", conselho: "CREA", uf: "sp", registro: "0000000 (fictício)", parceiroId: consultoria });
  const diretor = await salvarSignatario(sst, { nome: "Diretor Fictício", tipo: "RESPONSAVEL_ORGANIZACAO", qualificacao: "Diretor", cargo: "Diretor Executivo", registro: "" });
  medicoTesteId = await salvarSignatario(sst, { nome: "Médico Fictício do Trabalho", tipo: "MEDICO_TRABALHO", qualificacao: "Médico do Trabalho", conselho: "CRM", uf: "SP", registro: "00000 (fictício)", parceiroId: clinica });
  await deveFalhar("Médico não pode ser escolhido para assinar o PGR", () => atualizarPgr(sst, pgr.id, { elaboradorId: medicoTesteId }), "profissional de segurança");
  await atualizarPgr(sst, pgr.id, { elaboradorId: eng, responsavelOrgId: diretor, parceiroId: consultoria });
  const comSign = (await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgr.id) }))!;
  checar("Dados de quem assina vêm do cadastro (nome, qualificação, CREA-SP)", comSign.elaboradorNome === "Engenheira Fictícia de Segurança" && comSign.elaboradorRegistro === "CREA-SP 0000000 (fictício)" && comSign.responsavelOrganizacao === "Diretor Fictício — Diretor Executivo");
  parceirosTeste.push(consultoria, clinica); signatariosTeste.push(eng, diretor, medicoTesteId);
  await deveFalhar("Aprovar exige PDF", () => aprovarPgr(sst, pgr.id, { vigenciaInicio: new Date(), arquivo: IMG }), "PDF");
  await aprovarPgr(sst, pgr.id, { vigenciaInicio: new Date(), arquivo: PDF });
  const aprovado = (await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgr.id) }))!;
  checar("PGR aprovado com hash do PDF e revisão em até 24 meses", aprovado.status === "APROVADO" && !!aprovado.arquivoAssinadoHash && !!aprovado.proximaRevisao && +aprovado.proximaRevisao - Date.now() <= 731 * DIA);
  await deveFalhar("Versão aprovada não pode ser alterada", () => salvarRisco(sst, pgr.id, { id: riscoId, gheId, categoria: "FISICO", perigo: "x", fonte: "x", lesoes: "x", medidasExistentes: "x", severidade: 1, probabilidade: 1 }), "revisão");
  const r = await riscosDaFuncao(montador.id, obra.id);
  checar("Riscos da função saem do PGR aprovado da obra", !!r && r.riscos.length === n + 1);

  // ------------------------------------------------ colaborador fictício
  const convite = await criarConvite(rh, { obraId: obra.id, funcaoId: montador.id, empresaId: palla.id, nomeSugerido: "Maria Fictícia" });
  const { colab: c, usuario } = await cadastrarPorConvite(convite.token, {
    nome: "Maria Fictícia de Souza Teste", cpf: cpfFicticio(), telefone: "11999990002", email: `maria.${Date.now()}@ficticio.teste`,
    senha: "SenhaTeste123", consentimento: true, ficticio: true, dataNascimento: "10/05/1992",
  });
  const colab: Ator = { id: usuario.id, nome: usuario.nome, perfil: "COLABORADOR", colaboradorId: c.id };

  // ------------------------------------------------ termos
  checar("Modelos em revisão não aparecem para o colaborador", (await termosDoColaborador(c.id)).length === 0);
  const os = (await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.codigo, "OS-RISCOS") }))!;
  await deveFalhar("RH não aprova modelo de termo", () => aprovarModelo(rh, os.id), "Sem permissão");
  await aprovarModelo(sst, os.id);
  const montado = await montarTermo(os, c.id);
  checar("Ordem de serviço traz riscos e EPIs do GHE", !montado.bloqueio && montado.texto.includes("Ruído de chave de impacto") && montado.texto.includes("talabarte duplo") && !montado.texto.includes("{{"));
  checar("Termo pendente deixa o semáforo amarelo/vermelho", (await avaliarColaborador(c.id)).itens.some((i) => i.grupo === "Termos" && i.situacao === "PENDENTE"));
  await deveFalhar("Senha errada não assina", () => assinarTermo(colab, os.id, { senha: "errada", nomeDigitado: c.nome, aceite: true }), "Senha");
  await deveFalhar("Nome diferente não assina", () => assinarTermo(colab, os.id, { senha: "SenhaTeste123", nomeDigitado: "Outra Pessoa", aceite: true }), "nome");
  await deveFalhar("Equipe não assina pelo colaborador", () => assinarTermo(rh, os.id, { senha: "Palla@2026", nomeDigitado: c.nome, aceite: true }), "próprio colaborador");
  const ass = await assinarTermo(colab, os.id, { senha: "SenhaTeste123", nomeDigitado: "maria fictícia de souza teste", aceite: true, ip: "203.0.113.10", userAgent: "teste" });
  checar("Assinatura grava código, hash e texto congelado", ass.codigo.startsWith("TRM-") && ass.hashSha256.length === 64 && ass.textoFinal.includes("Ruído"));
  checar("Termo assinado sai das pendências", (await termosDoColaborador(c.id))[0].situacao === "ASSINADO");
  const v2 = await novaVersaoModelo(sst, os.id, os.texto + "\n\nTexto atualizado (teste).");
  await aprovarModelo(sst, v2);
  checar("Nova versão aprovada pede nova assinatura", (await termosDoColaborador(c.id)).find((t) => t.modelo.codigo === "OS-RISCOS")?.situacao === "NOVA_VERSAO");

  // ------------------------------------------------ dossiê admissional
  const d0 = await dossieAdmissional(c.id);
  checar("Dossiê lista os itens obrigatórios da função", d0.total >= 8 && d0.entregues === 0, `${d0.total} obrigatórios`);
  checar("Item só de operador de guindaste não aparece para montador", !d0.linhas.some((l) => l.item.codigo === "CNH-OPERADOR"));
  const itemId = d0.linhas.find((l) => l.item.codigo === "DOC-ID")!.item.id;
  const contratoId = d0.linhas.find((l) => l.item.codigo === "CONTRATO")!.item.id;
  await deveFalhar("Colaborador não envia item que é do RH", () => enviarItemAdmissional(colab, c.id, contratoId, PDF), "RH");
  const docId = await enviarItemAdmissional(colab, c.id, itemId, IMG);
  await conferirItemAdmissional(rh, docId.id, false, "Foto ilegível");
  checar("Documento rejeitado volta como pendência com motivo", (await dossieAdmissional(c.id)).linhas.find((l) => l.item.id === itemId)?.situacao === "REJEITADO");
  const doc2 = await enviarItemAdmissional(colab, c.id, itemId, IMG);
  await conferirItemAdmissional(rh, doc2.id, true);
  await enviarItemAdmissional(rh, c.id, contratoId, PDF);
  checar("Conferidos entram na contagem", (await dossieAdmissional(c.id)).entregues === 2);
  await deveFalhar("Gestor de obra não confere documento de admissão", () => conferirItemAdmissional(gestor, doc2.id, true), "Sem permissão");

  // ------------------------------------------------ PCMSO e ASO
  const pcmsoId = await registrarPcmso(sst, { titulo: "PCMSO teste", obraId: obra.id, pgrId: pgr.id, medicoNome: "", medicoCrm: "", medicoId: medicoTesteId, vigenciaInicio: new Date(), arquivo: PDF });
  const pc = (await db.query.pcmsos.findFirst({ where: eq(schema.pcmsos.id, pcmsoId) }))!;
  checar("PCMSO pega médico, CRM e clínica do cadastro", pc.medicoNome === "Médico Fictício do Trabalho" && pc.medicoCrm === "CRM-SP 00000 (fictício)" && pc.clinica === "Clínica Fictícia Ocupacional" && !!pc.parceiroId);
  await deveFalhar("Exame periódico exige periodicidade do PCMSO", () => salvarExame(sst, pcmsoId, { gheId, exame: "Exame clínico", momentos: ["ADMISSIONAL", "PERIODICO"] }), "periodicidade");
  await salvarExame(sst, pcmsoId, { gheId, exame: "Exame clínico", momentos: ["ADMISSIONAL", "PERIODICO", "DEMISSIONAL"], periodicidadeMeses: 12 });
  await salvarExame(sst, pcmsoId, { gheId, exame: "Audiometria (fictício)", momentos: ["ADMISSIONAL", "PERIODICO"], periodicidadeMeses: 6 });
  const ex = await examesDaFuncao(montador.id, obra.id);
  checar("Exames da função vêm do GHE no PCMSO vigente", ex?.exames.length === 2 && ex.menorPeriodicidade === 6);
  const emitido = new Date(Date.now() - 5 * 30 * DIA - 20 * DIA); // ~5 meses e 20 dias atrás
  const aso = await enviarDocumento(colab, { colaboradorId: c.id, tipo: "ASO", descricao: "ASO admissional (fictício)", emitidoEm: emitido, arquivo: PDF });
  await conferirDocumento(sst, aso.id, { aprovado: true, asoResultado: "APTO", asoTipoExame: "ADMISSIONAL" });
  const asoOk = (await db.query.documentos.findFirst({ where: eq(schema.documentos.id, aso.id) }))!;
  const esperado = new Date(emitido); esperado.setMonth(esperado.getMonth() + 6);
  checar("Próximo periódico = data do ASO + menor periodicidade do PCMSO", asoOk.validoAte?.toDateString() === esperado.toDateString() && asoOk.pcmsoId === pcmsoId, asoOk.validoAte?.toLocaleDateString("pt-BR"));

  // ------------------------------------------------ prazos
  await db.update(schema.colaboradores).set({ dataAdmissao: new Date(Date.now() - 40 * DIA), experienciaDias: 45, experienciaProrrogacaoDias: 45 }).where(eq(schema.colaboradores.id, c.id));
  const prazos = await listarPrazos({ janelaDias: 60, obraId: obra.id });
  checar("Alerta do exame periódico aparece", prazos.some((p) => p.tipo === "ASO" && p.colaboradorId === c.id));
  checar("Alerta do fim da experiência aparece", prazos.some((p) => p.tipo === "EXPERIENCIA"));
  checar("Alerta do plano de ação aparece", prazos.some((p) => p.tipo === "PLANO_ACAO"));
  checar("Revisão do PGR (2 anos) fica fora da janela de 60 dias", !prazos.some((p) => p.tipo === "PGR"));
  checar("Revisão do PGR aparece na janela de 2 anos", (await listarPrazos({ janelaDias: 740, obraId: obra.id })).some((p) => p.tipo === "PGR"));

  // ------------------------------------------------ ASO inapto
  const aso2 = await enviarDocumento(sst, { colaboradorId: c.id, tipo: "ASO", descricao: "ASO periódico (fictício)", emitidoEm: new Date(), arquivo: PDF });
  await conferirDocumento(sst, aso2.id, { aprovado: true, asoResultado: "INAPTO", asoTipoExame: "PERIODICO" });
  const conf = await avaliarColaborador(c.id);
  checar("ASO inapto impede o acesso (vermelho)", conf.semaforo === "VERMELHO" && conf.itens.some((i) => i.descricao === "ASO" && i.situacao === "IMPEDITIVO"));

  // ------------------------------------------------ revisão do PGR
  const novo = await revisarPgr(sst, pgr.id, "Nova etapa da obra (teste)");
  const pNovo = (await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, novo), with: { riscos: true, acoes: true } }))!;
  checar("Revisão copia inventário e ações abertas para a v2", pNovo.versao === 2 && pNovo.riscos.length === n + 1 && pNovo.acoes.length === 1);
  await deveFalhar("Não abre duas revisões ao mesmo tempo", () => revisarPgr(sst, pgr.id, "outra"), "Já existe");
  await enviarParaRevisao(sst, novo);
  await aprovarPgr(sst, novo, { vigenciaInicio: new Date(), arquivo: PDF });
  checar("Aprovar a v2 guarda a v1 como substituída (histórico)", (await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, pgr.id) }))!.status === "SUBSTITUIDO");
  checar("Auditoria registra a assinatura do termo", !!(await db.query.auditoria.findFirst({ where: eq(schema.auditoria.entidadeId, ass.id) })));

  // ------------------------------------------------ operador de guindaste e munck
  const opGuindar = (await db.query.funcoes.findFirst({ where: eq(schema.funcoes.codigo, "OP_GUINDAR") }))!;
  const conv2 = await criarConvite(rh, { obraId: obra.id, funcaoId: opGuindar.id, empresaId: palla.id, nomeSugerido: "Operador Fictício" });
  const { colab: op } = await cadastrarPorConvite(conv2.token, {
    nome: "Operador Fictício de Guindar Teste", cpf: cpfFicticio(), telefone: "11999990003", email: `operador.${Date.now()}@ficticio.teste`,
    senha: "SenhaTeste123", consentimento: true, ficticio: true, dataNascimento: "02/02/1985",
  });
  const mOp = await db.query.matriculas.findMany({ where: eq(schema.matriculas.colaboradorId, op.id), with: { curso: true } });
  checar("Operador de guindar recebe as capacitações de guindaste e de munck", ["NR18-GUI", "NR18-MUNCK", "PAL-54"].every((k) => mOp.some((m) => m.curso.codigo === k)));
  const avOp = await avaliarColaborador(op.id);
  checar("Exige duas autorizações separadas (guindaste e munck)", ["Autorização: Operação de equipamento de guindar", "Autorização: Operação de caminhão guindauto (munck)"].every((d) => avOp.itens.some((i) => i.descricao === d)));
  const dOp = await dossieAdmissional(op.id);
  checar("Dossiê do operador pede CNH com validade e certificados anteriores", dOp.linhas.some((l) => l.item.codigo === "CNH-OPERADOR" && l.item.exigeValidade) && dOp.linhas.some((l) => l.item.codigo === "CERT-OPERADOR"));

  // restaura os modelos de termo (o teste não deve deixar modelos aprovados no banco de desenvolvimento)
  await db.delete(schema.assinaturasTermo).where(eq(schema.assinaturasTermo.colaboradorId, c.id));
  await db.delete(schema.modelosTermo).where(eq(schema.modelosTermo.id, v2));
  for (const m of modelosAntes) await db.update(schema.modelosTermo).set({ status: m.status, aprovadoPorId: m.aprovadoPorId, aprovadoEm: m.aprovadoEm }).where(eq(schema.modelosTermo.id, m.id));

  if (!process.env.MANTER_DADOS) await limpar();
  if (!process.env.MANTER_DADOS && signatariosTeste.length) await db.delete(schema.signatarios).where(inArray(schema.signatarios.id, signatariosTeste));
  if (!process.env.MANTER_DADOS && parceirosTeste.length) await db.delete(schema.parceiros).where(inArray(schema.parceiros.id, parceirosTeste));
  console.log(`\n${res.filter(Boolean).length}/${res.length} verificações aprovadas.`);
  await encerrarDb();
  if (res.some((x) => !x)) process.exit(1);
}

main().catch(async (e) => { console.error(e); await encerrarDb(); process.exit(1); });
