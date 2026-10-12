import { modulosMiniCurso } from "./conteudo/minicurso";

// Catálogo inicial. Valores com origem LEGAL vêm do texto das NR (ver matriz legal);
// EMPREGADOR = critério interno Palla (a norma não fixa); A_VALIDAR = conferir no texto oficial antes do uso.
type CursoSeed = {
  codigo: string; titulo: string; tipo: "LEGAL" | "INTERNO" | "INTERNO_COMPLEMENTAR";
  normaReferencia: string; normaVersao: string; objetivo: string; publicoAlvo: string; preRequisitos?: string;
  conteudoProgramatico: string[]; cargaHoraria: number | null; cargaOrigem: "LEGAL" | "EMPREGADOR" | "A_VALIDAR";
  validadeMeses: number | null; validadeOrigem: "LEGAL" | "EMPREGADOR" | "A_VALIDAR"; validadeObservacao?: string;
  modalidade: "EAD" | "SEMIPRESENCIAL" | "PRESENCIAL"; exigePratica: boolean; praticaDescricao?: string;
  exigeAutorizacao?: string; exigeAptidaoAso?: string; requisitosInstrutor?: string; observacaoLegal?: string;
  notaMinima?: number; exigeDiagnostica?: boolean;
};

export const cursosSeed: CursoSeed[] = [
  {
    codigo: "INT-01", titulo: "Integração institucional Palla Construções", tipo: "INTERNO",
    normaReferencia: "Critério interno Palla; NR-1, item 1.7 (registros)", normaVersao: "NR-1 atualizada 2025",
    objetivo: "Apresentar a empresa, as regras de conduta e de segurança e o funcionamento do canteiro antes do início das atividades.",
    publicoAlvo: "Todos os colaboradores que atuarão nas obras.",
    conteudoProgramatico: [
      "Apresentação do Grupo Palla e da Palla Construções", "Missão, visão e valores", "Organização da empresa",
      "Código de conduta profissional", "Direitos e deveres dos colaboradores", "Comunicação com a liderança",
      "Organização do canteiro de obras", "Regras de acesso e permanência nas obras", "Uso de celulares no ambiente operacional",
      "Regras internas de segurança e direito de recusa", "Política de prevenção de acidentes e responsabilidades individuais e coletivas",
      "Política de álcool e drogas", "Comunicação de incidentes e quase acidentes", "Procedimentos disciplinares", "Encerramento e avaliação",
    ],
    cargaHoraria: 2, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    validadeObservacao: "Refazer também ao mudar de obra quando houver regras específicas do contratante.",
    modalidade: "EAD", exigePratica: false,
  },
  {
    codigo: "INT-02", titulo: "Orientação de segurança para visitantes e acesso eventual", tipo: "INTERNO",
    normaReferencia: "Critério interno Palla", normaVersao: "—",
    objetivo: "Orientar visitantes e colaboradores administrativos sobre riscos, rotas e regras antes de entrar no canteiro.",
    publicoAlvo: "Visitantes técnicos e colaboradores administrativos com acesso eventual.",
    conteudoProgramatico: ["Riscos do canteiro de montagem", "Rotas e áreas isoladas", "EPIs obrigatórios para visitantes", "Acompanhamento obrigatório", "Emergências"],
    cargaHoraria: 0.5, cargaOrigem: "EMPREGADOR", validadeMeses: 12, validadeOrigem: "EMPREGADOR",
    modalidade: "EAD", exigePratica: false,
  },
  {
    codigo: "NR18-BAS", titulo: "Básico em segurança do trabalho na construção (NR-18)", tipo: "LEGAL",
    normaReferencia: "NR-18, item 18.14 e Anexo I", normaVersao: "NR-18 atualizada 2026 (Portaria MTE nº 836/2026) — conferir Anexo I",
    objetivo: "Capacitar o trabalhador nos riscos da construção e nas medidas de prevenção do canteiro.",
    publicoAlvo: "Todos os trabalhadores da obra.",
    conteudoProgramatico: [
      "Riscos da construção civil", "Organização do canteiro e circulação de pessoas", "Proteções coletivas", "Equipamentos de proteção individual",
      "Máquinas e equipamentos", "Movimentação de materiais", "Escadas, andaimes e plataformas de trabalho", "Queda de materiais",
      "Escavações, quando aplicável", "Emergências", "Riscos específicos da montagem metálica",
    ],
    cargaHoraria: 4, cargaOrigem: "A_VALIDAR", validadeMeses: 24, validadeOrigem: "A_VALIDAR",
    validadeObservacao: "Periódico de 4 h a cada 2 anos segundo o manual CBIC (2021); confirmar no texto vigente.",
    modalidade: "PRESENCIAL", exigePratica: false,
    observacaoLegal: "Valores do Anexo I a conferir no texto alterado pela Portaria MTE nº 836/2026, inclusive a modalidade.",
  },
  {
    codigo: "NR06-EPI", titulo: "Equipamentos de Proteção Individual (NR-6)", tipo: "LEGAL",
    normaReferencia: "NR-6, itens 6.5.1 b, 6.7.1 e 6.7.2", normaVersao: "NR-6 atualizada 2025 (Portaria MTE nº 57/2025)",
    objetivo: "Orientar e treinar sobre seleção, uso, ajuste, inspeção, conservação e limitações dos EPIs.",
    publicoAlvo: "Todos os trabalhadores expostos a riscos que exigem EPI.",
    conteudoProgramatico: [
      "Conceito de EPI e Certificado de Aprovação", "Responsabilidades do empregador e do trabalhador", "Seleção dos equipamentos",
      "Inspeção antes do uso, ajuste e conservação", "Substituição e limitações de proteção", "Capacete, óculos e protetor auditivo",
      "Luvas e calçados", "Proteção respiratória", "Cinturões de segurança",
    ],
    cargaHoraria: 2, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    validadeObservacao: "A NR-6 não fixa carga nem periodicidade; valores definidos pela Palla.",
    modalidade: "EAD", exigePratica: true, praticaDescricao: "Ajuste e inspeção dos EPIs da função, acompanhados pelo instrutor (NR-6, 6.7.2.1).",
  },
  {
    codigo: "NR35-ALT", titulo: "Trabalho em altura (NR-35)", tipo: "LEGAL",
    normaReferencia: "NR-35, itens 35.4.1 a 35.4.5", normaVersao: "NR-35 atualizada (Portaria MTE nº 1.259/2026)",
    objetivo: "Capacitar para o trabalho em altura com análise de risco, sistemas de proteção contra quedas e resposta a emergências.",
    publicoAlvo: "Trabalhadores que executam atividades acima de 2 m do nível inferior com risco de queda.",
    preRequisitos: "ASO com aptidão para trabalho em altura.",
    conteudoProgramatico: [
      "Normas e regulamentos aplicáveis ao trabalho em altura", "Análise de risco e condições impeditivas",
      "Riscos potenciais inerentes ao trabalho em altura e medidas de prevenção e controle",
      "Sistemas, equipamentos e procedimentos de proteção coletiva",
      "EPI para trabalho em altura: seleção, inspeção, conservação e limitação de uso",
      "Acidentes típicos em trabalhos em altura",
      "Condutas em situações de emergência, incluindo noções de técnicas de resgate e primeiros socorros",
      "Ancoragens, linhas de vida, talabartes, trava-quedas, fator de queda e zona livre de queda",
    ],
    cargaHoraria: 8, cargaOrigem: "LEGAL", validadeMeses: 24, validadeOrigem: "LEGAL",
    validadeObservacao: "Periódico de 8 h a cada 2 anos (NR-35, 35.4.2.2).",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "Treinamento teórico e prático, presencial (NR-35, 35.4.2 e 35.4.5).",
    exigeAutorizacao: "Trabalho em altura (NR-35)", exigeAptidaoAso: "altura",
    requisitosInstrutor: "Proficiência comprovada no assunto, sob responsabilidade de profissional qualificado ou legalmente habilitado em segurança no trabalho (NR-35, 35.4.3).",
    observacaoLegal: "Somente presencial (35.4.5). A plataforma registra a turma presencial e guarda material de apoio; conteúdo online não conta como carga horária.",
  },
  {
    codigo: "NR11-SIN", titulo: "Sinaleiro e amarrador de cargas", tipo: "LEGAL",
    normaReferencia: "NR-18, Anexo I; NR-11", normaVersao: "NR-18 atualizada 2026 — conferir Anexo I",
    objetivo: "Capacitar para amarração de cargas e sinalização de operações de içamento.",
    publicoAlvo: "Sinaleiros e amarradores de cargas.",
    conteudoProgramatico: [
      "Movimentação de materiais e responsabilidades", "Inspeção de acessórios: cintas, cabos de aço, manilhas e ganchos",
      "Pontos de içamento e centro de gravidade", "Capacidade de carga e ângulo de lingada", "Plano de rigging",
      "Isolamento de áreas", "Comunicação por sinais e por rádio", "Prevenção de acidentes",
    ],
    cargaHoraria: 16, cargaOrigem: "A_VALIDAR", validadeMeses: 24, validadeOrigem: "A_VALIDAR",
    validadeObservacao: "Periódico a cada 2 anos com carga definida pelo empregador, segundo o manual CBIC (2021); confirmar.",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "Amarração, inspeção de acessórios e sinalização em içamento real ou simulado.",
    exigeAutorizacao: "Sinaleiro/amarrador de cargas",
  },
  {
    codigo: "NR11-AUX", titulo: "Movimentação de cargas para auxiliares de montagem", tipo: "INTERNO_COMPLEMENTAR",
    normaReferencia: "Critério interno Palla; complementa NR-11 e NR-18", normaVersao: "—",
    objetivo: "Preparar ajudantes e montadores para atuar com segurança nas proximidades de içamentos.",
    publicoAlvo: "Ajudantes, montadores e encarregados.",
    conteudoProgramatico: ["Riscos da carga suspensa", "Isolamento e posicionamento seguro", "Corda guia", "Sinais padronizados e parada de emergência", "Inspeção visual de acessórios"],
    cargaHoraria: 3, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    modalidade: "EAD", exigePratica: true, praticaDescricao: "Uso de corda guia e posicionamento em içamento acompanhado.",
    observacaoLegal: "Não habilita sinaleiro, amarrador nem operador.",
  },
  {
    codigo: "NR18-GUI", titulo: "Operador de equipamentos de guindar (guindaste compacto e talhas)", tipo: "LEGAL",
    normaReferencia: "NR-18, Anexo I; NR-12, Anexo II", normaVersao: "NR-18 atualizada 2026; NR-12 atualizada 2025",
    objetivo: "Capacitar para a operação segura do equipamento específico de guindar usado na obra.",
    publicoAlvo: "Operadores de guindastes compactos e talhas.",
    conteudoProgramatico: [
      "Riscos do equipamento e proteções", "Estabilização e patolamento", "Capacidade operacional e tabelas de carga",
      "Inspeção diária", "Limitações do equipamento", "Operação segura", "Comunicação com o sinaleiro", "Avaliação prática",
    ],
    cargaHoraria: null, cargaOrigem: "A_VALIDAR", validadeMeses: 24, validadeOrigem: "A_VALIDAR",
    validadeObservacao: "Carga definida pelo empregador com no mínimo 50% prática e periódico a cada 2 anos, segundo o manual CBIC (2021); confirmar.",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "Operação supervisionada no próprio equipamento, por modelo.",
    exigeAutorizacao: "Operação de equipamento de guindar",
    observacaoLegal: "Capacitação específica por equipamento. Um curso genérico não habilita para todos os modelos.",
  },
  {
    codigo: "NR18-PEMT", titulo: "Operador de plataforma elevatória (PEMT)", tipo: "LEGAL",
    normaReferencia: "NR-18, Anexo I", normaVersao: "NR-18 atualizada 2026 — conferir Anexo I",
    objetivo: "Capacitar para a operação segura de plataformas elevatórias móveis de trabalho.",
    publicoAlvo: "Operadores de PEMT.",
    conteudoProgramatico: ["Tipos de PEMT: tesoura e articulada", "Inspeção diária e dispositivos de segurança", "Terreno, rede elétrica, vento e carga máxima", "Ancoragem do cinto na cesta", "Operação e emergência"],
    cargaHoraria: 4, cargaOrigem: "A_VALIDAR", validadeMeses: 24, validadeOrigem: "A_VALIDAR",
    validadeObservacao: "Conteúdo conforme norma técnica nacional vigente; periódico de 4 h a cada 2 anos segundo o manual CBIC (2021); confirmar.",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "Operação no modelo usado na obra, com avaliação operacional.",
    exigeAutorizacao: "Operação de PEMT",
  },
  {
    codigo: "NR12-MAQ", titulo: "Segurança em máquinas e equipamentos (NR-12)", tipo: "LEGAL",
    normaReferencia: "NR-12, item 12.16 e Anexo II", normaVersao: "NR-12 atualizada 2025",
    objetivo: "Capacitar para operar e intervir com segurança em máquinas, ferramentas elétricas e equipamentos de corte e solda.",
    publicoAlvo: "Trabalhadores que operam, inspecionam ou fazem intervenções em máquinas.",
    conteudoProgramatico: [
      "Riscos mecânicos, elétricos e outros riscos relevantes", "Partes móveis e proteções", "Funcionamento das proteções e por que existem",
      "Quando e por quem uma proteção pode ser removida", "O que fazer com proteção danificada", "Princípios de segurança na utilização",
      "Método de trabalho seguro e permissão de trabalho", "Bloqueio de energias perigosas", "Esmerilhadeiras, furadeiras, equipamentos de corte e máquinas de solda",
    ],
    cargaHoraria: 4, cargaOrigem: "EMPREGADOR", validadeMeses: null, validadeOrigem: "EMPREGADOR",
    validadeObservacao: "A NR-12 não fixa periodicidade: reciclagem sempre que mudar máquina, método ou processo (12.16.8).",
    modalidade: "SEMIPRESENCIAL", exigePratica: true, praticaDescricao: "Etapa prática supervisionada e documentada na máquina (Anexo II, 1.1.1).",
    exigeAutorizacao: "Operação de máquinas e ferramentas (NR-12)",
    requisitosInstrutor: "Trabalhador qualificado sob supervisão de profissional legalmente habilitado (12.16.3 e).",
    observacaoLegal: "Válido apenas para o empregador que capacitou (12.16.6). Carga mínima a ser definida e documentada pelo profissional habilitado.",
  },
  {
    codigo: "NR23-INC", titulo: "Prevenção e combate a incêndios (informativo)", tipo: "LEGAL",
    normaReferencia: "NR-23, item 23.3.2", normaVersao: "NR-23 atualizada 2022 (Portaria MTP nº 2.769/2022)",
    objetivo: "Informar sobre uso de equipamentos de combate, procedimentos de emergência, abandono e alarmes.",
    publicoAlvo: "Todos os trabalhadores.",
    conteudoProgramatico: ["Princípios do fogo e classes de incêndio", "Agentes extintores e uso de extintores", "Identificação de riscos e prevenção", "Rotas de fuga e abandono de área", "Alarmes e comunicação de emergência", "Procedimentos iniciais"],
    cargaHoraria: 2, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    validadeObservacao: "A NR-23 não fixa carga nem periodicidade.",
    modalidade: "EAD", exigePratica: false,
    observacaoLegal: "Não é formação de brigadista; brigada segue a legislação estadual e as normas técnicas aplicáveis.",
  },
  {
    codigo: "NR17-ERG", titulo: "Ergonomia na montagem metálica", tipo: "LEGAL",
    normaReferencia: "NR-17, item 17.5.5", normaVersao: "NR-17 atualizada 2023",
    objetivo: "Orientar sobre levantamento, transporte e deposição de cargas e prevenção de lesões.",
    publicoAlvo: "Trabalhadores designados para transporte manual de cargas.",
    conteudoProgramatico: ["Posturas de trabalho", "Levantamento, carregamento e deposição de cargas", "Transporte manual", "Movimentos repetitivos", "Organização das atividades", "Prevenção de lesões na montagem metálica"],
    cargaHoraria: 1, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    modalidade: "EAD", exigePratica: false,
  },
  {
    codigo: "NR26-SIN", titulo: "Sinalização de segurança e produtos químicos (NR-26)", tipo: "LEGAL",
    normaReferencia: "NR-26, item 26.5.2", normaVersao: "NR-26 (Portaria MTE nº 704/2015)",
    objetivo: "Capacitar para compreender a sinalização, a rotulagem preventiva e a ficha com dados de segurança dos produtos químicos.",
    publicoAlvo: "Trabalhadores que utilizam produtos químicos e todos os que circulam no canteiro.",
    conteudoProgramatico: ["Sinalização de advertência, proibição e obrigação", "Identificação de áreas isoladas", "Rotulagem preventiva", "Ficha com dados de segurança (FDS)", "Perigos, riscos e medidas de uso seguro", "Procedimentos de emergência com produtos químicos"],
    cargaHoraria: 1, cargaOrigem: "EMPREGADOR", validadeMeses: 24, validadeOrigem: "EMPREGADOR",
    modalidade: "EAD", exigePratica: false,
  },
  {
    codigo: "NR33-TAV", titulo: "Espaço confinado — trabalhador autorizado e vigia (NR-33)", tipo: "LEGAL",
    normaReferencia: "NR-33, item 33.6 e Anexo III", normaVersao: "NR-33 atualizada 2022 (Portaria SEPRT nº 1.690/2022)",
    objetivo: "Capacitar trabalhadores autorizados e vigias para entrada e trabalho seguro em espaços confinados.",
    publicoAlvo: "Trabalhadores autorizados e vigias.",
    conteudoProgramatico: ["Conteúdo conforme Anexo III da NR-33 [a detalhar pelo responsável técnico]"],
    cargaHoraria: 16, cargaOrigem: "LEGAL", validadeMeses: 12, validadeOrigem: "LEGAL",
    validadeObservacao: "Periódico anual de 8 h (NR-33, Anexo III).",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "No mínimo 50% da carga em atividades práticas (Anexo III, 1.2).",
    exigeAutorizacao: "Entrada em espaço confinado (NR-33)", exigeAptidaoAso: "confinado",
    requisitosInstrutor: "Proficiência comprovada (33.6.4); coordenação do responsável técnico (33.3.2 f).",
    observacaoLegal: "Certificado deve indicar o tipo de espaço confinado e as atividades, com anuência do responsável técnico (33.6.5). Modalidade EAD da parte teórica a confirmar.",
  },
  {
    codigo: "NR33-SUP", titulo: "Espaço confinado — supervisor de entrada (NR-33)", tipo: "LEGAL",
    normaReferencia: "NR-33, item 33.6 e Anexo III", normaVersao: "NR-33 atualizada 2022 (Portaria SEPRT nº 1.690/2022)",
    objetivo: "Capacitar supervisores de entrada em espaços confinados.",
    publicoAlvo: "Supervisores de entrada.",
    conteudoProgramatico: ["Conteúdo conforme Anexo III da NR-33 [a detalhar pelo responsável técnico]"],
    cargaHoraria: 40, cargaOrigem: "LEGAL", validadeMeses: 12, validadeOrigem: "LEGAL",
    validadeObservacao: "Periódico anual de 8 h (NR-33, Anexo III).",
    modalidade: "PRESENCIAL", exigePratica: true, praticaDescricao: "No mínimo 50% da carga em atividades práticas (Anexo III, 1.2).",
    exigeAutorizacao: "Supervisor de entrada em espaço confinado (NR-33)", exigeAptidaoAso: "confinado",
  },
  ...[
    ["PAL-51", "Montagem de estruturas metálicas", 8, ["Recebimento de materiais", "Identificação de peças", "Conferência de desenhos", "Armazenamento", "Planejamento de montagem", "Sequência executiva", "Estabilidade provisória", "Içamento", "Posicionamento", "Alinhamento e nivelamento", "Ligações parafusadas", "Soldagem", "Inspeção", "Liberação das etapas"], "Montagem acompanhada na frente de serviço.", "Complementa ABNT NBR 8800 (referência técnica)."],
    ["PAL-52", "Segurança na montagem metálica", 2, ["Riscos de esmagamento", "Queda de peças", "Instabilidade estrutural", "Trabalho em altura na montagem", "Interferência entre equipes", "Movimentação suspensa", "Isolamento", "Comunicação operacional"], "Inspeção da frente de montagem: isolamento, estabilidade provisória e simulação de comunicação de içamento.", "Complementa NR-18 e NR-35; não as substitui."],
    ["PAL-53", "Operação segura de plataformas elevatórias — familiarização por modelo", 2, ["Modelo usado na obra: comandos e dispositivos", "Inspeção diária do modelo", "Limitações e tabela de carga", "Avaliação operacional"], "Avaliação operacional no modelo da obra.", "Complementa a capacitação NR-18 de operador de PEMT; não a substitui."],
    ["PAL-54", "Operação segura de guindastes compactos — familiarização por modelo", 4, ["Estabilização", "Capacidade operacional", "Tabelas de carga do modelo", "Inspeção", "Limitações", "Operação segura", "Comunicação", "Avaliação prática"], "Operação supervisionada no modelo da obra.", "Complementa a capacitação de operador de equipamento de guindar; não a substitui."],
    ["PAL-55", "Segurança em atividades de soldagem e corte", 4, ["Riscos elétricos e térmicos", "Fumos metálicos", "Radiação", "Incêndio", "Cilindros de gases", "Proteções coletivas", "EPIs", "Permissão de trabalho a quente, quando exigida"], "Preparação da área de trabalho a quente e inspeção do conjunto de solda e oxicorte.", "Complementa NR-12, NR-18 e NR-6."],
    ["PAL-56", "Utilização segura de ferramentas", 3, ["Esmerilhadeiras", "Furadeiras", "Parafusadeiras", "Chaves de impacto", "Ferramentas de torque", "Equipamentos de corte"], "Inspeção e uso supervisionado das ferramentas da função.", "Complementa NR-12."],
    ["PAL-57", "Leitura e interpretação de projetos de montagem", 4, ["Plantas", "Cortes", "Elevações", "Eixos", "Níveis", "Identificação de peças", "Detalhes de ligações", "Sequências de montagem"], "Localizar peças do projeto na obra e conferir posição e ligação.", "Sem norma específica."],
  ].map(([codigo, titulo, carga, conteudo, pratica, obs]) => ({
    codigo: codigo as string,
    titulo: titulo as string,
    tipo: (codigo === "PAL-51" || codigo === "PAL-57" ? "INTERNO" : "INTERNO_COMPLEMENTAR") as CursoSeed["tipo"],
    normaReferencia: `Capacitação interna Palla Construções. ${obs as string}`,
    normaVersao: "—",
    objetivo: `Capacitar as equipes de montagem em ${(titulo as string).toLowerCase()}, no padrão Palla.`,
    publicoAlvo: "Equipes de montagem conforme matriz por função.",
    conteudoProgramatico: conteudo as string[],
    cargaHoraria: carga as number, cargaOrigem: "EMPREGADOR" as const,
    validadeMeses: 24, validadeOrigem: "EMPREGADOR" as const,
    modalidade: "SEMIPRESENCIAL" as const, exigePratica: true, praticaDescricao: pratica as string,
  })),
];

