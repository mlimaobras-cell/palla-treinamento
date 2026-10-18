# Gera os roteiros (cenas JSON) dos vídeos da Integração (INT-01), da Segurança na montagem (PAL-52)
# e das apresentações de NR-17, NR-23, NR-26 e NR-33. Uso: python3 video/v2/gerar-roteiros-int-nr.py
# Conteúdo tirado de db/conteudo/integracao.ts, db/conteudo/montagem-segura.ts e db/catalogo.ts (não inventar requisitos).
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
F = "fotos/institucional/"
SCRIPTS = ["ilustracoes/icones.js"]


def foto(fotos, narr, titulo=None, cap=None, itens=None, layout=None):
    c = {"tipo": "foto", "fotos": [{"src": F + f[0], **({"m": f[1]} if len(f) > 1 and f[1] else {}), **({"legenda": f[2]} if len(f) > 2 else {})} for f in fotos], "narracao": narr}
    if titulo: c["titulo"] = titulo
    if cap: c["cap"] = cap
    if itens: c["itens"] = [{"m": m, "texto": t} for m, t in itens]
    if layout: c["layout"] = layout
    return c


def cartoes(titulo, cards, narr, sub=None, linha=False, colunas=None, aviso=None):
    c = {"tipo": "cartoes", "titulo": titulo, "cards": [dict(zip(["m", "icone", "titulo", "texto", "cor"], k)) for k in cards], "narracao": narr}
    for k in c["cards"]:
        if k.get("texto") is None: k.pop("texto", None)
        if k.get("cor") is None: k.pop("cor", None)
    if sub: c["sub"] = sub
    if linha: c["linha"] = True
    if colunas: c["colunas"] = colunas
    if aviso: c["aviso"] = aviso
    return c


def colunas(titulo, cols, narr, sub=None):
    return {"tipo": "colunas", "titulo": titulo, **({"sub": sub} if sub else {}), "narracao": narr,
            "colunas": [{"titulo": t, "icone": i, "cor": cor, "itens": [{"m": m, "texto": x} for m, x in its]} for t, i, cor, its in cols]}


def etapas(titulo, ets, narr, sub=None, forma=None):
    c = {"tipo": "etapas", "titulo": titulo, "narracao": narr, "etapas": [dict(zip(["m", "titulo", "texto", "icone", "cor"], e)) for e in ets]}
    for e in c["etapas"]:
        for k in ("texto", "icone", "cor"):
            if e.get(k) is None: e.pop(k, None)
    if sub: c["sub"] = sub
    if forma: c["forma"] = forma
    return c


def pergunta(p, resp, conta, narr):
    return {"tipo": "pergunta", "pergunta": p, "resposta": resp, "conta": conta, "narracao": narr}


def checklist(itens, rodape, narr, titulo="Leve para a obra"):
    return {"tipo": "checklist", "titulo": titulo, "itens": [{"texto": t, "chave": f"c{i + 1}"} for i, t in enumerate(itens)], "rodape": rodape, "narracao": narr}


def abertura(icone, objetivo, narr):
    return {"tipo": "abertura", "icone": icone, "objetivo": objetivo, "narracao": narr}


def roteiro(codigo, titulo, capitulo, eyebrow, fontes, cenas, pendencias=()):
    d = {"codigo": codigo, "titulo": titulo, "capitulo": capitulo, "eyebrow": eyebrow, "scripts": SCRIPTS, "fontes": fontes, "pendencias": list(pendencias), "cenas": cenas}
    nome = codigo.lower() + ".json"
    with open(os.path.join(AQUI, "cenas", nome), "w") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    return nome


INT = "Integração institucional"
FI = ["db/conteudo/integracao.ts (Módulo 01 — Integração institucional)"]
R = []

# ---------------------------------------------------------------- INT-01
R.append(roteiro("INT-2-missao", "Missão, visão, valores e organização", f"{INT} · Aula 2", "Integração · Aula 2",
  FI + ["Apresentação institucional do Grupo Palla (2026)"], [
  foto([("escritorio.jpg",)], "Toda empresa precisa saber para onde vai. {o}No Grupo Palla, isso está na missão, na visão e nos valores. E na obra, você também precisa saber quem é quem.",
       titulo="Missão, visão e valores", cap="Integração · Aula 2", itens=[("o", "Para onde vamos e quem é quem na obra")]),
  cartoes("Missão e visão", [
    ("mi", "target", "Missão", "Buscar constantemente a solução diferenciada dos nossos produtos, com qualidade e competitividade."),
    ("vi", "eye", "Visão", "Atender os clientes, buscando o avanço dos colaboradores, com os fornecedores, respeitando o meio ambiente e a comunidade."),
  ], "{mi}A missão é buscar constantemente a solução diferenciada dos nossos produtos, com qualidade e competitividade. {vi}A visão é atender as expectativas dos clientes, buscando o avanço dos colaboradores, em parceria com os fornecedores, garantindo a satisfação dos clientes, e respeitando o meio ambiente e a comunidade."),
  cartoes("Nossos valores", [
    ("v1", "scale", "Ética e transparência", "nos relacionamentos"),
    ("v2", "shield-check", "Responsabilidade", "em cada decisão"),
    ("v3", "users", "Valorização", "crescimento dos colaboradores"),
    ("v4", "target", "Foco no resultado", "desenvolvimento da empresa"),
    ("v5", "refresh-cw", "Melhoria contínua", "nos processos internos"),
  ], "São cinco valores: {v1}ética e transparência nos relacionamentos; {v2}responsabilidade em cada decisão; {v3}crescimento e valorização dos colaboradores; {v4}foco no resultado; {v5}e melhoria contínua. Perceba: valorizar quem trabalha aqui está nos valores. Isso inclui você."),
  etapas("Quem é quem na obra", [
    ("g", "Gerente de montagem", "planeja e responde pelas obras", "briefcase"),
    ("s", "Supervisor", "acompanha as frentes e o cronograma", "clipboard-list"),
    ("e", "Encarregado", "lidera a equipe, distribui tarefas e conduz o DDS", "hard-hat"),
    ("m", "Equipe", "montadores, soldadores, ajudantes, sinaleiro e operadores", "users"),
  ], "Na obra, a organização é assim: {g}o gerente de montagem planeja e responde pelas obras. {s}O supervisor acompanha as frentes e o cronograma. {e}O encarregado lidera a equipe no dia a dia, distribui as tarefas e conduz o DDS. {m}E a equipe executa: montadores, soldadores, ajudantes, sinaleiro e operadores."),
  cartoes("Quem apoia você", [
    ("st", "shield-alert", "Segurança do Trabalho", "orienta, inspeciona e pode parar tarefa insegura"),
    ("rh", "id-card", "RH", "cadastro, documentos, benefícios e dúvidas"),
  ], "Duas equipes acompanham todas as frentes. {st}A Segurança do Trabalho orienta, inspeciona, e pode paralisar uma tarefa insegura. {rh}E o RH cuida do seu cadastro, dos documentos e das dúvidas trabalhistas.", linha=True),
  pergunta("Quem distribui as tarefas do dia e conduz o DDS?", "O encarregado", "líder da equipe no dia a dia",
           "Sua vez: na sua frente de trabalho, quem distribui as tarefas do dia e conduz o DDS? {pensa}[[pausa:3]] {resp}O encarregado de montagem."),
  checklist(["Missão: soluções diferenciadas com qualidade", "Cinco valores: ética, responsabilidade, pessoas, resultado, melhoria", "Dúvida na tarefa: fale com o encarregado"], "Saber quem é quem é saber a quem pedir ajuda.",
            "Para levar: {c1}a missão é entregar soluções diferenciadas com qualidade. {c2}São cinco valores: ética, responsabilidade, valorização das pessoas, foco no resultado e melhoria contínua. {c3}E na dúvida sobre a tarefa, fale com o encarregado. {fim}Saber quem é quem é saber a quem pedir ajuda."),
]))

