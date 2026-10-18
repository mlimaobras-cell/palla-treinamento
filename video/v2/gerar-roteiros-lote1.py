# Lote 1 de treinamentos completos: NR-18 básico (material de apoio do presencial), NR-6 e NR-11 para auxiliares.
# Fonte dos parâmetros: db/catalogo.ts. Não inventar valores; onde a norma remete ao fabricante ou ao plano, dizer isso.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from roteiros_lib import *

R = []
# ================================================================ NR-18 BÁSICO
C, E = "NR-18 · Básico em segurança na construção", "NR-18 · Básico"
FN = ["NR-18, item 18.14 e Anexo I (conteúdo do treinamento básico)", "db/catalogo.ts (NR18-BAS)"]
NOTA18 = "Material de apoio do treinamento presencial. A carga horária do NR-18 básico é cumprida na turma presencial com instrutor."
PEND18 = ["Carga horária e periodicidade do básico: conferir no Anexo I da NR-18 vigente (Portaria MTE nº 836/2026) [VALIDAR]."]

R.append(roteiro_curso("NR18-1-riscos-canteiro", "Riscos da construção e organização do canteiro", C, 1, E, FN, [
  abertura("construction", "Reconhecer os principais riscos da obra e como o canteiro se organiza para controlá-los.",
           "NR dezoito, treinamento básico. Aula um: os riscos da construção, e como o canteiro se organiza para controlá-los."),
  cartoes("Os riscos da obra", [
    ("q", "construction", "Queda de pessoas", "de altura e no mesmo nível", "vermelho"),
    ("m", "package", "Queda de materiais", "peças, ferramentas, parafusos", "vermelho"),
    ("s", "triangle-alert", "Carga suspensa", "içamento e movimentação"),
    ("e", "zap", "Eletricidade", "cabos, extensões, quadros"),
    ("ma", "cog", "Máquinas e ferramentas", "partes móveis, corte, projeção"),
    ("f", "flame", "Incêndio", "solda, corte e inflamáveis"),
  ], "Na construção, os acidentes mais graves vêm de poucas fontes. {q}Queda de pessoas, de altura ou no mesmo nível. {m}Queda de materiais: peças, ferramentas e parafusos. {s}Carga suspensa, no içamento e na movimentação. {e}Eletricidade, em cabos, extensões e quadros. {ma}Máquinas e ferramentas, com partes móveis, corte e projeção de partículas. {f}E incêndio, principalmente com solda, corte e produtos inflamáveis."),
  cartoes("O canteiro organizado", [
    ("a", "door-open", "Acesso controlado", "portaria, crachá, liberação"),
    ("v", "coffee", "Área de vivência", "refeitório, sanitários, vestiário"),
    ("d", "boxes", "Depósito e armazenagem", "peças apoiadas e calçadas"),
    ("r", "footprints", "Rotas de pedestres", "separadas da circulação de máquinas"),
  ], "O canteiro organizado é a primeira proteção. {a}Acesso controlado, com portaria, crachá e liberação. {v}Área de vivência separada da frente de trabalho: refeitório, sanitários e vestiário. {d}Depósito e área de armazenagem, com as peças apoiadas e calçadas. {r}E rotas de pedestres sinalizadas, separadas da circulação de caminhões, guindastes e plataformas."),
  colunas("Circulação de pessoas", [
    ("Faça", "circle-check", "verde", [("f1", "Use as rotas sinalizadas"), ("f2", "Olhe para os dois lados nas vias de máquinas"), ("f3", "Mantenha passagens livres")]),
    ("Nunca", "octagon-x", "vermelho", [("n1", "Atravessar área isolada"), ("n2", "Passar sob carga suspensa"), ("n3", "Andar de costas perto de máquina em movimento")]),
  ], "Na circulação: {f1}use as rotas sinalizadas, {f2}olhe para os dois lados ao cruzar uma via de máquinas, {f3}e mantenha as passagens livres. E nunca: {n1}atravesse uma área isolada, {n2}passe sob carga suspensa, {n3}ou ande de costas perto de uma máquina em movimento."),
  caso("cargolift.jpg", [("c1", "Atalho pela área do guindaste"), ("c2", "Rota de pedestres, mesmo mais longa")],
       "Exemplo: {c1}para ganhar tempo, um ajudante corta caminho pela área de trabalho do guindaste, entre as patolas. Se a carga girar, ele está no raio. {c2}O certo é a rota de pedestres, mesmo que seja mais longa."),
  pergunta("Qual é a primeira proteção do canteiro?", "Organização", "acesso, vivência, armazenagem e rotas",
           "Sua vez: qual é a primeira proteção do canteiro? {pensa}[[pausa:3]] {resp}A organização: acesso controlado, área de vivência, armazenagem e rotas de pedestres."),
  checklist(["Conheça os riscos da sua frente", "Use as rotas e respeite os isolamentos", "Canteiro organizado é canteiro seguro"], "Organização é a primeira proteção.",
            "Para levar: {c1}conheça os riscos da sua frente de trabalho. {c2}Use as rotas e respeite os isolamentos. {c3}Canteiro organizado é canteiro seguro. {fim}Organização é a primeira proteção."),
], PEND18, NOTA18))