// Mini curso de montagem metálica (M1–M8): diagnóstica online → videoaula → avaliação final → prática com instrutor.
cursosSeed.push(...modulosMiniCurso.map((m, i): CursoSeed => ({
  codigo: m.codigo,
  titulo: `Mini curso M${i + 1} — ${m.titulo}`,
  tipo: "INTERNO",
  normaReferencia: `Capacitação interna Palla Construções. ${m.referencias}.`,
  normaVersao: "Caderno do instrutor do módulo, revisão 2 (em revisão técnica)",
  objetivo: `Desenvolver as competências do módulo ${i + 1} (${m.titulo.toLowerCase()}) para as equipes de montagem de estruturas metálicas, no padrão Palla.`,
  publicoAlvo: m.publico,
  conteudoProgramatico: [`Conteúdo do Caderno do Módulo ${i + 1} — ${m.titulo}`, "Videoaula online com legendas", "Avaliação diagnóstica (antes) e avaliação final (depois)", "Parte presencial com o instrutor e ficha de avaliação prática"],
  cargaHoraria: m.horas, cargaOrigem: "EMPREGADOR",
  validadeMeses: null, validadeOrigem: "EMPREGADOR",
  validadeObservacao: "Capacitação interna sem prazo legal. Reciclagem a critério da Palla (mudança de procedimento, de função ou após afastamento) — definir antes do uso oficial.",
  modalidade: "SEMIPRESENCIAL", exigePratica: true,
  praticaDescricao: `Parte presencial com o instrutor e ficha de avaliação prática do Caderno do Módulo ${i + 1}.`,
  observacaoLegal: "A carga horária total inclui a parte presencial com o instrutor; a videoaula online é parte da teoria. Não substitui treinamentos exigidos pelas NRs.",
  exigeDiagnostica: true,
})));

