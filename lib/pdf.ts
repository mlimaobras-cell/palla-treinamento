// Geração do certificado (A4 horizontal, 2 páginas) e do comprovante de etapa (A4 retrato).
import { readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, degrees } from "pdf-lib";
import QRCode from "qrcode";
import type { DadosCertificado } from "@/db/schema";
import { fmtData, fmtDataHora, MODALIDADE, ORIGEM } from "@/lib/formato";

export type BaseCertificado = {
  numero: string;
  codigoVerificacao: string;
  tipo: "INTEGRAL" | "COMPROVANTE_ETAPA";
  emitidoEm: Date;
  dataInicio: Date;
  dataConclusao: Date;
  validoAte: Date | null;
  local: string;
  aprovadoPorNome: string | null;
  aprovadoEm: Date | null;
  cienciaTrabalhadorEm: Date | null;
  status?: "VALIDO" | "CANCELADO" | "SUBSTITUIDO";
};

const NAVY = rgb(0.11, 0.145, 0.322);
const AZUL = rgb(0.204, 0.271, 0.604);
const VERMELHO = rgb(0.776, 0.149, 0.18);
const TEXTO = rgb(0.24, 0.27, 0.4);
const CINZA = rgb(0.45, 0.47, 0.56);
const LINHA = rgb(0.82, 0.84, 0.9);
const AMBAR_FUNDO = rgb(1, 0.96, 0.85);
const AMBAR = rgb(0.6, 0.38, 0.0);

const WINANSI_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
/** pdf-lib com fontes padrão só aceita WinAnsi: troca o que estiver fora. */
function limpar(s: string) {
  return s
    .replace(/[→⇒]/g, "->")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/[^\u0000-ÿ]/g, (ch) => (WINANSI_EXTRA.includes(ch) ? ch : "-"));
}

function quebrar(texto: string, fonte: PDFFont, tamanho: number, largura: number): string[] {
  const linhas: string[] = [];
  for (const par of limpar(texto).split("\n")) {
    let atual = "";
    for (const palavra of par.split(/\s+/)) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(teste, tamanho) > largura && atual) {
        linhas.push(atual);
        atual = palavra;
      } else atual = teste;
    }
    linhas.push(atual);
  }
  return linhas;
}

function texto(p: PDFPage, s: string, x: number, y: number, f: PDFFont, t: number, cor = TEXTO, alinhamento: "esq" | "centro" | "dir" = "esq") {
  const v = limpar(s);
  const w = f.widthOfTextAtSize(v, t);
  const xx = alinhamento === "centro" ? x - w / 2 : alinhamento === "dir" ? x - w : x;
  p.drawText(v, { x: xx, y, size: t, font: f, color: cor });
}

function paragrafo(p: PDFPage, s: string, x: number, y: number, largura: number, f: PDFFont, t: number, entre: number, cor = TEXTO, centro = false) {
  const linhas = quebrar(s, f, t, largura);
  linhas.forEach((l, i) => texto(p, l, centro ? x + largura / 2 : x, y - i * entre, f, t, cor, centro ? "centro" : "esq"));
  return y - linhas.length * entre;
}

function urlVerificacao(codigo: string) {
  return `${(process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "")}/verificar/${codigo}`;
}

const horas = (h: number | null) => (h == null ? "não fixada" : `${String(h).replace(".", ",")} horas`);