R.append(roteiro_curso("NR18-2-protecoes", "Proteções coletivas e EPI", C, 2, E, FN + ["NR-6 (EPI)"], [
  abertura("shield-check", "Saber quais proteções coletivas existem no canteiro e quando o EPI entra.",
           "Aula dois: proteções coletivas e equipamentos de proteção individual. Primeiro protege o grupo; depois, o indivíduo."),
  etapas("A ordem da proteção", [
    ("e", "Eliminar ou evitar o risco", "ex.: pré-montar no chão", "circle-check"),
    ("c", "Proteção coletiva", "protege todos, sem depender de cada um", "users"),
    ("a", "Organização e procedimento", "isolamento, sinalização, PT", "clipboard-list"),
    ("i", "EPI", "a última barreira", "hard-hat", "vermelho"),
  ], "A proteção segue uma ordem. {e}Primeiro, eliminar ou evitar o risco: por exemplo, pré-montar no chão em vez de montar em altura. {c}Depois, a proteção coletiva, que protege todos sem depender de cada um. {a}Em seguida, organização e procedimento: isolamento, sinalização e permissão de trabalho. {i}E por último o EPI, a última barreira.", forma="piramide"),
  cartoes("Proteções coletivas do canteiro", [
    ("g", "fence", "Guarda-corpo e rodapé", "bordas, aberturas e plataformas"),
    ("l", "link", "Linha de vida e ancoragem", "projetadas por profissional habilitado"),
    ("t", "layers", "Tampa de abertura", "fixa e resistente"),
    ("r", "network", "Rede de proteção", "quando prevista"),
    ("i", "traffic-cone", "Isolamento", "fita, cone e placa"),
    ("s", "shield", "Proteção de máquina", "nunca retirada"),
  ], "No canteiro, você vai encontrar: {g}guarda-corpo com rodapé nas bordas, aberturas e plataformas. {l}Linha de vida e pontos de ancoragem, projetados por profissional legalmente habilitado. {t}Tampas de abertura no piso, fixas e resistentes. {r}Redes de proteção, quando previstas. {i}Isolamento com fita, cone e placa. {s}E as proteções das máquinas, que nunca são retiradas. Viu uma proteção coletiva retirada ou danificada? Não use o local, e comunique."),
  cartoes("O EPI na obra", [
    ("c", "hard-hat", "Capacete", "com jugular em altura"),
    ("o", "glasses", "Óculos", "e protetor facial no esmeril"),
    ("a", "ear", "Protetor auditivo", "em área ruidosa"),
    ("l", "hand", "Luvas", "adequadas à tarefa"),
    ("b", "footprints", "Calçado de segurança", None),
    ("ci", "construction", "Cinturão paraquedista", "acima de 2 m com risco de queda"),
  ], "O EPI completa a proteção: {c}capacete, com jugular em trabalho em altura. {o}Óculos, e protetor facial no esmerilhamento. {a}Protetor auditivo nas áreas ruidosas. {l}Luvas adequadas à tarefa. {b}Calçado de segurança. {ci}E cinturão tipo paraquedista, acima de dois metros com risco de queda. Cada EPI tem o seu treinamento, no curso de NR seis."),
  caso("icamento-ponte.jpg", [("c1", "Guarda-corpo retirado para passar uma peça"), ("c2", "Recolocar antes de liberar a área")],
       "Exemplo: {c1}para passar uma viga, a equipe retira um trecho de guarda-corpo da laje. A peça passa, todos vão para o almoço, e a borda fica aberta. {c2}A proteção removida para uma tarefa é recolocada antes de liberar a área, e enquanto estiver aberta, a borda fica isolada e com alguém responsável."),
  pergunta("O EPI é a primeira ou a última barreira?", "A última", "antes vêm eliminar, coletiva e organização",
           "Sua vez: o EPI é a primeira ou a última barreira? {pensa}[[pausa:3]] {resp}A última. Antes vêm eliminar o risco, a proteção coletiva e a organização."),
  checklist(["Coletiva protege todos: não retire", "EPI completo e em bom estado", "Proteção danificada: não use e comunique"], "Proteção removida é risco para todos.",
            "Para levar: {c1}a proteção coletiva protege todos; não retire. {c2}EPI completo e em bom estado. {c3}Proteção danificada: não use o local, e comunique. {fim}Proteção removida é risco para todos."),
], PEND18, NOTA18))

R.append(roteiro_curso("NR18-3-maquinas-materiais", "Máquinas, equipamentos e movimentação de materiais", C, 3, E, FN + ["NR-11", "NR-12"], [
  abertura("cog", "Trabalhar com segurança perto de máquinas e na movimentação de materiais.",
           "Aula três: máquinas, equipamentos e movimentação de materiais. É onde a obra mais se mexe, e onde mais se machuca."),
  cartoes("Máquinas e equipamentos", [
    ("a", "user-check", "Só opera quem é autorizado", "capacitado no equipamento"),
    ("p", "shield", "Proteções no lugar", "nunca operar sem elas"),
    ("i", "clipboard-check", "Inspeção antes do uso", "defeito: não use, comunique"),
    ("e", "zap", "Elétrica", "cabos sem emenda exposta, ligação em quadro"),
  ], "Máquinas e equipamentos: {a}só opera quem é capacitado e autorizado naquele equipamento. {p}As proteções ficam no lugar; nunca opere sem elas. {i}Inspecione antes de usar; se tiver defeito, não use, e comunique. {e}E na parte elétrica: cabos sem emenda exposta, e ligação só em quadro ou tomada adequados, nunca direto na fiação."),
  cartoes("Movimentação mecânica", [
    ("o", "user-check", "Operador habilitado", "e sinaleiro designado"),
    ("pl", "clipboard-list", "Içamento planejado", "plano e tabela de carga"),
    ("is", "traffic-cone", "Área isolada", "ninguém sob a carga", "vermelho"),
    ("ac", "link", "Acessórios inspecionados", "cintas, cabos, manilhas"),
  ], "Na movimentação com guindaste, munck ou talha: {o}operador habilitado, e um sinaleiro designado. {pl}Içamento planejado, com plano e tabela de carga. {is}Área isolada: ninguém sob a carga. {ac}E acessórios inspecionados: cintas, cabos e manilhas."),
  cartoes("Movimentação manual", [
    ("p", "package", "Avalie o peso", "pesado: ajuda ou equipamento"),
    ("c", "arrow-down-to-line", "Joelhos dobrados", "costas retas, carga perto do corpo"),
    ("v", "eye", "Caminho livre", "veja antes de carregar"),
  ], "Na movimentação manual: {p}avalie o peso; se for pesado, peça ajuda ou use equipamento. {c}Levante com os joelhos dobrados, costas retas e a carga perto do corpo. {v}E olhe o caminho antes de carregar: obstáculos, buracos e degraus.", linha=True),
  caso("transporte.jpg", [("c1", "Descarga sem isolamento"), ("c2", "Isolar e afastar antes de soltar a amarração")],
       "Exemplo: {c1}na descarga de uma carreta, um colega se aproxima para soltar a amarração enquanto o munck já posiciona a próxima peça. {c2}O certo é isolar a área da descarga, e só se aproximar com o equipamento parado e a peça apoiada."),
  pergunta("O equipamento apresentou defeito no início do turno. O que fazer?", "Não usar", "e comunicar o encarregado",
           "Sua vez: a ferramenta ou o equipamento apresentou defeito no início do turno. O que fazer? {pensa}[[pausa:3]] {resp}Não usar, separar, e comunicar o encarregado."),
  checklist(["Só opera quem é autorizado", "Ninguém sob carga suspensa", "Pesado: ajuda ou equipamento"], "Máquina parada com defeito é máquina segura.",
            "Para levar: {c1}só opera quem é autorizado. {c2}Ninguém sob carga suspensa. {c3}Peso demais: ajuda ou equipamento. {fim}Máquina com defeito fica parada."),
], PEND18, NOTA18))

