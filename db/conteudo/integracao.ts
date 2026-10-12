// MÓDULO 01 — INTEGRAÇÃO INSTITUCIONAL PALLA CONSTRUÇÕES
// Status: EM REVISÃO. Trechos entre [A PREENCHER PELA PALLA: ...] dependem de informação oficial da empresa
// e NÃO devem ser publicados antes de preenchidos e aprovados pelo responsável técnico e pela diretoria.

export type AulaSeed = {
  titulo: string; duracaoMin: number; roteiro: string; narracao: string; textoApoio: string;
  exemplo?: string; perguntaFixacao?: string; resumo: string; videoUrl?: string; legendaUrl?: string;
  duracaoSeg?: number; posterUrl?: string;
};
export type CapituloSeed = { titulo: string; aulas: AulaSeed[] };
export type QuestaoSeed = {
  tipo: "MULTIPLA_ESCOLHA" | "SITUACIONAL"; enunciado: string;
  alternativas: { id: string; texto: string }[]; correta: string; comentario: string;
  codigo?: string; nivel?: string; diagnostica?: boolean;
};

export const capitulosIntegracao: CapituloSeed[] = [
  {
    titulo: "Bem-vindo ao Grupo Palla",
    aulas: [
      {
        titulo: "Quem somos: Grupo Palla e Palla Construções",
        duracaoMin: 6,
        roteiro: `CENA 1 (0:00–0:30) — Abertura com imagens aéreas de obras de estrutura metálica da Palla. Logotipo Palla Construções ao centro.
CENA 2 (0:30–2:30) — Apresentador(a) da diretoria em frente a uma estrutura montada. Texto de narração, bloco 1.
CENA 3 (2:30–4:30) — Linha do tempo animada com marcos da empresa. [A PREENCHER PELA PALLA: datas e marcos]
CENA 4 (4:30–6:00) — Mosaico de obras e equipes. Encerramento com a frase "Aqui, segurança e qualidade andam juntas".`,
        narracao: `Seja bem-vindo à Palla Construções, empresa do Grupo Palla.
Você está começando a sua integração. Ela foi feita para que você chegue à obra sabendo como trabalhamos, o que esperamos de você e o que você pode esperar de nós.
A Palla Construções atua na montagem de estruturas metálicas: recebemos as peças, conferimos, içamos, posicionamos, alinhamos, parafusamos e soldamos até a estrutura estar pronta para as próximas etapas da obra.
[A PREENCHER PELA PALLA: história do Grupo Palla, ano de fundação, onde atua, principais obras e números oficiais.]
O que importa agora é você saber uma coisa: cada estrutura que entregamos depende do trabalho bem feito de cada pessoa da equipe, e nenhuma obra vale mais do que a sua vida.`,
        textoApoio: `O Grupo Palla reúne empresas ligadas à construção. A Palla Construções é a empresa do grupo responsável pela montagem de estruturas metálicas e pelos treinamentos internos das equipes que atuam nas obras.

O que a Palla Construções faz no dia a dia:
• Recebimento, conferência e armazenamento das peças na obra.
• Planejamento e sequência de montagem.
• Içamento e posicionamento de pilares, vigas e contraventamentos.
• Alinhamento, nivelamento, ligações parafusadas e soldadas.
• Inspeção e liberação das etapas para o cliente.

[A PREENCHER PELA PALLA: histórico, empresas do grupo, áreas de atuação, obras de referência.]`,
        exemplo: "Numa obra de galpão, a Palla recebe as peças da fábrica, monta pilares e vigas na sequência do projeto e entrega a estrutura alinhada e com as ligações inspecionadas para a equipe de cobertura.",
        perguntaFixacao: "Qual é a atividade principal da Palla Construções dentro de uma obra?",
        resumo: "A Palla Construções, do Grupo Palla, monta estruturas metálicas. Qualidade e segurança fazem parte do mesmo trabalho.",
      },
      {
        titulo: "Missão, visão, valores e organização da empresa",
        duracaoMin: 6,
        roteiro: `CENA 1 — Cartelas com Missão, Visão e Valores (texto oficial).
CENA 2 — Organograma simplificado animado: diretoria, engenharia, segurança do trabalho, RH, suprimentos, equipes de obra.
CENA 3 — Foco na equipe de obra: gerente de montagem, supervisor, encarregado, montadores, soldadores, ajudantes, sinaleiro e operadores.`,
        narracao: `Toda empresa precisa saber para onde vai. Na Palla, isso está na nossa missão, na nossa visão e nos nossos valores.
[A PREENCHER PELA PALLA: texto oficial da missão, da visão e dos valores.]
Agora, veja como a empresa se organiza. Na obra, você vai trabalhar com uma equipe liderada pelo encarregado de montagem, que responde ao supervisor e à gerência de montagem. A Segurança do Trabalho acompanha todas as frentes, e o RH cuida dos seus documentos e do seu cadastro.
Saber quem é quem é importante: é assim que você sabe a quem pedir orientação, a quem comunicar um problema e quem pode liberar uma tarefa.`,
        textoApoio: `MISSÃO: [A PREENCHER PELA PALLA]
VISÃO: [A PREENCHER PELA PALLA]
VALORES: [A PREENCHER PELA PALLA]

Organização típica de uma frente de montagem:
• Gerente de montagem: planeja e responde pelas obras.
• Supervisor de montagem: acompanha várias frentes e o cronograma.
• Encarregado de montagem: lidera a equipe no dia a dia, distribui tarefas e conduz o DDS.
• Montadores, soldadores e ajudantes: executam a montagem.
• Sinaleiro e operadores: conduzem a movimentação de cargas.
• Segurança do Trabalho: orienta, inspeciona e pode paralisar tarefas inseguras.
• RH: cadastro, documentos, benefícios e dúvidas trabalhistas.

[A PREENCHER PELA PALLA: organograma oficial e contatos.]`,
        perguntaFixacao: "Na sua frente de trabalho, quem distribui as tarefas do dia e conduz o DDS?",
        resumo: "Conheça a missão, a visão e os valores da Palla e saiba quem é quem: encarregado, supervisor, gerência, Segurança do Trabalho e RH.",
      },
    ],
  },
  {
    titulo: "Conduta e relações de trabalho",
    aulas: [
      {
        titulo: "Código de conduta profissional",
        duracaoMin: 7,
        roteiro: `CENA 1 — Equipe chegando à obra, uniformizada, crachá visível.
CENA 2 — Três situações curtas encenadas: respeito entre colegas; trato com o cliente; uso correto de materiais da empresa.
CENA 3 — Cartela: "Assédio e discriminação não são tolerados. Denuncie."`,
        narracao: `O código de conduta da Palla resume como nos comportamos dentro e fora da obra quando estamos representando a empresa.
Respeito vem primeiro: tratamos colegas, clientes, fornecedores e vizinhos da obra com educação, sem apelidos ofensivos, sem brincadeiras que humilhem e sem qualquer tipo de discriminação.
Assédio moral e assédio sexual não são tolerados. Quem sofrer ou presenciar deve comunicar a liderança, o RH ou o canal de denúncias, com garantia de que não haverá retaliação.
Cuidamos dos bens da empresa e do cliente: ferramentas, equipamentos, materiais e alojamentos. E somos honestos: horários, registros e apontamentos devem mostrar a verdade.`,
        textoApoio: `Princípios do código de conduta:
1. Respeito a todas as pessoas, sem discriminação de qualquer natureza.
2. Tolerância zero a assédio moral, assédio sexual e violência.
3. Honestidade nos registros de ponto, produção, inspeção e documentos.
4. Cuidado com os bens da empresa, do cliente e de terceiros.
5. Sigilo sobre informações do cliente e da obra.
6. Boa convivência no canteiro e no alojamento.
7. Comunicação de irregularidades pelos canais oficiais, sem medo de retaliação.

Canal de denúncias: [A PREENCHER PELA PALLA: telefone, e-mail ou formulário oficial].
Organizações com CIPA também devem adotar medidas de prevenção e combate ao assédio (NR-1, Portaria MTP nº 4.219/2022).`,
        exemplo: "Um colega começa a fazer piadas sobre a origem de um ajudante novo. A atitude correta é interromper, deixar claro que isso não é aceito e comunicar o encarregado ou o RH se continuar.",
        perguntaFixacao: "Se você presenciar um caso de assédio na obra, a quem pode comunicar?",
        resumo: "Respeito, honestidade e cuidado com os bens. Assédio e discriminação não são tolerados e podem ser denunciados sem retaliação.",
      },
      {
        titulo: "Direitos e deveres dos colaboradores",
        duracaoMin: 6,
        roteiro: `CENA 1 — Duas colunas animadas: "Seus direitos" e "Seus deveres".
CENA 2 — Destaque para o direito de recusa e para o dever de usar o EPI.`,
        narracao: `Trabalhar com segurança é um direito seu e também um dever.
Você tem direito a receber os EPIs adequados sem custo, a ser treinado antes de começar uma atividade, a saber quais são os riscos do seu trabalho e as medidas para controlá-los, e a recusar uma tarefa quando houver risco grave e iminente.
Você tem o dever de cumprir as normas e os procedimentos de segurança, usar corretamente os EPIs, participar dos treinamentos e dos exames médicos, e comunicar qualquer condição insegura.
O tempo gasto nos treinamentos previstos nas Normas Regulamentadoras é tempo de trabalho efetivo.`,
        textoApoio: `Direitos (NR-1 e NR-6):
• Receber EPI adequado, gratuito e em bom estado.
• Receber informações sobre os riscos e as medidas de prevenção.
• Ser capacitado antes de iniciar a função; o tempo de treinamento conta como trabalho (NR-1, 1.7.2).
• Interromper a atividade diante de risco grave e iminente, comunicando a liderança (direito de recusa, NR-1).

Deveres:
• Cumprir as normas e os procedimentos de segurança da empresa e da obra.
• Usar o EPI apenas para a finalidade a que se destina, guardar e conservar (NR-6).
• Comunicar perda, dano ou alteração que torne o EPI impróprio.
• Submeter-se aos exames médicos previstos.
• Comunicar imediatamente incidentes e condições inseguras.

Direitos trabalhistas, benefícios e jornada: [A PREENCHER PELA PALLA/RH].`,
        perguntaFixacao: "O tempo que você passa em treinamento obrigatório conta como tempo de trabalho?",
        resumo: "Você tem direito a EPI, treinamento, informação e recusa diante de risco grave. Tem o dever de seguir as regras, usar o EPI e comunicar problemas.",
      },
      {
        titulo: "Comunicação com a liderança",
        duracaoMin: 5,
        roteiro: `CENA 1 — DDS no início do turno: encarregado fala, equipe pergunta.
CENA 2 — Montador interrompe a tarefa e chama o encarregado ao perceber uma peça diferente do projeto.`,
        narracao: `Na montagem, uma dúvida não esclarecida pode virar um acidente ou um retrabalho caro.
Por isso, pergunte sempre. O canal principal é o seu encarregado. Se ele não estiver, procure o supervisor ou a Segurança do Trabalho.
Participe do DDS, o Diálogo Diário de Segurança. É ali que se combina o trabalho do dia e os cuidados de cada tarefa.
E quando algo mudar, como uma peça diferente, um equipamento com defeito, o tempo virando ou uma equipe trabalhando embaixo, pare e comunique antes de continuar.`,
        textoApoio: `Como se comunicar bem na obra:
• Dúvida sobre a tarefa: encarregado. Ausente? Supervisor ou SST.
• Problema de segurança: comunicar na hora; se houver risco grave, parar a atividade.
• DDS: participe, pergunte e traga situações do dia.
• Rádio: mensagens curtas, identificação de quem fala e confirmação do que foi entendido.
• Nunca improvise uma mudança no método ou no equipamento sem autorização.

Contatos da obra: [preenchidos automaticamente com os dados da obra de destino].`,
        exemplo: "Ao conferir uma viga, o montador nota que a furação não bate com o pilar. Em vez de forçar com marreta ou alargar o furo, ele para e chama o encarregado, que consulta a engenharia.",
        perguntaFixacao: "O que fazer quando a peça não confere com o projeto?",
        resumo: "Pergunte, participe do DDS e pare para comunicar sempre que algo mudar. Improvisar não é uma opção.",
      },
    ],
  },
  {
    titulo: "O canteiro de obras",
    aulas: [
      {
        titulo: "Organização do canteiro e regras de acesso e permanência",
        duracaoMin: 7,
        roteiro: `CENA 1 — Portaria da obra: identificação, crachá, conferência de EPI.
CENA 2 — Percurso pelo canteiro: rotas de pedestres, áreas isoladas, área de vivência, depósito de peças.
CENA 3 — Placas e fitas de isolamento; cena de alguém atravessando área isolada é interrompida.`,
        narracao: `Um canteiro organizado é um canteiro mais seguro.
Para entrar na obra, você precisa estar liberado no sistema, com crachá e com os EPIs obrigatórios. A liberação depende da integração, dos treinamentos da sua função, do ASO e dos documentos exigidos pela obra e pelo cliente.
Dentro do canteiro, use as rotas de pedestres, respeite as áreas isoladas e nunca passe por baixo de cargas suspensas.
Mantenha a frente de trabalho limpa: sobras de material, parafusos e ferramentas no chão causam quedas e cortes.
E lembre: cada obra pode ter regras próprias do cliente. Elas fazem parte da sua integração.`,
        textoApoio: `Regras de acesso:
• Entrada só com liberação registrada, crachá e EPIs obrigatórios.
• Horários de entrada e saída definidos pela obra.
• Visitantes só acompanhados e após orientação de segurança.

Regras de permanência:
• Circule pelas rotas de pedestres sinalizadas.
• Respeite isolamentos (fitas, cones, cavaletes, placas).
• Não permaneça nem passe sob cargas suspensas.
• Mantenha a frente de trabalho limpa e organizada ao longo do dia e ao final do turno.
• Alimentação e descanso apenas na área de vivência.
• Fumar somente em local autorizado e longe de inflamáveis.

Regras específicas da obra e do contratante: [exibidas conforme a obra cadastrada].`,
        exemplo: "Um ajudante vê que o caminho mais curto até o banheiro passa pela área isolada de içamento. O certo é contornar pela rota de pedestres, mesmo que demore mais.",
        perguntaFixacao: "Você pode cruzar uma área isolada se ninguém estiver trabalhando no momento?",
        resumo: "Entre liberado, circule pelas rotas, respeite os isolamentos, nunca fique sob carga suspensa e mantenha tudo organizado.",
      },
      {
        titulo: "Uso de celular no ambiente operacional",
        duracaoMin: 4,
        roteiro: `CENA 1 — Montador em plataforma mexendo no celular; corte para alerta.
CENA 2 — Uso correto: comunicação no ponto seguro, rádio para operação.`,
        narracao: `O celular distrai, e distração na montagem pode custar uma mão, um dedo ou uma vida.
Na frente de trabalho, o celular fica guardado. Não use durante içamentos, trabalho em altura, operação de máquinas, soldagem ou corte.
Se precisar usar, vá até um local seguro, fora da área de risco. Para a comunicação operacional, use o rádio ou o meio definido pela obra.
Fotos e vídeos da obra só com autorização: o projeto e as instalações pertencem ao cliente.`,
        textoApoio: `Regras para celular:
• Proibido durante: içamento e sinalização de cargas, trabalho em altura, operação de máquinas e equipamentos, soldagem e corte, circulação por áreas de risco.
• Uso permitido em pausas, na área de vivência ou em ponto seguro indicado.
• Comunicação operacional: rádio ou meio definido pela obra.
• Fotos e vídeos: somente com autorização da liderança e do cliente.
• Fones de ouvido de música não são permitidos na frente de trabalho.`,
        perguntaFixacao: "Durante um içamento, o sinaleiro pode atender uma ligação rápida?",
        resumo: "Na frente de trabalho o celular fica guardado. Use só em local seguro e nunca durante tarefas críticas.",
      },
    ],
  },
  {
    titulo: "Segurança em primeiro lugar",
    aulas: [
      {
        titulo: "Regras internas de segurança e o direito de recusa",
        duracaoMin: 3,
        videoUrl: "/videos/INT-01-4-1.mp4",
        legendaUrl: "/videos/INT-01-4-1.vtt",
        roteiro: `CENA 1 — Lista animada das regras de ouro da montagem.
CENA 2 — Encenação: montador recusa subir sem ponto de ancoragem; encarregado apoia e resolve.`,
        narracao: `Algumas regras não têm exceção na Palla. São as nossas regras de ouro.
Nunca trabalhe em altura sem estar conectado a um ponto de ancoragem adequado. Nunca fique sob carga suspensa. Nunca opere máquina ou equipamento sem treinamento e autorização. Nunca retire proteções de máquinas. Nunca comece uma tarefa crítica sem a análise de risco e a permissão de trabalho, quando exigidas.
Se você perceber um risco grave e iminente, você pode e deve parar a atividade e comunicar a liderança. Esse é o direito de recusa, previsto na NR-1. Ninguém será punido por parar uma tarefa insegura.`,
        textoApoio: `Regras de ouro da Palla Construções:
1. Em altura, sempre conectado (NR-35).
2. Ninguém sob carga suspensa (NR-11 e NR-18).
3. Só opera máquina ou equipamento quem é capacitado e autorizado (NR-12 e NR-18).
4. Proteções de máquinas nunca são retiradas sem bloqueio e autorização.
5. Tarefa crítica só com APR e Permissão de Trabalho quando exigidas.
6. EPI correto, completo e em bom estado.
7. Área de içamento e de montagem sempre isolada.

Direito de recusa (NR-1): diante de risco grave e iminente, o trabalhador pode interromper a atividade, comunicando imediatamente o superior hierárquico, que diligenciará as medidas cabíveis.`,
        exemplo: "Ao chegar à viga onde iria trabalhar, o montador percebe que a linha de vida ainda não foi instalada. Ele não sobe, comunica o encarregado e só inicia depois da instalação e liberação da linha.",
        perguntaFixacao: "Cite duas regras de ouro que não têm exceção.",
        resumo: "As regras de ouro não têm exceção. Diante de risco grave e iminente, pare e comunique: é seu direito.",
      },
      {
        titulo: "Política de prevenção de acidentes e responsabilidades",
        duracaoMin: 6,
        roteiro: `CENA 1 — Pirâmide de controle de riscos: eliminar, substituir, proteção coletiva, procedimentos, EPI.
CENA 2 — Responsabilidades: empresa, liderança, trabalhador, equipe.`,
        narracao: `Prevenir acidentes é responsabilidade de todos, mas cada um tem o seu papel.
A empresa identifica os perigos e avalia os riscos no Programa de Gerenciamento de Riscos, o PGR, fornece proteções coletivas e EPIs, treina e fiscaliza.
A liderança planeja o trabalho com segurança, conduz o DDS, confere as condições antes de liberar a tarefa e corrige desvios na hora.
Você cumpre os procedimentos, usa os EPIs, cuida do colega e comunica os riscos.
E a equipe cuida de todos: se um colega estiver em risco, avise. Segurança é coletiva.`,
        textoApoio: `A prevenção segue a ordem de prioridade do gerenciamento de riscos (NR-1):
1. Eliminar o perigo.
2. Reduzir o risco com proteções coletivas (guarda-corpo, linha de vida, isolamento).
3. Medidas administrativas e de organização (procedimentos, APR, PT, sinalização).
4. EPI, como complemento.

Responsabilidades:
• Empresa: PGR, proteções, EPIs, treinamentos, exames, fiscalização.
• Liderança: planejar, orientar, liberar com segurança, corrigir desvios.
• Trabalhador: cumprir regras, usar EPI, comunicar riscos, cuidar de si e dos colegas.
• Equipe: vigilância mútua e ajuda.`,
        perguntaFixacao: "O EPI é a primeira ou a última barreira de proteção?",
        resumo: "A empresa gerencia os riscos, a liderança planeja e corrige e você cumpre e comunica. O EPI complementa, não substitui, as proteções coletivas.",
      },
      {
        titulo: "Política de álcool e drogas",
        duracaoMin: 5,
        roteiro: `CENA 1 — Portaria: orientação sobre a política.
CENA 2 — Cartela com canais de apoio.`,
        narracao: `Álcool e outras drogas reduzem a atenção, os reflexos e o equilíbrio. Em uma obra de estrutura metálica, isso é risco de morte para você e para os colegas.
Por isso, é proibido entrar ou permanecer na obra sob efeito de álcool ou drogas, e é proibido portar ou consumir essas substâncias no canteiro e nos alojamentos da empresa.
Se você usa algum medicamento que cause sonolência ou altere os reflexos, avise o encarregado ou a Segurança do Trabalho, sem precisar contar o diagnóstico.
E se você precisar de ajuda, procure o RH. Buscar ajuda é um ato de coragem e será tratado com sigilo.`,
        textoApoio: `Política de álcool e drogas:
• Proibido entrar ou permanecer na obra sob efeito de álcool ou drogas.
• Proibido portar, consumir ou oferecer essas substâncias no canteiro, nos veículos e nos alojamentos da empresa.
• Medicamentos que alterem atenção ou reflexos: comunicar a liderança ou a SST para avaliação da atividade.
• Apoio: o RH orienta sobre acompanhamento e encaminhamento, com sigilo.

Procedimentos de verificação e medidas aplicáveis: [A PREENCHER PELA PALLA conforme política aprovada e assessoria jurídica].`,
        perguntaFixacao: "O que fazer se você estiver usando um remédio que dá sono?",
        resumo: "Álcool e drogas são proibidos na obra e no alojamento. Avise sobre remédios que alterem os reflexos e procure ajuda quando precisar.",
      },
    ],
  },
  {
    titulo: "Quando algo dá errado",
    aulas: [
      {
        titulo: "Comunicação de incidentes e quase acidentes",
        duracaoMin: 6,
        roteiro: `CENA 1 — Parafuso cai de uma viga e passa perto de um ajudante (quase acidente).
CENA 2 — Equipe comunica, área é isolada, causa é analisada no DDS seguinte.`,
        narracao: `Um quase acidente é um aviso. Um parafuso que caiu e não acertou ninguém mostra que, da próxima vez, pode acertar.
Por isso, todo acidente, incidente ou quase acidente deve ser comunicado imediatamente ao encarregado e à Segurança do Trabalho.
Em caso de acidente com vítima, acione o socorro conforme o plano de emergência da obra, não mova a vítima a menos que haja risco maior, e isole a área.
Comunicar não é dedurar. É assim que a gente descobre a causa e evita que aconteça de novo.`,
        textoApoio: `O que comunicar:
• Acidente: evento com lesão ou dano.
• Incidente: evento sem lesão, mas com dano ou potencial de dano.
• Quase acidente: situação que por pouco não causou lesão ou dano.
• Condição insegura: algo que pode causar um acidente.

Como comunicar:
1. Garanta a segurança do local e isole a área.
2. Avise imediatamente o encarregado e a SST.
3. Em caso de vítima, acione o socorro pelo plano de emergência da obra.
4. Preserve o local para análise, quando possível.
5. Participe da análise e das ações corretivas.

Telefones de emergência da obra: [exibidos conforme a obra].`,
        exemplo: "Durante a montagem de terças, uma porca cai do nível superior e atinge o chão a um metro de um ajudante. A equipe para, isola a área abaixo, comunica a SST, e a análise leva à adoção de bolsas porta-parafusos.",
        perguntaFixacao: "Um quase acidente precisa ser comunicado mesmo sem ninguém ferido?",
        resumo: "Comunique todo acidente, incidente e quase acidente na hora. Isole, avise, preserve e participe da análise.",
      },
      {
        titulo: "Procedimentos disciplinares",
        duracaoMin: 5,
        roteiro: `CENA 1 — Cartela: "Regras existem para proteger".
CENA 2 — Linha de etapas: orientação, advertência, suspensão, conforme a gravidade.`,
        narracao: `As regras da Palla existem para proteger as pessoas. Quando alguém descumpre uma regra, a empresa precisa agir.
As medidas seguem a legislação trabalhista e são proporcionais à gravidade: podem ir de uma orientação até uma advertência, uma suspensão ou, em casos graves previstos em lei, a dispensa.
Descumprir uma regra de ouro de segurança é falta grave, porque coloca vidas em risco.
E lembre: parar uma tarefa por risco grave e iminente nunca é motivo de punição.`,
        textoApoio: `Princípios dos procedimentos disciplinares:
• Medidas proporcionais à gravidade e aplicadas de forma imediata e coerente.
• Registro formal de toda medida aplicada, com direito de manifestação do colaborador.
• O descumprimento de normas de segurança pode ser considerado ato faltoso (CLT, art. 158, parágrafo único).
• O exercício do direito de recusa diante de risco grave e iminente nunca é punido.

Tabela de condutas e medidas: [A PREENCHER PELA PALLA conforme regulamento interno aprovado pelo RH e pelo jurídico].`,
        perguntaFixacao: "Parar uma tarefa por risco grave pode gerar punição?",
        resumo: "As medidas disciplinares são proporcionais e registradas. Descumprir regra de ouro é grave. Exercer o direito de recusa nunca é punido.",
      },
    ],
  },
  {
    titulo: "Encerramento",
    aulas: [
      {
        titulo: "Revisão e próximos passos",
        duracaoMin: 4,
        roteiro: `CENA 1 — Recapitulação visual dos capítulos.
CENA 2 — Tela da plataforma mostrando a trilha do colaborador: próximos cursos, práticas presenciais e documentos.`,
        narracao: `Você chegou ao final da integração. Vamos relembrar: você conheceu a Palla, nosso jeito de trabalhar, as regras do canteiro, as regras de ouro, o direito de recusa e como comunicar incidentes.
Agora vem a avaliação. Depois dela, continue a sua trilha: cada função tem cursos obrigatórios e, em alguns casos, uma etapa prática presencial com instrutor.
Atenção: concluir a integração não libera o acesso à obra sozinho. A liberação depende de todos os requisitos da sua função e da aprovação de um responsável.
Bom trabalho e seja bem-vindo à Palla Construções.`,
        textoApoio: `Seus próximos passos:
1. Fazer a avaliação da integração.
2. Concluir os cursos obrigatórios da sua função.
3. Comparecer às práticas presenciais agendadas.
4. Enviar o ASO e os documentos pedidos.
5. Acompanhar na plataforma a situação da sua documentação.

A integração, sozinha, não autoriza o acesso à obra.`,
        resumo: "Faça a avaliação e siga a sua trilha. A liberação para a obra depende de todos os requisitos e de aprovação humana.",
      },
    ],
  },
];