R.append(roteiro("INT-3-conduta", "Código de conduta profissional", f"{INT} · Aula 3", "Integração · Aula 3", FI, [
  foto([("gestamp-taubate.jpg",)], "O código de conduta resume como nos comportamos dentro e fora da obra, {o}sempre que estamos representando a Palla.",
       titulo="Código de conduta", cap="Integração · Aula 3", itens=[("o", "Como agimos quando representamos a Palla")]),
  cartoes("Respeito vem primeiro", [
    ("r1", "users", "Com todos", "colegas, clientes, fornecedores e vizinhos da obra"),
    ("r2", "ban", "Sem humilhação", "nada de apelidos ofensivos ou brincadeiras que humilham", "vermelho"),
    ("r3", "scale", "Sem discriminação", "de qualquer natureza", "vermelho"),
  ], "Respeito vem primeiro. {r1}Tratamos colegas, clientes, fornecedores e vizinhos da obra com educação. {r2}Sem apelidos ofensivos e sem brincadeiras que humilhem. {r3}E sem qualquer tipo de discriminação."),
  cartoes("Assédio: tolerância zero", [
    ("a1", "shield-x", "Não é tolerado", "assédio moral, assédio sexual e violência", "vermelho"),
    ("a2", "megaphone", "Comunique", "liderança, RH ou o canal oficial de denúncias"),
    ("a3", "shield-check", "Sem retaliação", "quem denuncia é protegido", "verde"),
  ], "{a1}Assédio moral, assédio sexual e violência não são tolerados. {a2}Quem sofrer ou presenciar deve comunicar a liderança, o RH, ou o canal oficial de denúncias. {a3}Com a garantia de que não haverá retaliação."),
  cartoes("Honestidade e cuidado", [
    ("h1", "clipboard-check", "Registros verdadeiros", "ponto, produção, inspeção e documentos"),
    ("h2", "wrench", "Cuidado com os bens", "ferramentas, equipamentos, materiais e alojamento"),
    ("h3", "lock", "Sigilo", "informações do cliente e da obra"),
    ("h4", "camera-off", "Fotos só com autorização", "o projeto é do cliente"),
  ], "{h1}Somos honestos: ponto, produção, inspeção e documentos mostram a verdade. {h2}Cuidamos das ferramentas, dos equipamentos, dos materiais e do alojamento. {h3}Guardamos sigilo sobre as informações do cliente e da obra. {h4}E fotos da obra, só com autorização."),
  pergunta("Um colega faz piadas sobre a origem de um ajudante novo. O que fazer?", "Interromper", "e comunicar o encarregado ou o RH se continuar",
           "Sua vez: um colega começa a fazer piadas sobre a origem de um ajudante novo. O que você faz? {pensa}[[pausa:3]] {resp}Interrompa, deixe claro que isso não é aceito, e comunique o encarregado ou o RH se continuar."),
  checklist(["Respeito a todos, sem discriminação", "Assédio: comunique, sem medo de retaliação", "Registros verdadeiros e cuidado com os bens"], "Conduta também é segurança.",
            "Para levar: {c1}respeito a todos, sem discriminação. {c2}Assédio: comunique, sem medo de retaliação. {c3}Registros verdadeiros e cuidado com os bens. {fim}Conduta também é segurança."),
]))

R.append(roteiro("INT-4-direitos", "Direitos e deveres dos colaboradores", f"{INT} · Aula 4", "Integração · Aula 4",
  FI + ["NR-1 (capacitação e direito de recusa)", "NR-6 (EPI)", "Política de Viagens e Reembolso de Despesas v1.0 (15/09/2026)"], [
  foto([("aranhas.jpg",)], "Trabalhar com segurança é um direito seu. {o}E também é um dever.", titulo="Direitos e deveres", cap="Integração · Aula 4", itens=[("o", "Segurança é direito e dever")]),
  colunas("Direitos e deveres", [
    ("Seus direitos", "badge-check", "verde", [("d1", "EPI adequado, gratuito e em bom estado"), ("d2", "Saber os riscos e as medidas de controle"), ("d3", "Treinamento antes de começar; conta como trabalho"), ("d4", "Recusar tarefa com risco grave e iminente")]),
    ("Seus deveres", "clipboard-check", "azul", [("v1", "Cumprir normas e procedimentos"), ("v2", "Usar e conservar o EPI"), ("v3", "Fazer treinamentos e exames"), ("v4", "Comunicar condição insegura")]),
  ], "Você tem direito a {d1}receber os EPIs adequados, sem custo e em bom estado. {d2}A saber quais são os riscos do seu trabalho e as medidas de controle. {d3}A ser treinado antes de começar. E o tempo de treinamento obrigatório é tempo de trabalho. {d4}E a recusar uma tarefa diante de risco grave e iminente. Você tem o dever de {v1}cumprir as normas e os procedimentos, {v2}usar e conservar o EPI, {v3}participar dos treinamentos e exames, {v4}e comunicar qualquer condição insegura."),
  cartoes("Viagens a serviço", [
    ("p1", "file-check", "Autorização antes", "pedidos ao RH por e-mail"),
    ("p2", "bed", "Hospedagem", "até R$ 150,00 por dia"),
    ("p3", "utensils", "Alimentação", "até R$ 120,00 por dia"),
    ("p4", "files", "Prestação de contas", "em até 3 dias úteis, com nota fiscal"),
  ], "Quem viaja a serviço segue a política de viagens da empresa. {p1}Nenhuma viagem sem autorização prévia: passagens, hospedagem e veículo são pedidos ao RH. {p2}A hospedagem tem limite de cento e cinquenta reais por dia. {p3}A alimentação, de cento e vinte reais por dia. {p4}E a prestação de contas é feita em até três dias úteis depois do retorno, com nota fiscal ou recibo.",
          aviso="Política de Viagens e Reembolso v1.0 (15/09/2026). Valores e aplicação: confirmar com o RH."),
  pergunta("O tempo de treinamento obrigatório conta como trabalho?", "Sim", "é tempo de trabalho efetivo",
           "Sua vez: o tempo que você passa em treinamento obrigatório conta como tempo de trabalho? {pensa}[[pausa:3]] {resp}Sim. O treinamento previsto nas normas é tempo de trabalho."),
  checklist(["EPI, treinamento e informação são direitos", "Recusa diante de risco grave e iminente", "Cumprir regras, usar EPI e comunicar riscos"], "Direito e dever andam juntos.",
            "Para levar: {c1}EPI, treinamento e informação são seus direitos. {c2}Diante de risco grave e iminente, você pode recusar a tarefa. {c3}E o seu dever é cumprir as regras, usar o EPI e comunicar os riscos. {fim}Direito e dever andam juntos."),
], pendencias=["Aplicação da política de viagens à Palla Construções e vigência dos valores: [VALIDAR]."]))