R.append(roteiro_curso("NR18-4-escadas-andaimes", "Escadas, andaimes, plataformas e queda de materiais", C, 4, E, FN + ["NR-35"], [
  abertura("layers", "Usar escadas, andaimes e plataformas com segurança e evitar a queda de materiais.",
           "Aula quatro: escadas, andaimes, plataformas de trabalho, e queda de materiais. E, quando houver, escavações."),
  cartoes("Escadas de mão", [
    ("i", "clipboard-check", "Inspecione", "degraus, montantes, sapatas"),
    ("a", "anchor", "Apoio firme", "base nivelada, topo amarrado"),
    ("p", "hand", "Três pontos de apoio", "subir de frente, mãos livres"),
    ("t", "ban", "Escada não é plataforma", "trabalho prolongado: plataforma", "vermelho"),
  ], "Escada de mão: {i}inspecione antes: degraus, montantes e sapatas. {a}Apoio firme, base nivelada, e topo amarrado ou travado. {p}Suba de frente, mantendo três pontos de apoio, com as mãos livres; ferramenta vai na bolsa. {t}E escada é para acesso: trabalho prolongado se faz em plataforma ou andaime."),
  cartoes("Andaimes e plataformas", [
    ("m", "user-check", "Montado por equipe capacitada", "conforme projeto e fabricante"),
    ("l", "file-check", "Liberado para uso", "inspeção registrada"),
    ("g", "fence", "Guarda-corpo e rodapé", "piso completo e travado"),
    ("n", "ban", "Nunca alterar", "nem retirar peças ou travas", "vermelho"),
  ], "Andaimes e plataformas: {m}montados por equipe capacitada, conforme o projeto e o manual do fabricante. {l}Só usados depois de liberados, com inspeção registrada. {g}Com guarda-corpo, rodapé e piso completo e travado. {n}E nunca altere, nem retire peças ou travas por conta própria."),
  cartoes("Queda de materiais", [
    ("b", "package", "Bolsa fechada", "parafusos e porcas"),
    ("f", "wrench", "Ferramenta amarrada", "em altura"),
    ("r", "fence", "Rodapé e tela", "nas bordas"),
    ("i", "traffic-cone", "Isolamento abaixo", "enquanto houver trabalho acima"),
    ("l", "ban", "Nada arremessado", "de um nível a outro", "vermelho"),
  ], "Queda de materiais: {b}parafusos e porcas em bolsa fechada. {f}Ferramentas amarradas em altura. {r}Rodapé e tela nas bordas. {i}Área isolada abaixo, enquanto houver trabalho acima. {l}E nada é arremessado de um nível a outro."),
  cartoes("Escavações, quando houver", [
    ("e", "shield-alert", "Escoramento ou talude", "conforme projeto"),
    ("b", "fence", "Borda protegida", "material afastado da beira"),
  ], "Quando houver escavação, como em bases e blocos: {e}ela tem escoramento ou talude, conforme o projeto. {b}A borda é protegida, e o material escavado fica afastado da beira. Ninguém entra numa vala sem liberação.", linha=True),
  caso("aranhas.jpg", [("c1", "Chave caiu da plataforma"), ("c2", "Área abaixo isolada: ninguém atingido")],
       "Exemplo: {c1}uma chave de boca escorrega da plataforma a seis metros e cai no piso. {c2}Como a área abaixo estava isolada, ninguém foi atingido. A equipe comunica o quase acidente, e passa a amarrar as ferramentas."),
  pergunta("Escada de mão serve para trabalho prolongado em altura?", "Não", "use plataforma ou andaime liberado",
           "Sua vez: a escada de mão serve para trabalho prolongado em altura? {pensa}[[pausa:3]] {resp}Não. Escada é acesso. Para trabalhar, use plataforma ou andaime liberado."),
  checklist(["Escada: inspeção, apoio e três pontos", "Andaime só liberado e completo", "Bolsa, ferramenta amarrada e isolamento abaixo"], "O que sobe tem que ficar preso.",
            "Para levar: {c1}escada com inspeção, apoio firme e três pontos de contato. {c2}Andaime só liberado e completo. {c3}Bolsa fechada, ferramenta amarrada e isolamento abaixo. {fim}O que sobe tem que ficar preso."),
], PEND18, NOTA18))

