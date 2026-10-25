// Biblioteca Palla de ambientes e atividades — perigos típicos para o inventário de riscos (NR-1, 1.5.7.3.2).
// PONTO DE PARTIDA, NÃO É O PGR: cada obra é avaliada no local pelo profissional legalmente habilitado (NR-18, 18.4.2),
// que confirma, ajusta ou exclui cada linha. Severidade (S) e probabilidade (P) são sugestões na escala 1–5 do critério padrão.
// "examesSugeridos" é apenas sugestão para o médico do PCMSO avaliar (NR-7): nunca vira exigência automática.
type Cat = "FISICO" | "QUIMICO" | "BIOLOGICO" | "ERGONOMICO" | "PSICOSSOCIAL" | "ACIDENTE";
export type PerigoSeed = { categoria: Cat; perigo: string; fonte: string; lesoes: string; medidas: string; s: number; p: number; exames?: string; cursos?: string; ref?: string };
export type AmbienteSeed = { codigo: string; nome: string; descricao: string; atividades: string; perigos: PerigoSeed[] };

const PSICO_OBRA: PerigoSeed[] = [
  { categoria: "PSICOSSOCIAL", perigo: "Pressão por prazo e ritmo intenso", fonte: "Cronograma de montagem, janelas de içamento, metas de produção", lesoes: "Estresse, fadiga, aumento de erros e de acidentes", medidas: "Planejamento com folga; DDS; liderança orientada a não apressar etapas críticas; direito de recusa divulgado", s: 3, p: 3, ref: "NR-1, 1.5.3.1.4; NR-17" },
  { categoria: "PSICOSSOCIAL", perigo: "Jornadas prolongadas e trabalho longe de casa", fonte: "Obras em outras cidades, alojamento, horas extras", lesoes: "Fadiga, distúrbios do sono, sofrimento psíquico", medidas: "Controle de jornada e descanso; condições de alojamento (NR-18, NR-24); canal de escuta", s: 3, p: 3, ref: "NR-1, 1.5.3.1.4; NR-17" },
  { categoria: "PSICOSSOCIAL", perigo: "Conflitos, assédio ou violência no trabalho", fonte: "Relações entre equipes, liderança e terceiros", lesoes: "Sofrimento psíquico, afastamento", medidas: "Código de conduta; canal de denúncia; treinamento de liderança; apuração (NR-1, 1.4.1.1)", s: 3, p: 2, ref: "NR-1, 1.4.1.1 e 1.5.3.1.4" },
];