export const funcoesSeed: [string, string][] = [
  ["AJUDANTE", "Ajudante de montagem"],
  ["MONTADOR", "Montador de estruturas metálicas"],
  ["SOLDADOR", "Soldador"],
  ["SINALEIRO", "Sinaleiro de movimentação de cargas"],
  ["OP_PEMT", "Operador de plataforma elevatória"],
  ["OP_GUINDASTE", "Operador de guindaste compacto"],
  ["ENCARREGADO", "Encarregado de montagem"],
  ["SUPERVISOR", "Supervisor de montagem"],
  ["TST", "Técnico de Segurança do Trabalho"],
  ["ENGENHEIRO", "Engenheiro de obras"],
  ["VISITANTE", "Visitante técnico"],
  ["ADMINISTRATIVO", "Colaborador administrativo com acesso eventual à obra"],
];

// O = obrigatório, I = interno, R = recomendado, C = condicional
const M = { O: "OBRIGATORIO", I: "INTERNO", R: "RECOMENDADO", C: "CONDICIONAL" } as const;
type L = keyof typeof M;
const linha = (pares: Record<string, L>) => Object.entries(pares).map(([c, l]) => [c, M[l]] as const);

// Trilhas do mini curso (critério interno, conforme o plano de produção do curso).
export const matrizMiniCurso: Record<string, Record<string, L>> = {
  AJUDANTE: { "MC-M1": "I", "MC-M2": "I", "MC-M3": "I", "MC-M7": "I" },
  SOLDADOR: { "MC-M1": "I", "MC-M2": "I", "MC-M5": "I", "MC-M7": "I" },
  MONTADOR: { "MC-M1": "I", "MC-M2": "I", "MC-M3": "I", "MC-M4": "I", "MC-M5": "I", "MC-M7": "I", "MC-M8": "R" },
  ENCARREGADO: { "MC-M1": "I", "MC-M2": "I", "MC-M3": "I", "MC-M4": "I", "MC-M5": "I", "MC-M6": "I", "MC-M7": "I", "MC-M8": "R" },
};