R.append(roteiro("INT-5-lideranca", "Comunicação com a liderança", f"{INT} · Aula 5", "Integração · Aula 5", FI, [
  foto([("icamento-ponte.jpg",)], "Na montagem, uma dúvida não esclarecida pode virar um acidente, {o}ou um retrabalho caro.", titulo="Comunicação com a liderança", cap="Integração · Aula 5", itens=[("o", "Dúvida não esclarecida vira acidente ou retrabalho")]),
  etapas("A quem falar", [
    ("e", "Encarregado", "canal principal para a tarefa", "hard-hat"),
    ("s", "Supervisor ou Segurança do Trabalho", "quando o encarregado não estiver", "shield-alert"),
    ("d", "DDS", "combine o trabalho e os cuidados do dia", "message-circle"),
  ], "Pergunte sempre. {e}O canal principal é o seu encarregado. {s}Se ele não estiver, procure o supervisor ou a Segurança do Trabalho. {d}E participe do DDS, o Diálogo Diário de Segurança: é ali que se combina o trabalho do dia e os cuidados de cada tarefa."),
  cartoes("Mudou algo? Pare e comunique", [
    ("p1", "box", "Peça diferente", "do projeto"),
    ("p2", "wrench", "Equipamento", "com defeito"),
    ("p3", "cloud-lightning", "Tempo virando", "vento, chuva, raio"),
    ("p4", "users", "Equipe embaixo", "ou ao lado da frente"),
  ], "Quando algo mudar, pare e comunique antes de continuar. {p1}Uma peça diferente do projeto. {p2}Um equipamento com defeito. {p3}O tempo virando. {p4}Ou outra equipe trabalhando embaixo."),
  cartoes("Rádio: mensagem curta", [
    ("r1", "radio", "Quem fala", "identifique-se"),
    ("r2", "message-square-warning", "O quê", "mensagem curta e clara"),
    ("r3", "circle-check", "Confirmação", "repita o que entendeu", "verde"),
  ], "No rádio, a mensagem é curta: {r1}quem fala, {r2}o que precisa, {r3}e a confirmação de quem recebeu. E nunca improvise uma mudança no método ou no equipamento sem autorização."),
  pergunta("A furação da viga não bate com o pilar. O que fazer?", "Parar", "e chamar o encarregado; nada de forçar ou alargar o furo",
           "Sua vez: ao conferir uma viga, a furação não bate com o pilar. O que você faz? {pensa}[[pausa:3]] {resp}Para e chama o encarregado, que consulta a engenharia. Nada de forçar com marreta ou alargar o furo."),
  checklist(["Dúvida: pergunte ao encarregado", "Participe do DDS", "Mudou algo: pare e comunique"], "Improvisar não é uma opção.",
            "Para levar: {c1}na dúvida, pergunte ao encarregado. {c2}Participe do DDS. {c3}E se algo mudar, pare e comunique. {fim}Improvisar não é uma opção."),
]))

R.append(roteiro("INT-6-canteiro", "Organização do canteiro, acesso e permanência", f"{INT} · Aula 6", "Integração · Aula 6", FI, [
  foto([("cargolift.jpg",)], "Um canteiro organizado é um canteiro mais seguro. {o}E cada obra tem as suas regras.", titulo="O canteiro de obras", cap="Integração · Aula 6", itens=[("o", "Acesso, circulação e organização")]),
  cartoes("Para entrar na obra", [
    ("l", "user-check", "Liberado no sistema", "integração, treinamentos, ASO e documentos"),
    ("c", "id-card", "Crachá", "identificação visível"),
    ("e", "hard-hat", "EPIs obrigatórios", "da obra e da função"),
  ], "Para entrar na obra, você precisa estar {l}liberado no sistema: integração, treinamentos da função, ASO e documentos exigidos pela obra e pelo cliente. {c}Com crachá. {e}E com os EPIs obrigatórios."),
  cartoes("Dentro do canteiro", [
    ("r", "footprints", "Rotas de pedestres", "circule só por elas"),
    ("i", "traffic-cone", "Áreas isoladas", "fita, cone ou placa: não entre", "vermelho"),
    ("s", "triangle-alert", "Carga suspensa", "nunca fique ou passe embaixo", "vermelho"),
    ("o", "trash-2", "Frente limpa", "sobras, parafusos e ferramentas guardados"),
  ], "Dentro do canteiro: {r}use as rotas de pedestres. {i}Respeite as áreas isoladas. {s}Nunca fique, nem passe, sob carga suspensa. {o}E mantenha a frente de trabalho limpa: sobras de material, parafusos e ferramentas no chão causam quedas e cortes."),
  cartoes("Convivência", [
    ("v", "coffee", "Área de vivência", "alimentação e descanso só nela"),
    ("f", "cigarette-off", "Fumar", "só em local autorizado, longe de inflamáveis"),
    ("cl", "building-2", "Regras do cliente", "fazem parte da sua integração"),
  ], "{v}Alimentação e descanso, só na área de vivência. {f}Fumar, só em local autorizado e longe de inflamáveis. {cl}E lembre: cada obra pode ter regras próprias do cliente. Elas fazem parte da sua integração.", linha=True),
  pergunta("Ninguém está trabalhando agora. Posso cruzar a área isolada?", "Não", "contorne pela rota de pedestres",
           "Sua vez: ninguém está trabalhando agora na área isolada de içamento. Você pode cruzar por ela? {pensa}[[pausa:3]] {resp}Não. Contorne pela rota de pedestres, mesmo que demore mais."),
  checklist(["Entre liberado, com crachá e EPI", "Rotas de pedestres e isolamentos", "Nunca sob carga suspensa"], "Canteiro organizado, obra segura.",
            "Para levar: {c1}entre liberado, com crachá e EPI. {c2}Circule pelas rotas e respeite os isolamentos. {c3}E nunca fique sob carga suspensa. {fim}Canteiro organizado, obra segura."),
]))

R.append(roteiro("INT-7-celular", "Uso de celular no ambiente operacional", f"{INT} · Aula 7", "Integração · Aula 7", FI, [
  foto([("equipamentos.jpg",)], "O celular distrai. {o}E distração na montagem pode custar uma mão, um dedo, ou uma vida.", titulo="Celular na obra", cap="Integração · Aula 7", itens=[("o", "Distração custa caro na montagem")]),
  cartoes("Celular guardado durante", [
    ("i", "triangle-alert", "Içamento", "e sinalização de cargas", "vermelho"),
    ("a", "construction", "Trabalho em altura", None, "vermelho"),
    ("m", "cog", "Operação de máquinas", None, "vermelho"),
    ("s", "flame", "Solda e corte", None, "vermelho"),
    ("c", "footprints", "Circulação", "em áreas de risco", "vermelho"),
  ], "Na frente de trabalho, o celular fica guardado. É proibido usar durante {i}içamento e sinalização de cargas, {a}trabalho em altura, {m}operação de máquinas, {s}solda e corte, {c}e circulação em áreas de risco."),
  cartoes("Uso permitido", [
    ("p", "coffee", "Pausas", "área de vivência ou ponto seguro"),
    ("r", "radio", "Operação", "use o rádio ou o meio definido pela obra"),
    ("f", "camera-off", "Fotos e vídeos", "só com autorização da liderança e do cliente"),
    ("h", "headphones", "Fone de música", "não é permitido na frente de trabalho", "vermelho"),
  ], "{p}Se precisar usar, vá para a área de vivência ou um ponto seguro. {r}Para a comunicação da operação, use o rádio. {f}Fotos e vídeos da obra, só com autorização. {h}E fone de ouvido com música não é permitido na frente de trabalho."),
  pergunta("Durante um içamento, o sinaleiro pode atender uma ligação rápida?", "Não", "atenção total na carga e no operador",
           "Sua vez: durante um içamento, o sinaleiro pode atender uma ligação rápida? {pensa}[[pausa:3]] {resp}Não. Atenção total na carga e no operador. A ligação espera."),
  checklist(["Na frente de trabalho, celular guardado", "Uso só em local seguro", "Operação: rádio"], "Nenhuma mensagem vale um acidente.",
            "Para levar: {c1}na frente de trabalho, o celular fica guardado. {c2}Use só em local seguro. {c3}E para a operação, rádio. {fim}Nenhuma mensagem vale um acidente."),
]))