export async function gerarPdfCertificado(base: BaseCertificado, d: DadosCertificado): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${base.tipo === "INTEGRAL" ? "Certificado" : "Comprovante de etapa"} ${base.numero}`);
  pdf.setAuthor(d.empresa.nome);
  pdf.setCreator("Grupo Palla | Treinamento e Integração");
  pdf.setSubject(d.cursoTitulo);
  const normal = await pdf.embedFont(StandardFonts.Helvetica);
  const negrito = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italico = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const logo = await pdf.embedPng(readFileSync(path.join(process.cwd(), "public", "logo-palla.png")));
  const qr = await pdf.embedPng(await QRCode.toBuffer(urlVerificacao(base.codigoVerificacao), { margin: 1, width: 300, color: { dark: "#1C2552" } }));
  const f = { normal, negrito, italico };

  if (base.tipo === "INTEGRAL") {
    paginaCertificado(pdf, base, d, f, logo, qr);
    paginaConteudo(pdf, base, d, f, logo);
  } else {
    paginaComprovante(pdf, base, d, f, logo, qr);
  }
  return Buffer.from(await pdf.save({ useObjectStreams: false }));
}

type Fontes = { normal: PDFFont; negrito: PDFFont; italico: PDFFont };
type Img = Awaited<ReturnType<PDFDocument["embedPng"]>>;

function carimboStatus(p: PDFPage, base: BaseCertificado, f: Fontes) {
  if (!base.status || base.status === "VALIDO") return;
  const rotulo = base.status === "CANCELADO" ? "CANCELADO" : "SUBSTITUIDO";
  const { width, height } = p.getSize();
  p.drawText(rotulo, { x: width / 2 - 190, y: height / 2 - 60, size: 72, font: f.negrito, color: VERMELHO, opacity: 0.35, rotate: degrees(20) });
}

function paginaCertificado(pdf: PDFDocument, b: BaseCertificado, d: DadosCertificado, f: Fontes, logo: Img, qr: Img) {
  const p = pdf.addPage([841.89, 595.28]);
  const W = 841.89, H = 595.28;
  // bordas
  p.drawRectangle({ x: 16, y: 16, width: W - 32, height: H - 32, borderColor: AZUL, borderWidth: 2.2 });
  p.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: AZUL, borderWidth: 0.6 });
  p.drawRectangle({ x: 24, y: H - 30, width: 160, height: 6, color: VERMELHO });
  // marca-d'água
  const wm = 430;
  p.drawImage(logo, { x: W / 2 - wm / 2, y: H / 2 - (wm / logo.width) * logo.height / 2 - 20, width: wm, height: (wm / logo.width) * logo.height, opacity: 0.05 });
  // cabeçalho
  const lw = 170;
  p.drawImage(logo, { x: 52, y: H - 52 - (lw / logo.width) * logo.height, width: lw, height: (lw / logo.width) * logo.height });
  texto(p, "GRUPO PALLA", W - 52, H - 62, f.negrito, 11, NAVY, "dir");
  texto(p, "Treinamento e Integração", W - 52, H - 76, f.normal, 9.5, CINZA, "dir");
  texto(p, `Certificado nº ${b.numero}`, W - 52, H - 90, f.normal, 9.5, CINZA, "dir");

  texto(p, "CERTIFICADO DE CAPACITAÇÃO", W / 2, 438, f.negrito, 27, NAVY, "centro");
  p.drawRectangle({ x: W / 2 - 40, y: 428, width: 80, height: 2, color: VERMELHO });
  texto(p, `A ${d.empresa.nome} certifica que`, W / 2, 400, f.normal, 12, TEXTO, "centro");
  texto(p, d.colaboradorNome.toUpperCase(), W / 2, 368, f.negrito, 23, NAVY, "centro");
  texto(p, `CPF ${d.cpfMascarado}`, W / 2, 350, f.normal, 9.5, CINZA, "centro");

  const corpo = `concluiu com aproveitamento o treinamento "${d.cursoTitulo}", com carga horária de ${horas(d.cargaHoraria)}, ` +
    `na modalidade ${MODALIDADE[d.modalidade].toLowerCase()}, realizado de ${fmtData(b.dataInicio)} a ${fmtData(b.dataConclusao)}, ` +
    `em ${d.local}, com fundamento em ${d.normaReferencia}.`;
  paragrafo(p, corpo, 120, 322, W - 240, f.normal, 12, 17, TEXTO, true);

  // faixa de dados
  const colunas: [string, string][] = [
    ["CARGA HORÁRIA", d.cargaHoraria == null ? "Não fixada" : `${String(d.cargaHoraria).replace(".", ",")} h`],
    ["MODALIDADE", MODALIDADE[d.modalidade]],
    ["CONCLUSÃO", fmtData(b.dataConclusao)],
    ["VALIDADE", b.validoAte ? `até ${fmtData(b.validoAte)}` : "Sem prazo fixo na norma"],
  ];
  const x0 = 110, larg = (W - 220) / 4, yf = 236;
  colunas.forEach(([r, v], i) => {
    const x = x0 + i * larg;
    if (i > 0) p.drawLine({ start: { x, y: yf - 6 }, end: { x, y: yf + 26 }, thickness: 0.6, color: LINHA });
    texto(p, r, x + larg / 2, yf + 14, f.negrito, 7.5, CINZA, "centro");
    texto(p, v, x + larg / 2, yf - 1, f.negrito, 11, NAVY, "centro");
  });

  // assinaturas (registros eletrônicos vinculados a usuários reais; sem imagens de assinatura)
  const ys = 176;
  const blocos: { titulo: string; nome: string; l1: string; l2: string }[] = [];
  if (d.responsavelTecnico) {
    blocos.push({
      titulo: "Responsável técnico",
      nome: d.responsavelTecnico.nome,
      l1: [d.responsavelTecnico.qualificacao, d.responsavelTecnico.registro].filter(Boolean).join(" · "),
      l2: b.aprovadoEm ? `Aprovado eletronicamente em ${fmtDataHora(b.aprovadoEm)}` : "",
    });
  }
  const instr = d.instrutores[0];
  if (instr) blocos.push({ titulo: d.instrutores.length > 1 ? "Instrutores" : "Instrutor", nome: d.instrutores.map((i) => i.nome).join(", "), l1: [instr.qualificacao, instr.registro].filter(Boolean).join(" · "), l2: "Registro de prática na plataforma" });
  blocos.push({
    titulo: "Trabalhador",
    nome: d.colaboradorNome,
    l1: b.cienciaTrabalhadorEm ? `Ciência eletrônica em ${fmtDataHora(b.cienciaTrabalhadorEm)}` : "Assinatura do trabalhador",
    l2: "",
  });
  const lb = (W - 160) / blocos.length;
  blocos.forEach((bl, i) => {
    const cx = 80 + lb * i + lb / 2;
    p.drawLine({ start: { x: cx - lb / 2 + 22, y: ys }, end: { x: cx + lb / 2 - 22, y: ys }, thickness: 0.7, color: NAVY });
    const largTxt = lb - 44;
    let yy = ys - 13;
    for (const l of quebrar(bl.nome, f.negrito, 9.5, largTxt).slice(0, 2)) { texto(p, l, cx, yy, f.negrito, 9.5, NAVY, "centro"); yy -= 11.5; }
    texto(p, bl.titulo, cx, yy, f.normal, 8.5, CINZA, "centro"); yy -= 10.5;
    for (const l of quebrar(bl.l1, f.normal, 7.5, largTxt).slice(0, 3)) { if (l) { texto(p, l, cx, yy, f.normal, 7.5, CINZA, "centro"); yy -= 9.5; } }
    if (bl.l2) texto(p, bl.l2, cx, yy, f.italico, 7.5, CINZA, "centro");
  });

  // rodapé com autenticação
  const q = 70;
  p.drawImage(qr, { x: W - 52 - q, y: 38, width: q, height: q });
  texto(p, "Verifique a autenticidade", W - 60 - q, 86, f.negrito, 8.5, NAVY, "dir");
  texto(p, `Código: ${b.codigoVerificacao}`, W - 60 - q, 74, f.normal, 8.5, TEXTO, "dir");
  texto(p, urlVerificacao(b.codigoVerificacao), W - 60 - q, 62, f.normal, 7.5, CINZA, "dir");
  texto(p, `${d.empresa.nome}${d.empresa.cnpj ? ` · CNPJ ${d.empresa.cnpj}` : ""} · Grupo Palla`, 52, 74, f.normal, 8.5, TEXTO);
  texto(p, `Emitido em ${fmtDataHora(b.emitidoEm)} · Conteúdo programático e registros no verso`, 52, 62, f.normal, 7.5, CINZA);
  carimboStatus(p, b, f);
}

function paginaConteudo(pdf: PDFDocument, b: BaseCertificado, d: DadosCertificado, f: Fontes, logo: Img) {
  const p = pdf.addPage([841.89, 595.28]);
  const W = 841.89, H = 595.28;
  p.drawRectangle({ x: 16, y: 16, width: W - 32, height: H - 32, borderColor: AZUL, borderWidth: 2.2 });
  p.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: AZUL, borderWidth: 0.6 });
  const lw = 110;
  p.drawImage(logo, { x: W - 52 - lw, y: H - 48 - (lw / logo.width) * logo.height, width: lw, height: (lw / logo.width) * logo.height });
  texto(p, "CONTEÚDO PROGRAMÁTICO E REGISTROS", 52, H - 66, f.negrito, 15, NAVY);
  texto(p, `${d.cursoCodigo} · ${d.cursoTitulo} · Certificado nº ${b.numero}`, 52, H - 82, f.normal, 9, CINZA);
  p.drawRectangle({ x: 52, y: H - 92, width: 60, height: 2, color: VERMELHO });

  // conteúdo em 2 colunas
  const colW = 360;
  let y = H - 118;
  let col = 0;
  const topoCol = y;
  for (const [i, item] of d.conteudoProgramatico.entries()) {
    const linhas = quebrar(`${i + 1}. ${item}`, f.normal, 9, colW - 10);
    if (y - linhas.length * 12 < 250 && col === 0) {
      col = 1;
      y = topoCol;
    }
    linhas.forEach((l, k) => texto(p, l, 52 + col * (colW + 20) + (k ? 12 : 0), y - k * 12, f.normal, 9, TEXTO));
    y -= linhas.length * 12 + 3;
  }

  // tabela de registros
  const registros: [string, string][] = [
    ["Fundamentação", d.normaVersao && d.normaVersao !== "—" ? `${d.normaReferencia} (${d.normaVersao})` : d.normaReferencia],
    ["Natureza", d.tipoCurso === "LEGAL" ? "Treinamento de obrigação legal (NR)" : "Capacitação interna da Palla Construções; não substitui treinamentos exigidos pelas NR"],
    ["Carga horária", `${horas(d.cargaHoraria)} (${ORIGEM[d.cargaOrigem]})`],
    ["Modalidade e local", `${MODALIDADE[d.modalidade]} · ${d.local}`],
    ["Período", `${fmtData(b.dataInicio)} a ${fmtData(b.dataConclusao)}`],
    ["Avaliação", d.notaAvaliacao != null ? `Aproveitamento de ${d.notaAvaliacao}%` : "—"],
    ["Instrutor(es)", d.instrutores.length ? d.instrutores.map((i) => `${i.nome}${i.qualificacao ? ` (${i.qualificacao}${i.registro ? `, ${i.registro}` : ""})` : ""}`).join("; ") : "Curso a distância com tutoria da equipe de SST"],
    ["Responsável técnico", d.responsavelTecnico ? `${d.responsavelTecnico.nome}${d.responsavelTecnico.qualificacao ? `, ${d.responsavelTecnico.qualificacao}` : ""}${d.responsavelTecnico.registro ? `, ${d.responsavelTecnico.registro}` : ""}` : "—"],
    ["Validade e reciclagem", b.validoAte ? `Válido até ${fmtData(b.validoAte)}. ${d.validadeObservacao ?? ""}` : (d.validadeObservacao ?? "A norma não fixa periodicidade; reciclagem conforme NR-1, item 1.7.1.2.")],
  ];
  let yt = 232;
  p.drawLine({ start: { x: 52, y: yt + 12 }, end: { x: W - 52, y: yt + 12 }, thickness: 0.6, color: LINHA });
  for (const [r, v] of registros) {
    texto(p, r.toUpperCase(), 52, yt, f.negrito, 7.5, CINZA);
    const fim = paragrafo(p, v, 190, yt, W - 52 - 190, f.normal, 8.5, 11, TEXTO);
    yt = Math.min(yt - 14, fim - 3);
  }
  texto(p, "Documento elaborado para atender ao item 1.7.1.1 da NR-1. As assinaturas correspondem a aprovações eletrônicas registradas com login individual e trilha de auditoria.", 52, 44, f.italico, 7.5, CINZA);
  carimboStatus(p, b, f);
}

function paginaComprovante(pdf: PDFDocument, b: BaseCertificado, d: DadosCertificado, f: Fontes, logo: Img, qr: Img) {
  const p = pdf.addPage([595.28, 841.89]);
  const W = 595.28, H = 841.89;
  const lw = 120;
  p.drawImage(logo, { x: 50, y: H - 50 - (lw / logo.width) * logo.height, width: lw, height: (lw / logo.width) * logo.height });
  texto(p, `Nº ${b.numero}`, W - 50, H - 62, f.normal, 9, CINZA, "dir");
  texto(p, "COMPROVANTE DE CONCLUSÃO DE ETAPA TEÓRICA", 50, H - 120, f.negrito, 14, NAVY);
  p.drawRectangle({ x: 50, y: H - 205, width: W - 100, height: 66, color: AMBAR_FUNDO, borderColor: AMBAR, borderWidth: 0.8 });
  texto(p, "CAPACITAÇÃO INCOMPLETA", 64, H - 160, f.negrito, 11, AMBAR);
  paragrafo(p, "Pendente: atividade prática presencial obrigatória. Este comprovante registra apenas a etapa teórica concluída e não substitui o certificado de capacitação nem autoriza a execução da atividade.", 64, H - 176, W - 128, f.normal, 9.5, 12.5, TEXTO);

  const linhas: [string, string][] = [
    ["Participante", `${d.colaboradorNome} (CPF ${d.cpfMascarado})`],
    ["Treinamento", `${d.cursoCodigo} · ${d.cursoTitulo}`],
    ["Fundamentação", d.normaVersao && d.normaVersao !== "—" ? `${d.normaReferencia} (${d.normaVersao})` : d.normaReferencia],
    ["Etapa concluída", `Teoria a distância, de ${fmtData(b.dataInicio)} a ${fmtData(b.dataConclusao)}`],
    ["Avaliação teórica", d.notaAvaliacao != null ? `${d.notaAvaliacao}% de aproveitamento` : "—"],
    ["Etapa pendente", "Prática presencial com instrutor qualificado"],
    ["Emitido em", fmtDataHora(b.emitidoEm)],
  ];
  let y = H - 250;
  for (const [r, v] of linhas) {
    texto(p, r.toUpperCase(), 50, y, f.negrito, 8, CINZA);
    y = Math.min(y - 18, paragrafo(p, v, 170, y, W - 220, f.normal, 10, 13, TEXTO) - 5);
  }
  p.drawImage(qr, { x: 50, y: 60, width: 70, height: 70 });
  texto(p, `Código de verificação: ${b.codigoVerificacao}`, 132, 104, f.normal, 9, TEXTO);
  texto(p, urlVerificacao(b.codigoVerificacao), 132, 90, f.normal, 8, CINZA);
  texto(p, `${d.empresa.nome} · Grupo Palla`, 132, 76, f.normal, 8, CINZA);
  carimboStatus(p, b, f);
}
