# Roteiros dos vídeos da Integração institucional (INT-01), aulas 2 a 13.
# Fonte única: db/conteudo/integracao.ts (narração e texto de apoio das aulas). Nada aqui cria regra nova da Palla.
# Gera video/v2/cenas/int-<n>-<nome>.json.  Uso: python3 video/v2/roteiros/integracao.py
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, "..", "cenas")
FOTO = lambda n: f"fotos/institucional/{n}.jpg"
FONTES = ["db/conteudo/integracao.ts (Módulo 01 — Integração institucional)"]


def roteiro(n, nome, titulo, cenas, pendencias=()):
    d = {
        "codigo": f"INT-{n}-{nome}", "titulo": titulo, "capitulo": f"Integração institucional · Aula {n}",
        "eyebrow": f"Integração · Aula {n}", "scripts": ["ilustracoes/icones.js"], "fontes": FONTES,
        "pendencias": list(pendencias), "cenas": cenas,
    }
    json.dump(d, open(os.path.join(SAIDA, f"int-{n}-{nome}.json"), "w"), ensure_ascii=False, indent=2)
    return d


def abertura(foto, titulo, objetivo, narracao):
    return {"tipo": "foto", "fotos": [{"src": FOTO(foto)}], "cap": "Integração institucional", "titulo": titulo,
            "itens": [{"m": "o", "texto": objetivo}], "narracao": narracao}


def pergunta(p, r, conta, narr):
    return {"tipo": "pergunta", "pergunta": p, "resposta": r, "conta": conta, "narracao": narr}


def checklist(itens, rodape, narr):
    return {"tipo": "checklist", "titulo": "Leve para a obra", "itens": [{"texto": t, "chave": f"c{i+1}"} for i, t in enumerate(itens)],
            "rodape": rodape, "narracao": narr}


R = []

# 2 — Missão, visão, valores e organização
R.append(roteiro(2, "missao", "Missão, visão, valores e organização da empresa", [
    abertura("escritorio", "Missão, visão e valores", "Para onde vamos e quem é quem na obra",
             "Toda empresa precisa saber para onde vai. {o}No Grupo Palla, isso está na missão, na visão e nos valores. E, na obra, você precisa saber quem é quem."),
    {"tipo": "cartoes", "titulo": "Missão e visão", "cards": [
        {"m": "mi", "icone": "flag", "titulo": "Missão", "texto": "Buscar constantemente a solução diferenciada de seus produtos com qualidade e competitividade."},
        {"m": "vi", "icone": "eye", "titulo": "Visão", "texto": "Atender as expectativas dos clientes, buscando o avanço de seus colaboradores, em parceria com os fornecedores, garantindo a satisfação dos clientes, respeitando o meio ambiente e a comunidade."},
    ], "narracao": "{mi}A nossa missão é buscar constantemente a solução diferenciada dos nossos produtos, com qualidade e competitividade. {vi}A nossa visão é atender as expectativas dos clientes, buscando o avanço dos colaboradores, em parceria com os fornecedores, garantindo a satisfação dos clientes, e respeitando o meio ambiente e a comunidade."},
    {"tipo": "cartoes", "titulo": "Nossos valores", "colunas": 3, "cards": [
        {"m": "v1", "icone": "scale", "titulo": "Ética e transparência", "texto": "nos relacionamentos"},
        {"m": "v2", "icone": "shield-check", "titulo": "Responsabilidade", "texto": "em cada decisão"},
        {"m": "v3", "icone": "users", "titulo": "Crescimento e valorização", "texto": "dos colaboradores", "cor": "vermelho"},
        {"m": "v4", "icone": "target", "titulo": "Foco no resultado", "texto": "buscando o desenvolvimento da empresa"},
        {"m": "v5", "icone": "refresh-cw", "titulo": "Melhoria contínua", "texto": "nos processos internos"},
    ], "narracao": "Os nossos valores são cinco. {v1}Ética e transparência nos relacionamentos. {v2}Responsabilidade em cada decisão. {v3}Crescimento e valorização dos colaboradores. {v4}Foco no resultado. {v5}E melhoria contínua. Perceba que valorizar quem trabalha aqui está na visão e nos valores. Isso inclui você."},
    {"tipo": "etapas", "titulo": "Quem é quem na frente de montagem", "etapas": [
        {"m": "g", "icone": "briefcase", "titulo": "Gerente de montagem", "texto": "planeja e responde pelas obras"},
        {"m": "s", "icone": "clipboard-list", "titulo": "Supervisor de montagem", "texto": "acompanha frentes e cronograma"},
        {"m": "e", "icone": "hard-hat", "titulo": "Encarregado", "texto": "lidera a equipe e conduz o DDS", "cor": "vermelho"},
        {"m": "m", "icone": "wrench", "titulo": "Montadores, soldadores e ajudantes", "texto": "executam a montagem"},
        {"m": "o", "icone": "radio", "titulo": "Sinaleiro e operadores", "texto": "conduzem a movimentação de cargas"},
    ], "narracao": "Agora, veja como a empresa se organiza. {g}A gerência de montagem planeja e responde pelas obras. {s}O supervisor acompanha as frentes e o cronograma. {e}Na obra, você vai trabalhar com uma equipe liderada pelo encarregado de montagem, que distribui as tarefas e conduz o DDS. {m}Montadores, soldadores e ajudantes executam a montagem. {o}E o sinaleiro e os operadores conduzem a movimentação de cargas."},
    {"tipo": "cartoes", "titulo": "Quem apoia todas as frentes", "cards": [
        {"m": "sst", "icone": "shield-alert", "titulo": "Segurança do Trabalho", "texto": "Orienta, inspeciona e pode paralisar tarefas inseguras.", "cor": "vermelho"},
        {"m": "rh", "icone": "id-card", "titulo": "RH", "texto": "Cadastro, documentos, benefícios e dúvidas trabalhistas."},
    ], "narracao": "{sst}A Segurança do Trabalho acompanha todas as frentes: orienta, inspeciona, e pode paralisar uma tarefa insegura. {rh}E o RH cuida dos seus documentos e do seu cadastro. Saber quem é quem é importante: é assim que você sabe a quem pedir orientação, a quem comunicar um problema, e quem pode liberar uma tarefa."},
    pergunta("Na sua frente de trabalho, quem distribui as tarefas do dia e conduz o DDS?", "O encarregado", "de montagem, que responde ao supervisor",
             "Sua vez: na sua frente de trabalho, quem distribui as tarefas do dia e conduz o DDS? {pensa}[[pausa:3]] {resp}O encarregado de montagem."),
    checklist(["Missão: soluções com qualidade e competitividade", "Valores: ética, responsabilidade, pessoas, resultado e melhoria", "Encarregado lidera; SST orienta e pode paralisar"],
              "Na dúvida, pergunte a quem lidera.",
              "Para levar para a obra: {c1}a missão é buscar soluções diferenciadas, com qualidade e competitividade. {c2}Os valores são ética, responsabilidade, valorização das pessoas, foco no resultado e melhoria contínua. {c3}Na obra, o encarregado lidera, e a Segurança do Trabalho orienta e pode paralisar. {fim}Na dúvida, pergunte a quem lidera."),
], ["Organograma oficial da Palla Construções e contatos de RH e SST [A PREENCHER PELA PALLA]"]))