R.append(roteiro("INT-8-regras-ouro", "Regras de ouro e direito de recusa", f"{INT} · Aula 8", "Integração · Aula 8", FI + ["NR-1 (direito de recusa)"], [
  foto([("icamento-ponte.jpg",)], "Algumas regras não têm exceção na Palla. {o}São as nossas regras de ouro.", titulo="Regras de ouro", cap="Integração · Aula 8", itens=[("o", "Regras sem exceção")]),
  cartoes("Regras de ouro", [
    ("r1", "construction", "Em altura, conectado", "NR-35"),
    ("r2", "triangle-alert", "Ninguém sob carga suspensa", "NR-11 e NR-18"),
    ("r3", "user-check", "Só opera quem é autorizado", "máquinas e equipamentos"),
    ("r4", "shield", "Proteção não se retira", "sem bloqueio e autorização"),
    ("r5", "file-check", "Tarefa crítica com APR e PT", "quando exigidas"),
    ("r6", "traffic-cone", "Área isolada", "içamento e montagem"),
  ], "{r1}Em altura, sempre conectado. {r2}Ninguém sob carga suspensa. {r3}Só opera máquina ou equipamento quem é capacitado e autorizado. {r4}Proteção de máquina nunca é retirada sem bloqueio e autorização. {r5}Tarefa crítica, só com análise de risco e permissão de trabalho, quando exigidas. {r6}E a área de içamento e de montagem sempre isolada. Junto com elas: EPI correto, completo e em bom estado."),
  etapas("Direito de recusa", [
    ("p", "Percebeu risco grave e iminente?", None, "triangle-alert", "vermelho"),
    ("i", "Interrompa a atividade", None, "hand"),
    ("c", "Comunique a liderança na hora", None, "megaphone"),
    ("n", "Ninguém é punido por parar tarefa insegura", None, "shield-check", "verde"),
  ], "{p}Se você perceber um risco grave e iminente, {i}você pode, e deve, interromper a atividade, {c}e comunicar a liderança imediatamente. Esse é o direito de recusa, previsto na NR um. {n}Ninguém será punido por parar uma tarefa insegura."),
  pergunta("A linha de vida ainda não foi instalada. Você sobe?", "Não", "comunica e espera a instalação e a liberação",
           "Sua vez: você chega à viga onde vai trabalhar e a linha de vida ainda não foi instalada. Você sobe? {pensa}[[pausa:3]] {resp}Não. Comunica o encarregado e só começa depois da instalação e da liberação da linha."),
  checklist(["Seis regras de ouro, sem exceção", "Risco grave e iminente: pare e comunique", "Parar tarefa insegura nunca é punido"], "Na dúvida, pare.",
            "Para levar: {c1}as regras de ouro não têm exceção. {c2}Diante de risco grave e iminente, pare e comunique. {c3}E parar uma tarefa insegura nunca é punido. {fim}Na dúvida, pare."),
]))

R.append(roteiro("INT-9-prevencao", "Prevenção de acidentes e responsabilidades", f"{INT} · Aula 9", "Integração · Aula 9", FI + ["NR-1 (gerenciamento de riscos)"], [
  foto([("arcelormittal.jpg",)], "Prevenir acidentes é responsabilidade de todos. {o}Mas cada um tem o seu papel.", titulo="Prevenção de acidentes", cap="Integração · Aula 9", itens=[("o", "Responsabilidade de todos, papéis diferentes")]),
  etapas("Ordem de prioridade", [
    ("e", "Eliminar o perigo", None, None),
    ("c", "Proteção coletiva", "guarda-corpo, linha de vida, isolamento", None),
    ("a", "Medidas administrativas", "procedimentos, APR, PT, sinalização", None),
    ("i", "EPI", "complemento, a última barreira", None, "vermelho"),
  ], "A prevenção segue uma ordem de prioridade. {e}Primeiro, eliminar o perigo. {c}Depois, reduzir o risco com proteção coletiva: guarda-corpo, linha de vida, isolamento. {a}Em seguida, medidas de organização: procedimentos, análise de risco, permissão de trabalho, sinalização. {i}E o EPI vem como complemento. Ele é a última barreira, não a primeira.", forma="piramide"),
  cartoes("Cada um com o seu papel", [
    ("em", "building-2", "Empresa", "PGR, proteções, EPI, treinamentos e fiscalização"),
    ("li", "hard-hat", "Liderança", "planeja, orienta, libera com segurança e corrige"),
    ("tr", "user-check", "Você", "cumpre, usa o EPI e comunica os riscos"),
    ("eq", "users", "Equipe", "um cuida do outro"),
  ], "{em}A empresa identifica os perigos e avalia os riscos no PGR, o Programa de Gerenciamento de Riscos; fornece proteções e EPIs, treina e fiscaliza. {li}A liderança planeja com segurança, conduz o DDS, confere as condições antes de liberar e corrige desvios na hora. {tr}Você cumpre os procedimentos, usa o EPI e comunica os riscos. {eq}E a equipe cuida de todos: se um colega estiver em risco, avise."),
  pergunta("O EPI é a primeira ou a última barreira de proteção?", "A última", "primeiro eliminar e proteger coletivamente",
           "Sua vez: o EPI é a primeira ou a última barreira de proteção? {pensa}[[pausa:3]] {resp}A última. Primeiro se elimina o perigo e se protege de forma coletiva. O EPI complementa."),
  checklist(["Eliminar → coletiva → organização → EPI", "Empresa, liderança e você: cada um com o seu papel", "Viu um colega em risco? Avise"], "Segurança é coletiva.",
            "Para levar: {c1}eliminar, proteger de forma coletiva, organizar, e só então o EPI. {c2}Empresa, liderança e você: cada um com o seu papel. {c3}E viu um colega em risco? Avise. {fim}Segurança é coletiva."),
]))

R.append(roteiro("INT-10-alcool", "Política de álcool e drogas", f"{INT} · Aula 10", "Integração · Aula 10", FI, [
  foto([("main-plaza.jpg",)], "Álcool e outras drogas reduzem a atenção, os reflexos e o equilíbrio. {o}Numa obra de estrutura metálica, isso é risco de morte.", titulo="Álcool e drogas", cap="Integração · Aula 10", itens=[("o", "Risco para você e para os colegas")]),
  cartoes("É proibido", [
    ("p1", "ban", "Sob efeito", "entrar ou permanecer na obra", "vermelho"),
    ("p2", "wine", "Portar ou consumir", "no canteiro, nos veículos e nos alojamentos", "vermelho"),
    ("p3", "hand", "Oferecer", "a colegas", "vermelho"),
  ], "{p1}É proibido entrar ou permanecer na obra sob efeito de álcool ou drogas. {p2}E é proibido portar, consumir {p3}ou oferecer essas substâncias no canteiro, nos veículos e nos alojamentos da empresa."),
  cartoes("Remédio e ajuda", [
    ("m", "pill", "Remédio que dá sono?", "avise o encarregado ou a SST; não precisa contar o diagnóstico"),
    ("a", "hand-helping", "Precisa de ajuda?", "procure o RH; tratado com sigilo", "verde"),
  ], "{m}Se você usa algum remédio que cause sonolência ou altere os reflexos, avise o encarregado ou a Segurança do Trabalho, sem precisar contar o diagnóstico. A atividade será avaliada. {a}E se você precisar de ajuda, procure o RH. Buscar ajuda é um ato de coragem, e será tratado com sigilo.", linha=True),
  pergunta("Você está tomando um remédio que dá sono. O que fazer?", "Avisar", "o encarregado ou a SST antes de começar",
           "Sua vez: você está tomando um remédio que dá sono. O que fazer? {pensa}[[pausa:3]] {resp}Avisar o encarregado ou a Segurança do Trabalho antes de começar, para avaliar a atividade."),
  checklist(["Álcool e drogas: proibidos na obra e no alojamento", "Remédio que altera reflexos: avise", "Ajuda: RH, com sigilo"], "Atenção total é segurança.",
            "Para levar: {c1}álcool e drogas são proibidos na obra e no alojamento. {c2}Remédio que altera os reflexos: avise. {c3}E se precisar de ajuda, o RH está aí, com sigilo. {fim}Atenção total é segurança."),
], pendencias=["Procedimentos de verificação e medidas: conforme política aprovada pela Palla e assessoria jurídica [VALIDAR]."]))