export const questoesIntegracao: QuestaoSeed[] = [
  {
    tipo: "SITUACIONAL",
    enunciado: "Você vai trabalhar em uma viga e percebe que a linha de vida ainda não foi instalada. O encarregado está do outro lado da obra. O que você faz?",
    alternativas: [
      { id: "a", texto: "Sobe com cuidado e se prende na própria viga até a linha ser instalada." },
      { id: "b", texto: "Não sobe, comunica o encarregado e aguarda a instalação e liberação da linha de vida." },
      { id: "c", texto: "Pede para um colega segurar a sua mão enquanto você trabalha." },
      { id: "d", texto: "Sobe só para adiantar o serviço, porque é rápido." },
    ],
    correta: "b",
    comentario: "Trabalho em altura só com sistema de proteção contra quedas adequado e liberado. Diante de risco grave e iminente, o trabalhador interrompe e comunica (direito de recusa, NR-1).",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Sobre cargas suspensas, qual afirmação está correta?",
    alternativas: [
      { id: "a", texto: "Pode passar por baixo se a carga estiver parada." },
      { id: "b", texto: "Pode passar por baixo usando capacete." },
      { id: "c", texto: "Ninguém deve passar nem permanecer sob carga suspensa." },
      { id: "d", texto: "Só o sinaleiro pode ficar sob a carga." },
    ],
    correta: "c",
    comentario: "É uma regra de ouro: ninguém sob carga suspensa. O capacete não protege contra a queda de uma peça de estrutura.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "O que é um quase acidente?",
    alternativas: [
      { id: "a", texto: "Um acidente com afastamento menor que 15 dias." },
      { id: "b", texto: "Uma situação que por pouco não causou lesão ou dano." },
      { id: "c", texto: "Um acidente que aconteceu fora do horário de trabalho." },
      { id: "d", texto: "Um risco que ainda não foi identificado." },
    ],
    correta: "b",
    comentario: "Quase acidente é o evento que por pouco não causou lesão ou dano. Deve ser comunicado para que a causa seja tratada.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "Durante a montagem, uma porca cai do nível superior e atinge o chão perto de um ajudante, sem ferir ninguém. Qual é a atitude correta?",
    alternativas: [
      { id: "a", texto: "Continuar o trabalho, porque ninguém se machucou." },
      { id: "b", texto: "Pedir ao ajudante que preste mais atenção." },
      { id: "c", texto: "Parar, isolar a área abaixo e comunicar o encarregado e a Segurança do Trabalho." },
      { id: "d", texto: "Recolher a porca e comunicar no fim do dia." },
    ],
    correta: "c",
    comentario: "Quase acidentes devem ser comunicados imediatamente. Isolar a área abaixo evita que a próxima queda atinja alguém.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "O tempo gasto em treinamentos previstos nas Normas Regulamentadoras é:",
    alternativas: [
      { id: "a", texto: "Considerado tempo de trabalho efetivo." },
      { id: "b", texto: "Descontado do banco de horas." },
      { id: "c", texto: "Tempo livre do trabalhador." },
      { id: "d", texto: "Pago apenas se o trabalhador for aprovado." },
    ],
    correta: "a",
    comentario: "A NR-1 (item 1.7.2) considera o tempo despendido em treinamentos previstos nas NR como de trabalho efetivo.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "O sinaleiro está conduzindo o içamento de um pilar quando o celular toca. O que ele deve fazer?",
    alternativas: [
      { id: "a", texto: "Atender rapidamente, sem tirar os olhos da carga." },
      { id: "b", texto: "Pedir ao operador para continuar sozinho enquanto atende." },
      { id: "c", texto: "Ignorar a ligação e manter atenção total ao içamento; o celular fica guardado durante tarefas críticas." },
      { id: "d", texto: "Atender pelo fone de ouvido." },
    ],
    correta: "c",
    comentario: "O uso de celular é proibido durante içamentos e outras tarefas críticas. A comunicação operacional é feita pelo meio definido pela obra.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Na ordem de prioridade das medidas de prevenção, o EPI é:",
    alternativas: [
      { id: "a", texto: "A primeira medida a ser adotada." },
      { id: "b", texto: "Uma medida complementar às proteções coletivas e administrativas." },
      { id: "c", texto: "Dispensável quando há proteção coletiva." },
      { id: "d", texto: "Obrigatório só para quem trabalha em altura." },
    ],
    correta: "b",
    comentario: "Primeiro elimina-se o perigo, depois aplicam-se proteções coletivas e medidas administrativas. O EPI complementa essas medidas.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "Você percebe que a furação da viga não coincide com a do pilar. O que fazer?",
    alternativas: [
      { id: "a", texto: "Alargar o furo com o maçarico para encaixar." },
      { id: "b", texto: "Forçar o encaixe com marreta e pino." },
      { id: "c", texto: "Parar e comunicar o encarregado, que consultará a engenharia." },
      { id: "d", texto: "Soldar a ligação no lugar do parafuso." },
    ],
    correta: "c",
    comentario: "Mudanças no método ou na ligação exigem avaliação técnica. Improvisar pode comprometer a estrutura e a segurança.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Sobre álcool e drogas, a política da empresa determina que:",
    alternativas: [
      { id: "a", texto: "É permitido consumir no alojamento após o expediente." },
      { id: "b", texto: "É proibido entrar ou permanecer na obra sob efeito, e proibido portar ou consumir no canteiro e nos alojamentos." },
      { id: "c", texto: "Só é proibido para operadores de equipamentos." },
      { id: "d", texto: "É permitido em pequenas quantidades." },
    ],
    correta: "b",
    comentario: "A política proíbe estar sob efeito na obra e portar ou consumir no canteiro, nos veículos e nos alojamentos da empresa.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "Concluir a integração na plataforma significa que:",
    alternativas: [
      { id: "a", texto: "O colaborador já está liberado para entrar na obra." },
      { id: "b", texto: "O colaborador pode operar qualquer equipamento." },
      { id: "c", texto: "Uma etapa foi cumprida; a liberação depende dos demais requisitos e de aprovação de um responsável." },
      { id: "d", texto: "O ASO deixa de ser necessário." },
    ],
    correta: "c",
    comentario: "A integração é um dos requisitos. A liberação exige os treinamentos da função, o ASO, os documentos da obra e a aprovação humana.",
  },
  {
    tipo: "SITUACIONAL",
    enunciado: "Um colega faz piadas ofensivas repetidas sobre a origem de um ajudante novo. Qual é a atitude esperada?",
    alternativas: [
      { id: "a", texto: "Rir para não criar clima ruim." },
      { id: "b", texto: "Deixar claro que isso não é aceito e comunicar a liderança, o RH ou o canal de denúncias." },
      { id: "c", texto: "Ignorar, porque não é com você." },
      { id: "d", texto: "Responder com outra piada." },
    ],
    correta: "b",
    comentario: "Discriminação e assédio não são tolerados. Quem presencia deve comunicar pelos canais oficiais, sem retaliação.",
  },
  {
    tipo: "MULTIPLA_ESCOLHA",
    enunciado: "O caminho mais curto até a área de vivência passa por uma área isolada de içamento, sem ninguém trabalhando no momento. Você deve:",
    alternativas: [
      { id: "a", texto: "Passar rápido, já que não há içamento agora." },
      { id: "b", texto: "Usar a rota de pedestres e respeitar o isolamento." },
      { id: "c", texto: "Retirar a fita para passar e recolocar depois." },
      { id: "d", texto: "Passar se estiver com capacete." },
    ],
    correta: "b",
    comentario: "Isolamentos devem ser respeitados sempre. A situação da área pode mudar sem aviso.",
  },
];