# 3 — Código de conduta
R.append(roteiro(3, "conduta", "Código de conduta profissional", [
    abertura("gestamp-taubate", "Código de conduta", "Como nos comportamos dentro e fora da obra",
             "O código de conduta da Palla resume {o}como nos comportamos dentro e fora da obra, quando estamos representando a empresa."),
    {"tipo": "cartoes", "titulo": "Respeito vem primeiro", "cards": [
        {"m": "a", "icone": "handshake", "titulo": "Com todos", "texto": "colegas, clientes, fornecedores e vizinhos da obra"},
        {"m": "b", "icone": "message-circle-off", "titulo": "Sem humilhar", "texto": "sem apelidos ofensivos nem brincadeiras que humilhem", "cor": "vermelho"},
        {"m": "c", "icone": "users", "titulo": "Sem discriminação", "texto": "de qualquer natureza"},
    ], "narracao": "Respeito vem primeiro. {a}Tratamos colegas, clientes, fornecedores e vizinhos da obra com educação, {b}sem apelidos ofensivos, e sem brincadeiras que humilhem. {c}E sem qualquer tipo de discriminação."},
    {"tipo": "cartoes", "titulo": "Assédio não é tolerado", "linha": True, "cards": [
        {"m": "a", "icone": "ban", "titulo": "Tolerância zero", "texto": "assédio moral, assédio sexual e violência", "cor": "vermelho"},
        {"m": "b", "icone": "megaphone", "titulo": "Comunique", "texto": "liderança, RH ou canal de denúncias"},
        {"m": "c", "icone": "shield-check", "titulo": "Sem retaliação", "texto": "quem comunica é protegido", "cor": "verde"},
    ], "narracao": "{a}Assédio moral e assédio sexual não são tolerados. {b}Quem sofrer ou presenciar deve comunicar a liderança, o RH, ou o canal de denúncias, {c}com garantia de que não haverá retaliação."},
    {"tipo": "cartoes", "titulo": "Cuidado e honestidade", "cards": [
        {"m": "a", "icone": "package", "titulo": "Cuidar dos bens", "texto": "ferramentas, equipamentos, materiais e alojamentos"},
        {"m": "b", "icone": "clipboard-check", "titulo": "Registros verdadeiros", "texto": "ponto, produção, inspeção e documentos"},
        {"m": "c", "icone": "lock", "titulo": "Sigilo", "texto": "informações do cliente e da obra"},
    ], "narracao": "{a}Cuidamos dos bens da empresa e do cliente: ferramentas, equipamentos, materiais e alojamentos. {b}E somos honestos: horários, registros e apontamentos devem mostrar a verdade. {c}Informações do cliente e da obra ficam em sigilo."},
    pergunta("Se você presenciar um caso de assédio na obra, a quem pode comunicar?", "Liderança · RH · canal", "sem medo de retaliação",
             "Sua vez: se você presenciar um caso de assédio na obra, a quem pode comunicar? {pensa}[[pausa:3]] {resp}À liderança, ao RH, ou ao canal de denúncias. Sem medo de retaliação."),
    checklist(["Respeito a todas as pessoas", "Assédio e discriminação: tolerância zero", "Cuidado com os bens e registros verdadeiros"],
              "Comunicar é seguro: não há retaliação.",
              "Para levar para a obra: {c1}respeito a todas as pessoas. {c2}Assédio e discriminação não são tolerados. {c3}Cuide dos bens, e mantenha os registros verdadeiros. {fim}E lembre: comunicar é seguro, não há retaliação."),
], ["Canal de denúncias oficial [A PREENCHER PELA PALLA]"]))