R.append(roteiro("INT-11-incidentes", "Comunicação de incidentes e quase acidentes", f"{INT} · Aula 11", "Integração · Aula 11", FI, [
  foto([("viaduto.jpg",)], "Um quase acidente é um aviso. {o}O parafuso que caiu e não acertou ninguém mostra que, da próxima vez, pode acertar.", titulo="Incidentes e quase acidentes", cap="Integração · Aula 11", itens=[("o", "Todo quase acidente é um aviso")]),
  cartoes("O que comunicar", [
    ("a", "siren", "Acidente", "lesão ou dano", "vermelho"),
    ("i", "triangle-alert", "Incidente", "sem lesão, com dano ou potencial"),
    ("q", "circle-alert", "Quase acidente", "por pouco não causou lesão ou dano"),
    ("c", "eye", "Condição insegura", "algo que pode causar um acidente"),
  ], "Tudo isso deve ser comunicado: {a}o acidente, que causou lesão ou dano. {i}O incidente, sem lesão, mas com dano ou potencial de dano. {q}O quase acidente, que por pouco não causou. {c}E a condição insegura, que pode causar um acidente."),
  etapas("Como agir", [
    ("s", "Garanta a segurança e isole a área", None, "traffic-cone"),
    ("v", "Avise o encarregado e a SST", None, "megaphone"),
    ("vi", "Com vítima: plano de emergência", "não mova a vítima, exceto risco maior", "siren", "vermelho"),
    ("p", "Preserve o local e participe da análise", None, "clipboard-list"),
  ], "Como agir: {s}garanta a segurança e isole a área. {v}Avise imediatamente o encarregado e a Segurança do Trabalho. {vi}Se houver vítima, acione o socorro pelo plano de emergência da obra, e não mova a vítima, a menos que haja um risco maior. {p}Preserve o local, quando possível, e participe da análise."),
  foto([("aranhas.jpg",)], "Exemplo: {e}durante a montagem de terças, uma porca cai do nível de cima e bate no chão a um metro de um ajudante. A equipe para, isola a área, comunica a Segurança do Trabalho, {r}e a análise leva ao uso de bolsas porta-parafusos. {d}Comunicar não é dedurar. É assim que a gente descobre a causa e evita que aconteça de novo.",
       titulo="Na prática", itens=[("e", "Porca cai a 1 m de um ajudante"), ("r", "Análise: bolsa porta-parafusos"), ("d", "Comunicar não é dedurar")]),
  pergunta("Ninguém se feriu. O quase acidente precisa ser comunicado?", "Sim", "na hora, ao encarregado e à SST",
           "Sua vez: ninguém se feriu. O quase acidente precisa ser comunicado? {pensa}[[pausa:3]] {resp}Sim. Na hora, ao encarregado e à Segurança do Trabalho."),
  checklist(["Acidente, incidente e quase acidente: comunique", "Isole, avise, preserve", "Participe da análise"], "Comunicar evita o próximo.",
            "Para levar: {c1}acidente, incidente e quase acidente: comunique. {c2}Isole, avise e preserve. {c3}E participe da análise. {fim}Comunicar evita o próximo."),
]))

R.append(roteiro("INT-12-disciplina", "Procedimentos disciplinares", f"{INT} · Aula 12", "Integração · Aula 12", FI + ["CLT, art. 158, parágrafo único"], [
  foto([("parque-fabril.jpg",)], "As regras da Palla existem para proteger as pessoas. {o}Quando alguém descumpre, a empresa precisa agir.", titulo="Procedimentos disciplinares", cap="Integração · Aula 12", itens=[("o", "Regras existem para proteger")]),
  etapas("Medidas proporcionais à gravidade", [
    ("o", "Orientação", None, "message-circle"),
    ("a", "Advertência", None, "file-warning"),
    ("s", "Suspensão", None, "octagon-x"),
    ("d", "Dispensa", "em casos graves previstos em lei", "x", "vermelho"),
  ], "As medidas seguem a legislação trabalhista e são proporcionais à gravidade. Podem ir de {o}uma orientação, {a}a uma advertência, {s}uma suspensão, {d}ou, em casos graves previstos em lei, a dispensa. Toda medida é registrada, com direito de manifestação."),
  colunas("Regra de ouro e direito de recusa", [
    ("Falta grave", "triangle-alert", "vermelho", [("f1", "Descumprir regra de ouro de segurança"), ("f2", "Coloca vidas em risco")]),
    ("Nunca punido", "shield-check", "verde", [("r1", "Parar tarefa por risco grave e iminente"), ("r2", "Comunicar um risco ou incidente")]),
  ], "{f1}Descumprir uma regra de ouro de segurança é falta grave, {f2}porque coloca vidas em risco. Por outro lado, {r1}parar uma tarefa por risco grave e iminente {r2}ou comunicar um risco nunca é motivo de punição."),
  pergunta("Parar uma tarefa por risco grave pode gerar punição?", "Não", "é o direito de recusa",
           "Sua vez: parar uma tarefa por risco grave e iminente pode gerar punição? {pensa}[[pausa:3]] {resp}Não. É o seu direito de recusa."),
  checklist(["Medidas proporcionais e registradas", "Regra de ouro descumprida é falta grave", "Direito de recusa nunca é punido"], "Regras protegem pessoas.",
            "Para levar: {c1}as medidas são proporcionais e registradas. {c2}Descumprir regra de ouro é falta grave. {c3}E o direito de recusa nunca é punido. {fim}Regras protegem pessoas."),
], pendencias=["Tabela de condutas e medidas: regulamento interno aprovado pelo RH e pelo jurídico [VALIDAR]."]))

