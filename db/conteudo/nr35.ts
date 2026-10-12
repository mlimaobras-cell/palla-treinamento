// NR-35 — TRABALHO EM ALTURA: MATERIAL DE APOIO (não conta como carga horária)
// Desde a Portaria MTE nº 1.259/2026 (DOU de 16/07/2026), os treinamentos da NR-35 são presenciais (item 35.4.5).
// Este conteúdo é para estudo antes e revisão depois da turma. A carga horária, a avaliação e a prática
// são cumpridas na turma presencial e registradas pelo instrutor em "Atividades práticas".
// O banco de questões abaixo é usado na prova escrita aplicada PRESENCIALMENTE (impressão em /admin/cursos/[id]/prova).
// Referência: NR-35 atualizada (texto do MTE com a Portaria MTE nº 1.259/2026). Status: EM REVISÃO pelo responsável técnico.
import type { CapituloSeed, QuestaoSeed } from "./integracao";

export const capitulosNr35: CapituloSeed[] = [
  {
    titulo: "Normas e regulamentos aplicáveis",
    aulas: [
      {
        titulo: "A NR-35 e o que ela exige",
        duracaoMin: 9,
        videoUrl: "/videos/NR35-apoio.mp4",
        legendaUrl: "/videos/NR35-apoio.vtt",
        roteiro: `Vídeo animado de apoio (narração gerada, voz feminina): presencialidade, conceito, autorização, hierarquia de medidas, análise de risco, PT, proteção coletiva e individual, fator de queda, zona livre de queda, inspeção, emergência e situações típicas da montagem metálica.`,
        narracao: `A NR-35 estabelece os requisitos mínimos e as medidas de proteção para o trabalho em altura, desde o planejamento e a organização até a execução.
Trabalho em altura é toda atividade com diferença de nível acima de dois metros onde exista risco de queda.
Os treinamentos previstos na NR-35 são presenciais, com teoria e prática.`,
        textoApoio: `O que é trabalho em altura (NR-35, 35.2.1)
• Toda atividade com diferença de nível acima de 2,0 m onde haja risco de queda.

Quem pode trabalhar em altura (35.4.1)
• Só o trabalhador formalmente autorizado pela organização.
• Autorizado = capacitado + saúde avaliada + considerado apto (35.4.1.1).
• A autorização considera as tarefas, o treinamento recebido e a aptidão clínica (35.4.1.2).
• Fica registrada nos documentos funcionais, e a empresa mantém um sistema que mostra a abrangência da autorização de cada um (35.4.1.3).
• Certificado de treinamento NÃO é autorização.

Treinamentos (35.4.2 a 35.4.5)
• Teórico e prático; inicial, periódico e eventual, observada a NR-01.
• Inicial: carga mínima de 8 horas, antes de começar a atividade.
• Periódico: a cada 2 anos, carga mínima de 8 horas.
• Eventual: nas situações previstas na NR-01 (por exemplo, mudança de procedimento ou condição, acidente grave, retorno de afastamento). [VALIDAR com o texto vigente da NR-01]
• Instrutores com proficiência comprovada, sob responsabilidade de profissional qualificado ou legalmente habilitado em segurança no trabalho (35.4.3).
• Modalidade presencial (35.4.5, incluído pela Portaria MTE nº 1.259/2026). Quem fez o inicial a distância tem prazo de 1 ano, contado da publicação (16/07/2026), para refazê-lo ou completá-lo presencialmente (art. 8º da portaria).

Saúde (35.4.4)
• A empresa avalia a saúde de quem trabalha em altura conforme a NR-07, considerando condições que possam causar mal súbito ou queda, e fatores psicossociais.
• A aptidão para trabalho em altura consta no ASO.

Responsabilidades
• Organização (35.3.1): garantir as medidas de prevenção, a análise de risco e a PT, os procedimentos de rotina, a avaliação prévia do local, o acompanhamento de terceiros, a suspensão do trabalho diante de risco não previsto, o sistema de autorização e a guarda dos documentos por no mínimo 5 anos.
• Trabalhador (35.3.2): cumprir a NR-35, o item 1.4.2 da NR-01 e os procedimentos da empresa.`,
        exemplo: "Um montador novo chega com certificado de NR-35 de outra empresa, feito a distância. Ele não sobe: o treinamento precisa ser presencial, ser avaliado pela Palla e ele precisa estar autorizado e apto no ASO para trabalho em altura.",
        perguntaFixacao: "Certificado de NR-35 é o mesmo que autorização para trabalho em altura?",
        resumo: "Acima de 2 m com risco de queda é trabalho em altura. Só o autorizado sobe. Treinamento presencial: inicial de 8 h, periódico de 8 h a cada 2 anos.",
      },
    ],
  },
  {
    titulo: "Análise de risco e condições impeditivas",
    aulas: [
      {
        titulo: "Planejamento e análise de risco",
        duracaoMin: 8,
        roteiro: `CENA 1 — Hierarquia das medidas em três degraus: evitar, eliminar, reduzir.
CENA 2 — Equipe fazendo a análise de risco ao pé do pórtico, antes de subir.
CENA 3 — Lista dos itens da AR aparecendo sobre a foto da frente de montagem.`,
        narracao: `Todo trabalho em altura é planejado e organizado. As medidas seguem uma ordem: primeiro evitar o trabalho em altura, depois eliminar o risco de queda e só então reduzir as consequências da queda.
Antes de todo trabalho em altura existe uma análise de risco. Ela olha o local, a ancoragem, o clima, a queda de materiais, os trabalhos simultâneos, as condições impeditivas, a emergência, a comunicação e a supervisão.`,
        textoApoio: `Hierarquia (35.5.2)
a) evitar o trabalho em altura sempre que houver outro meio (ex.: pré-montar tesouras e terças no chão);
b) eliminar o risco de queda (guarda-corpo, plataforma protegida, rede);
c) minimizar as consequências da queda (sistema de proteção individual).

A análise de risco (AR) vem antes de todo trabalho em altura (35.5.5) e considera (35.5.5.1):
a) o local de execução e o entorno;
b) o isolamento e a sinalização da área;
c) os sistemas e pontos de ancoragem;
d) as condições meteorológicas adversas;
e) a seleção, a inspeção, o uso e os limites dos sistemas de proteção coletiva e individual;
f) o risco de queda de materiais e ferramentas;
g) os trabalhos simultâneos com riscos específicos;
h) os requisitos das demais NRs;
i) os riscos adicionais;
j) as condições impeditivas;
k) as emergências, com planejamento de resgate e primeiros socorros para reduzir o tempo de suspensão inerte;
l) a necessidade de comunicação;
m) a forma de supervisão.`,
        exemplo: "Montagem de terças a 9 m: a AR aponta a pré-montagem de módulos no chão (evitar), a plataforma elevatória com guarda-corpo (eliminar) e o talabarte ancorado na plataforma (reduzir), além do isolamento da área abaixo.",
        perguntaFixacao: "Qual é a primeira medida na hierarquia do trabalho em altura?",
        resumo: "Evitar, eliminar, reduzir. A análise de risco vem antes de todo trabalho em altura e cobre treze pontos, do local à supervisão.",
      },
      {
        titulo: "Procedimento, permissão de trabalho e condições impeditivas",
        duracaoMin: 7,
        roteiro: `CENA 1 — Duas pastas: "Rotina" (procedimento operacional) e "Não rotina" (permissão de trabalho).
CENA 2 — PT sendo preenchida, aprovada e afixada na frente de trabalho; ao fim do turno, encerrada.
CENA 3 — Nuvem escura e biruta: o encarregado interrompe a atividade.`,
        narracao: `Para atividades de rotina, a análise de risco pode estar no procedimento operacional. Para o que não é rotina, é preciso uma permissão de trabalho aprovada antes de começar.
A permissão vale só para aquela atividade e aquele turno, lista todos os envolvidos e fica disponível no local.
Condição impeditiva é tudo o que coloca a saúde ou a vida em risco. Diante dela, o serviço não começa, ou para.`,
        textoApoio: `Atividade de rotina (35.5.6 e 35.5.6.1)
• A AR pode estar contida no procedimento operacional, que detalha a tarefa, as medidas de prevenção, as condições impeditivas, os sistemas de proteção e as responsabilidades.

Atividade não rotineira (35.5.7 e 35.5.8)
• Exige autorização prévia por permissão de trabalho (PT).
• A PT pode ser física ou digital, é aprovada, fica disponível no local e, ao final, é encerrada e arquivada.
• Contém os requisitos mínimos, as medidas da AR e a relação de todos os envolvidos.
• Vale apenas para a atividade e o turno; pode ser revalidada se as condições e a equipe não mudarem.

Condições impeditivas
• Situações que impedem a realização ou a continuidade do serviço por colocarem em risco a saúde ou a integridade do trabalhador.
• Exemplos na montagem: vento acima do limite do plano, chuva, descarga atmosférica, ancoragem não liberada, equipamento reprovado na inspeção, mal-estar, falta de supervisão prevista.
• A organização suspende o trabalho quando surge um risco não previsto que não pode ser eliminado na hora (35.3.1, h).`,
        exemplo: "Troca de uma terça empenada fora da sequência normal de montagem: não é rotina. A equipe faz a AR, emite a PT com os nomes de todos, e a PT vale só para aquele turno.",
        perguntaFixacao: "Por quanto tempo vale uma permissão de trabalho?",
        resumo: "Rotina: procedimento operacional. Não rotina: PT aprovada, para a atividade e o turno. Condição impeditiva: não começa, ou para.",
      },
    ],
  },
  {
    titulo: "Riscos e medidas de prevenção",
    aulas: [
      {
        titulo: "Riscos do trabalho em altura na montagem metálica",
        duracaoMin: 7,
        roteiro: `CENA 1 — Frente de montagem com marcação dos riscos: borda, abertura, telha frágil, rede elétrica, material solto.
CENA 2 — Medida de controle aparecendo ao lado de cada risco.`,
        narracao: `Os riscos do trabalho em altura vão além da queda da pessoa. Há a queda de materiais e ferramentas sobre quem está embaixo, o choque elétrico perto de redes, o vento sobre peças grandes, a telha frágil e as atividades sobrepostas.
Cada risco tem a sua medida de controle, definida na análise de risco.`,
        textoApoio: `Riscos típicos e controles
• Queda de pessoa: borda sem proteção, aberturas, deslocamento sobre vigas → proteção coletiva; linha de vida instalada e liberada; conexão contínua.
• Queda de materiais e ferramentas: parafusos, pontas de parafuso TC, ferramentas → bolsa fechada, ferramenta amarrada, isolamento da área abaixo, nada lançado de um nível para outro.
• Telhas e superfícies frágeis: telha translúcida, telha sem apoio, manta → nunca pisar fora dos apoios; passarelas; linha de vida móvel.
• Rede elétrica próxima: distância de segurança definida na AR; desenergização quando prevista.
• Vento e clima: limites definidos no plano; parada da atividade.
• Atividades simultâneas: coordenação entre equipes; ninguém sob a frente de trabalho.
• Equipamentos de acesso: escada mal fixada, plataforma elevatória fora de nível → inspeção e uso conforme o fabricante.
• Mal súbito: aptidão no ASO; ninguém trabalha sozinho em altura sem forma de supervisão definida na AR.`,
        exemplo: "Um montador aperta parafusos a 8 m e uma ponta de parafuso TC rompida cai. Com a área abaixo isolada e as pontas recolhidas na bolsa, ninguém se fere.",
        perguntaFixacao: "Cite duas medidas contra a queda de materiais.",
        resumo: "Queda de pessoa, queda de material, telha frágil, rede elétrica, vento, trabalhos simultâneos e mal súbito: cada um com controle definido na AR.",
      },
    ],
  },
  {
    titulo: "Proteção coletiva",
    aulas: [
      {
        titulo: "Sistemas de proteção contra quedas: o coletivo vem primeiro",
        duracaoMin: 6,
        roteiro: `CENA 1 — Guarda-corpo, rede e plataforma com proteção na frente de montagem.
CENA 2 — Placa "projeto por profissional legalmente habilitado".`,
        narracao: `O sistema de proteção contra quedas é obrigatório sempre que não for possível evitar o trabalho em altura.
A proteção coletiva tem prioridade. A individual entra quando a coletiva não é possível, não é completa ou para situações de emergência.`,
        textoApoio: `Sistema de Proteção contra Quedas (SPQ) (35.6.1 e 35.6.2)
• Obrigatório sempre que não for possível evitar o trabalho em altura.
• Deve ser adequado à tarefa, selecionado conforme a AR por profissional qualificado ou habilitado em segurança, resistente à força máxima aplicável, conforme as normas técnicas, com elementos compatíveis e inspecionáveis.

Proteção coletiva (SPCQ) (35.6.3)
• Tem prioridade sobre a individual.
• Deve ser projetada por profissional legalmente habilitado (35.6.3.1).
• Exemplos: guarda-corpo, rede de proteção, plataforma de trabalho com proteção, fechamento de aberturas.

Proteção individual (SPIQ)
• Usada quando a coletiva é inviável, incompleta, ou em emergência.
• Tipos (35.6.4): restrição de movimentação, retenção de queda, posicionamento no trabalho e acesso por cordas (Anexo I).

Na montagem metálica
• Linhas de vida provisórias e definitivas fazem parte do sistema e seguem o projeto; não se improvisa ponto de ancoragem.`,
        perguntaFixacao: "Quando o sistema individual pode ser usado no lugar do coletivo?",
        resumo: "SPQ é obrigatório. O coletivo é prioritário e projetado por profissional habilitado. O individual entra quando o coletivo não é possível ou completo.",
      },
    ],
  },
  {
    titulo: "Equipamentos de proteção individual para altura",
    aulas: [
      {
        titulo: "Cinturão, talabarte, trava-quedas e ancoragem",
        duracaoMin: 9,
        roteiro: `CENA 1 — Cinturão tipo paraquedista com o ponto de conexão indicado pelo fabricante.
CENA 2 — Talabarte com absorvedor de energia integrado; talabarte duplo na transposição.
CENA 3 — Trava-quedas guiado em linha de vida vertical.
CENA 4 — Proibições: emendar talabartes, dar nós, ancorar em ponto não liberado.`,
        narracao: `Na retenção de queda, o trabalhador usa cinturão tipo paraquedista, conectado no ponto indicado pelo fabricante, e talabarte com absorvedor de energia integrado.
Durante toda a exposição, ele fica conectado. O sistema limita a força de impacto a seis quilonewtons.
Talabarte não se emenda e não se amarra com nó, a não ser que o fabricante permita.`,
        textoApoio: `Seleção e uso
• Retenção de queda e acesso por cordas: cinturão tipo paraquedista, conectado no elemento indicado pelo fabricante (35.6.9 e 35.6.9.1).
• Talabarte de retenção: com absorvedor de energia integrado (35.6.9.1.1).
• Força de impacto transmitida ao trabalhador: no máximo 6 kN (35.6.7).
• Trava-quedas guiado: seguir o fabricante quanto à compatibilidade com a linha de vida vertical e ao comprimento máximo do extensor (35.6.10).
• Não conectar talabarte a outro talabarte, conector ou extensor, nem fazer nós ou laços, salvo previsão do fabricante (35.6.11.1.1).
• Fabricante informa desempenho e limites de uso, considerando a massa total do sistema (35.6.5).
• EPI com Certificado de Aprovação, conforme a NR-06.

A AR considera, na seleção (35.6.11):
a) conexão contínua durante a exposição;
b) distância de queda livre;
c) fator de queda;
d) elemento de conexão que limite o impacto a 6 kN;
e) zona livre de queda;
f) compatibilidade entre os componentes.

Conceitos
• Fator de queda: distância que o trabalhador percorreria na queda dividida pelo comprimento do equipamento que irá detê-la. Ancoragem acima da cabeça reduz o fator.
• Zona livre de queda (ZLQ): espaço mínimo abaixo do ponto de ancoragem (ou dos pés, no trava-quedas) para que, após a queda, o trabalhador não bata na estrutura, em obstáculo ou no solo.
• Distância de queda livre: do início da queda ao início da retenção.
• Absorvedor de energia: limita a força de impacto dissipando a energia.

Na montagem
• Talabarte duplo para manter a conexão contínua ao trocar de ponto.
• Plataforma elevatória: talabarte no ponto de ancoragem da própria plataforma, conforme o fabricante.
• Ponto de ancoragem só depois de liberado (linha de vida instalada, inspecionada e liberada).`,
        exemplo: "A 4 m de altura, com talabarte de 1,8 m ancorado no pé, a queda pode ultrapassar a zona livre disponível e o montador bate no chão antes de o sistema parar. Ancorar acima da cabeça ou usar outro sistema resolve; quem decide é a AR.",
        perguntaFixacao: "Qual é a força máxima de impacto que o sistema pode transmitir ao trabalhador?",
        resumo: "Paraquedista no ponto do fabricante, talabarte com absorvedor, conectado o tempo todo, impacto até 6 kN, sem emendas nem nós; fator de queda e ZLQ entram na AR.",
      },
      {
        titulo: "Inspeção, conservação e descarte",
        duracaoMin: 6,
        roteiro: `CENA 1 — Inspeção rotineira do cinturão: costuras, fitas, fivelas, argolas, etiqueta.
CENA 2 — Talabarte com o indicador de queda acionado vai para o descarte.
CENA 3 — Ficha de inspeção periódica.`,
        narracao: `O equipamento individual passa por inspeção inicial, rotineira e periódica.
A rotineira é antes de cada trabalho. A periódica é feita, no mínimo, a cada doze meses.
Equipamento com defeito, deformação, degradação ou que sofreu impacto de queda é recusado e descartado.`,
        textoApoio: `Inspeções do SPIQ (35.6.6)
• Inicial: entre o recebimento e o primeiro uso (35.6.6.1).
• Rotineira: antes do início dos trabalhos (35.6.6.2).
• Periódica: no mínimo a cada 12 meses, podendo ser mais frequente conforme uso e exposição (35.6.6.3).
• Registrar as inspeções inicial e periódica e as rotineiras em que algum elemento for recusado (35.6.6.4).
• Elementos com defeito, degradação, deformação ou que sofreram impacto de queda são inutilizados e descartados, salvo quando o fabricante permitir a restauração (35.6.6.5).

Na inspeção rotineira, olhe
• Fitas: cortes, queimaduras de solda, desfiamento, rigidez, contaminação.
• Costuras: pontos soltos ou rompidos.
• Metais: argolas, fivelas e mosquetões sem trinca, deformação ou corrosão; travas funcionando.
• Absorvedor: sem sinal de acionamento.
• Etiqueta legível (identificação, lote, CA).

Conservação
• Guardar limpo, seco, longe de sol, calor, respingos de solda e produtos químicos.
• Na solda e no corte, proteger as fitas contra respingos e calor.`,
        perguntaFixacao: "O que fazer com um talabarte que já segurou uma queda?",
        resumo: "Inspeção inicial, rotineira antes do uso e periódica no máximo a cada 12 meses. Defeito ou queda: recusar e descartar, com registro.",
      },
    ],
  },
  {
    titulo: "Acidentes típicos",
    aulas: [
      {
        titulo: "Como acontecem as quedas na montagem",
        duracaoMin: 6,
        roteiro: `CENA 1 — Cinco cenários animados (sem imagens de vítimas): desconexão na transposição, ancoragem improvisada, telha frágil, escada mal posicionada, zona livre insuficiente.
CENA 2 — Para cada cenário, a barreira que faltou.`,
        narracao: `Os acidentes em altura na montagem costumam se repetir. Desconectar para passar de um ponto ao outro. Ancorar em peça não liberada. Pisar em telha frágil. Usar escada mal posicionada. Ancorar baixo demais, sem zona livre.
Em todos eles, uma barreira prevista na análise de risco faltou.`,
        textoApoio: `Acidentes típicos e a barreira que faltou
• Queda na transposição de obstáculo, com o trabalhador desconectado → talabarte duplo, conexão contínua.
• Ancoragem em peça solta, terça sem fixação ou ponto não dimensionado → só ponto de ancoragem liberado.
• Queda através de telha translúcida, telha sem apoio ou manta → passarela, linha de vida, nunca pisar fora do apoio.
• Escada sem fixação, apoiada em superfície inadequada ou sem ultrapassar o ponto de apoio → escada inspecionada, fixada e usada conforme o procedimento.
• Queda com batida no chão mesmo conectado → zona livre de queda não verificada; ancoragem acima da cabeça.
• Queda de material ferindo quem está embaixo → isolamento e bolsas.
• Tombamento de plataforma elevatória → terreno nivelado, limites do fabricante, check-list.
• Mal súbito em altura → aptidão no ASO e supervisão definida na AR.`,
        exemplo: "Para passar por um pilar sobre a viga, o montador solta o talabarte simples 'só por um segundo'. É exatamente nesse segundo que acontecem muitas quedas. Com talabarte duplo, ele conecta o segundo antes de soltar o primeiro.",
        perguntaFixacao: "Qual a barreira que evita a queda na transposição de um obstáculo?",
        resumo: "Desconexão, ancoragem improvisada, telha frágil, escada mal usada, zona livre insuficiente, queda de material e mal súbito: cada um tem a sua barreira.",
      },
    ],
  },
  {
    titulo: "Emergência, resgate e primeiros socorros",
    aulas: [
      {
        titulo: "Resposta a emergências e noções de resgate",
        duracaoMin: 7,
        roteiro: `CENA 1 — Plano de emergência afixado na obra: telefones, equipe, kit de resgate.
CENA 2 — Simulado de resgate com equipe treinada (sem vítima real).
CENA 3 — Cronômetro: tempo de suspensão o menor possível.`,
        narracao: `Depois de uma queda retida, o trabalhador fica suspenso no cinto, e esse tempo precisa ser o menor possível.
Por isso, o resgate é planejado antes de começar: procedimento, equipe, tempo estimado e equipamentos.
Quem faz o resgate é treinado em resgate e primeiros socorros. Os demais acionam a emergência e isolam a área.`,
        textoApoio: `Emergência e salvamento (35.7)
• A organização estabelece, implementa e mantém procedimentos de resposta a emergências (35.7.1), que consideram:
  a) os riscos do resgate;
  b) a composição e o dimensionamento da equipe;
  c) o tempo estimado para o resgate;
  d) as técnicas, os equipamentos e os sistemas para reduzir o tempo de suspensão.
• Análise de risco para cada cenário de emergência identificado (35.7.1.1).
• A equipe tem os recursos necessários para responder (35.7.2).
• Quem resgata é capacitado em resgate e primeiros socorros e está física e mentalmente apto (35.7.3). Para equipe interna, a empresa define o conteúdo e a carga desse treinamento (35.7.3.1).

O que todo trabalhador faz (noções)
• Aciona a emergência conforme o plano da obra (no Brasil: SAMU 192, Bombeiros 193) e avisa o encarregado.
• Não tenta resgate improvisado sem treinamento e equipamento: isso cria uma segunda vítima.
• Isola a área e afasta curiosos.
• Fica com a vítima consciente, conversando, até a equipe chegar.
• Após o resgate, segue as orientações do primeiro socorro treinado e do atendimento especializado.
[As técnicas de resgate e de primeiros socorros são praticadas na turma presencial com o instrutor.]`,
        exemplo: "Um montador fica suspenso no talabarte após escorregar da viga. O colega aciona o encarregado e o plano de emergência; a equipe de resgate da obra usa o kit já posicionado e o desce com a plataforma elevatória prevista na AR.",
        perguntaFixacao: "Por que o tempo de suspensão após a queda deve ser o menor possível?",
        resumo: "Resgate planejado antes de subir: procedimento, equipe, tempo e equipamento. Quem não é da equipe aciona a emergência, isola e não improvisa resgate.",
      },
    ],
  },
];