# 4 — Direitos e deveres
R.append(roteiro(4, "direitos", "Direitos e deveres dos colaboradores", [
    abertura("parque-fabril", "Direitos e deveres", "Segurança é um direito seu e também um dever",
             "Trabalhar com segurança {o}é um direito seu, e também um dever."),
    {"tipo": "colunas", "titulo": "Seus direitos e seus deveres", "colunas": [
        {"titulo": "Seus direitos", "icone": "scale", "cor": "verde", "itens": [
            {"m": "d1", "texto": "EPI adequado, sem custo"}, {"m": "d2", "texto": "Treinamento antes da atividade"},
            {"m": "d3", "texto": "Saber os riscos e as medidas"}, {"m": "d4", "texto": "Recusar diante de risco grave e iminente"}]},
        {"titulo": "Seus deveres", "icone": "clipboard-check", "itens": [
            {"m": "v1", "texto": "Cumprir normas e procedimentos"}, {"m": "v2", "texto": "Usar e conservar o EPI"},
            {"m": "v3", "texto": "Participar de treinamentos e exames"}, {"m": "v4", "texto": "Comunicar condições inseguras"}]},
    ], "narracao": "Você tem direito {d1}a receber os EPIs adequados sem custo, {d2}a ser treinado antes de começar uma atividade, {d3}a saber quais são os riscos do seu trabalho e as medidas para controlá-los, {d4}e a recusar uma tarefa quando houver risco grave e iminente. E você tem o dever {v1}de cumprir as normas e os procedimentos de segurança, {v2}usar corretamente os EPIs, {v3}participar dos treinamentos e dos exames médicos, {v4}e comunicar qualquer condição insegura."},
    {"tipo": "cartoes", "titulo": "Treinamento é trabalho", "linha": True, "cards": [
        {"m": "a", "icone": "clock", "titulo": "Tempo de trabalho efetivo", "texto": "o tempo dos treinamentos previstos nas NRs (NR-1, item 1.7.2)", "cor": "verde"},
        {"m": "b", "icone": "hard-hat", "titulo": "EPI com cuidado", "texto": "comunique perda, dano ou alteração que deixe o EPI impróprio"},
    ], "narracao": "{a}O tempo gasto nos treinamentos previstos nas Normas Regulamentadoras é tempo de trabalho efetivo. {b}E se o seu EPI for perdido, danificado, ou ficar impróprio, comunique para que seja trocado."},
    {"tipo": "cartoes", "titulo": "Viagens a serviço", "sub": "Política de Viagens e Reembolso de Despesas, versão 1.0", "cards": [
        {"m": "a", "icone": "file-check", "titulo": "Autorização antes", "texto": "pedidos ao RH por e-mail"},
        {"m": "b", "icone": "receipt", "titulo": "Comprovantes", "texto": "nota fiscal, cupom ou recibo legível"},
        {"m": "c", "icone": "calendar-clock", "titulo": "Prestação de contas", "texto": "até 3 dias úteis após o retorno"},
    ], "aviso": "Valores e limites: veja o material de leitura desta aula.",
       "narracao": "Se você viajar a serviço, siga a política de viagens. {a}Nenhuma viagem sem autorização prévia: passagens, hospedagem e veículo são pedidos ao RH. {b}Guarde as notas fiscais, cupons ou recibos legíveis. {c}E preste contas em até três dias úteis depois do retorno. Os limites de cada despesa estão no material de leitura desta aula."},
    pergunta("O tempo que você passa em treinamento obrigatório conta como tempo de trabalho?", "Sim", "tempo de trabalho efetivo (NR-1)",
             "Sua vez: o tempo que você passa em treinamento obrigatório conta como tempo de trabalho? {pensa}[[pausa:3]] {resp}Sim. É tempo de trabalho efetivo."),
    checklist(["Direito a EPI, treinamento, informação e recusa", "Dever de seguir regras, usar EPI e comunicar", "Viagem só com autorização e prestação de contas"],
              "Segurança: direito e dever ao mesmo tempo.",
              "Para levar para a obra: {c1}você tem direito a EPI, treinamento, informação, e à recusa diante de risco grave. {c2}Tem o dever de seguir as regras, usar o EPI, e comunicar problemas. {c3}E viagem a serviço, só com autorização e prestação de contas. {fim}Segurança é direito e dever ao mesmo tempo."),
], ["Aplicação da política de viagens à Palla Construções [VALIDAR PELA PALLA]"]))

