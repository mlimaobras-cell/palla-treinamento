// Saúde e Segurança — lista-base de documentos de admissão e modelos de termo.
// Tudo aqui é CONFIGURÁVEL e passa por validação do RH, da SST e do jurídico da Palla antes do uso oficial.
// origem: LEGAL = a exigência decorre da lei citada; EMPREGADOR = critério interno; A_VALIDAR = base a confirmar.
import type { CriterioRisco } from "../schema";

export type ItemAdmissionalSeed = {
  codigo: string; nome: string; orientacao?: string; base: string;
  origem: "LEGAL" | "EMPREGADOR" | "A_VALIDAR"; obrigatorio: boolean; quemEnvia: "COLABORADOR" | "EQUIPE";
  exigeValidade?: boolean; sensivel?: boolean; funcoesCodigos?: string[] | null;
};

export const itensAdmissionaisSeed: ItemAdmissionalSeed[] = [
  { codigo: "DOC-ID", nome: "Documento de identidade com foto (RG ou CNH), frente e verso", orientacao: "Foto nítida, sem cortes, com o número do CPF visível.",
    base: "Qualificação civil no registro do empregado (CLT, art. 41)", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR" },
  { codigo: "CTPS", nome: "Carteira de Trabalho Digital (tela de contratos)", orientacao: "No app Carteira de Trabalho Digital: Contratos → print da tela.",
    base: "Rotina de admissão (CTPS digital — CLT, art. 29)", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR" },
  { codigo: "RESIDENCIA", nome: "Comprovante de residência recente", orientacao: "Conta de água, luz, telefone ou internet dos últimos 3 meses.",
    base: "Critério interno (cadastro e vale-transporte)", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR" },
  { codigo: "FOTO", nome: "Foto de rosto (para crachá)", orientacao: "Fundo claro, rosto de frente, sem boné e sem óculos escuros.",
    base: "Critério interno (identificação no canteiro)", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR" },
  { codigo: "BANCO", nome: "Dados bancários para pagamento", orientacao: "Print do app do banco com agência e conta em seu nome.",
    base: "Critério interno", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR" },
  { codigo: "ESCOLARIDADE", nome: "Comprovante de escolaridade", orientacao: "Diploma, histórico ou declaração da escola.",
    base: "Critério interno", origem: "EMPREGADOR", obrigatorio: false, quemEnvia: "COLABORADOR" },
  { codigo: "TITULO", nome: "Título de eleitor", base: "Critério interno", origem: "EMPREGADOR", obrigatorio: false, quemEnvia: "COLABORADOR" },
  { codigo: "RESERVISTA", nome: "Certificado de reservista (homens)", base: "Comprovação de quitação militar — base a confirmar com o jurídico",
    origem: "A_VALIDAR", obrigatorio: false, quemEnvia: "COLABORADOR" },
  { codigo: "DEPENDENTES", nome: "Documentos de dependentes (certidão de nascimento; vacinação ou frequência escolar)", orientacao: "Só se tiver filhos que dão direito ao salário-família.",
    base: "Salário-família, quando aplicável (Lei 8.213/1991, art. 67)", origem: "LEGAL", obrigatorio: false, quemEnvia: "COLABORADOR", sensivel: true },
  { codigo: "CNH-OPERADOR", nome: "CNH válida (categoria exigida para o equipamento)", orientacao: "Exigência do equipamento ou da contratante; confirme com a SST.",
    base: "Critério interno / exigência da contratante", origem: "EMPREGADOR", obrigatorio: true, quemEnvia: "COLABORADOR", exigeValidade: true, funcoesCodigos: ["OP_GUINDASTE", "OP_GUINDAR"] },
  { codigo: "CERT-OPERADOR", nome: "Certificados anteriores de operação (guindaste, munck, outros)", orientacao: "Foto ou PDF de cada certificado. A Segurança do Trabalho analisa; a capacitação e a autorização na Palla continuam necessárias.",
    base: "Critério interno (análise de experiência anterior)", origem: "EMPREGADOR", obrigatorio: false, quemEnvia: "COLABORADOR", funcoesCodigos: ["OP_GUINDASTE", "OP_GUINDAR", "OP_PEMT"] },
  { codigo: "VT", nome: "Declaração de opção pelo vale-transporte", orientacao: "Preenchida e assinada na admissão.",
    base: "Vale-transporte (Lei 7.418/1985 e regulamento) — confirmar o modelo com o RH", origem: "A_VALIDAR", obrigatorio: true, quemEnvia: "EQUIPE" },
  { codigo: "CONTRATO", nome: "Contrato de trabalho assinado (com cláusula de experiência, se houver)",
    base: "Contrato individual de trabalho (CLT, arts. 442 e 443; experiência: arts. 445 e 451)", origem: "LEGAL", obrigatorio: true, quemEnvia: "EQUIPE" },
  { codigo: "REGISTRO", nome: "Ficha ou livro de registro do empregado", base: "Registro do empregado (CLT, art. 41)", origem: "LEGAL", obrigatorio: true, quemEnvia: "EQUIPE" },
];

export type ModeloTermoSeed = {
  codigo: string; titulo: string; base: string; origem: "LEGAL" | "EMPREGADOR" | "A_VALIDAR";
  naAdmissao: boolean; funcoesCodigos?: string[] | null; texto: string;
};

// Marcadores substituídos na assinatura: {{nome}} {{cpf}} {{funcao}} {{obra}} {{empresa}} {{data}} {{riscos}} {{epis}}
export const modelosTermoSeed: ModeloTermoSeed[] = [
  {
    codigo: "OS-RISCOS", titulo: "Ordem de serviço e informação sobre riscos ocupacionais",
    base: "NR-1, 1.4.1, alíneas b e c (informar riscos e medidas; ordens de serviço) e 1.4.4 (na admissão e na mudança de função); direito de recusa: NR-1, 1.4.3",
    origem: "LEGAL", naAdmissao: true,
    texto: `Eu, {{nome}}, CPF {{cpf}}, contratado(a) pela {{empresa}} para a função de {{funcao}}, declaro que recebi, li (ou ouvi a leitura) e entendi esta ordem de serviço.

1. Riscos da minha função e medidas de prevenção (conforme o inventário de riscos do PGR em vigor):
{{riscos}}

2. Equipamentos de proteção individual que devo usar:
{{epis}}

3. Comprometo-me a:
- cumprir os procedimentos de segurança, as permissões de trabalho e as orientações da liderança e da Segurança do Trabalho;
- usar os EPIs apenas para a finalidade a que se destinam, conservá-los e comunicar qualquer dano;
- não executar atividade para a qual não estou capacitado(a) e autorizado(a);
- comunicar imediatamente incidentes, quase acidentes e condições inseguras.

4. Fui informado(a) de que posso interromper minha atividade quando constatar situação que, a meu ver, envolva risco grave e iminente para minha vida e saúde ou de outras pessoas, comunicando o fato imediatamente ao meu superior (NR-1, 1.4.3).

5. Sei que o descumprimento injustificado das ordens de serviço de segurança pode constituir ato faltoso (CLT, art. 158, parágrafo único).

Obra: {{obra}}. Data: {{data}}.`,
  },
  {
    codigo: "EPI-RESP", titulo: "Termo de responsabilidade pelo uso dos EPIs",
    base: "NR-6 (obrigações do trabalhador quanto ao EPI). A ficha de entrega com o número do CA de cada item continua sendo registrada separadamente.",
    origem: "LEGAL", naAdmissao: true,
    texto: `Eu, {{nome}}, CPF {{cpf}}, função {{funcao}}, declaro estar ciente de que devo:
- usar o EPI fornecido apenas para a finalidade a que se destina;
- responsabilizar-me pela guarda e conservação;
- comunicar ao empregador qualquer alteração que o torne impróprio para uso;
- cumprir as determinações do empregador sobre o uso adequado.

Sei que cada entrega de EPI é registrada na ficha de entrega, com a identificação do equipamento e do número do Certificado de Aprovação (CA), e que devo devolver o EPI danificado para troca.

EPIs previstos para a minha função:
{{epis}}

Data: {{data}}.`,
  },
  {
    codigo: "REGULAMENTO", titulo: "Recebimento do código de conduta e das regras internas da Palla",
    base: "Critério interno (regulamento da empresa)", origem: "EMPREGADOR", naAdmissao: true,
    texto: `Eu, {{nome}}, CPF {{cpf}}, declaro que recebi e tive acesso ao código de conduta e às regras internas da {{empresa}}, apresentados na integração (curso INT-01), e me comprometo a cumpri-los, incluindo as regras de acesso e permanência nas obras, a política de prevenção de acidentes e a comunicação de incidentes.

Data: {{data}}.`,
  },
  {
    codigo: "ALCOOL-DROGAS", titulo: "Ciência da política de álcool e drogas",
    base: "Critério interno (política da empresa) — texto a validar com o jurídico", origem: "A_VALIDAR", naAdmissao: true,
    texto: `Eu, {{nome}}, CPF {{cpf}}, declaro que conheço a política de álcool e drogas da {{empresa}}: é proibido trabalhar, entrar ou permanecer nas obras sob efeito de álcool ou de outras substâncias que alterem a atenção, e é proibido portar essas substâncias no ambiente de trabalho. Sei que devo informar à liderança o uso de medicamento que possa afetar minha atenção, para avaliação.

Data: {{data}}.`,
  },
  {
    codigo: "IMAGEM", titulo: "Autorização de uso de imagem (opcional)",
    base: "Direito à imagem (Código Civil, art. 20). Assinatura opcional; a recusa não traz nenhuma consequência.", origem: "LEGAL", naAdmissao: false,
    texto: `Eu, {{nome}}, CPF {{cpf}}, autorizo a {{empresa}} a usar, sem fins comerciais, fotos e vídeos em que eu apareça durante o trabalho, exclusivamente em materiais de treinamento, segurança e comunicação interna do Grupo Palla. Posso revogar esta autorização a qualquer momento, comunicando o RH.

Data: {{data}}.`,
  },
];

/** Critério de risco SUGERIDO (matriz 5×5). A NR-1 (1.5.4.4.2) exige que a organização defina e documente o próprio critério: aprovar ou ajustar. */
export const criterioPadrao: CriterioRisco = {
  severidade: [
    { valor: 1, rotulo: "Leve", descricao: "Lesão sem afastamento, primeiros socorros; desconforto passageiro" },
    { valor: 2, rotulo: "Moderada", descricao: "Lesão com afastamento curto; doença reversível" },
    { valor: 3, rotulo: "Séria", descricao: "Afastamento prolongado; doença com tratamento prolongado" },
    { valor: 4, rotulo: "Grave", descricao: "Incapacidade permanente parcial; doença irreversível" },
    { valor: 5, rotulo: "Gravíssima", descricao: "Morte ou incapacidade permanente total; múltiplas vítimas" },
  ],
  probabilidade: [
    { valor: 1, rotulo: "Rara", descricao: "Controles adequados, eficazes e mantidos; exposição eventual" },
    { valor: 2, rotulo: "Improvável", descricao: "Controles adequados, com pequenas falhas pontuais" },
    { valor: 3, rotulo: "Possível", descricao: "Controles parciais ou dependentes de comportamento" },
    { valor: 4, rotulo: "Provável", descricao: "Controles insuficientes; exposição frequente" },
    { valor: 5, rotulo: "Quase certa", descricao: "Sem controles ou controles ineficazes; exposição contínua" },
  ],
  niveis: [
    { ate: 4, nivel: "Baixo", cor: "verde", decisao: "Manter as medidas e o acompanhamento" },
    { ate: 9, nivel: "Moderado", cor: "amarelo", decisao: "Melhorar as medidas no plano de ação, com prazo definido" },
    { ate: 16, nivel: "Alto", cor: "laranja", decisao: "Prioridade no plano de ação; atividade só com medidas adicionais e PT/APR" },
    { ate: 25, nivel: "Crítico", cor: "vermelho", decisao: "Atividade não pode começar ou continuar até reduzir o risco" },
  ],
};

export function nivelDoRisco(c: CriterioRisco, sev: number, prob: number) {
  const p = sev * prob;
  return c.niveis.find((n) => p <= n.ate) ?? c.niveis[c.niveis.length - 1];
}
