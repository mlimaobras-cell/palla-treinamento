// CURSO 5.2 — SEGURANÇA NA MONTAGEM METÁLICA (capacitação interna Palla; complementa NR-18 e NR-35, não as substitui)
// Status: EM REVISÃO pelo responsável técnico.
import type { CapituloSeed, QuestaoSeed } from "./integracao";

export const capitulosMontagemSegura: CapituloSeed[] = [
  {
    titulo: "Riscos da montagem",
    aulas: [
      {
        titulo: "Esmagamento e queda de peças",
        duracaoMin: 10,
        roteiro: `CENA 1 — Montagem de viga: mão do montador entre a viga e o consolo do pilar (animação, sem imagem de lesão).
CENA 2 — Uso de corda guia e de alinhador cônico (pino) para posicionar a peça sem colocar a mão entre as partes.
CENA 3 — Bolsa porta-parafusos, ferramentas amarradas e rodapé na plataforma.`,
        narracao: `Na montagem de estruturas metálicas, as peças são pesadas, rígidas e chegam em movimento. Quando uma viga encontra o pilar, qualquer mão ou pé no meio é esmagado.
Regra prática: as mãos ficam fora da linha de fechamento. Para guiar a peça, use corda guia. Para alinhar furos, use o pino cônico, nunca o dedo.
O segundo risco é a queda de material. Um parafuso de uma polegada caindo de oito metros vira um projétil. Parafusos, porcas e arruelas vão em bolsa fechada; ferramentas manuais são amarradas; e a área abaixo fica isolada enquanto houver trabalho acima.`,
        textoApoio: `Esmagamento (prensamento):
• Mantenha mãos e pés fora da linha de fechamento entre peças.
• Guie cargas com corda guia de comprimento adequado.
• Use alinhador cônico para coincidir furos.
• Comunique-se com o sinaleiro antes de aproximar a mão da peça.
• Calços e apoios das peças no chão devem ser estáveis antes de soltar a lingada.

Queda de material:
• Bolsas fechadas para parafusos e pequenas peças.
• Ferramentas amarradas ao punho ou ao cinto em trabalho em altura.
• Nada é lançado de um nível para outro.
• Isolamento e sinalização da área abaixo da frente de montagem.
• Nenhuma peça fica solta sobre a estrutura sem estar fixada ou apoiada com segurança.`,
        exemplo: "Ao encaixar uma viga de cobertura, o montador apoia a mão na aba para guiar. O sinaleiro manda descer e a viga desliza 5 cm. Com corda guia, essa mão estaria a dois metros de distância.",
        perguntaFixacao: "Qual ferramenta usar para alinhar furos sem colocar o dedo entre as peças?",
        resumo: "Mãos fora da linha de fechamento, corda guia, pino cônico, bolsa para parafusos, ferramenta amarrada e área abaixo isolada.",
      },
      {
        titulo: "Instabilidade estrutural e estabilidade provisória",
        duracaoMin: 10,
        roteiro: `CENA 1 — Animação de pórtico sem contraventamento oscilando com vento.
CENA 2 — Instalação de contraventamentos provisórios e estais conforme plano de montagem.
CENA 3 — Encarregado conferindo a sequência de montagem antes de soltar a lingada.`,
        narracao: `Uma estrutura metálica só fica estável quando está completa: pilares chumbados, vigas ligadas e contraventamentos instalados. Durante a montagem, ela passa por fases em que pode tombar com o vento ou com um esforço lateral.
Por isso, seguimos a sequência de montagem do projeto e instalamos a estabilidade provisória indicada: estais, escoras ou contraventamentos provisórios.
Nunca solte a lingada de um pilar antes de ele estar chumbado ou escorado conforme o plano. Nunca retire um contraventamento provisório sem a liberação do encarregado. E com vento forte, a montagem para.`,
        textoApoio: `Cuidados com a estabilidade:
• Siga a sequência de montagem definida no plano.
• Pilar só é liberado da lingada após chumbadores com porcas apertadas ou estaiamento provisório.
• Instale os contraventamentos provisórios previstos antes de seguir para o próximo vão.
• Não retire estais, escoras ou contraventamentos provisórios sem autorização.
• Acompanhe a velocidade do vento; pare a montagem conforme os limites do plano e do equipamento.
• Comunique deformações, folgas anormais ou peças fora de prumo antes de continuar.`,
        perguntaFixacao: "Quando é permitido soltar a lingada de um pilar recém-posicionado?",
        resumo: "A estrutura só fica estável completa. Siga a sequência, instale a estabilidade provisória e não remova escoras sem liberação.",
      },
    ],
  },
  {
    titulo: "Organização da frente de montagem",
    aulas: [
      {
        titulo: "Movimentação suspensa, isolamento e comunicação operacional",
        duracaoMin: 10,
        roteiro: `CENA 1 — Planta da frente de montagem com raio de giro do equipamento e área isolada.
CENA 2 — Duas equipes (montagem e outra disciplina) sob a mesma área: encarregado combina horários.
CENA 3 — Sinaleiro com colete identificado, comunicação por rádio com confirmação.`,
        narracao: `Na frente de montagem, várias equipes dividem o mesmo espaço. Se a equipe de elétrica está trabalhando embaixo da área de içamento, o risco é de todos.
Antes de começar, o encarregado combina com as outras equipes quem trabalha onde e quando. A área de içamento e o raio de giro do equipamento ficam isolados, com fita, cones e placa.
Durante o içamento, só o sinaleiro designado orienta o operador. Os sinais seguem o padrão combinado, e as mensagens de rádio são curtas: quem fala, a ação e a confirmação.
Se alguém entrar na área isolada, o içamento para.`,
        textoApoio: `Interferência entre equipes:
• Combine no DDS e com as outras disciplinas as áreas e horários de cada atividade.
• Não trabalhe acima ou abaixo de outra equipe sem proteção e coordenação.

Isolamento:
• Isole a área de içamento e o raio de giro do equipamento.
• Sinalize com fita, cones e placas; mantenha um responsável pelo isolamento.

Comunicação operacional:
• Um único sinaleiro designado por içamento, identificado.
• Sinais padronizados, conhecidos por operador e sinaleiro.
• Rádio: identificação, mensagem curta, confirmação.
• Qualquer pessoa pode dar o sinal de parada de emergência.`,
        exemplo: "O içamento de uma treliça é suspenso quando um eletricista de outra empresa entra na área isolada para buscar material. A equipe só retoma após ele sair e o isolamento ser reforçado.",
        perguntaFixacao: "Quem pode dar o sinal de parada de emergência durante um içamento?",
        resumo: "Combine com as outras equipes, isole a área e o raio de giro e comunique-se por um único sinaleiro. Alguém entrou na área? Pare.",
      },
    ],
  },
];