// Banco para a PROVA ESCRITA PRESENCIAL (o instrutor imprime e aplica na turma).
export const questoesNr35: QuestaoSeed[] = [
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Pela NR-35, trabalho em altura é a atividade:",
    alternativas: [
      { id: "a", texto: "Acima de 1,5 m do piso, com ou sem risco de queda." },
      { id: "b", texto: "Com diferença de nível acima de 2,0 m, onde haja risco de queda." },
      { id: "c", texto: "Somente acima de 3 m, em andaimes." },
      { id: "d", texto: "Qualquer atividade sobre escada." } ],
    correta: "b", comentario: "NR-35, 35.2.1: diferença de nível acima de 2,0 m com risco de queda." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Desde a Portaria MTE nº 1.259/2026, os treinamentos da NR-35 devem ser realizados:",
    alternativas: [
      { id: "a", texto: "Totalmente a distância." },
      { id: "b", texto: "Semipresenciais, com a teoria online." },
      { id: "c", texto: "Na modalidade presencial." },
      { id: "d", texto: "Na modalidade escolhida pelo trabalhador." } ],
    correta: "c", comentario: "Item 35.4.5: os treinamentos previstos na NR-35 devem ser realizados na modalidade presencial." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "A carga horária mínima do treinamento inicial da NR-35 é:",
    alternativas: [
      { id: "a", texto: "4 horas." }, { id: "b", texto: "8 horas." }, { id: "c", texto: "16 horas." }, { id: "d", texto: "Não há carga mínima." } ],
    correta: "b", comentario: "35.4.2.1: mínimo de 8 horas, antes do início da atividade." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "O treinamento periódico da NR-35 deve ser feito:",
    alternativas: [
      { id: "a", texto: "A cada ano, com 4 horas." },
      { id: "b", texto: "A cada dois anos, com no mínimo 8 horas." },
      { id: "c", texto: "Só quando o trabalhador mudar de empresa." },
      { id: "d", texto: "A cada cinco anos." } ],
    correta: "b", comentario: "35.4.2.2: a cada dois anos, carga mínima de 8 horas." },
  { tipo: "SITUACIONAL", enunciado: "Um ajudante tem certificado de NR-35 válido, mas ainda não foi autorizado pela empresa. Ele pode trabalhar em altura?",
    alternativas: [
      { id: "a", texto: "Sim, o certificado basta." },
      { id: "b", texto: "Sim, se o encarregado deixar verbalmente." },
      { id: "c", texto: "Não: só trabalha em altura quem é formalmente autorizado pela organização." },
      { id: "d", texto: "Sim, desde que use cinto." } ],
    correta: "c", comentario: "35.4.1: todo trabalho em altura é feito por trabalhador formalmente autorizado. A autorização considera tarefas, treinamento e aptidão." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Para ser considerado autorizado, o trabalhador precisa:",
    alternativas: [
      { id: "a", texto: "Apenas ter experiência anterior." },
      { id: "b", texto: "Ser capacitado, ter a saúde avaliada e ser considerado apto." },
      { id: "c", texto: "Ter cinto próprio." },
      { id: "d", texto: "Ter mais de dois anos de empresa." } ],
    correta: "b", comentario: "35.4.1.1: capacitado, com estado de saúde avaliado e considerado apto." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Qual é a ordem correta das medidas para o trabalho em altura?",
    alternativas: [
      { id: "a", texto: "Usar cinto, isolar a área, evitar o trabalho." },
      { id: "b", texto: "Evitar o trabalho em altura, eliminar o risco de queda, minimizar as consequências da queda." },
      { id: "c", texto: "Minimizar as consequências, evitar, eliminar." },
      { id: "d", texto: "Qualquer ordem, desde que todas sejam feitas." } ],
    correta: "b", comentario: "35.5.2: evitar; eliminar o risco; minimizar as consequências." },
  { tipo: "SITUACIONAL", enunciado: "A equipe pode montar as terças de um módulo da cobertura no chão e içar o conjunto pronto. Pela hierarquia da NR-35, isso é:",
    alternativas: [
      { id: "a", texto: "Uma medida para evitar o trabalho em altura, a primeira da hierarquia." },
      { id: "b", texto: "Proibido, porque toda montagem deve ser feita no alto." },
      { id: "c", texto: "Irrelevante para a segurança." },
      { id: "d", texto: "Uma medida de proteção individual." } ],
    correta: "a", comentario: "Pré-montar no solo reduz ou evita a exposição em altura: é a primeira medida da hierarquia." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Quando a análise de risco deve ser feita?",
    alternativas: [
      { id: "a", texto: "Depois do serviço, para registro." },
      { id: "b", texto: "Antes de todo trabalho em altura." },
      { id: "c", texto: "Só em atividades acima de 10 m." },
      { id: "d", texto: "Só quando houver acidente." } ],
    correta: "b", comentario: "35.5.5: todo trabalho em altura deve ser precedido de análise de risco." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Qual destes itens NÃO está entre os que a análise de risco deve considerar?",
    alternativas: [
      { id: "a", texto: "Condições meteorológicas adversas." },
      { id: "b", texto: "Sistemas e pontos de ancoragem." },
      { id: "c", texto: "A cor do uniforme da equipe." },
      { id: "d", texto: "Planejamento do resgate e primeiros socorros." } ],
    correta: "c", comentario: "35.5.5.1 lista local, isolamento, ancoragem, clima, sistemas de proteção, queda de materiais, trabalhos simultâneos, outras NRs, riscos adicionais, condições impeditivas, emergência, comunicação e supervisão." },
  { tipo: "SITUACIONAL", enunciado: "A troca de uma terça empenada, fora da sequência normal da montagem, é uma atividade não rotineira em altura. O que é exigido?",
    alternativas: [
      { id: "a", texto: "Nada além do cinto." },
      { id: "b", texto: "Autorização prévia por permissão de trabalho, com as medidas da análise de risco." },
      { id: "c", texto: "Somente avisar o cliente." },
      { id: "d", texto: "Um e-mail ao RH." } ],
    correta: "b", comentario: "35.5.7: atividades não rotineiras devem ser previamente autorizadas por PT." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "A permissão de trabalho é válida:",
    alternativas: [
      { id: "a", texto: "Por toda a obra." },
      { id: "b", texto: "Por uma semana." },
      { id: "c", texto: "Apenas para a duração da atividade e para o turno, podendo ser revalidada se nada mudar." },
      { id: "d", texto: "Por 30 dias." } ],
    correta: "c", comentario: "35.5.8.2." },
  { tipo: "SITUACIONAL", enunciado: "No meio da montagem de uma tesoura, começa uma tempestade com raios. O que fazer?",
    alternativas: [
      { id: "a", texto: "Terminar a peça rapidamente." },
      { id: "b", texto: "Interromper: é condição impeditiva. Descer em segurança conforme o procedimento." },
      { id: "c", texto: "Continuar, porque o cinto protege." },
      { id: "d", texto: "Esperar no alto até passar." } ],
    correta: "b", comentario: "Condições meteorológicas adversas são condição impeditiva: o serviço não começa ou é interrompido." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Sobre os sistemas de proteção contra quedas, é correto afirmar:",
    alternativas: [
      { id: "a", texto: "O individual tem prioridade sobre o coletivo." },
      { id: "b", texto: "O coletivo tem prioridade; o individual entra quando o coletivo é inviável, incompleto ou em emergência." },
      { id: "c", texto: "Basta um dos dois, à escolha do encarregado." },
      { id: "d", texto: "O coletivo é proibido em montagem metálica." } ],
    correta: "b", comentario: "35.6.3." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "O sistema de proteção coletiva contra quedas deve ser:",
    alternativas: [
      { id: "a", texto: "Improvisado pela equipe com o material da obra." },
      { id: "b", texto: "Projetado por profissional legalmente habilitado." },
      { id: "c", texto: "Escolhido pelo fornecedor de telhas." },
      { id: "d", texto: "Dispensado quando há cinto." } ],
    correta: "b", comentario: "35.6.3.1." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Na retenção de queda, o trabalhador usa:",
    alternativas: [
      { id: "a", texto: "Cinto abdominal." },
      { id: "b", texto: "Cinturão tipo paraquedista, conectado no ponto indicado pelo fabricante." },
      { id: "c", texto: "Corda amarrada na cintura." },
      { id: "d", texto: "Qualquer cinturão, conectado em qualquer argola." } ],
    correta: "b", comentario: "35.6.9 e 35.6.9.1." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "O talabarte usado para retenção de queda deve:",
    alternativas: [
      { id: "a", texto: "Ter absorvedor de energia integrado." },
      { id: "b", texto: "Ser o mais curto possível, sem absorvedor." },
      { id: "c", texto: "Ser de corda comum." },
      { id: "d", texto: "Ser emendado em outro para alcançar mais longe." } ],
    correta: "a", comentario: "35.6.9.1.1." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "A força de impacto transmitida ao trabalhador numa queda retida não pode passar de:",
    alternativas: [
      { id: "a", texto: "2 kN." }, { id: "b", texto: "6 kN." }, { id: "c", texto: "12 kN." }, { id: "d", texto: "Não há limite." } ],
    correta: "b", comentario: "35.6.7." },
  { tipo: "SITUACIONAL", enunciado: "Para passar por um pilar sobre a viga, o montador precisa trocar de ponto de ancoragem. O correto é:",
    alternativas: [
      { id: "a", texto: "Soltar o talabarte rapidamente e reconectar do outro lado." },
      { id: "b", texto: "Usar talabarte duplo: conectar o segundo braço antes de soltar o primeiro." },
      { id: "c", texto: "Segurar no pilar com as mãos." },
      { id: "d", texto: "Pedir a um colega que o segure." } ],
    correta: "b", comentario: "A AR considera a conexão contínua durante toda a exposição (35.6.11, a). O talabarte duplo permite isso." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Fator de queda é:",
    alternativas: [
      { id: "a", texto: "A altura do prédio dividida por dois." },
      { id: "b", texto: "A razão entre a distância que o trabalhador percorreria na queda e o comprimento do equipamento que irá detê-la." },
      { id: "c", texto: "O peso do trabalhador." },
      { id: "d", texto: "O número de quedas que o equipamento aguenta." } ],
    correta: "b", comentario: "Definição do glossário da NR-35. Ancoragem acima da cabeça reduz o fator de queda." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Zona livre de queda é:",
    alternativas: [
      { id: "a", texto: "A área isolada no chão." },
      { id: "b", texto: "O espaço mínimo abaixo do ponto de ancoragem (ou dos pés, no trava-quedas) para que, após a queda, o trabalhador não colida com estrutura, obstáculo ou solo." },
      { id: "c", texto: "A área onde é proibido trabalhar." },
      { id: "d", texto: "A distância entre duas ancoragens." } ],
    correta: "b", comentario: "Definição do glossário da NR-35." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "É correto em relação ao uso de talabartes:",
    alternativas: [
      { id: "a", texto: "Pode-se fazer nó para encurtar." },
      { id: "b", texto: "Pode-se emendar dois talabartes para alcançar a ancoragem." },
      { id: "c", texto: "Não se conecta talabarte a outro talabarte, conector ou extensor, nem se faz nó ou laço, salvo previsão do fabricante." },
      { id: "d", texto: "Qualquer ajuste é permitido se o encarregado autorizar." } ],
    correta: "c", comentario: "35.6.11.1.1." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "A inspeção rotineira do equipamento individual de proteção contra quedas é feita:",
    alternativas: [
      { id: "a", texto: "Uma vez por ano." },
      { id: "b", texto: "Antes do início dos trabalhos." },
      { id: "c", texto: "Só quando o equipamento é novo." },
      { id: "d", texto: "Só pelo fabricante." } ],
    correta: "b", comentario: "35.6.6.2. A periódica é no mínimo a cada 12 meses (35.6.6.3)." },
  { tipo: "SITUACIONAL", enunciado: "Na inspeção antes do uso, o montador vê que o absorvedor do talabarte está aberto, sinal de que já segurou uma queda. O que fazer?",
    alternativas: [
      { id: "a", texto: "Usar mesmo assim, porque ainda está inteiro." },
      { id: "b", texto: "Recusar o equipamento, avisar e encaminhar para descarte, com registro." },
      { id: "c", texto: "Costurar o absorvedor." },
      { id: "d", texto: "Usar só em alturas menores." } ],
    correta: "b", comentario: "35.6.6.5: elementos que sofreram impacto de queda são inutilizados e descartados, salvo restauração prevista pelo fabricante. A recusa é registrada (35.6.6.4)." },
  { tipo: "SITUACIONAL", enunciado: "Um colega cai e fica suspenso pelo talabarte. Você não faz parte da equipe de resgate. O que fazer?",
    alternativas: [
      { id: "a", texto: "Subir sozinho e tentar puxá-lo." },
      { id: "b", texto: "Acionar a emergência conforme o plano da obra, avisar o encarregado, isolar a área e não improvisar resgate." },
      { id: "c", texto: "Esperar o fim do turno." },
      { id: "d", texto: "Cortar o talabarte para ele cair na caçamba." } ],
    correta: "b", comentario: "O resgate é feito pela equipe treinada e equipada (35.7). Resgate improvisado cria uma segunda vítima. O tempo em suspensão deve ser o menor possível." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Os procedimentos de emergência e resgate devem considerar, entre outros:",
    alternativas: [
      { id: "a", texto: "O tempo estimado para o resgate e as técnicas para reduzir o tempo de suspensão." },
      { id: "b", texto: "Apenas o telefone do SAMU." },
      { id: "c", texto: "Apenas o nome do encarregado." },
      { id: "d", texto: "Nada; o resgate é improvisado na hora." } ],
    correta: "a", comentario: "35.7.1: riscos do resgate, equipe, tempo estimado, técnicas e equipamentos para reduzir a suspensão." },
  { tipo: "SITUACIONAL", enunciado: "A telha da cobertura ainda não tem passarela e o montador precisa chegar à calha. O correto é:",
    alternativas: [
      { id: "a", texto: "Pisar na telha translúcida, que é mais leve." },
      { id: "b", texto: "Andar sobre a manta entre as terças." },
      { id: "c", texto: "Seguir a AR: passarela ou apoio sobre a estrutura, com linha de vida, nunca pisando em telha frágil ou fora do apoio." },
      { id: "d", texto: "Ir rápido para não dar tempo de a telha ceder." } ],
    correta: "c", comentario: "Queda através de telha frágil e manta é acidente típico. A barreira é planejada na AR." },
  { tipo: "MULTIPLA_ESCOLHA", enunciado: "Por quanto tempo, no mínimo, a organização guarda a documentação prevista na NR-35, quando outra NR não fixar prazo diferente?",
    alternativas: [
      { id: "a", texto: "1 ano." }, { id: "b", texto: "2 anos." }, { id: "c", texto: "5 anos." }, { id: "d", texto: "Não precisa guardar." } ],
    correta: "c", comentario: "35.3.1, j." },
];