# 5 — Comunicação com a liderança
R.append(roteiro(5, "comunicacao", "Comunicação com a liderança", [
    abertura("arcelormittal", "Comunicação com a liderança", "Pergunte, participe e pare para comunicar",
             "Na montagem, {o}uma dúvida não esclarecida pode virar um acidente, ou um retrabalho caro."),
    {"tipo": "etapas", "titulo": "A quem perguntar", "etapas": [
        {"m": "a", "icone": "hard-hat", "titulo": "Encarregado", "texto": "canal principal"},
        {"m": "b", "icone": "clipboard-list", "titulo": "Supervisor", "texto": "se o encarregado não estiver"},
        {"m": "c", "icone": "shield-alert", "titulo": "Segurança do Trabalho", "texto": "problemas de segurança, na hora", "cor": "vermelho"},
    ], "narracao": "Por isso, pergunte sempre. {a}O canal principal é o seu encarregado. {b}Se ele não estiver, procure o supervisor, {c}ou a Segurança do Trabalho. Problema de segurança se comunica na hora."},
    {"tipo": "cartoes", "titulo": "DDS e rádio", "cards": [
        {"m": "a", "icone": "messages-square", "titulo": "DDS", "texto": "Diálogo Diário de Segurança: combine o trabalho e os cuidados do dia. Participe e pergunte."},
        {"m": "b", "icone": "radio", "titulo": "Rádio", "texto": "Mensagens curtas, diga quem fala e confirme o que entendeu."},
    ], "narracao": "{a}Participe do DDS, o Diálogo Diário de Segurança. É ali que se combina o trabalho do dia e os cuidados de cada tarefa. Pergunte, e traga situações do dia. {b}No rádio, mensagens curtas: diga quem está falando, e confirme o que entendeu."},
    {"tipo": "cartoes", "titulo": "Mudou algo? Pare e comunique", "colunas": 4, "cards": [
        {"m": "a", "icone": "puzzle", "titulo": "Peça diferente", "cor": "vermelho"},
        {"m": "b", "icone": "wrench", "titulo": "Equipamento com defeito", "cor": "vermelho"},
        {"m": "c", "icone": "cloud-lightning", "titulo": "Tempo virando", "cor": "vermelho"},
        {"m": "d", "icone": "users", "titulo": "Equipe embaixo", "cor": "vermelho"},
    ], "aviso": "Nunca improvise uma mudança no método ou no equipamento sem autorização.",
       "narracao": "E quando algo mudar, {a}como uma peça diferente, {b}um equipamento com defeito, {c}o tempo virando, {d}ou uma equipe trabalhando embaixo, pare e comunique antes de continuar. Nunca improvise uma mudança no método ou no equipamento sem autorização."},
    pergunta("A furação da viga não bate com o pilar. O que fazer?", "Parar e chamar", "o encarregado, que consulta a engenharia",
             "Sua vez: ao conferir uma viga, a furação não bate com o pilar. O que fazer? {pensa}[[pausa:3]] {resp}Não force com marreta, nem alargue o furo. Pare, e chame o encarregado, que consulta a engenharia."),
    checklist(["Dúvida: encarregado, supervisor ou SST", "Participe do DDS", "Mudou algo: pare e comunique"],
              "Improvisar não é uma opção.",
              "Para levar para a obra: {c1}na dúvida, encarregado, supervisor ou Segurança do Trabalho. {c2}Participe do DDS. {c3}Se algo mudar, pare e comunique. {fim}Improvisar não é uma opção."),
]))