export const questoesMontagemSegura: QuestaoSeed[] = [
  {
    tipo: "SITUACIONAL",
    enunciado: "Uma viga está sendo baixada até o consolo do pilar. Como o montador deve guiá-la?",
    alternativas: [
      { id: "a", texto: "Com a mão apoiada na aba da viga." },
      { id: "b", texto: "Com corda guia, mantendo as mãos fora da linha de fechamento." },
      { id: "c", texto: "Empurrando com o pé." },
      { id: "d", texto: "Segurando a lingada." },
    ],
    correta: "b",
    comentario: "A corda guia mantém o trabalhador fora da linha de fechamento entre as peças, evitando o esmagamento.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Para fazer coincidir os furos de uma ligação, deve-se usar:",
    alternativas: [
      { id: "a", texto: "O dedo indicador." },
      { id: "b", texto: "O alinhador cônico (pino)." },
      { id: "c", texto: "Uma chave de fenda." },
      { id: "d", texto: "O maçarico para alargar o furo." },
    ],
    correta: "b",
    comentario: "O alinhador cônico é a ferramenta própria para coincidir furos sem expor a mão.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Como devem ser levados os parafusos para o trabalho em altura?",
    alternativas: [
      { id: "a", texto: "No bolso da calça." },
      { id: "b", texto: "Soltos sobre a viga, perto do ponto de trabalho." },
      { id: "c", texto: "Em bolsa fechada própria para parafusos." },
      { id: "d", texto: "Lançados por um colega quando necessário." },
    ],
    correta: "c",
    comentario: "Bolsas fechadas evitam a queda de pequenas peças. Nada é lançado entre níveis.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "O pilar acabou de ser posicionado sobre os chumbadores, mas as porcas ainda não foram apertadas e não há estai. O operador pergunta se pode soltar a lingada. Qual a resposta?",
    alternativas: [
      { id: "a", texto: "Sim, o pilar está no lugar." },
      { id: "b", texto: "Sim, se não estiver ventando." },
      { id: "c", texto: "Não. Só após o aperto das porcas dos chumbadores ou o estaiamento previsto no plano." },
      { id: "d", texto: "Sim, desde que alguém segure o pilar." },
    ],
    correta: "c",
    comentario: "O pilar só pode ser liberado da lingada após estar fixado nos chumbadores ou estaiado conforme o plano de montagem.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Um contraventamento provisório atrapalha a passagem de material. Quem pode retirá-lo?",
    alternativas: [
      { id: "a", texto: "Qualquer montador, se for recolocado depois." },
      { id: "b", texto: "Ninguém sem a liberação do encarregado conforme o plano de montagem." },
      { id: "c", texto: "O operador do equipamento." },
      { id: "d", texto: "O ajudante mais experiente." },
    ],
    correta: "b",
    comentario: "Elementos de estabilidade provisória só são retirados com liberação, conforme a sequência do plano.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "Durante o içamento, um eletricista de outra empresa entra na área isolada. O que deve acontecer?",
    alternativas: [
      { id: "a", texto: "O içamento continua, mas mais devagar." },
      { id: "b", texto: "O içamento para até a área estar livre e o isolamento ser reforçado." },
      { id: "c", texto: "O sinaleiro grita para ele sair e o içamento continua." },
      { id: "d", texto: "Nada; ele é de outra empresa." },
    ],
    correta: "b",
    comentario: "Pessoa na área isolada significa parar o içamento. A retomada só ocorre com a área livre.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Quantos sinaleiros devem orientar o operador em um mesmo içamento?",
    alternativas: [
      { id: "a", texto: "Todos os montadores que estiverem vendo a carga." },
      { id: "b", texto: "Um único sinaleiro designado e identificado." },
      { id: "c", texto: "Dois, para ter redundância de sinais." },
      { id: "d", texto: "Nenhum, se houver rádio." },
    ],
    correta: "b",
    comentario: "Um único sinaleiro designado evita sinais conflitantes. Qualquer pessoa, porém, pode sinalizar parada de emergência.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "A área que deve ser isolada durante o içamento inclui:",
    alternativas: [
      { id: "a", texto: "Somente o ponto onde a peça será montada." },
      { id: "b", texto: "A área de içamento e o raio de giro do equipamento." },
      { id: "c", texto: "Apenas a área em volta do caminhão." },
      { id: "d", texto: "Nenhuma área, se houver sinaleiro." },
    ],
    correta: "b",
    comentario: "O isolamento cobre a trajetória da carga e o raio de giro do equipamento.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "Começa a ventar forte durante a montagem de uma treliça. O que fazer?",
    alternativas: [
      { id: "a", texto: "Acelerar para terminar antes de piorar." },
      { id: "b", texto: "Parar a montagem conforme os limites do plano e do equipamento e garantir a estabilidade do que já foi montado." },
      { id: "c", texto: "Continuar com mais gente segurando as cordas guia." },
      { id: "d", texto: "Soltar a treliça no lugar sem parafusar." },
    ],
    correta: "b",
    comentario: "O vento afeta a carga e a estabilidade da estrutura. Respeite os limites do plano e do equipamento.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Outra equipe precisa trabalhar no nível de baixo, sob a frente de montagem. O correto é:",
    alternativas: [
      { id: "a", texto: "Trabalhar ao mesmo tempo, com atenção redobrada." },
      { id: "b", texto: "Combinar áreas e horários para não haver trabalho sobreposto sem proteção." },
      { id: "c", texto: "Pedir que usem capacete e seguir normalmente." },
      { id: "d", texto: "Deixar o encarregado da outra equipe decidir sozinho." },
    ],
    correta: "b",
    comentario: "Atividades sobrepostas exigem coordenação entre equipes e proteção contra queda de materiais.",
  },
];