const matrizBase: Record<string, ReturnType<typeof linha>> = {
  AJUDANTE: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "O", "NR11-AUX": "R", "NR12-MAQ": "C", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "NR33-TAV": "C", "PAL-51": "I", "PAL-52": "I", "PAL-56": "I" }),
  MONTADOR: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "O", "NR11-AUX": "R", "NR12-MAQ": "O", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "NR33-TAV": "C", "PAL-51": "I", "PAL-52": "I", "PAL-56": "I", "PAL-57": "I" }),
  SOLDADOR: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR12-MAQ": "O", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "O", "NR33-TAV": "C", "PAL-52": "I", "PAL-55": "I" }),
  SINALEIRO: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR11-SIN": "O", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "PAL-52": "I" }),
  OP_PEMT: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "O", "NR18-PEMT": "O", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "PAL-52": "I", "PAL-53": "I" }),
  OP_GUINDASTE: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR18-GUI": "O", "NR12-MAQ": "O", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "PAL-52": "I", "PAL-54": "I" }),
  ENCARREGADO: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "O", "NR11-AUX": "O", "NR12-MAQ": "R", "NR23-INC": "O", "NR17-ERG": "O", "NR26-SIN": "R", "NR33-SUP": "C", "PAL-51": "I", "PAL-52": "I", "PAL-57": "I" }),
  SUPERVISOR: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR11-AUX": "R", "NR12-MAQ": "R", "NR23-INC": "O", "NR17-ERG": "R", "NR26-SIN": "R", "NR33-SUP": "C", "PAL-51": "I", "PAL-52": "I", "PAL-57": "I" }),
  TST: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR11-AUX": "R", "NR12-MAQ": "R", "NR23-INC": "O", "NR17-ERG": "R", "NR26-SIN": "O", "NR33-SUP": "C", "PAL-52": "R" }),
  ENGENHEIRO: linha({ "INT-01": "I", "NR18-BAS": "O", "NR06-EPI": "O", "NR35-ALT": "C", "NR11-AUX": "R", "NR12-MAQ": "R", "NR23-INC": "O", "NR17-ERG": "R", "NR26-SIN": "R", "NR33-SUP": "C", "PAL-51": "R", "PAL-57": "R" }),
  VISITANTE: linha({ "INT-02": "I" }),
  ADMINISTRATIVO: linha({ "INT-02": "I", "NR18-BAS": "C", "NR23-INC": "O", "NR17-ERG": "R" }),
};

export const matrizSeed: Record<string, ReturnType<typeof linha>> = Object.fromEntries(
  Object.entries(matrizBase).map(([f, l]) => [f, [...l, ...linha(matrizMiniCurso[f] ?? {})]]),
);