R.append(roteiro_curso("NR18-5-emergencias-montagem", "Emergências e riscos da montagem metálica", C, 5, E, FN, [
  abertura("siren", "Saber agir numa emergência e reconhecer os riscos próprios da montagem metálica.",
           "Aula cinco: emergências, e os riscos próprios da montagem de estruturas metálicas."),
  etapas("Numa emergência", [
    ("p", "Pare e avalie", "não vire a segunda vítima", "hand", "vermelho"),
    ("a", "Acione o socorro", "plano de emergência da obra", "phone"),
    ("i", "Isole o local", None, "traffic-cone"),
    ("s", "Ajude só no que foi treinado", "não mova a vítima, exceto risco maior", "hand-helping"),
    ("e", "Abandono: rota de fuga", "ponto de encontro", "door-open"),
  ], "Numa emergência: {p}pare e avalie: não vire a segunda vítima. {a}Acione o socorro, conforme o plano de emergência da obra. {i}Isole o local. {s}Ajude só no que você foi treinado, e não mova a vítima, a menos que haja um risco maior. {e}Se for preciso abandonar, siga a rota de fuga até o ponto de encontro."),
  cartoes("Riscos da montagem metálica", [
    ("e", "hand", "Esmagamento", "mão entre peças em movimento", "vermelho"),
    ("i", "triangle-alert", "Instabilidade", "estrutura incompleta pode tombar", "vermelho"),
    ("a", "construction", "Altura", "quase tudo acima de 2 m"),
    ("s", "triangle-alert", "Carga suspensa", "peças longas giram"),
    ("so", "flame", "Solda e corte", "fagulha, radiação, fumos"),
  ], "A montagem metálica tem riscos próprios: {e}esmagamento, com a mão entre peças em movimento. {i}Instabilidade: estrutura incompleta pode tombar com o vento. {a}Altura: quase tudo acontece acima de dois metros. {s}Carga suspensa: peças longas giram e balançam. {so}E solda e corte: fagulha, radiação e fumos. Cada um tem o seu treinamento na trilha da Palla."),
  caso("arcelormittal.jpg", [("c1", "Vento forte com pilares sem contraventamento"), ("c2", "Montagem parada e estaiamento conferido")],
       "Exemplo: {c1}no fim da tarde, o vento aumenta com uma fila de pilares recém-montados, ainda sem contraventamento. {c2}O encarregado para a montagem, confere o estaiamento, e só retoma no dia seguinte."),
  pergunta("Um colega caiu e está inconsciente. Qual o primeiro passo?", "Avaliar", "o local e acionar o socorro pelo plano da obra",
           "Sua vez: um colega caiu e está inconsciente. Qual o primeiro passo? {pensa}[[pausa:3]] {resp}Parar, avaliar se o local é seguro, e acionar o socorro pelo plano de emergência da obra."),
  checklist(["Emergência: avalie, acione, isole", "Conheça a rota de fuga e o ponto de encontro", "Montagem: esmagamento, instabilidade, altura"], "Saber agir salva vidas.",
            "Para levar: {c1}numa emergência, avalie, acione e isole. {c2}Conheça a rota de fuga e o ponto de encontro da sua obra. {c3}E na montagem, atenção a esmagamento, instabilidade e altura. {fim}Saber agir salva vidas."),
], PEND18, NOTA18))