R.append(roteiro("INT-13-encerramento", "Revisão e próximos passos", f"{INT} · Aula 13", "Integração · Aula 13", FI, [
  foto([("fabrica-aerea.jpg",)], "Você chegou ao final da integração. {o}Vamos relembrar e ver os próximos passos.", titulo="Revisão e próximos passos", cap="Integração · Aula 13", itens=[("o", "O que vimos e o que vem agora")]),
  cartoes("O que você viu", [
    ("a", "building-2", "A Palla", "grupo, missão e valores"),
    ("b", "scale", "Conduta", "respeito, direitos e deveres"),
    ("c", "construction", "Canteiro", "acesso, circulação e celular"),
    ("d", "shield-check", "Regras de ouro", "e direito de recusa"),
    ("e", "siren", "Incidentes", "comunicar e analisar"),
  ], "Você conheceu {a}a Palla e os seus valores; {b}o nosso jeito de trabalhar, com respeito, direitos e deveres; {c}as regras do canteiro; {d}as regras de ouro e o direito de recusa; {e}e como comunicar incidentes."),
  etapas("Seus próximos passos", [
    ("p1", "Avaliação da integração", None, "clipboard-check"),
    ("p2", "Cursos obrigatórios da sua função", None, "graduation-cap"),
    ("p3", "Práticas presenciais agendadas", None, "hard-hat"),
    ("p4", "ASO e documentos na plataforma", None, "files"),
  ], "Agora: {p1}faça a avaliação da integração. {p2}Continue a sua trilha: cada função tem cursos obrigatórios. {p3}Alguns têm etapa prática presencial com instrutor. {p4}E envie o ASO e os documentos pedidos pela plataforma."),
  cartoes("Atenção", [
    ("x", "lock", "Integração não libera sozinha", "o acesso depende de todos os requisitos da função e da aprovação de um responsável", "vermelho"),
  ], "{x}Atenção: concluir a integração não libera o acesso à obra sozinha. A liberação depende de todos os requisitos da sua função, e da aprovação de um responsável.", linha=True),
  checklist(["Faça a avaliação", "Siga a trilha da sua função", "Acompanhe seus documentos na plataforma"], "Bem-vindo à Palla Construções.",
            "Para fechar: {c1}faça a avaliação. {c2}Siga a trilha da sua função. {c3}E acompanhe os seus documentos na plataforma. {fim}Bom trabalho, e seja bem-vindo à Palla Construções."),
]))

# ---------------------------------------------------------------- PAL-52
FP = ["db/conteudo/montagem-segura.ts (Curso 5.2 — Segurança na montagem metálica)"]
PAL = "Segurança na montagem metálica"
R.append(roteiro("PAL52-1-esmagamento", "Esmagamento e queda de peças", f"{PAL} · Aula 1", "PAL-52 · Montagem segura", FP, [
  foto([("icamento-ponte.jpg",)], "Na montagem, as peças são pesadas, rígidas, e chegam em movimento. {o}Quando uma viga encontra o pilar, qualquer mão no meio é esmagada.", titulo="Esmagamento e queda de peças", cap="Segurança na montagem · Aula 1", itens=[("o", "Peças pesadas, rígidas e em movimento")]),
  cartoes("Mãos fora da linha de fechamento", [
    ("c", "move-horizontal", "Corda-guia", "guia a peça de longe"),
    ("p", "pin", "Pino cônico", "alinha os furos, nunca o dedo"),
    ("s", "radio", "Combine com o sinaleiro", "antes de aproximar a mão"),
    ("a", "layers", "Apoio estável", "antes de soltar a lingada"),
  ], "A regra prática: as mãos ficam fora da linha de fechamento. {c}Para guiar a peça, use a corda-guia. {p}Para alinhar os furos, o pino cônico, nunca o dedo. {s}Combine com o sinaleiro antes de aproximar a mão da peça. {a}E no chão, calços e apoios estáveis antes de soltar a lingada."),
  cartoes("Queda de material", [
    ("b", "package", "Bolsa fechada", "parafusos, porcas e arruelas"),
    ("f", "wrench", "Ferramenta amarrada", "ao punho ou ao cinto"),
    ("n", "ban", "Nada lançado", "de um nível para outro", "vermelho"),
    ("i", "traffic-cone", "Área abaixo isolada", "enquanto houver trabalho acima"),
  ], "O segundo risco é a queda de material. Um parafuso de uma polegada, caindo de oito metros, vira um projétil. {b}Parafusos, porcas e arruelas vão em bolsa fechada. {f}Ferramentas manuais são amarradas. {n}Nada é lançado de um nível para outro. {i}E a área abaixo fica isolada enquanto houver trabalho acima."),
  pergunta("Que ferramenta alinha furos sem colocar o dedo entre as peças?", "Pino cônico", "o alinhador; a peça se guia com corda",
           "Sua vez: qual ferramenta alinha os furos sem colocar o dedo entre as peças? {pensa}[[pausa:3]] {resp}O pino cônico, o alinhador. E a peça se guia com a corda-guia."),
  checklist(["Mãos fora da linha de fechamento", "Corda-guia e pino cônico", "Bolsa, ferramenta amarrada e área isolada"], "A peça não para por causa da sua mão.",
            "Para levar: {c1}mãos fora da linha de fechamento. {c2}Corda-guia e pino cônico. {c3}Bolsa fechada, ferramenta amarrada e área abaixo isolada. {fim}A peça não para por causa da sua mão."),
]))
R.append(roteiro("PAL52-2-estabilidade", "Instabilidade estrutural e estabilidade provisória", f"{PAL} · Aula 2", "PAL-52 · Montagem segura", FP, [
  foto([("arcelormittal.jpg",)], "A estrutura metálica só fica estável quando está completa. {o}Durante a montagem, ela pode tombar com o vento ou com um esforço lateral.", titulo="Estabilidade provisória", cap="Segurança na montagem · Aula 2", itens=[("o", "Incompleta, a estrutura pode tombar")]),
  etapas("Estável só quando completa", [
    ("p", "Pilares chumbados", "porcas apertadas ou estaiamento provisório", "anchor"),
    ("v", "Vigas ligadas", None, "link"),
    ("c", "Contraventamentos instalados", "provisórios, conforme o plano", "x"),
  ], "A estrutura só é estável completa: {p}pilares chumbados, {v}vigas ligadas, {c}e contraventamentos instalados. Até lá, vale a sequência de montagem do projeto, com a estabilidade provisória indicada: estais, escoras ou contraventamentos provisórios."),
  cartoes("Nunca", [
    ("l", "unlink", "Soltar a lingada do pilar", "antes de chumbado ou escorado conforme o plano", "vermelho"),
    ("r", "octagon-x", "Retirar estai ou escora", "sem liberação do encarregado", "vermelho"),
    ("w", "wind", "Montar com vento forte", "pare conforme os limites do plano e do equipamento", "vermelho"),
  ], "{l}Nunca solte a lingada de um pilar antes de ele estar chumbado ou escorado conforme o plano. {r}Nunca retire um estai, uma escora ou um contraventamento provisório sem a liberação do encarregado. {w}E com vento forte, a montagem para, conforme os limites do plano e do equipamento.", linha=True),
  cartoes("Viu algo errado?", [
    ("d", "eye", "Deformação, folga ou fora de prumo", "comunique antes de continuar"),
  ], "{d}Viu uma deformação, uma folga anormal ou uma peça fora de prumo? Comunique antes de continuar.", linha=True),
  pergunta("Quando é permitido soltar a lingada de um pilar recém-posicionado?", "Depois", "de chumbado com porcas ou estaiado conforme o plano",
           "Sua vez: quando é permitido soltar a lingada de um pilar recém-posicionado? {pensa}[[pausa:3]] {resp}Só depois de chumbado, com as porcas apertadas, ou estaiado conforme o plano de montagem."),
  checklist(["Siga a sequência de montagem", "Estabilidade provisória antes do próximo vão", "Vento forte: pare"], "Estrutura incompleta não perdoa pressa.",
            "Para levar: {c1}siga a sequência de montagem. {c2}Estabilidade provisória antes do próximo vão. {c3}Vento forte: pare. {fim}Estrutura incompleta não perdoa pressa."),
]))
R.append(roteiro("PAL52-3-suspensa", "Movimentação suspensa, isolamento e comunicação", f"{PAL} · Aula 3", "PAL-52 · Montagem segura", FP, [
  foto([("aranhas.jpg",)], "Na frente de montagem, várias equipes dividem o mesmo espaço. {o}Se alguém trabalha embaixo da área de içamento, o risco é de todos.", titulo="Movimentação suspensa", cap="Segurança na montagem · Aula 3", itens=[("o", "Espaço dividido, risco dividido")]),
  cartoes("Antes de içar", [
    ("c", "users", "Combine com as outras equipes", "quem trabalha onde e quando"),
    ("i", "traffic-cone", "Isole a área", "e o raio de giro do equipamento"),
    ("r", "user-check", "Responsável pelo isolamento", "fita, cones e placa"),
  ], "Antes de começar: {c}o encarregado combina com as outras equipes quem trabalha onde, e quando. {i}A área de içamento e o raio de giro do equipamento ficam isolados, {r}com fita, cones, placa, e um responsável pelo isolamento."),
  cartoes("Durante o içamento", [
    ("s", "hand", "Um sinaleiro designado", "identificado; só ele orienta o operador"),
    ("p", "list-checks", "Sinais padronizados", "conhecidos por operador e sinaleiro"),
    ("r", "radio", "Rádio", "quem fala, ação e confirmação"),
    ("e", "octagon-x", "Parada de emergência", "qualquer pessoa pode dar", "vermelho"),
  ], "Durante o içamento: {s}só o sinaleiro designado orienta o operador. {p}Os sinais seguem o padrão combinado. {r}No rádio: quem fala, a ação e a confirmação. {e}E qualquer pessoa pode dar o sinal de parada de emergência. Se alguém entrar na área isolada, o içamento para."),
  pergunta("Quem pode dar o sinal de parada de emergência?", "Qualquer pessoa", "que veja o risco",
           "Sua vez: durante um içamento, quem pode dar o sinal de parada de emergência? {pensa}[[pausa:3]] {resp}Qualquer pessoa que veja o risco."),
  checklist(["Combine com as outras equipes", "Isole a área e o raio de giro", "Um único sinaleiro; alguém entrou, pare"], "Ninguém sob a carga.",
            "Para levar: {c1}combine com as outras equipes. {c2}Isole a área e o raio de giro. {c3}Um único sinaleiro. E se alguém entrou na área, pare. {fim}Ninguém sob a carga."),
]))