# 6 — Organização do canteiro, acesso e permanência
R.append(roteiro(6, "canteiro", "Organização do canteiro e regras de acesso e permanência", [
    abertura("cargolift", "Canteiro organizado", "Regras de acesso e de permanência na obra",
             "Um canteiro organizado {o}é um canteiro mais seguro."),
    {"tipo": "cartoes", "titulo": "Para entrar na obra", "cards": [
        {"m": "a", "icone": "badge-check", "titulo": "Liberado no sistema", "texto": "integração, treinamentos da função, ASO e documentos da obra"},
        {"m": "b", "icone": "id-card", "titulo": "Crachá", "texto": "visível"},
        {"m": "c", "icone": "hard-hat", "titulo": "EPIs obrigatórios", "texto": "completos e em bom estado"},
    ], "narracao": "Para entrar na obra, você precisa {a}estar liberado no sistema, {b}com crachá, {c}e com os EPIs obrigatórios. {a}A liberação depende da integração, dos treinamentos da sua função, do ASO, e dos documentos exigidos pela obra e pelo cliente."},
    {"tipo": "cartoes", "titulo": "Dentro do canteiro", "colunas": 2, "cards": [
        {"m": "a", "icone": "footprints", "titulo": "Rotas de pedestres", "texto": "circule pelos caminhos sinalizados"},
        {"m": "b", "icone": "construction", "titulo": "Áreas isoladas", "texto": "fitas, cones, cavaletes e placas: respeite", "cor": "ambar"},
        {"m": "c", "icone": "ban", "titulo": "Nunca sob carga suspensa", "texto": "nem parado, nem de passagem", "cor": "vermelho"},
        {"m": "d", "icone": "trash-2", "titulo": "Frente limpa", "texto": "sobras, parafusos e ferramentas no chão causam quedas e cortes"},
    ], "narracao": "Dentro do canteiro, {a}use as rotas de pedestres, {b}respeite as áreas isoladas, {c}e nunca passe por baixo de cargas suspensas. {d}Mantenha a frente de trabalho limpa: sobras de material, parafusos e ferramentas no chão causam quedas e cortes."},
    {"tipo": "cartoes", "titulo": "Cada obra tem regras próprias", "linha": True, "cards": [
        {"m": "a", "icone": "utensils", "titulo": "Área de vivência", "texto": "alimentação e descanso só nela"},
        {"m": "b", "icone": "cigarette-off", "titulo": "Fumar", "texto": "só em local autorizado, longe de inflamáveis"},
        {"m": "c", "icone": "building-2", "titulo": "Regras do cliente", "texto": "fazem parte da sua integração"},
    ], "narracao": "{a}Alimentação e descanso, só na área de vivência. {b}Fumar, só em local autorizado, e longe de inflamáveis. {c}E lembre: cada obra pode ter regras próprias do cliente. Elas fazem parte da sua integração."},
    pergunta("Você pode cruzar uma área isolada se ninguém estiver trabalhando no momento?", "Não", "contorne pela rota de pedestres",
             "Sua vez: você pode cruzar uma área isolada se ninguém estiver trabalhando no momento? {pensa}[[pausa:3]] {resp}Não. Contorne pela rota de pedestres, mesmo que demore mais."),
    checklist(["Entre liberado, com crachá e EPI", "Rotas de pedestres e isolamentos", "Nunca sob carga suspensa; frente limpa"],
              "Organização também é segurança.",
              "Para levar para a obra: {c1}entre liberado, com crachá e EPI. {c2}Circule pelas rotas, e respeite os isolamentos. {c3}Nunca fique sob carga suspensa, e mantenha tudo organizado. {fim}Organização também é segurança."),
]))

# 7 — Celular
R.append(roteiro(7, "celular", "Uso de celular no ambiente operacional", [
    abertura("aranhas", "Celular na obra", "Na frente de trabalho, o celular fica guardado",
             "O celular distrai. {o}E distração na montagem pode custar uma mão, um dedo, ou uma vida."),
    {"tipo": "cartoes", "titulo": "Celular guardado durante", "colunas": 3, "cards": [
        {"m": "a", "icone": "anchor", "titulo": "Içamento e sinalização", "cor": "vermelho"},
        {"m": "b", "icone": "arrow-up-from-line", "titulo": "Trabalho em altura", "cor": "vermelho"},
        {"m": "c", "icone": "cog", "titulo": "Operação de máquinas", "cor": "vermelho"},
        {"m": "d", "icone": "flame", "titulo": "Soldagem e corte", "cor": "vermelho"},
        {"m": "e", "icone": "triangle-alert", "titulo": "Áreas de risco", "cor": "vermelho"},
        {"m": "f", "icone": "headphones", "titulo": "Fone de música: não", "cor": "vermelho"},
    ], "narracao": "Na frente de trabalho, o celular fica guardado. Não use durante {a}içamentos e sinalização de cargas, {b}trabalho em altura, {c}operação de máquinas, {d}soldagem ou corte, {e}nem circulando por áreas de risco. {f}E fone de ouvido de música não é permitido na frente de trabalho."},
    {"tipo": "cartoes", "titulo": "Como usar", "cards": [
        {"m": "a", "icone": "map-pin", "titulo": "Em local seguro", "texto": "pausas, área de vivência ou ponto indicado", "cor": "verde"},
        {"m": "b", "icone": "radio", "titulo": "Operação: rádio", "texto": "ou o meio definido pela obra"},
        {"m": "c", "icone": "camera-off", "titulo": "Fotos e vídeos", "texto": "só com autorização da liderança e do cliente", "cor": "ambar"},
    ], "narracao": "Se precisar usar, {a}vá até um local seguro, fora da área de risco. {b}Para a comunicação operacional, use o rádio, ou o meio definido pela obra. {c}E fotos e vídeos da obra, só com autorização: o projeto e as instalações pertencem ao cliente."},
    pergunta("Durante um içamento, o sinaleiro pode atender uma ligação rápida?", "Não", "atenção total à carga",
             "Sua vez: durante um içamento, o sinaleiro pode atender uma ligação rápida? {pensa}[[pausa:3]] {resp}Não. Durante tarefas críticas, o celular fica guardado, e a atenção é toda da carga."),
    checklist(["Celular guardado na frente de trabalho", "Usar só em local seguro", "Fotos e vídeos só com autorização"],
              "Nenhuma mensagem vale um acidente.",
              "Para levar para a obra: {c1}na frente de trabalho, o celular fica guardado. {c2}Use só em local seguro. {c3}Fotos e vídeos, só com autorização. {fim}Nenhuma mensagem vale um acidente."),
]))