# ================================================================ NR-6
C, E = "NR-6 · Equipamentos de Proteção Individual", "NR-6 · EPI"
FN = ["NR-6, itens 6.5.1 b, 6.7.1 e 6.7.2 (Portaria MTE nº 57/2025)", "db/catalogo.ts (NR06-EPI)"]
R.append(roteiro_curso("NR06-1-conceito-ca", "O que é EPI, Certificado de Aprovação e responsabilidades", C, 1, E, FN, [
  abertura("hard-hat", "Entender o que é EPI, o Certificado de Aprovação e o papel de cada um.",
           "NR seis: equipamentos de proteção individual. Aula um: o que é EPI, o Certificado de Aprovação, e as responsabilidades."),
  cartoes("O que é EPI", [
    ("d", "user-check", "Uso individual", "protege quem usa"),
    ("r", "shield-check", "Contra riscos", "que ameaçam a segurança e a saúde"),
    ("u", "layers", "Complementa", "não substitui a proteção coletiva"),
  ], "EPI é todo dispositivo ou produto {d}de uso individual, {r}destinado a proteger contra riscos que ameaçam a segurança e a saúde no trabalho. {u}Ele complementa a proteção coletiva e a organização do trabalho; não as substitui."),
  cartoes("Certificado de Aprovação", [
    ("c", "badge-check", "CA", "número gravado no EPI"),
    ("v", "calendar", "Válido", "consulta pública do Ministério do Trabalho"),
    ("s", "ban", "Sem CA, não é EPI", "não pode ser fornecido", "vermelho"),
  ], "Todo EPI só pode ser comercializado e usado com o {c}Certificado de Aprovação, o CA, emitido pelo Ministério do Trabalho. O número vem gravado no equipamento. {v}A validade do CA pode ser consultada. {s}Equipamento sem CA válido não é EPI, e não pode ser fornecido."),
  colunas("Quem faz o quê", [
    ("Empresa", "building-2", "azul", [("e1", "Fornece o EPI adequado, gratuito e em bom estado"), ("e2", "Orienta e treina sobre uso, guarda e conservação"), ("e3", "Exige o uso e substitui quando danificado"), ("e4", "Registra a entrega")]),
    ("Você", "user-check", "verde", [("t1", "Usa só para a finalidade"), ("t2", "Guarda e conserva"), ("t3", "Comunica dano ou perda"), ("t4", "Cumpre as orientações")]),
  ], "A empresa {e1}fornece o EPI adequado ao risco, gratuitamente e em perfeito estado. {e2}Orienta e treina sobre o uso, a guarda e a conservação. {e3}Exige o uso, e substitui quando danificado ou extraviado. {e4}E registra a entrega, em ficha ou sistema. Você {t1}usa o EPI só para a finalidade a que se destina, {t2}é responsável pela guarda e conservação, {t3}comunica qualquer dano, perda ou alteração que o torne impróprio, {t4}e cumpre as orientações sobre o uso."),
  caso("parque-fabril.jpg", [("c1", "Luva comprada na loja da esquina"), ("c2", "Sem CA: troque pelo EPI fornecido")],
       "Exemplo: {c1}um montador perde a luva e compra uma parecida na loja da esquina, sem CA. {c2}Ela não é EPI. O certo é comunicar a perda e receber uma nova, com CA, registrada na ficha."),
  pergunta("Quem paga pelo EPI do trabalhador?", "A empresa", "fornecimento gratuito, adequado e em bom estado",
           "Sua vez: quem paga pelo EPI? {pensa}[[pausa:3]] {resp}A empresa. O fornecimento é gratuito, adequado ao risco e em perfeito estado."),
  checklist(["EPI tem CA válido", "Empresa fornece, treina e substitui", "Você usa, conserva e comunica"], "EPI certo, em bom estado, usado do jeito certo.",
            "Para levar: {c1}EPI tem CA válido. {c2}A empresa fornece, treina e substitui. {c3}Você usa, conserva e comunica. {fim}EPI certo, em bom estado, usado do jeito certo."),
]))
R.append(roteiro_curso("NR06-2-uso-cuidados", "Seleção, inspeção, ajuste, conservação e limitações", C, 2, E, FN, [
  abertura("clipboard-check", "Selecionar, inspecionar, ajustar, conservar e saber os limites de cada EPI.",
           "Aula dois: como selecionar, inspecionar, ajustar e conservar o EPI, e quais são os seus limites."),
  etapas("O ciclo do EPI", [
    ("s", "Seleção", "pelo risco da tarefa, definido pela SST", "target"),
    ("i", "Inspeção antes do uso", "rachadura, corte, costura, validade", "eye"),
    ("a", "Ajuste", "no tamanho certo, sem folga", "user-check"),
    ("c", "Conservação", "limpo, seco, guardado", "box"),
    ("t", "Troca", "danificado, vencido ou após impacto", "refresh-cw", "vermelho"),
  ], "O EPI tem um ciclo. {s}Seleção: definida pelo risco da tarefa, pela Segurança do Trabalho. {i}Inspeção antes de cada uso: rachaduras, cortes, costuras e validade. {a}Ajuste no tamanho certo, sem folga. {c}Conservação: limpo, seco e guardado longe do sol e de produtos químicos. {t}E troca quando estiver danificado, vencido, ou depois de sofrer um impacto."),
  cartoes("Limitações", [
    ("l1", "triangle-alert", "Protege contra um risco", "não contra todos"),
    ("l2", "ban", "Adaptado não protege", "furos, cortes, peças trocadas", "vermelho"),
    ("l3", "user-x", "Mal ajustado não protege", "folga, tamanho errado", "vermelho"),
  ], "Todo EPI tem limitações. {l1}Ele protege contra um risco específico, não contra todos: luva de vaqueta não protege contra produto químico. {l2}EPI adaptado não protege: furos, cortes ou peças trocadas anulam o CA. {l3}E EPI mal ajustado também não protege."),
  caso("equipamentos.jpg", [("c1", "Capacete com rachadura depois de batida"), ("c2", "Trocar, mesmo parecendo inteiro")],
       "Exemplo: {c1}uma peça bate no capacete de um ajudante. Ele está bem, e o capacete parece inteiro, com uma pequena rachadura. {c2}Capacete que sofreu impacto é trocado: a proteção pode estar comprometida mesmo sem dano visível."),
  pergunta("Capacete que sofreu impacto forte pode continuar em uso?", "Não", "troque, mesmo sem dano aparente",
           "Sua vez: o capacete que sofreu um impacto forte pode continuar em uso? {pensa}[[pausa:3]] {resp}Não. Troque, mesmo sem dano aparente."),
  checklist(["Inspecione antes de cada uso", "Ajuste no tamanho certo", "Danificado ou após impacto: troque"], "EPI adaptado não é EPI.",
            "Para levar: {c1}inspecione antes de cada uso. {c2}Ajuste no tamanho certo. {c3}Danificado, vencido ou depois de um impacto: troque. {fim}EPI adaptado não é EPI."),
]))
R.append(roteiro_curso("NR06-3-cabeca-olhos-ouvidos", "Capacete, óculos, protetor facial e protetor auditivo", C, 3, E, FN, [
  abertura("glasses", "Usar corretamente a proteção da cabeça, dos olhos, do rosto e da audição.",
           "Aula três: proteção da cabeça, dos olhos, do rosto e da audição."),
  cartoes("Capacete", [
    ("u", "hard-hat", "Sempre na área operacional", None),
    ("j", "link", "Jugular", "em altura e com vento"),
    ("n", "ban", "Não furar nem pintar", "nem usar boné por baixo", "vermelho"),
  ], "Capacete: {u}sempre na área operacional. {j}Com a jugular afivelada em trabalho em altura e com vento, para não cair. {n}Não fure, não pinte com solvente e não use boné por baixo: isso compromete a proteção."),
  cartoes("Olhos e rosto", [
    ("o", "glasses", "Óculos de segurança", "partículas, poeira"),
    ("f", "shield", "Protetor facial", "esmerilhadeira e corte"),
    ("m", "eye-off", "Máscara de solda", "radiação do arco, com o filtro adequado"),
  ], "Olhos e rosto: {o}óculos de segurança contra partículas e poeira. {f}No esmerilhamento e no corte, protetor facial por cima dos óculos. {m}E na solda, máscara com o filtro adequado ao processo, contra a radiação do arco. Quem está perto da solda também precisa de proteção."),
  cartoes("Audição", [
    ("p", "ear", "Plug ou concha", "conforme a área e a tarefa"),
    ("c", "hand", "Colocação correta", "mãos limpas, plug bem inserido"),
    ("t", "clock", "Todo o tempo de exposição", "tirar alguns minutos já reduz a proteção"),
  ], "Audição: {p}o protetor pode ser de inserção, o plug, ou tipo concha, conforme a área e a tarefa. {c}O plug é colocado com as mãos limpas e bem inserido. {t}E deve ser usado todo o tempo de exposição ao ruído: tirar por alguns minutos já reduz muito a proteção."),
  caso("parque-fabril.jpg", [("c1", "Ajudante segura a peça para o esmerilhamento"), ("c2", "Óculos e protetor facial também para ele")],
       "Exemplo: {c1}um ajudante segura a peça enquanto o montador usa a esmerilhadeira. Só o montador está de protetor facial. {c2}Quem está perto do esmerilhamento também está exposto: óculos e protetor facial para os dois."),
  pergunta("No esmerilhamento, só os óculos bastam?", "Não", "óculos + protetor facial",
           "Sua vez: no esmerilhamento, só os óculos bastam? {pensa}[[pausa:3]] {resp}Não. Óculos e protetor facial por cima."),
  checklist(["Capacete com jugular em altura", "Esmeril: óculos e protetor facial", "Protetor auditivo todo o tempo no ruído"], "Olhos e ouvidos não têm peça de reposição.",
            "Para levar: {c1}capacete com jugular em altura. {c2}No esmeril, óculos e protetor facial. {c3}Protetor auditivo todo o tempo no ruído. {fim}Olhos e ouvidos não têm peça de reposição."),
]))
R.append(roteiro_curso("NR06-4-maos-pes-respiracao", "Luvas, calçados e proteção respiratória", C, 4, E, FN, [
  abertura("hand", "Escolher e usar luvas, calçados e proteção respiratória.",
           "Aula quatro: luvas, calçados e proteção respiratória."),
  cartoes("Luvas: uma para cada risco", [
    ("v", "hand", "Vaqueta ou raspa", "manuseio de peças, abrasão"),
    ("s", "flame", "Luva de soldador", "calor e respingo"),
    ("q", "flask-conical", "Luva química", "solventes e tintas"),
    ("r", "ban", "Perto de partes que giram", "atenção: luva pode ser puxada", "vermelho"),
  ], "Luva certa para cada risco: {v}vaqueta ou raspa para manuseio de peças e abrasão. {s}Luva de soldador para calor e respingos. {q}Luva química, conforme a ficha do produto, para solventes e tintas. {r}E atenção: perto de partes que giram, como a broca da furadeira de bancada, a luva pode ser puxada. Siga a orientação da Segurança do Trabalho para cada máquina."),
  cartoes("Calçado de segurança", [
    ("b", "footprints", "Biqueira", "contra impacto e prensagem"),
    ("s", "layers", "Solado", "antiderrapante, conforme o risco"),
    ("c", "clipboard-check", "Conservado", "sem solado descolado"),
  ], "Calçado de segurança: {b}com biqueira contra impacto e prensagem dos dedos, {s}solado adequado ao risco, {c}e conservado, sem solado descolado ou rasgos."),
  cartoes("Proteção respiratória", [
    ("f", "wind", "Fumos e poeiras", "solda, esmerilhamento, pintura"),
    ("p", "clipboard-list", "Programa de proteção respiratória", "seleção e vedação definidas pela SST"),
    ("b", "user-x", "Barba atrapalha a vedação", None, "vermelho"),
    ("t", "refresh-cw", "Filtro saturado: troque", None),
  ], "Proteção respiratória: {f}contra fumos de solda, poeiras de esmerilhamento e vapores de tinta. {p}O tipo de respirador e o filtro são definidos pela Segurança do Trabalho, no programa de proteção respiratória, com teste de vedação quando exigido. {b}Barba na área de vedação atrapalha a proteção. {t}E filtro saturado, ou respirador danificado, se troca."),
  caso("equipamentos.jpg", [("c1", "Pintura de retoque com solvente"), ("c2", "Luva química e respirador conforme a FDS")],
       "Exemplo: {c1}um montador vai retocar a pintura com tinta e solvente, de luva de vaqueta e sem respirador. {c2}A ficha do produto indica luva química e respirador com filtro para vapores. O certo é pedir o EPI indicado antes de começar."),
  pergunta("Luva de vaqueta protege contra solvente?", "Não", "use a luva química indicada na FDS",
           "Sua vez: a luva de vaqueta protege contra solvente? {pensa}[[pausa:3]] {resp}Não. Use a luva química indicada na ficha do produto."),
  checklist(["Uma luva para cada risco", "Calçado com biqueira e conservado", "Respirador: o definido pela SST, bem vedado"], "EPI certo para o risco certo.",
            "Para levar: {c1}uma luva para cada risco. {c2}Calçado com biqueira e conservado. {c3}Respirador definido pela Segurança do Trabalho, bem vedado. {fim}EPI certo para o risco certo."),
]))
R.append(roteiro_curso("NR06-5-cinturao-pratica", "Cinturão de segurança e etapa prática", C, 5, E, FN + ["NR-35 (sistema de proteção contra quedas)"], [
  abertura("construction", "Inspecionar e vestir o cinturão tipo paraquedista e saber como é a etapa prática.",
           "Aula cinco: o cinturão de segurança tipo paraquedista, e a etapa prática deste curso."),
  etapas("Inspeção do cinturão", [
    ("f", "Fitas", "sem corte, queimadura ou desfiamento", "eye"),
    ("c", "Costuras", "inteiras", "check"),
    ("v", "Fivelas e argolas", "sem trinca nem deformação", "link"),
    ("e", "Etiqueta legível", "CA e identificação", "tag"),
    ("q", "Segurou uma queda?", "sai de uso", "octagon-x", "vermelho"),
  ], "Antes de cada uso, inspecione: {f}as fitas, sem corte, queimadura ou desfiamento. {c}As costuras, inteiras. {v}As fivelas e argolas, sem trinca nem deformação. {e}A etiqueta legível, com o CA. {q}E equipamento que segurou uma queda sai de uso."),
  etapas("Vestir e ajustar", [
    ("p", "Pegue pela argola das costas", None, "hand"),
    ("v", "Vista como um colete", None, "shirt"),
    ("a", "Ajuste pernas e peito", "firme, cabe a mão espalmada", "user-check"),
    ("d", "Argola dorsal entre as escápulas", None, "circle-check", "verde"),
  ], "Para vestir: {p}pegue o cinturão pela argola das costas e desembarace as fitas. {v}Vista como um colete. {a}Ajuste as pernas e o peito, firme, de modo que caiba a mão espalmada entre a fita e o corpo. {d}A argola dorsal fica entre as escápulas."),
  cartoes("Etapa prática", [
    ("p", "hard-hat", "Com o instrutor", "ajuste e inspeção dos EPIs da sua função"),
    ("r", "clipboard-check", "Registrada na plataforma", "o curso só conclui depois dela"),
    ("n", "info", "Altura é outro curso", "uso do cinturão em altura: NR-35"),
  ], "Este curso tem uma etapa prática: {p}com o instrutor, você faz o ajuste e a inspeção dos EPIs da sua função. {r}Ela é registrada na plataforma, e o curso só é concluído depois dela. {n}E atenção: usar o cinturão em altura exige o treinamento de NR trinta e cinco."),
  pergunta("O cinturão segurou uma queda e parece inteiro. Pode voltar ao uso?", "Não", "equipamento que reteve queda sai de uso",
           "Sua vez: o cinturão segurou uma queda e parece inteiro. Pode voltar ao uso? {pensa}[[pausa:3]] {resp}Não. Equipamento que reteve uma queda sai de uso."),
  checklist(["Inspecione fitas, costuras, fivelas e etiqueta", "Ajuste firme: cabe a mão espalmada", "Prática com o instrutor conclui o curso"], "Cinturão bem ajustado salva; frouxo machuca.",
            "Para levar: {c1}inspecione fitas, costuras, fivelas e etiqueta. {c2}Ajuste firme, cabendo a mão espalmada. {c3}E a prática com o instrutor conclui o curso. {fim}Cinturão bem ajustado salva; frouxo machuca."),
]))