export const bibliotecaSeed: AmbienteSeed[] = [
  {
    codigo: "CANTEIRO-MONT", nome: "Canteiro de montagem de estrutura metálica — área geral",
    descricao: "Circulação, recebimento e estocagem de peças, frentes de montagem e convivência com outras equipes.",
    atividades: "Recebimento e conferência de peças; estocagem; circulação; preparação de frentes; interface com outras equipes e máquinas",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Atropelamento ou prensamento por máquinas e veículos", fonte: "Caminhões, guindastes, PEMT e empilhadeiras em manobra", lesoes: "Politraumatismo, morte", medidas: "Plano de circulação; vias segregadas; sinaleiro em manobras; colete refletivo; alarme de ré", s: 5, p: 2, cursos: "NR18-BAS; PAL-52" },
      { categoria: "ACIDENTE", perigo: "Queda de peças estocadas ou tombamento de pilhas", fonte: "Perfis e chapas empilhados sem calço ou travamento", lesoes: "Esmagamento de membros, fraturas", medidas: "Estocagem sobre calços, altura limitada, travamento; isolamento da área; inspeção", s: 4, p: 2, cursos: "PAL-51" },
      { categoria: "ACIDENTE", perigo: "Queda no mesmo nível e torção", fonte: "Terreno irregular, sobras de material, cabos, lama", lesoes: "Entorse, fraturas, contusões", medidas: "Organização e limpeza (5S); iluminação; calçado de segurança; rotas definidas", s: 2, p: 3 },
      { categoria: "FISICO", perigo: "Radiação solar e calor", fonte: "Trabalho a céu aberto", lesoes: "Queimadura solar, desidratação, exaustão térmica; câncer de pele a longo prazo", medidas: "Hidratação; pausas em sombra; protetor solar; roupa de manga longa; programação de tarefas pesadas fora do pico de calor", s: 3, p: 3, exames: "A critério do médico: avaliação clínica dermatológica", ref: "NR-21; NR-15 Anexo 3 (avaliação de calor)" },
      { categoria: "FISICO", perigo: "Ruído", fonte: "Chaves de impacto, esmerilhadeiras, geradores, máquinas", lesoes: "Perda auditiva induzida por ruído, zumbido", medidas: "Avaliação quantitativa de ruído; enclausurar ou afastar fontes; protetor auditivo com CA; rodízio", s: 3, p: 3, exames: "Audiometria conforme NR-7, Anexo II, se a avaliação indicar exposição", ref: "NR-15 Anexo 1; NR-7 Anexo II" },
      { categoria: "ACIDENTE", perigo: "Descarga atmosférica e ventos fortes", fonte: "Tempestades durante a montagem", lesoes: "Eletrocussão, queda, morte", medidas: "Monitoramento meteorológico; critério de paralisação definido na APR; abrigo", s: 5, p: 2, ref: "NR-18 (condições climáticas); APR" },
      ...PSICO_OBRA,
    ],
  },
  {
    codigo: "ALTURA", nome: "Trabalho em altura — estrutura, PEMT e andaimes",
    descricao: "Atividades acima de 2,00 m do nível inferior com risco de queda (NR-35), na estrutura, em PEMT ou em andaime.",
    atividades: "Montagem e aparafusamento de vigas e terças; uso de PEMT; montagem e uso de andaimes; instalação de linhas de vida",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Queda de pessoa de altura", fonte: "Bordas, vãos, deslocamento na estrutura, falha ou ausência de ancoragem", lesoes: "Politraumatismo, morte", medidas: "Planejamento e APR; proteção coletiva; SPIQ com ancoragem projetada; cinto paraquedista com talabarte duplo; PT; trabalhador capacitado e autorizado; plano de resgate", s: 5, p: 3, exames: "Aptidão para trabalho em altura no ASO (NR-35); exames a critério do médico", cursos: "NR35-ALT", ref: "NR-35; NR-18" },
      { categoria: "ACIDENTE", perigo: "Queda de materiais e ferramentas", fonte: "Parafusos, ferramentas e peças soltas em altura", lesoes: "Traumatismo craniano e outras lesões em quem está embaixo", medidas: "Isolamento e sinalização da área abaixo; ferramentas amarradas; bolsas porta-ferramentas; capacete com jugular", s: 4, p: 3, cursos: "PAL-52" },
      { categoria: "ACIDENTE", perigo: "Tombamento ou esmagamento com PEMT", fonte: "Piso irregular, sobrecarga, vento, prensamento contra a estrutura", lesoes: "Esmagamento, morte", medidas: "Operador capacitado; inspeção pré-uso; respeitar capacidade e vento máximo do fabricante; piso nivelado; cinto ancorado no ponto da cesta", s: 5, p: 2, cursos: "NR18-PEMT; PAL-53", ref: "NR-18 (PEMT); manual do fabricante" },
      { categoria: "ACIDENTE", perigo: "Colapso de andaime", fonte: "Montagem incorreta, base sem apoio, sobrecarga", lesoes: "Queda, esmagamento, morte", medidas: "Projeto/especificação do fabricante; montagem por equipe capacitada; liberação documentada; inspeção diária", s: 5, p: 2, ref: "NR-18 (andaimes)" },
      { categoria: "ACIDENTE", perigo: "Suspensão inerte após queda retida", fonte: "Trabalhador suspenso no cinto sem resgate rápido", lesoes: "Síndrome da suspensão, morte", medidas: "Plano de emergência e resgate com equipe e equipamentos disponíveis (NR-35); simulados", s: 5, p: 2, cursos: "NR35-ALT" },
      { categoria: "ERGONOMICO", perigo: "Posturas forçadas em altura", fonte: "Trabalho acima da cabeça, agachado na estrutura, uso prolongado do cinto", lesoes: "Lombalgia, distúrbios osteomusculares", medidas: "Planejamento de acesso (PEMT x estrutura); pausas; rodízio", s: 2, p: 3, cursos: "NR17-ERG" },
    ],
  },
  {
    codigo: "ICAMENTO", nome: "Içamento e movimentação de cargas",
    descricao: "Içamento de peças com guindaste, guindaste compacto, caminhão munck ou talha; amarração e sinalização.",
    atividades: "Amarração (rigging); sinalização; operação de guindaste; guia de cargas com cordas; posicionamento de peças",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Queda da carga suspensa", fonte: "Acessórios danificados ou subdimensionados, amarração incorreta, centro de gravidade mal avaliado", lesoes: "Esmagamento, morte", medidas: "Plano de rigging; inspeção de cintas, cabos, manilhas e ganchos; ninguém sob carga suspensa; isolamento do raio de ação", s: 5, p: 2, cursos: "NR11-AUX; NR11-SIN", ref: "NR-11; NR-18 (movimentação e transporte de materiais)" },
      { categoria: "ACIDENTE", perigo: "Tombamento do guindaste", fonte: "Patolamento em solo sem capacidade, excesso de carga ou de raio, vento", lesoes: "Esmagamento, morte de várias pessoas", medidas: "Tabela de carga; patolas totalmente estendidas com calços; avaliação do solo; limite de vento do fabricante; operador habilitado", s: 5, p: 2, cursos: "NR18-GUI; PAL-54" },
      { categoria: "ACIDENTE", perigo: "Prensamento de mãos e corpo entre carga e estrutura", fonte: "Guia da peça com as mãos no posicionamento", lesoes: "Amputação, esmagamento", medidas: "Cordas-guia; nunca colocar mão entre carga e estrutura; comunicação por sinais/rádio padronizada", s: 4, p: 3, cursos: "NR11-AUX; NR11-SIN" },
      { categoria: "ACIDENTE", perigo: "Contato com rede elétrica aérea", fonte: "Lança ou carga próxima de redes energizadas", lesoes: "Eletrocussão, morte", medidas: "Levantamento de interferências; distância de segurança da concessionária; desligamento; vigia dedicado", s: 5, p: 2, ref: "NR-10 (zona de risco) e NR-18" },
      { categoria: "PSICOSSOCIAL", perigo: "Falha de comunicação entre operador e sinaleiro", fonte: "Ruído, sinais não padronizados, mais de um sinaleiro", lesoes: "Acidentes com carga suspensa", medidas: "Um único sinaleiro identificado; código de sinais padronizado; rádio com canal exclusivo", s: 4, p: 2, cursos: "NR11-SIN" },
    ],
  },
  {
    codigo: "MUNCK", nome: "Caminhão guindauto (munck)",
    descricao: "Içamento de peças com guindaste articulado montado em caminhão, no canteiro e em pátios; inclui o deslocamento do caminhão.",
    atividades: "Patolamento; içamento e descarga de peças; posicionamento; recolhimento da lança; condução do caminhão",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Tombamento do caminhão guindauto", fonte: "Patolas não estendidas, solo sem capacidade, borda de vala ou talude, carga acima da tabela para o raio", lesoes: "Esmagamento, morte", medidas: "Avaliação do solo e calços; patolas totalmente estendidas; caminhão nivelado; tabela de carga por raio; limitador de momento operante; plano de cargas", s: 5, p: 2, cursos: "NR18-MUNCK", ref: "NR-18, 18.10.1.16 a 18.10.1.24" },
      { categoria: "ACIDENTE", perigo: "Contato da lança com rede elétrica aérea", fonte: "Içamento ou deslocamento com a lança próxima de redes energizadas", lesoes: "Eletrocussão do operador e de quem toca o caminhão, morte", medidas: "Levantamento de interferências; distância de segurança da concessionária ou desligamento; vigia dedicado; ninguém encostado no caminhão durante o içamento", s: 5, p: 2, cursos: "NR18-MUNCK", ref: "NR-10 (zona de risco); NR-18" },
      { categoria: "ACIDENTE", perigo: "Queda da carga ou de parte dela", fonte: "Amarração inadequada, acessórios danificados, movimento brusco", lesoes: "Esmagamento, morte", medidas: "Sinaleiro/amarrador capacitado; inspeção dos acessórios; isolamento do raio de ação; ninguém sob carga suspensa", s: 5, p: 2, cursos: "NR11-SIN; NR18-MUNCK" },
      { categoria: "ACIDENTE", perigo: "Queda ao subir ou descer da carroceria e do posto de comando", fonte: "Degraus e plataforma molhados ou sujos; pular da carroceria", lesoes: "Fraturas, torções", medidas: "Três pontos de apoio; degraus e pegas em bom estado; proibição de pular; calçado antiderrapante", s: 3, p: 3 },
      { categoria: "ACIDENTE", perigo: "Deslocamento com a lança mal recolhida", fonte: "Lança ou patolas não travadas antes de rodar", lesoes: "Colisão com estruturas, redes e viadutos; acidente de trânsito", medidas: "Checklist de recolhimento e travamento antes de sair; altura máxima do conjunto conhecida pelo condutor", s: 5, p: 1, cursos: "NR18-MUNCK" },
      { categoria: "FISICO", perigo: "Ruído e vibração no posto de comando", fonte: "Motor e bomba hidráulica em funcionamento", lesoes: "Perda auditiva; desconforto", medidas: "Avaliação de ruído; manutenção; protetor auditivo conforme avaliação", s: 2, p: 3, exames: "Audiometria conforme NR-7, Anexo II, se a avaliação indicar exposição" },
      { categoria: "PSICOSSOCIAL", perigo: "Fadiga por direção somada à jornada de operação", fonte: "Deslocamentos longos antes ou depois do içamento", lesoes: "Sonolência, erro de operação, acidente de trânsito", medidas: "Planejamento de horários e pausas; controle de jornada; revezamento quando possível", s: 4, p: 2 },
    ],
  },
  {
    codigo: "SOLDA", nome: "Soldagem e corte a quente",
    descricao: "Soldagem com eletrodo revestido, MIG/MAG ou arame tubular; oxicorte; goivagem com arco-ar; aquecimento.",
    atividades: "Soldagem de ligações; oxicorte; goivagem; preaquecimento; manuseio de cilindros",
    perigos: [
      { categoria: "QUIMICO", perigo: "Fumos metálicos e gases de soldagem", fonte: "Fusão do metal de base, do eletrodo e de revestimentos (manganês, ferro, zinco em galvanizado, cromo em inox)", lesoes: "Irritação respiratória, febre dos fumos metálicos, doenças pulmonares; efeitos neurológicos (manganês)", medidas: "Avaliação de exposição; ventilação/exaustão local; posicionar-se fora da pluma; respirador adequado conforme PPR", s: 4, p: 3, exames: "A critério do médico do PCMSO, conforme a avaliação de exposição (ex.: avaliação respiratória)", ref: "NR-15 Anexo 11/13; NR-9 (avaliação)" },
      { categoria: "FISICO", perigo: "Radiação ultravioleta e infravermelha do arco", fonte: "Arco elétrico e chama", lesoes: "Ceratoconjuntivite (\"olho de soldador\"), queimaduras de pele", medidas: "Máscara de solda com filtro adequado; biombos para proteger terceiros; roupa de raspa/manga longa", s: 3, p: 3 },
      { categoria: "ACIDENTE", perigo: "Incêndio e explosão", fonte: "Fagulhas e respingos sobre materiais combustíveis; vazamento de gases combustíveis", lesoes: "Queimaduras, morte; perdas materiais", medidas: "Permissão de trabalho a quente; remoção ou proteção de combustíveis; extintor no local; vigia de fogo; inspeção pós-trabalho", s: 5, p: 2, cursos: "NR23-INC; PAL-55", ref: "NR-18; NR-23; NR-34 (referência para trabalho a quente)" },
      { categoria: "ACIDENTE", perigo: "Choque elétrico", fonte: "Máquina de solda, cabos danificados, ambiente úmido", lesoes: "Queimaduras, parada cardiorrespiratória", medidas: "Inspeção de cabos e garras; aterramento; luvas secas; não trabalhar molhado", s: 4, p: 2 },
      { categoria: "ACIDENTE", perigo: "Cilindros de gases sob pressão", fonte: "Queda ou dano à válvula; retrocesso de chama", lesoes: "Explosão, queimaduras, impacto", medidas: "Cilindros presos em pé; capacete da válvula; válvulas antirretrocesso; armazenagem ventilada e separada", s: 5, p: 1 },
      { categoria: "ACIDENTE", perigo: "Queimaduras por contato", fonte: "Peças quentes, respingos, escória", lesoes: "Queimaduras", medidas: "Luvas de raspa; perneira; avental; sinalizar peças quentes", s: 2, p: 3 },
    ],
  },
  {
    codigo: "FERRAMENTAS", nome: "Ferramentas manuais e elétricas portáteis",
    descricao: "Esmerilhadeiras, furadeiras magnéticas, parafusadeiras, chaves de impacto e de torque.",
    atividades: "Corte e desbaste; furação; aperto de parafusos; acabamento",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Ruptura de disco e projeção de partículas", fonte: "Esmerilhadeira sem proteção, disco inadequado à rotação, uso lateral do disco de corte", lesoes: "Cortes graves, lesões oculares, morte", medidas: "Proteção original sempre instalada; disco compatível com a rotação; empunhadura auxiliar; óculos e protetor facial; treinamento", s: 4, p: 3, cursos: "NR12-MAQ; PAL-56", ref: "NR-12" },
      { categoria: "ACIDENTE", perigo: "Enroscamento e torção (furadeira, chave de impacto)", fonte: "Broca travada, reação de torque, roupa solta", lesoes: "Fraturas de punho, lesões de mão", medidas: "Ferramenta com embreagem/limitador; base magnética fixada; não usar luva em broca rotativa quando o fabricante proibir; cabelo e roupa presos", s: 3, p: 3, cursos: "PAL-56" },
      { categoria: "FISICO", perigo: "Vibração de mãos e braços", fonte: "Chaves de impacto, esmerilhadeiras", lesoes: "Distúrbios vasculares e neurológicos das mãos (dedo branco), osteoarticulares", medidas: "Avaliação de vibração; ferramentas com antivibração; manutenção; pausas e rodízio", s: 3, p: 2, ref: "NR-15 Anexo 8; NR-9" },
      { categoria: "FISICO", perigo: "Ruído", fonte: "Esmerilhadeiras e chaves de impacto", lesoes: "Perda auditiva induzida por ruído", medidas: "Protetor auditivo com CA; afastamento de outras equipes; avaliação quantitativa", s: 3, p: 3, exames: "Audiometria conforme NR-7, Anexo II, se a avaliação indicar exposição" },
      { categoria: "ACIDENTE", perigo: "Choque elétrico por cabos e extensões", fonte: "Extensões improvisadas, cabos danificados, falta de DR", lesoes: "Choque, queimaduras", medidas: "Quadro provisório com DR e aterramento; inspeção de cabos e plugues; proibição de emendas", s: 4, p: 2, ref: "NR-18 (instalações elétricas temporárias)" },
    ],
  },
  {
    codigo: "FABRICA", nome: "Fábrica e oficina de estruturas metálicas",
    descricao: "Corte, furação, dobra, montagem de peças e soldagem em ambiente industrial, com pontes rolantes.",
    atividades: "Serra, guilhotina, puncionadeira, furadeira de coluna; ponte rolante; solda de fabricação; expedição",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Contato com partes móveis de máquinas", fonte: "Serras, prensas, guilhotinas, puncionadeiras sem proteção", lesoes: "Amputação, esmagamento", medidas: "Proteções fixas e móveis intertravadas; parada de emergência; bloqueio e etiquetagem na manutenção (NR-12); operador capacitado", s: 5, p: 2, cursos: "NR12-MAQ", ref: "NR-12" },
      { categoria: "ACIDENTE", perigo: "Queda de carga em ponte rolante", fonte: "Acessórios inadequados, ponte sem inspeção", lesoes: "Esmagamento, morte", medidas: "Inspeção periódica da ponte; acessórios certificados; operador capacitado; ninguém sob a carga", s: 5, p: 2, ref: "NR-11; NR-12" },
      { categoria: "FISICO", perigo: "Ruído", fonte: "Corte, esmerilhamento e martelamento", lesoes: "Perda auditiva", medidas: "Avaliação quantitativa; enclausuramento; protetor auditivo", s: 3, p: 4, exames: "Audiometria conforme NR-7, Anexo II, se a avaliação indicar exposição" },
      { categoria: "QUIMICO", perigo: "Fumos de solda em ambiente fechado", fonte: "Postos de solda de fabricação", lesoes: "Doenças respiratórias", medidas: "Exaustão local; ventilação geral; respirador conforme avaliação", s: 4, p: 3, exames: "A critério do médico do PCMSO, conforme a avaliação de exposição" },
      { categoria: "ERGONOMICO", perigo: "Levantamento e transporte manual de peças", fonte: "Peças pequenas e médias movimentadas à mão", lesoes: "Lombalgias, hérnias, distúrbios osteomusculares", medidas: "Meios mecânicos; limite de peso definido na avaliação ergonômica; levantamento em dupla; treinamento", s: 3, p: 3, cursos: "NR17-ERG", ref: "NR-17" },
    ],
  },
  {
    codigo: "PINTURA", nome: "Jateamento e pintura industrial",
    descricao: "Preparo de superfície (jateamento abrasivo, escovamento) e pintura com pistola ou rolo.",
    atividades: "Jateamento; limpeza com solventes; pintura com pistola airless; retoques na obra",
    perigos: [
      { categoria: "QUIMICO", perigo: "Vapores de solventes e tintas", fonte: "Tintas, diluentes e solventes orgânicos (FDS de cada produto)", lesoes: "Intoxicação, efeitos neurológicos, dermatites", medidas: "Consultar a FDS; ventilação/exaustão; respirador com filtro químico conforme PPR; luvas adequadas; armazenagem segregada", s: 4, p: 3, exames: "A critério do médico do PCMSO, conforme os produtos da FDS e a avaliação de exposição", cursos: "NR26-SIN", ref: "NR-26 (FDS); NR-15 Anexo 11" },
      { categoria: "QUIMICO", perigo: "Poeira do jateamento abrasivo", fonte: "Abrasivo e material removido", lesoes: "Doenças respiratórias (sílica, se o abrasivo contiver)", medidas: "Proibir abrasivo com sílica livre; cabine ou área isolada; capacete de jateamento com ar mandado", s: 4, p: 2, ref: "NR-15 Anexo 12" },
      { categoria: "ACIDENTE", perigo: "Incêndio de produtos inflamáveis", fonte: "Solventes e tintas próximos de trabalho a quente", lesoes: "Queimaduras", medidas: "Separar pintura de trabalho a quente; extintores; proibição de fumar; aterramento de equipamentos", s: 5, p: 2, cursos: "NR23-INC" },
      { categoria: "ACIDENTE", perigo: "Injeção de tinta sob alta pressão", fonte: "Pistola airless", lesoes: "Lesão grave de mão com risco de amputação", medidas: "Trava do gatilho; nunca apontar para o corpo; alívio de pressão antes de limpar", s: 4, p: 1 },
    ],
  },
  {
    codigo: "COBERTURA", nome: "Coberturas, telhas, calhas e fechamentos",
    descricao: "Montagem de telhas metálicas, calhas, rufos e fechamentos laterais.",
    atividades: "Içamento de fardos de telhas; fixação; vedação; montagem de calhas e rufos",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Queda através de telha ou de abertura", fonte: "Telhas não fixadas, translúcidas ou frágeis; aberturas para claraboias", lesoes: "Politraumatismo, morte", medidas: "Linha de vida e cinto; passarelas sobre a cobertura; proteção de aberturas; proibição de pisar em telha não fixada ou translúcida", s: 5, p: 3, cursos: "NR35-ALT", ref: "NR-18 (trabalho em telhados e coberturas); NR-35" },
      { categoria: "ACIDENTE", perigo: "Cortes por bordas de chapas", fonte: "Telhas e rufos com arestas vivas", lesoes: "Cortes em mãos e antebraços", medidas: "Luvas anticorte; manga protetora", s: 2, p: 4 },
      { categoria: "ACIDENTE", perigo: "Vento arrastando telhas soltas", fonte: "Fardos abertos ou telhas sem fixação", lesoes: "Impacto, queda de altura", medidas: "Fixar progressivamente; amarrar fardos; critério de paralisação por vento", s: 4, p: 2 },
      { categoria: "FISICO", perigo: "Calor e radiação solar intensos sobre a cobertura", fonte: "Superfície metálica exposta ao sol", lesoes: "Exaustão térmica, queimaduras por contato", medidas: "Pausas, hidratação, horários de menor calor; avaliação de calor", s: 3, p: 3, ref: "NR-15 Anexo 3" },
    ],
  },
  {
    codigo: "CLIENTE-IND", nome: "Montagem dentro de indústria em operação",
    descricao: "Serviços em áreas do cliente com processos ativos (tubulações, máquinas, produtos químicos, tráfego interno).",
    atividades: "Montagem e reforço de estruturas em área operacional; interfaces com operação do cliente",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Interação com riscos do processo do cliente", fonte: "Linhas pressurizadas, produtos perigosos, máquinas em operação, energia", lesoes: "Variadas, conforme o processo (queimaduras, intoxicação, esmagamento)", medidas: "Troca de informações com a contratante (NR-1, 1.5.8); integração do cliente; permissão de trabalho do cliente; bloqueio de energias", s: 5, p: 2, ref: "NR-1, 1.5.8; NR-18, 18.4.4" },
      { categoria: "QUIMICO", perigo: "Agentes químicos do ambiente do cliente", fonte: "Emissões e vazamentos do processo", lesoes: "Conforme o agente (informado pela contratante)", medidas: "Obter o inventário de riscos da contratante; monitoramento; EPI específico", s: 4, p: 2, exames: "A critério do médico do PCMSO, conforme os agentes informados pela contratante" },
      { categoria: "ACIDENTE", perigo: "Tráfego interno de empilhadeiras e veículos", fonte: "Logística do cliente", lesoes: "Atropelamento", medidas: "Isolamento da frente de trabalho; sinalização; rotas acordadas com o cliente", s: 5, p: 2 },
    ],
  },
  {
    codigo: "ESPACO-CONF", nome: "Espaço confinado (quando existir na obra)",
    descricao: "Entrada em reservatórios, silos, caixas, galerias ou vigas-caixão que se enquadrem como espaço confinado (NR-33).",
    atividades: "Soldagem ou montagem interna; inspeção; limpeza",
    perigos: [
      { categoria: "QUIMICO", perigo: "Atmosfera perigosa (deficiência ou enriquecimento de oxigênio, gases tóxicos ou inflamáveis)", fonte: "Ventilação insuficiente, resíduos, soldagem no interior", lesoes: "Asfixia, intoxicação, explosão, morte", medidas: "Gestão de espaço confinado da NR-33: cadastro, PET, medição contínua, ventilação, vigia, equipe de resgate; trabalhadores capacitados e com ASO com aptidão", s: 5, p: 2, exames: "Aptidão para espaço confinado no ASO (NR-33); exames a critério do médico", cursos: "NR33-TAV", ref: "NR-33" },
      { categoria: "ACIDENTE", perigo: "Dificuldade de resgate", fonte: "Acesso restrito", lesoes: "Agravamento de lesões, morte", medidas: "Plano de resgate e equipe disponível; equipamentos de resgate testados", s: 5, p: 2, ref: "NR-33" },
    ],
  },
  {
    codigo: "VIVENCIA", nome: "Área de vivência, almoxarifado e pátio",
    descricao: "Refeitório, vestiários, instalações sanitárias, alojamento (quando houver), almoxarifado e pátio de materiais.",
    atividades: "Refeições, higiene, guarda de materiais e ferramentas, carga e descarga",
    perigos: [
      { categoria: "BIOLOGICO", perigo: "Agentes biológicos por falta de higiene", fonte: "Instalações sanitárias e refeitório sem limpeza adequada; água sem controle", lesoes: "Doenças infecciosas e gastrointestinais", medidas: "Limpeza diária; água potável; projeto da área de vivência (NR-18, 18.4.3, a; NR-24)", s: 2, p: 2, ref: "NR-24; NR-18" },
      { categoria: "BIOLOGICO", perigo: "Animais peçonhentos", fonte: "Material estocado no chão, mato, entulho", lesoes: "Picadas com envenenamento", medidas: "Limpeza do terreno; estocagem elevada; luvas ao mover materiais; orientação de primeiros socorros", s: 3, p: 2 },
      { categoria: "ERGONOMICO", perigo: "Movimentação manual no almoxarifado", fonte: "Caixas de parafusos, rolos de cabo, ferramentas pesadas", lesoes: "Lombalgia", medidas: "Carrinhos; prateleiras com itens pesados na altura da cintura; limite de peso definido", s: 2, p: 3, cursos: "NR17-ERG" },
      { categoria: "ACIDENTE", perigo: "Incêndio em área de vivência e almoxarifado", fonte: "Instalações elétricas provisórias, aquecedores, inflamáveis guardados", lesoes: "Queimaduras, intoxicação por fumaça", medidas: "Extintores; separar inflamáveis; projeto elétrico provisório (NR-18, 18.4.3, b); rotas de fuga", s: 4, p: 2, cursos: "NR23-INC" },
    ],
  },
  {
    codigo: "ESCRITORIO", nome: "Escritório de obra e atividades administrativas",
    descricao: "Trabalho em computador, reuniões, atendimento; acesso eventual ao canteiro.",
    atividades: "Planejamento, compras, RH, medições; visitas ao canteiro",
    perigos: [
      { categoria: "ERGONOMICO", perigo: "Mobiliário e posto de trabalho inadequados", fonte: "Uso prolongado de computador; cadeira e mesa sem ajuste", lesoes: "Dores musculoesqueléticas, fadiga visual", medidas: "Mobiliário ajustável; monitor na altura dos olhos; pausas; avaliação ergonômica (NR-17)", s: 2, p: 3, ref: "NR-17" },
      { categoria: "PSICOSSOCIAL", perigo: "Sobrecarga e prazos administrativos", fonte: "Fechamentos, medições e demandas simultâneas", lesoes: "Estresse, sofrimento psíquico", medidas: "Organização do trabalho; distribuição de demandas; canal de escuta", s: 2, p: 3, ref: "NR-1, 1.5.3.1.4" },
      { categoria: "ACIDENTE", perigo: "Exposição aos riscos do canteiro durante visitas", fonte: "Circulação na obra sem conhecer os riscos", lesoes: "Conforme os riscos do canteiro", medidas: "Integração; EPI de visitante; acompanhamento por pessoa da obra; rotas definidas", s: 4, p: 2, cursos: "INT-01" },
    ],
  },
  {
    codigo: "DESLOCAMENTO", nome: "Condução de veículos e deslocamento entre obras",
    descricao: "Condução de veículos da empresa e transporte de equipes entre alojamento, fábrica e obras.",
    atividades: "Dirigir veículos leves e caminhões; transporte de equipe e materiais",
    perigos: [
      { categoria: "ACIDENTE", perigo: "Acidente de trânsito", fonte: "Fadiga, velocidade, estradas, manutenção do veículo", lesoes: "Politraumatismo, morte", medidas: "Condutor habilitado e autorizado; manutenção preventiva; controle de jornada e descanso; proibição de uso de celular ao dirigir; transporte de pessoas só em veículo adequado", s: 5, p: 2, ref: "CTB; NR-18 (transporte de trabalhadores)" },
      { categoria: "ACIDENTE", perigo: "Queda ou deslocamento de carga no transporte", fonte: "Amarração deficiente de perfis e ferramentas", lesoes: "Impacto, acidente de trânsito", medidas: "Amarração com cintas; carga dentro dos limites do veículo; inspeção antes de sair", s: 4, p: 2 },
      { categoria: "PSICOSSOCIAL", perigo: "Fadiga por longas viagens antes ou depois da jornada", fonte: "Deslocamentos longos somados à jornada", lesoes: "Sonolência ao volante, acidentes", medidas: "Planejamento de horários; revezamento de condutores; descanso", s: 4, p: 2 },
    ],
  },
];