# 9 — Prevenção de acidentes e responsabilidades
R.append(roteiro(9, "prevencao", "Política de prevenção de acidentes e responsabilidades", [
    abertura("icamento-ponte", "Prevenção de acidentes", "Cada um tem o seu papel",
             "Prevenir acidentes é responsabilidade de todos. {o}Mas cada um tem o seu papel."),
    {"tipo": "etapas", "titulo": "Ordem de prioridade das medidas", "sub": "Gerenciamento de riscos (NR-1)", "forma": "piramide", "etapas": [
        {"m": "a", "titulo": "Eliminar o perigo", "cor": "verde"},
        {"m": "b", "titulo": "Proteção coletiva", "texto": "guarda-corpo, linha de vida, isolamento"},
        {"m": "c", "titulo": "Medidas administrativas", "texto": "procedimentos, APR, PT, sinalização"},
        {"m": "d", "titulo": "EPI, como complemento", "cor": "ambar"},
    ], "narracao": "Na prevenção, existe uma ordem. {a}Primeiro, eliminar o perigo. {b}Depois, reduzir o risco com proteções coletivas, como guarda-corpo, linha de vida e isolamento. {c}Em seguida, medidas administrativas: procedimentos, APR, permissão de trabalho e sinalização. {d}E o EPI vem como complemento. Ele não substitui as outras barreiras."},
    {"tipo": "cartoes", "titulo": "Quem faz o quê", "colunas": 2, "cards": [
        {"m": "a", "icone": "building-2", "titulo": "Empresa", "texto": "PGR, proteções, EPIs, treinamentos, exames e fiscalização"},
        {"m": "b", "icone": "hard-hat", "titulo": "Liderança", "texto": "planeja, conduz o DDS, libera com segurança e corrige desvios"},
        {"m": "c", "icone": "user-check", "titulo": "Você", "texto": "cumpre procedimentos, usa EPI, cuida do colega e comunica riscos", "cor": "vermelho"},
        {"m": "d", "icone": "users", "titulo": "Equipe", "texto": "vigilância mútua: se um colega estiver em risco, avise", "cor": "verde"},
    ], "narracao": "{a}A empresa identifica os perigos e avalia os riscos no Programa de Gerenciamento de Riscos, o PGR; fornece proteções coletivas e EPIs, treina e fiscaliza. {b}A liderança planeja o trabalho com segurança, conduz o DDS, confere as condições antes de liberar a tarefa, e corrige desvios na hora. {c}Você cumpre os procedimentos, usa os EPIs, cuida do colega, e comunica os riscos. {d}E a equipe cuida de todos: se um colega estiver em risco, avise. Segurança é coletiva."},
    pergunta("O EPI é a primeira ou a última barreira de proteção?", "A última", "complementa as proteções coletivas",
             "Sua vez: o EPI é a primeira, ou a última barreira de proteção? {pensa}[[pausa:3]] {resp}A última. Ele complementa as proteções coletivas e as medidas administrativas."),
    checklist(["Eliminar, proteger coletivamente, organizar, e só então o EPI", "A empresa gerencia; a liderança planeja e corrige", "Você cumpre, cuida e comunica"],
              "Segurança é coletiva.",
              "Para levar para a obra: {c1}primeiro eliminar, depois proteger coletivamente, organizar, e só então o EPI. {c2}A empresa gerencia os riscos, e a liderança planeja e corrige. {c3}Você cumpre, cuida do colega, e comunica. {fim}Segurança é coletiva."),
]))

# 10 — Álcool e drogas
R.append(roteiro(10, "alcool-drogas", "Política de álcool e drogas", [
    abertura("viaduto", "Álcool e drogas", "Atenção, reflexo e equilíbrio salvam vidas",
             "Álcool e outras drogas reduzem a atenção, os reflexos e o equilíbrio. {o}Em uma obra de estrutura metálica, isso é risco de morte, para você e para os colegas."),
    {"tipo": "cartoes", "titulo": "É proibido", "linha": True, "cards": [
        {"m": "a", "icone": "ban", "titulo": "Entrar ou permanecer sob efeito", "texto": "de álcool ou de drogas", "cor": "vermelho"},
        {"m": "b", "icone": "wine-off", "titulo": "Portar, consumir ou oferecer", "texto": "no canteiro, nos veículos e nos alojamentos da empresa", "cor": "vermelho"},
    ], "narracao": "Por isso, {a}é proibido entrar ou permanecer na obra sob efeito de álcool ou drogas. {b}E é proibido portar, consumir ou oferecer essas substâncias no canteiro, nos veículos, e nos alojamentos da empresa."},
    {"tipo": "cartoes", "titulo": "Remédios e apoio", "cards": [
        {"m": "a", "icone": "pill", "titulo": "Remédio que dá sono?", "texto": "Avise o encarregado ou a SST. Não precisa contar o diagnóstico.", "cor": "ambar"},
        {"m": "b", "icone": "heart-handshake", "titulo": "Precisa de ajuda?", "texto": "Procure o RH. Buscar ajuda é coragem, e é tratado com sigilo.", "cor": "verde"},
    ], "narracao": "{a}Se você usa algum medicamento que cause sonolência, ou altere os reflexos, avise o encarregado ou a Segurança do Trabalho, sem precisar contar o diagnóstico. {b}E se você precisar de ajuda, procure o RH. Buscar ajuda é um ato de coragem, e será tratado com sigilo."},
    pergunta("O que fazer se você estiver usando um remédio que dá sono?", "Avisar", "o encarregado ou a Segurança do Trabalho",
             "Sua vez: o que fazer se você estiver usando um remédio que dá sono? {pensa}[[pausa:3]] {resp}Avisar o encarregado, ou a Segurança do Trabalho, para avaliar a sua atividade."),
    checklist(["Álcool e drogas: proibidos na obra e no alojamento", "Remédio que altera reflexos: avise", "Precisa de ajuda: RH, com sigilo"],
              "Cuidar de você é cuidar da equipe.",
              "Para levar para a obra: {c1}álcool e drogas são proibidos na obra, nos veículos e no alojamento. {c2}Remédio que altera os reflexos, avise. {c3}Precisa de ajuda, procure o RH, com sigilo. {fim}Cuidar de você é cuidar da equipe."),
], ["Procedimentos de verificação e medidas aplicáveis [A PREENCHER PELA PALLA]"]))