# ================================================================ NR-11 AUXILIAR
C, E = "Movimentação de cargas para auxiliares", "NR-11 · Auxiliares"
FN = ["Critério interno Palla; complementa NR-11 e NR-18 (db/catalogo.ts, NR11-AUX)"]
NOTA11 = "Este curso não habilita sinaleiro, amarrador nem operador."
R.append(roteiro_curso("AUX-1-carga-suspensa", "Os riscos da carga suspensa", C, 1, E, FN, [
  abertura("triangle-alert", "Entender por que a carga suspensa é um dos maiores riscos da montagem.",
           "Movimentação de cargas para auxiliares. Aula um: os riscos da carga suspensa. Este curso não habilita sinaleiro, amarrador nem operador."),
  cartoes("O que pode dar errado", [
    ("q", "arrow-down-to-line", "Queda da carga", "acessório rompe ou solta", "vermelho"),
    ("g", "refresh-cw", "Giro e balanço", "peça longa bate em quem está perto"),
    ("t", "construction", "Tombamento do equipamento", "base ou carga acima da tabela", "vermelho"),
    ("e", "hand", "Esmagamento", "entre a carga e a estrutura"),
  ], "Na movimentação, o que pode dar errado: {q}a carga cair, porque um acessório rompeu ou soltou. {g}A peça longa girar ou balançar, e bater em quem está perto. {t}O equipamento tombar, por base mal preparada ou carga acima da tabela. {e}E o esmagamento entre a carga e a estrutura."),
  cartoes("A regra que não muda", [
    ("n", "ban", "Ninguém sob a carga", "nem de passagem", "vermelho"),
    ("r", "move-horizontal", "Fora do raio de giro", None),
    ("c", "eye", "Olho na carga", "o tempo todo"),
  ], "Por isso, a regra não muda: {n}ninguém fica sob a carga, nem de passagem. {r}Quem não está na tarefa fica fora do raio de giro do equipamento. {c}E quem está na tarefa mantém o olho na carga o tempo todo."),
  caso("icamento-ponte.jpg", [("c1", "Ajudante passa sob a viga para pegar a corda"), ("c2", "Esperar a peça baixar ou contornar")],
       "Exemplo: {c1}a viga está suspensa a três metros, e um ajudante passa por baixo para pegar a corda-guia do outro lado. {c2}O certo é esperar a peça baixar e ficar apoiada, ou contornar por fora da área isolada."),
  pergunta("A carga está parada no ar há minutos. Posso passar por baixo?", "Não", "carga suspensa nunca é apoio seguro",
           "Sua vez: a carga está parada no ar há minutos. Posso passar por baixo? {pensa}[[pausa:3]] {resp}Não. Carga suspensa nunca é segura."),
  checklist(["Ninguém sob a carga", "Fora do raio de giro", "Olho na carga"], "Carga suspensa não avisa antes de cair.",
            "Para levar: {c1}ninguém sob a carga. {c2}Fora do raio de giro. {c3}Olho na carga. {fim}Carga suspensa não avisa antes de cair."),
], nota=NOTA11))
R.append(roteiro_curso("AUX-2-isolamento-corda", "Isolamento, posicionamento e corda-guia", C, 2, E, FN, [
  abertura("traffic-cone", "Isolar a área, se posicionar com segurança e guiar a peça com corda.",
           "Aula dois: isolamento da área, posicionamento seguro e uso da corda-guia."),
  cartoes("Isolamento", [
    ("a", "traffic-cone", "Área de içamento", "e raio de giro do equipamento"),
    ("f", "fence", "Fita, cone e placa", "visíveis de todos os lados"),
    ("r", "user-check", "Um responsável", "mantém a área livre"),
  ], "Antes do içamento: {a}isole a área de içamento e o raio de giro do equipamento. {f}Com fita, cones e placa, visíveis de todos os lados. {r}E um responsável mantém a área livre. Se alguém entrar, avise o sinaleiro: o içamento para."),
  cartoes("Seu posicionamento", [
    ("v", "eye", "Visível para o sinaleiro", None),
    ("s", "door-open", "Rota de saída livre", "nunca entre a carga e um obstáculo"),
    ("m", "hand", "Mãos fora da linha de fechamento", None, "vermelho"),
  ], "Seu posicionamento: {v}fique sempre visível para o sinaleiro. {s}Com uma rota de saída livre: nunca entre a carga e um obstáculo, como um pilar ou uma pilha. {m}E mãos fora da linha de fechamento, entre a peça e a estrutura."),
  etapas("Corda-guia", [
    ("p", "Presa na peça antes de içar", None, "link"),
    ("c", "Comprimento suficiente", "você fica fora da projeção da carga", "move-horizontal"),
    ("g", "Só guia, não segura o peso", None, "hand"),
    ("e", "Nunca enrolada na mão", "se puxar, solte", "ban", "vermelho"),
  ], "A corda-guia: {p}é presa na peça antes de içar. {c}Tem comprimento suficiente para você ficar fora da projeção da carga. {g}Ela só guia; não segura o peso. {e}E nunca é enrolada na mão ou no corpo: se a peça puxar, solte."),
  caso("aranhas.jpg", [("c1", "Corda enrolada no pulso"), ("c2", "Segurar com a mão aberta e soltar se puxar")],
       "Exemplo: {c1}para ter mais firmeza, um ajudante enrola a corda-guia no pulso. Uma rajada gira a peça e ele é puxado. {c2}A corda se segura com a mão aberta, e se a peça puxar, você solta."),
  pergunta("A peça girou e está puxando a corda-guia. O que fazer?", "Soltar", "e avisar o sinaleiro",
           "Sua vez: a peça girou e está puxando a corda-guia. O que fazer? {pensa}[[pausa:3]] {resp}Soltar a corda, sair da área, e avisar o sinaleiro."),
  checklist(["Isole área e raio de giro", "Fique visível e com saída livre", "Corda-guia: só guia, nunca enrolada"], "Distância é a sua proteção.",
            "Para levar: {c1}isole a área e o raio de giro. {c2}Fique visível e com saída livre. {c3}Corda-guia só guia, e nunca enrolada. {fim}Distância é a sua proteção."),
], nota=NOTA11))
R.append(roteiro_curso("AUX-3-sinais-parada", "Sinais, rádio e parada de emergência", C, 3, E, FN, [
  abertura("radio", "Entender como a operação se comunica e quando qualquer um pode parar o içamento.",
           "Aula três: os sinais, o rádio, e a parada de emergência."),
  cartoes("Quem comanda", [
    ("s", "user-check", "Um sinaleiro designado", "identificado, por içamento"),
    ("o", "hard-hat", "O operador obedece a ele", None),
    ("a", "users", "Você não sinaliza", "a não ser a parada", "vermelho"),
  ], "Quem comanda o içamento: {s}um único sinaleiro designado, identificado. {o}O operador obedece a ele. {a}E você, auxiliar, não dá sinais ao operador, com uma exceção: a parada de emergência."),
  cartoes("Sinais e rádio", [
    ("p", "list-checks", "Sinais padronizados", "combinados antes, conhecidos por todos"),
    ("r", "radio", "Rádio", "quem fala, a ação, a confirmação"),
    ("d", "circle-help", "Dúvida?", "pare e pergunte"),
  ], "{p}Os sinais são padronizados e combinados antes do içamento, para que todos entendam. {r}No rádio: quem fala, a ação, e a confirmação de quem recebeu. {d}Ficou em dúvida sobre um sinal? Pare e pergunte."),
  cartoes("Parada de emergência", [
    ("q", "octagon-x", "Qualquer pessoa pode dar", "ao ver um risco", "vermelho"),
    ("e", "users", "Alguém na área, peça presa, vento", "motivos para parar"),
    ("r", "message-circle", "Retomar só com o sinaleiro", "depois de resolver"),
  ], "{q}A parada de emergência pode ser dada por qualquer pessoa que veja um risco. {e}Alguém entrou na área, a peça enganchou, o vento aumentou: são motivos para parar. {r}E a operação só é retomada pelo sinaleiro, depois de resolvido o problema."),
  caso("icamento-ponte.jpg", [("c1", "Eletricista entra na área isolada"), ("c2", "Ajudante dá a parada; içamento só volta depois")],
       "Exemplo: {c1}durante o içamento de uma treliça, um eletricista de outra empresa entra na área isolada para buscar material. {c2}O ajudante dá o sinal de parada. O içamento só é retomado depois que ele sai, e o isolamento é reforçado."),
  pergunta("Quem pode dar o sinal de parada de emergência?", "Qualquer pessoa", "que veja o risco",
           "Sua vez: quem pode dar o sinal de parada de emergência? {pensa}[[pausa:3]] {resp}Qualquer pessoa que veja o risco."),
  checklist(["Um sinaleiro comanda", "Sinais combinados; dúvida, pare", "Parada: qualquer um pode dar"], "Na dúvida, pare.",
            "Para levar: {c1}um único sinaleiro comanda. {c2}Sinais combinados antes; na dúvida, pare. {c3}E a parada de emergência, qualquer um pode dar. {fim}Na dúvida, pare."),
], nota=NOTA11))

print("\n".join(R))