# ---------------------------------------------------------------- Apresentações NR-17, NR-23, NR-26, NR-33
AP = "Apresentação: o que é, para quem é e como funciona o treinamento. Não substitui a capacitação."
R.append(roteiro("NR17-apresentacao", "Ergonomia na montagem metálica", "NR-17 · Apresentação", "NR-17 · Ergonomia",
  ["db/catalogo.ts (NR17-ERG: NR-17, item 17.5.5; carga e validade por critério interno)"], [
  abertura("person-standing", "Conhecer a NR-17 e os cuidados com o corpo na montagem.", "NR dezessete: ergonomia. É a norma que trata da adaptação do trabalho às pessoas, para evitar lesões e desgaste."),
  cartoes("Na montagem, cuidado com", [
    ("p", "person-standing", "Posturas", "tronco torcido, braços acima da cabeça"),
    ("l", "package", "Levantamento de cargas", "peso, distância do corpo"),
    ("t", "move-horizontal", "Transporte manual", "percurso, pega, obstáculos"),
    ("r", "repeat", "Movimentos repetitivos", "aperto, lixamento, furação"),
  ], "Na montagem metálica, os principais cuidados são com {p}as posturas, como tronco torcido e braços acima da cabeça; {l}o levantamento de cargas; {t}o transporte manual; {r}e os movimentos repetitivos, como aperto, lixamento e furação."),
  etapas("Levantar com segurança", [
    ("a", "Avalie o peso e peça ajuda", "ou use equipamento", "users"),
    ("j", "Carga perto do corpo", None, "package"),
    ("c", "Dobre os joelhos, costas retas", None, "arrow-down-to-line"),
    ("g", "Não gire o tronco com a carga", "vire o corpo com os pés", "rotate-ccw"),
  ], "Para levantar: {a}avalie o peso; se for pesado, peça ajuda ou use um equipamento. {j}Mantenha a carga perto do corpo. {c}Dobre os joelhos e mantenha as costas retas. {g}E não gire o tronco segurando a carga: vire o corpo com os pés."),
  cartoes("O treinamento", [
    ("q", "users", "Para quem", "trabalhadores que fazem transporte manual de cargas"),
    ("m", "graduation-cap", "Como", "online, 1 hora (critério interno da Palla)"),
  ], "{q}O treinamento é para quem faz transporte manual de cargas, como prevê a NR dezessete. {m}Na Palla, ele é online, com uma hora, por critério interno da empresa.", linha=True, aviso=AP),
  checklist(["Carga perto do corpo, joelhos dobrados", "Pesado? Peça ajuda ou use equipamento", "Dor ou desconforto: comunique"], "Seu corpo é sua ferramenta de trabalho.",
            "Para levar: {c1}carga perto do corpo e joelhos dobrados. {c2}Pesado? Peça ajuda ou use um equipamento. {c3}E dor ou desconforto, comunique. {fim}Seu corpo é a sua ferramenta de trabalho."),
]))
R.append(roteiro("NR23-apresentacao", "Prevenção e combate a incêndios", "NR-23 · Apresentação", "NR-23 · Incêndios",
  ["db/catalogo.ts (NR23-INC: NR-23, item 23.3.2; a NR-23 não fixa carga nem periodicidade)"], [
  abertura("flame", "Conhecer a NR-23 e as atitudes básicas de prevenção e emergência.", "NR vinte e três: proteção contra incêndios. Na montagem, solda, corte e esmerilhamento produzem fagulhas o dia inteiro."),
  cartoes("O fogo precisa de três coisas", [
    ("c", "package", "Combustível", "madeira, papel, tinta, óleo, gás"),
    ("o", "wind", "Oxigênio", "o ar"),
    ("q", "flame", "Calor", "fagulha, solda, chama", "vermelho"),
  ], "O fogo precisa de três coisas: {c}combustível, {o}oxigênio, {q}e calor. Tire uma delas e o fogo apaga. Por isso, a prevenção afasta o calor do combustível."),
  cartoes("Classes e extintores", [
    ("a", "box", "Classe A", "sólidos: madeira, papel, tecido"),
    ("b", "droplets", "Classe B", "líquidos inflamáveis: óleo, tinta, solvente"),
    ("e", "zap", "Classe C", "equipamentos elétricos energizados"),
  ], "Os incêndios mais comuns na obra são de {a}classe A, sólidos como madeira, papel e tecido; {b}classe B, líquidos inflamáveis como óleo, tinta e solvente; {e}e classe C, equipamentos elétricos energizados. Cada extintor indica no rótulo as classes em que pode ser usado. Confira antes de usar.",
          aviso="Use só o extintor indicado para a classe do fogo. Água nunca em equipamento energizado."),
  etapas("Em caso de incêndio", [
    ("al", "Dê o alarme", "avise e acione a emergência da obra", "bell-ring", "vermelho"),
    ("ex", "Princípio de incêndio: extintor", "só se for seguro e você souber usar", "fire-extinguisher"),
    ("ab", "Abandone pela rota de fuga", "sem correr, sem voltar", "door-open"),
    ("pe", "Ponto de encontro", "aguarde a contagem", "map-pin"),
  ], "Em caso de incêndio: {al}dê o alarme e acione a emergência da obra. {ex}Num princípio de incêndio, use o extintor, só se for seguro e se você souber usar. {ab}Se não der, abandone pela rota de fuga, sem correr e sem voltar. {pe}E vá para o ponto de encontro."),
  cartoes("O treinamento", [
    ("q", "users", "Para quem", "todos os trabalhadores"),
    ("m", "graduation-cap", "Como", "online, informativo, 2 horas (critério interno)"),
    ("b", "info", "Não é brigada", "brigadista segue legislação própria"),
  ], "{q}O treinamento é para todos os trabalhadores. {m}Na Palla, ele é online, informativo, com duas horas, por critério interno: a NR vinte e três não fixa carga horária. {b}E atenção: ele não forma brigadista. A brigada de incêndio segue a legislação do estado e as normas técnicas.", aviso=AP),
  checklist(["Fagulha longe de combustível", "Alarme primeiro; extintor só se for seguro", "Rota de fuga e ponto de encontro"], "Conheça a rota antes de precisar dela.",
            "Para levar: {c1}fagulha longe de combustível. {c2}Alarme primeiro; extintor, só se for seguro. {c3}Rota de fuga e ponto de encontro. {fim}Conheça a rota antes de precisar dela."),
]))
R.append(roteiro("NR26-apresentacao", "Sinalização de segurança e produtos químicos", "NR-26 · Apresentação", "NR-26 · Sinalização",
  ["db/catalogo.ts (NR26-SIN: NR-26, item 26.5.2)", "NR-26: cores e rotulagem conforme normas técnicas oficiais"], [
  abertura("triangle-alert", "Conhecer a NR-26: sinalização, rótulos e ficha de dados dos produtos químicos.", "NR vinte e seis: sinalização de segurança. É ela que diz o que as placas, as cores e os rótulos estão avisando."),
  cartoes("Os tipos de placa", [
    ("p", "ban", "Proibição", "círculo com barra, vermelho", "vermelho"),
    ("a", "triangle-alert", "Advertência", "triângulo, amarelo"),
    ("o", "hard-hat", "Obrigação", "círculo azul"),
    ("e", "door-open", "Emergência", "retângulo verde: saída, primeiros socorros", "verde"),
  ], "No canteiro, cada placa tem uma forma e uma cor. {p}A de proibição: círculo com barra, em vermelho. {a}A de advertência: triângulo amarelo. {o}A de obrigação: círculo azul, como uso obrigatório de capacete. {e}E a de emergência: retângulo verde, como saída e primeiros socorros. Fita e cone de isolamento também são sinalização: área isolada, não entre."),
  cartoes("Produto químico", [
    ("r", "tag", "Rótulo", "pictogramas, palavra de advertência e frases de perigo"),
    ("f", "file-text", "FDS", "ficha com dados de segurança: perigos, uso seguro e emergência"),
    ("u", "flask-conical", "Na obra", "tintas, solventes, gases de solda, desengraxantes"),
  ], "Produto químico tem duas fontes de informação. {r}O rótulo, com pictogramas, a palavra de advertência e as frases de perigo. {f}E a FDS, a ficha com dados de segurança, que explica os perigos, o uso seguro e o que fazer numa emergência. {u}Na obra, isso vale para tintas, solventes, gases de solda e desengraxantes. Produto sem rótulo não se usa."),
  cartoes("O treinamento", [
    ("q", "users", "Para quem", "quem usa produto químico e quem circula no canteiro"),
    ("m", "graduation-cap", "Como", "online, 1 hora (critério interno)"),
  ], "{q}O treinamento é para quem usa produtos químicos, e para todos que circulam no canteiro. {m}Na Palla, ele é online, com uma hora, por critério interno da empresa.", linha=True, aviso=AP),
  checklist(["Forma e cor dizem o tipo da placa", "Rótulo e FDS antes de usar o produto", "Sem rótulo, não use"], "Placa ignorada é aviso perdido.",
            "Para levar: {c1}a forma e a cor dizem o tipo da placa. {c2}Leia o rótulo e a FDS antes de usar o produto. {c3}E produto sem rótulo, não use. {fim}Placa ignorada é aviso perdido."),
]))
R.append(roteiro("NR33-apresentacao", "Espaços confinados", "NR-33 · Apresentação", "NR-33 · Espaço confinado",
  ["db/catalogo.ts (NR33-TAV e NR33-SUP: NR-33, item 33.6 e Anexo III; NR-33 atualizada 2022)"], [
  abertura("triangle-alert", "Conhecer a NR-33 e por que ninguém entra em espaço confinado sem capacitação e permissão.", "NR trinta e três: espaços confinados. É uma das atividades com maior risco de morte, inclusive para quem tenta socorrer sem preparo."),
  cartoes("O que é espaço confinado", [
    ("o", "ban", "Não é feito para ocupação contínua", None),
    ("e", "door-closed", "Entrada e saída limitadas", None),
    ("a", "wind", "Atmosfera perigosa", "existe ou pode existir", "vermelho"),
  ], "Espaço confinado é uma área {o}que não foi projetada para ocupação humana contínua, {e}com meios limitados de entrada e saída, {a}e onde existe, ou pode existir, atmosfera perigosa. Exemplos: tanques, reservatórios, silos e galerias. Na obra, quem identifica e classifica é o responsável técnico."),
  cartoes("Três funções", [
    ("t", "user-check", "Trabalhador autorizado", "entra e executa"),
    ("v", "eye", "Vigia", "fica do lado de fora, o tempo todo"),
    ("s", "clipboard-check", "Supervisor de entrada", "emite a permissão e acompanha"),
  ], "Na entrada, há três funções. {t}O trabalhador autorizado, que entra e executa. {v}O vigia, que fica do lado de fora o tempo todo. {s}E o supervisor de entrada, que emite a Permissão de Entrada e Trabalho, a PET, e acompanha a atividade."),
  cartoes("O treinamento é presencial", [
    ("h", "clock", "Autorizado e vigia", "16 horas"),
    ("sp", "clock", "Supervisor", "40 horas"),
    ("p", "hard-hat", "Prática", "no mínimo metade da carga"),
    ("r", "refresh-cw", "Periódico anual", "8 horas"),
  ], "O treinamento é presencial, com instrutor. {h}Para trabalhador autorizado e vigia: dezesseis horas. {sp}Para supervisor de entrada: quarenta horas. {p}No mínimo metade da carga é prática. {r}E há um periódico anual de oito horas. Além do curso, é preciso ASO com aptidão para espaço confinado, e autorização da empresa.",
          aviso="Valores do catálogo da plataforma (NR-33, Anexo III). Confirmar na versão vigente da norma."),
  pergunta("Um colega desmaiou dentro de um tanque. Você entra para ajudar?", "Não", "acione o resgate; quem entra sem preparo vira a segunda vítima",
           "Sua vez: um colega desmaiou dentro de um tanque. Você entra para ajudar? {pensa}[[pausa:3]] {resp}Não. Acione a emergência e o resgate preparado. Quem entra sem preparo e sem equipamento vira a segunda vítima."),
  checklist(["Sem capacitação, ASO e PET, ninguém entra", "Vigia do lado de fora o tempo todo", "Emergência: acione o resgate, não entre"], "Espaço confinado não perdoa improviso.",
            "Para levar: {c1}sem capacitação, ASO e PET, ninguém entra. {c2}O vigia fica do lado de fora o tempo todo. {c3}E numa emergência, acione o resgate: não entre. {fim}Espaço confinado não perdoa improviso."),
], pendencias=["Carga horária, prática e periodicidade: conferir na versão vigente da NR-33 (Anexo III) antes da turma [VALIDAR]."]))

print("\n".join(R))