# 11 — Incidentes e quase acidentes
R.append(roteiro(11, "incidentes", "Comunicação de incidentes e quase acidentes", [
    abertura("main-plaza", "Quase acidente é aviso", "Comunicar é como evitamos a repetição",
             "Um quase acidente é um aviso. {o}Um parafuso que caiu e não acertou ninguém mostra que, da próxima vez, pode acertar."),
    {"tipo": "cartoes", "titulo": "O que comunicar", "colunas": 2, "cards": [
        {"m": "a", "icone": "siren", "titulo": "Acidente", "texto": "evento com lesão ou dano", "cor": "vermelho"},
        {"m": "b", "icone": "triangle-alert", "titulo": "Incidente", "texto": "sem lesão, mas com dano ou potencial de dano", "cor": "ambar"},
        {"m": "c", "icone": "circle-alert", "titulo": "Quase acidente", "texto": "por pouco não causou lesão ou dano", "cor": "ambar"},
        {"m": "d", "icone": "eye", "titulo": "Condição insegura", "texto": "algo que pode causar um acidente"},
    ], "narracao": "Comunique tudo: {a}o acidente, que é o evento com lesão ou dano; {b}o incidente, sem lesão, mas com dano ou potencial de dano; {c}o quase acidente, que por pouco não causou lesão ou dano; {d}e a condição insegura, que pode causar um acidente."},
    {"tipo": "etapas", "titulo": "Como comunicar", "etapas": [
        {"m": "a", "titulo": "Isole a área", "texto": "garanta a segurança do local"},
        {"m": "b", "titulo": "Avise na hora", "texto": "encarregado e Segurança do Trabalho", "cor": "vermelho"},
        {"m": "c", "titulo": "Vítima: socorro pelo plano de emergência", "texto": "não mova, salvo risco maior"},
        {"m": "d", "titulo": "Preserve o local", "texto": "quando possível"},
        {"m": "e", "titulo": "Participe da análise", "texto": "e das ações corretivas", "cor": "verde"},
    ], "narracao": "Como comunicar: {a}garanta a segurança, e isole a área. {b}Avise imediatamente o encarregado e a Segurança do Trabalho. {c}Em caso de acidente com vítima, acione o socorro conforme o plano de emergência da obra, e não mova a vítima, a menos que haja risco maior. {d}Preserve o local para análise, quando possível. {e}E participe da análise e das ações corretivas. Comunicar não é dedurar: é assim que a gente descobre a causa, e evita que aconteça de novo."},
    pergunta("Um quase acidente precisa ser comunicado mesmo sem ninguém ferido?", "Sim", "na hora, ao encarregado e à SST",
             "Sua vez: um quase acidente precisa ser comunicado, mesmo sem ninguém ferido? {pensa}[[pausa:3]] {resp}Sim, na hora. Foi assim que uma equipe, depois de uma porca cair perto de um ajudante, passou a usar bolsas porta-parafusos."),
    checklist(["Comunique acidente, incidente e quase acidente", "Isole, avise, preserve", "Participe da análise"],
              "Comunicar não é dedurar: é prevenir.",
              "Para levar para a obra: {c1}comunique todo acidente, incidente e quase acidente. {c2}Isole, avise e preserve. {c3}E participe da análise. {fim}Comunicar não é dedurar: é prevenir."),
], ["Telefones de emergência por obra [exibidos conforme a obra]"]))

# 12 — Procedimentos disciplinares
R.append(roteiro(12, "disciplinares", "Procedimentos disciplinares", [
    abertura("produtos-pilha", "Procedimentos disciplinares", "Regras existem para proteger as pessoas",
             "As regras da Palla existem para proteger as pessoas. {o}Quando alguém descumpre uma regra, a empresa precisa agir."),
    {"tipo": "etapas", "titulo": "Medidas proporcionais à gravidade", "sub": "Conforme a legislação trabalhista", "etapas": [
        {"m": "a", "icone": "message-circle", "titulo": "Orientação"},
        {"m": "b", "icone": "file-warning", "titulo": "Advertência", "cor": "ambar"},
        {"m": "c", "icone": "calendar-x", "titulo": "Suspensão", "cor": "ambar"},
        {"m": "d", "icone": "door-open", "titulo": "Dispensa", "texto": "em casos graves previstos em lei", "cor": "vermelho"},
    ], "narracao": "As medidas seguem a legislação trabalhista, e são proporcionais à gravidade. Podem ir {a}de uma orientação, {b}até uma advertência, {c}uma suspensão, {d}ou, em casos graves previstos em lei, a dispensa. Toda medida é registrada, com direito de manifestação do colaborador."},
    {"tipo": "cartoes", "titulo": "Dois pontos importantes", "cards": [
        {"m": "a", "icone": "triangle-alert", "titulo": "Regra de ouro descumprida", "texto": "é falta grave: coloca vidas em risco", "cor": "vermelho"},
        {"m": "b", "icone": "hand", "titulo": "Direito de recusa", "texto": "parar por risco grave e iminente nunca é punido", "cor": "verde"},
    ], "narracao": "{a}Descumprir uma regra de ouro de segurança é falta grave, porque coloca vidas em risco. {b}E lembre: parar uma tarefa por risco grave e iminente nunca é motivo de punição."},
    pergunta("Parar uma tarefa por risco grave pode gerar punição?", "Não", "é o direito de recusa",
             "Sua vez: parar uma tarefa por risco grave pode gerar punição? {pensa}[[pausa:3]] {resp}Não. Esse é o direito de recusa, e ele nunca é punido."),
    checklist(["Medidas proporcionais e registradas", "Regra de ouro: falta grave", "Direito de recusa nunca é punido"],
              "Regras existem para proteger.",
              "Para levar para a obra: {c1}as medidas disciplinares são proporcionais e registradas. {c2}Descumprir regra de ouro é falta grave. {c3}E exercer o direito de recusa nunca é punido. {fim}Regras existem para proteger."),
], ["Tabela de condutas e medidas [A PREENCHER PELA PALLA conforme regulamento interno]"]))

# 13 — Revisão e próximos passos
R.append(roteiro(13, "revisao", "Revisão e próximos passos", [
    abertura("fabrica-aerea", "Revisão e próximos passos", "O que vimos e o que vem agora",
             "Você chegou ao final da integração. {o}Vamos relembrar, e ver os próximos passos."),
    {"tipo": "cartoes", "titulo": "O que você viu", "colunas": 3, "cards": [
        {"m": "a", "icone": "building-2", "titulo": "A Palla", "texto": "quem somos e nossos valores"},
        {"m": "b", "icone": "handshake", "titulo": "Nosso jeito", "texto": "conduta, direitos e deveres"},
        {"m": "c", "icone": "construction", "titulo": "O canteiro", "texto": "acesso, permanência e celular"},
        {"m": "d", "icone": "shield-check", "titulo": "Regras de ouro", "texto": "sem exceção", "cor": "vermelho"},
        {"m": "e", "icone": "hand", "titulo": "Direito de recusa", "texto": "diante de risco grave", "cor": "verde"},
        {"m": "f", "icone": "megaphone", "titulo": "Comunicar", "texto": "incidentes e quase acidentes"},
    ], "narracao": "Você conheceu {a}a Palla, {b}o nosso jeito de trabalhar, {c}as regras do canteiro, {d}as regras de ouro, {e}o direito de recusa, {f}e como comunicar incidentes."},
    {"tipo": "etapas", "titulo": "Seus próximos passos", "etapas": [
        {"m": "a", "icone": "clipboard-check", "titulo": "Avaliação da integração"},
        {"m": "b", "icone": "graduation-cap", "titulo": "Cursos obrigatórios da sua função"},
        {"m": "c", "icone": "users", "titulo": "Práticas presenciais agendadas", "texto": "com instrutor, quando exigidas"},
        {"m": "d", "icone": "file-text", "titulo": "ASO e documentos pedidos"},
        {"m": "e", "icone": "smartphone", "titulo": "Acompanhe a sua situação na plataforma"},
    ], "narracao": "Agora, {a}vem a avaliação. Depois dela, {b}continue a sua trilha: cada função tem cursos obrigatórios, {c}e, em alguns casos, uma etapa prática presencial com instrutor. {d}Envie o ASO e os documentos pedidos, {e}e acompanhe a sua situação na plataforma."},
    {"tipo": "cartoes", "titulo": "Atenção", "linha": True, "cards": [
        {"m": "a", "icone": "lock", "titulo": "A integração, sozinha, não libera o acesso à obra", "texto": "a liberação depende de todos os requisitos da sua função e da aprovação de um responsável", "cor": "vermelho"},
    ], "narracao": "{a}Atenção: concluir a integração não libera o acesso à obra sozinho. A liberação depende de todos os requisitos da sua função, e da aprovação de um responsável. Bom trabalho, e seja bem-vindo à Palla Construções."},
]))

print("\n".join(r["codigo"] for r in R))
