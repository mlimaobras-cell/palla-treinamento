# Lote 3: PAL-53 e PAL-54 (familiarização por modelo), PAL-55 (soldagem e corte), PAL-56 (ferramentas, aulas novas) e INT-02 (visitantes).
# PAL-51 e PAL-57 reutilizam os vídeos do mini curso (ver db/conteudo/treinamentos.ts).
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from roteiros_lib import *

R = []
FI = lambda cod: [f"Capacitação interna Palla Construções (db/catalogo.ts, {cod})"]
NOTA_FAM = "Familiarização por modelo: complementa a capacitação NR-18 do operador e não a substitui."

# ================================================================ PAL-53 e PAL-54
R.append(roteiro_curso("PAL53-1-familiarizacao", "Familiarização com o modelo de PEMT da obra", "Plataformas elevatórias — familiarização por modelo", 1, "PAL-53 · PEMT por modelo", FI("PAL-53"), [
  abertura("clipboard-check", "Saber como é feita a familiarização com o modelo de plataforma usado na obra.",
           "Familiarização com o modelo de plataforma elevatória da obra. Ela complementa a capacitação de operador; não a substitui."),
  cartoes("Por que familiarizar", [
    ("d", "layers", "Cada modelo é diferente", "comandos, limites, dispositivos"),
    ("m", "book-open", "O manual manda", "não a experiência com outro modelo"),
  ], "{d}Cada modelo de plataforma tem comandos, limites e dispositivos diferentes. {m}O que vale é o manual daquele modelo, não a experiência com outro.", linha=True),
  etapas("A familiarização", [
    ("m", "Manual e placa do modelo", "carga, vento, inclinação, alcance", "book-open"),
    ("c", "Comandos da cesta e do solo", None, "hand"),
    ("d", "Dispositivos de segurança", "parada, descida de emergência, alarmes", "octagon-x"),
    ("i", "Inspeção diária do modelo", "checklist do fabricante", "clipboard-check"),
    ("a", "Avaliação operacional", "com o instrutor, registrada", "badge-check", "verde"),
  ], "A familiarização cobre: {m}o manual e a placa do modelo, com carga, vento, inclinação e alcance. {c}Os comandos da cesta e do solo. {d}Os dispositivos de segurança: parada, descida de emergência e alarmes. {i}A inspeção diária pelo checklist do fabricante. {a}E termina com a avaliação operacional com o instrutor, registrada na plataforma."),
  cartoes("Registro", [
    ("r", "file-check", "Modelo e número de série", "data, instrutor e resultado"),
    ("n", "refresh-cw", "Modelo novo na obra?", "nova familiarização"),
  ], "{r}O registro traz o modelo, o número de série, a data, o instrutor e o resultado. {n}Chegou um modelo diferente na obra? Nova familiarização antes de operar.", linha=True),
  pergunta("Chegou outro modelo de plataforma na obra. Posso operar direto?", "Não", "familiarização no novo modelo antes",
           "Sua vez: chegou outro modelo de plataforma na obra. Posso operar direto? {pensa}[[pausa:3]] {resp}Não. Primeiro, a familiarização no novo modelo."),
  checklist(["Manual e placa do modelo", "Comandos, dispositivos e inspeção", "Avaliação registrada por modelo"], "Cada modelo, uma familiarização.",
            "Para levar: {c1}manual e placa do modelo. {c2}Comandos, dispositivos e inspeção. {c3}Avaliação registrada por modelo. {fim}Cada modelo, uma familiarização."),
], nota=NOTA_FAM))
R.append(roteiro_curso("PAL54-1-familiarizacao", "Familiarização com o modelo de guindaste compacto", "Guindastes compactos — familiarização por modelo", 1, "PAL-54 · Guindaste por modelo", FI("PAL-54") + ["Plano logístico Super JK (guindastes aranha 3.0, SPD 360CDH e 8.0)"], [
  abertura("construction", "Saber como é feita a familiarização com o modelo de guindaste compacto da obra.",
           "Familiarização com o modelo de guindaste compacto da obra. Ela complementa a capacitação de operador de equipamento de guindar; não a substitui."),
  foto([("aranhas.jpg",)], "Numa mesma obra podem trabalhar {m}modelos diferentes de guindaste aranha, {t}cada um com a sua tabela de carga, configurações de patola, e dispositivos.",
       titulo="Modelos diferentes", itens=[("m", "Vários modelos na mesma obra"), ("t", "Cada um com tabela e configurações próprias")]),
  etapas("A familiarização", [
    ("m", "Manual e tabela de carga do modelo", "raio, lança, configuração de patolas", "book-open"),
    ("e", "Estabilização do modelo", "patolas, sapatas, nivelamento", "anchor"),
    ("d", "Dispositivos e indicadores", "limitador, alarmes, controle remoto", "gauge"),
    ("i", "Inspeção diária do modelo", None, "clipboard-check"),
    ("a", "Operação supervisionada e avaliação", "registrada", "badge-check", "verde"),
  ], "A familiarização cobre: {m}o manual e a tabela de carga do modelo, com raio, lança e configuração de patolas. {e}A estabilização daquele modelo. {d}Os dispositivos e indicadores, como o limitador e o controle remoto. {i}A inspeção diária do modelo. {a}E a operação supervisionada, com avaliação registrada."),
  cartoes("Registro", [
    ("r", "file-check", "Modelo, série, data, instrutor", "e resultado"),
    ("t", "list-checks", "Tabela de um modelo não vale para outro", None, "vermelho"),
  ], "{r}O registro traz o modelo, o número de série, a data, o instrutor e o resultado. {t}E lembre: a tabela de um modelo não vale para outro.", linha=True),
  pergunta("Posso usar a tabela de carga do modelo 3.0 no modelo 8.0?", "Não", "cada modelo, a sua tabela",
           "Sua vez: posso usar a tabela de carga de um modelo em outro? {pensa}[[pausa:3]] {resp}Não. Cada modelo tem a sua tabela."),
  checklist(["Manual e tabela do modelo", "Estabilização e dispositivos do modelo", "Avaliação registrada por modelo"], "Cada modelo, uma familiarização.",
            "Para levar: {c1}manual e tabela do modelo. {c2}Estabilização e dispositivos daquele modelo. {c3}Avaliação registrada por modelo. {fim}Cada modelo, uma familiarização."),
], nota=NOTA_FAM))

# ================================================================ PAL-55 SOLDAGEM E CORTE
C, E = "Segurança em atividades de soldagem e corte", "PAL-55 · Solda e corte"
FN = FI("PAL-55") + ["Complementa NR-12, NR-18 e NR-6"]
R.append(roteiro_curso("PAL55-1-eletrico-radiacao", "Riscos elétricos, térmicos e radiação", C, 1, E, FN, [
  abertura("zap", "Proteger-se dos riscos elétricos, térmicos e da radiação da solda.",
           "Segurança em soldagem e corte. Aula um: riscos elétricos, térmicos e a radiação do arco."),
  cartoes("Risco elétrico", [
    ("c", "zap", "Cabos e porta-eletrodo", "íntegros e isolados"),
    ("u", "droplets", "Umidade", "luva e roupa secas, piso seco", "vermelho"),
    ("t", "hand", "Troca de eletrodo", "com luva seca; nunca encoste no corpo"),
    ("d", "power", "Desligue ao parar", None),
  ], "Risco elétrico: {c}cabos e porta-eletrodo íntegros e isolados. {u}Umidade aumenta o risco: luva, roupa e piso secos. {t}Troque o eletrodo com luva seca, e nunca encoste o porta-eletrodo no corpo. {d}E desligue a máquina ao parar."),
  cartoes("Risco térmico", [
    ("r", "sparkles", "Respingos", "roupa de algodão ou couro, sem bolso aberto"),
    ("q", "thermometer", "Peça quente", "sinalize e não deixe ao alcance"),
    ("p", "shirt", "Perneira, avental, mangote", "conforme a posição"),
  ], "Risco térmico: {r}respingos: roupa adequada, sem bolsos abertos. {q}Peça recém-soldada é quente: sinalize, e não deixe ao alcance de outros. {p}E perneira, avental e mangote, conforme a posição de soldagem."),
  cartoes("Radiação do arco", [
    ("o", "eye-off", "Olhos", "máscara com o filtro adequado"),
    ("p", "sun", "Pele", "a radiação queima como sol forte"),
    ("b", "fence", "Biombo ou cortina", "protege quem está perto"),
  ], "A radiação do arco: {o}queima os olhos: máscara com o filtro adequado ao processo e à corrente. {p}Queima a pele exposta, como sol forte. {b}E atinge quem está perto: use biombo ou cortina para proteger os colegas."),
  caso("parque-fabril.jpg", [("c1", "Ajudante olha o arco sem proteção"), ("c2", "Olhos irritados à noite: biombo e óculos adequados")],
       "Exemplo: {c1}um ajudante acompanha a solda de perto, sem proteção, só por alguns minutos. À noite, os olhos ardem e lacrimejam. {c2}Biombo, distância, e proteção adequada para quem auxilia."),
  pergunta("Quem está perto da solda também precisa de proteção?", "Sim", "biombo e proteção dos olhos",
           "Sua vez: quem está perto da solda também precisa de proteção? {pensa}[[pausa:3]] {resp}Sim. Biombo, distância e proteção dos olhos."),
  checklist(["Tudo seco e isolado", "Peça quente sinalizada", "Máscara adequada e biombo"], "O arco não escolhe quem queima.",
            "Para levar: {c1}tudo seco e isolado. {c2}Peça quente sinalizada. {c3}Máscara adequada, e biombo para os colegas. {fim}O arco não escolhe quem queima."),
]))
R.append(roteiro_curso("PAL55-2-fumos", "Fumos metálicos e ventilação", C, 2, E, FN, [
  abertura("wind", "Reduzir a exposição aos fumos de solda e corte.",
           "Aula dois: fumos metálicos e ventilação."),
  cartoes("De onde vêm os fumos", [
    ("m", "flame", "Metal fundido", "solda e corte"),
    ("g", "layers", "Galvanizado", "fumos de zinco", "vermelho"),
    ("t", "paint-bucket", "Tinta queimando", "na região da junta"),
  ], "Os fumos vêm {m}do metal fundido, na solda e no corte. {g}No aço galvanizado, os fumos de zinco podem causar febre e mal-estar. {t}E da tinta queimando na região da junta: por isso a pintura é removida antes, conforme o procedimento."),
  cartoes("Como se proteger", [
    ("v", "wind", "Ventilação ou exaustão", "leva o fumo para longe"),
    ("p", "move-horizontal", "Fora da pluma", "não fique com o rosto sobre o fumo"),
    ("r", "shield-check", "Respirador", "o definido pela SST"),
    ("f", "door-open", "Local fechado", "avaliação antes; pode ser espaço confinado", "vermelho"),
  ], "Para se proteger: {v}ventilação ou exaustão, que leva o fumo para longe. {p}Fique fora da pluma: não ponha o rosto sobre o fumo. {r}Use o respirador definido pela Segurança do Trabalho. {f}E em local fechado, avaliação antes de começar: pode até ser espaço confinado."),
  caso("equipamentos.jpg", [("c1", "Solda em peça galvanizada sem exaustão"), ("c2", "Exaustão, posição e respirador antes de começar")],
       "Exemplo: {c1}um soldador faz várias juntas em peças galvanizadas, sem exaustão, e no fim do dia sente febre e mal-estar. {c2}Em galvanizado, exaustão, posição fora da pluma e respirador, antes de começar."),
  pergunta("Onde posicionar o rosto em relação ao fumo da solda?", "Fora da pluma", "de lado, com ventilação",
           "Sua vez: onde posicionar o rosto em relação ao fumo da solda? {pensa}[[pausa:3]] {resp}Fora da pluma, de lado, com ventilação."),
  checklist(["Ventilação ou exaustão sempre", "Fora da pluma", "Galvanizado e tinta: cuidado redobrado"], "O fumo que você não vê também faz mal.",
            "Para levar: {c1}ventilação ou exaustão sempre. {c2}Rosto fora da pluma. {c3}Galvanizado e tinta: cuidado redobrado. {fim}O fumo que você não vê também faz mal."),
]))
R.append(roteiro_curso("PAL55-3-incendio-pt", "Incêndio e permissão de trabalho a quente", C, 3, E, FN + ["NR-23"], [
  abertura("flame", "Evitar incêndio na solda e no corte e saber quando há permissão de trabalho a quente.",
           "Aula três: incêndio, e a permissão de trabalho a quente."),
  etapas("Preparar a área", [
    ("i", "Afaste os inflamáveis", "ou cubra com manta resistente ao fogo", "flame"),
    ("f", "Veja onde caem as fagulhas", "inclusive no andar de baixo", "arrow-down-to-line"),
    ("e", "Extintor ao alcance", None, "fire-extinguisher"),
    ("pt", "Permissão de trabalho a quente", "quando exigida pela obra ou contratante", "file-check"),
  ], "Antes de soldar ou cortar: {i}afaste os inflamáveis, ou cubra com manta resistente ao fogo. {f}Veja onde as fagulhas vão cair, inclusive no andar de baixo. {e}Deixe o extintor ao alcance. {pt}E quando a obra ou o contratante exigirem, emita a permissão de trabalho a quente antes de começar."),
  cartoes("Durante e depois", [
    ("v", "eye", "Vigia de fogo", "quando previsto na PT"),
    ("d", "clock", "Inspeção depois", "fagulha pode virar fogo minutos depois"),
    ("e", "bell-ring", "Princípio de incêndio", "alarme; extintor só se for seguro"),
  ], "Durante e depois: {v}quando a PT prever, um vigia de fogo acompanha. {d}Ao terminar, inspecione a área: uma fagulha pode virar fogo minutos depois. {e}E se houver princípio de incêndio, dê o alarme; use o extintor só se for seguro."),
  caso("main-plaza.jpg", [("c1", "Corte sobre forro com isolamento"), ("c2", "Manta, vigia e inspeção depois")],
       "Exemplo: {c1}num shopping em operação, a equipe vai cortar uma peça acima de um forro com isolamento. {c2}A permissão de trabalho a quente exige manta sob o corte, vigia de fogo, extintor, e inspeção da área depois de terminar."),
  pergunta("Terminou o corte. Pode ir embora na hora?", "Não", "inspecione a área depois",
           "Sua vez: terminou o corte. Pode ir embora na hora? {pensa}[[pausa:3]] {resp}Não. Inspecione a área, porque a fagulha pode virar fogo depois."),
  checklist(["Inflamáveis afastados ou cobertos", "Extintor perto; PT quando exigida", "Inspeção depois de terminar"], "Fagulha é pequena; o incêndio, não.",
            "Para levar: {c1}inflamáveis afastados ou cobertos. {c2}Extintor perto, e PT quando exigida. {c3}Inspeção depois de terminar. {fim}Fagulha é pequena; o incêndio, não."),
]))
R.append(roteiro_curso("PAL55-4-cilindros-oxicorte", "Cilindros de gases e oxicorte", C, 4, E, FN, [
  abertura("flame", "Manusear cilindros e o conjunto de oxicorte com segurança.",
           "Aula quatro: cilindros de gases e o conjunto de oxicorte."),
  cartoes("Cilindros", [
    ("p", "anchor", "Em pé e presos", "corrente ou suporte"),
    ("c", "hard-hat", "Capacete de proteção da válvula", "no transporte"),
    ("s", "move-horizontal", "Oxigênio separado do combustível", "conforme a norma e o procedimento"),
    ("l", "thermometer", "Longe de calor e fagulha", None),
  ], "Cilindros: {p}sempre em pé e presos, com corrente ou suporte. {c}Com o capacete de proteção da válvula no transporte. {s}Oxigênio armazenado separado do gás combustível, conforme a norma e o procedimento. {l}E longe de calor e de fagulhas."),
  cartoes("Conjunto de oxicorte", [
    ("v", "shield-check", "Válvula contra retrocesso de chama", "no conjunto, conforme o procedimento"),
    ("m", "link", "Mangueiras íntegras", "sem emenda improvisada"),
    ("t", "droplets", "Teste de vazamento", "água e sabão, nunca chama"),
    ("o", "ban", "Óleo e graxa", "nunca em contato com oxigênio", "vermelho"),
  ], "O conjunto de oxicorte: {v}com dispositivo contra retrocesso de chama, conforme o procedimento. {m}Mangueiras íntegras, sem emenda improvisada. {t}Teste de vazamento com água e sabão, nunca com chama. {o}E nunca deixe óleo ou graxa em contato com oxigênio: pode inflamar."),
  caso("transporte.jpg", [("c1", "Cilindro solto tomba"), ("c2", "Sempre preso, mesmo por pouco tempo")],
       "Exemplo: {c1}para mudar de frente, a equipe deixa o cilindro de oxigênio solto, encostado num pilar. Ele tomba e a válvula bate no piso. {c2}Cilindro fica sempre preso, mesmo por pouco tempo."),
  pergunta("Como testar vazamento no conjunto de oxicorte?", "Água e sabão", "nunca com chama",
           "Sua vez: como testar vazamento no conjunto de oxicorte? {pensa}[[pausa:3]] {resp}Com água e sabão. Nunca com chama."),
  checklist(["Cilindro em pé e preso", "Antirretrocesso e mangueiras íntegras", "Óleo e graxa longe do oxigênio"], "Cilindro solto é projétil.",
            "Para levar: {c1}cilindro em pé e preso. {c2}Dispositivo contra retrocesso e mangueiras íntegras. {c3}Óleo e graxa longe do oxigênio. {fim}Cilindro solto é projétil."),
]))

# ================================================================ PAL-56 FERRAMENTAS (aulas novas)
C, E = "Utilização segura de ferramentas", "PAL-56 · Ferramentas"
FN = FI("PAL-56") + ["Complementa NR-12"]
R.append(roteiro_curso("PAL56-2-parafusadeira-impacto", "Parafusadeira, chave de impacto e ferramentas manuais", C, 2, E, FN, [
  abertura("wrench", "Usar parafusadeira, chave de impacto e ferramentas manuais com segurança.",
           "Utilização segura de ferramentas. Aula dois: parafusadeira, chave de impacto e ferramentas manuais."),
  cartoes("Chave de impacto e parafusadeira", [
    ("s", "link", "Soquete certo e travado", "pino e anel no lugar"),
    ("r", "rotate-ccw", "Reação da ferramenta", "segure firme, posição estável"),
    ("a", "construction", "Em altura", "ferramenta amarrada"),
    ("p", "info", "Não é ferramenta de torque final", "aperto final pelo método da ligação"),
  ], "Chave de impacto e parafusadeira: {s}soquete certo para a porca, travado com pino e anel. {r}A ferramenta reage: segure firme e em posição estável. {a}Em altura, ferramenta amarrada. {p}E atenção: a chave de impacto não define o aperto final. O aperto final segue o método da ligação, visto no módulo de parafusos."),
  cartoes("Ferramentas manuais", [
    ("c", "wrench", "Chave do tamanho certo", "nada de calço ou cano de extensão", "vermelho"),
    ("m", "hammer", "Marreta e martelo", "cabo firme, cabeça sem rebarba"),
    ("p", "pin", "Pino de alinhar", "nunca o dedo"),
    ("b", "package", "Bolsa de ferramentas", "no cinto, em altura"),
  ], "Ferramentas manuais: {c}chave do tamanho certo: nada de calço ou cano de extensão. {m}Marreta e martelo com cabo firme e cabeça sem rebarba. {p}Para alinhar furos, o pino, nunca o dedo. {b}E em altura, as ferramentas ficam na bolsa ou amarradas."),
  caso("aranhas.jpg", [("c1", "Cano de extensão na chave"), ("c2", "A chave escapa e o montador perde o equilíbrio")],
       "Exemplo: {c1}para soltar uma porca presa, o montador coloca um cano de extensão na chave. A chave escapa, e ele perde o equilíbrio na plataforma. {c2}Use a ferramenta adequada, e peça ajuda quando a porca não solta."),
  pergunta("A chave de impacto dá o aperto final da ligação?", "Não", "o aperto final segue o método da ligação",
           "Sua vez: a chave de impacto dá o aperto final da ligação? {pensa}[[pausa:3]] {resp}Não. O aperto final segue o método definido para a ligação."),
  checklist(["Soquete certo e travado", "Nada de calço ou cano de extensão", "Em altura: ferramenta amarrada"], "Ferramenta certa, do jeito certo.",
            "Para levar: {c1}soquete certo e travado. {c2}Nada de calço ou cano de extensão. {c3}Em altura, ferramenta amarrada. {fim}Ferramenta certa, do jeito certo."),
]))
R.append(roteiro_curso("PAL56-4-inspecao-guarda", "Inspeção, guarda e manutenção das ferramentas", C, 4, E, FN, [
  abertura("clipboard-check", "Inspecionar, guardar e encaminhar para manutenção as ferramentas da função.",
           "Aula quatro: inspeção, guarda e manutenção das ferramentas."),
  cartoes("Inspeção antes do uso", [
    ("c", "zap", "Cabo e plugue", "sem emenda, sem fio exposto"),
    ("p", "shield", "Proteções e empunhaduras", "no lugar"),
    ("g", "hand", "Gatilho", "liga e desliga normalmente"),
    ("a", "disc", "Acessórios", "disco, broca, soquete em bom estado"),
  ], "Antes de usar: {c}cabo e plugue sem emenda e sem fio exposto. {p}Proteções e empunhaduras no lugar. {g}Gatilho que liga e desliga normalmente. {a}E acessórios, como disco, broca e soquete, em bom estado."),
  etapas("Defeito encontrado", [
    ("s", "Separe e identifique", "etiqueta: não usar", "tag", "vermelho"),
    ("c", "Comunique o encarregado", None, "megaphone"),
    ("m", "Manutenção por quem é autorizado", "nada de conserto improvisado", "wrench"),
  ], "Encontrou um defeito: {s}separe a ferramenta e identifique com etiqueta de não usar. {c}Comunique o encarregado. {m}E a manutenção é feita por quem é autorizado: nada de conserto improvisado com fita."),
  cartoes("Guarda", [
    ("l", "box", "Local seco e organizado", None),
    ("d", "disc", "Discos protegidos", "de umidade e impacto"),
    ("t", "lock", "Controle de entrega", "conforme a obra"),
  ], "A guarda: {l}em local seco e organizado. {d}Discos protegidos de umidade e impacto. {t}E controle de entrega e devolução, conforme a obra.", linha=True),
  pergunta("O cabo da esmerilhadeira está com fio exposto. Passa uma fita e usa?", "Não", "separe, identifique e comunique",
           "Sua vez: o cabo da esmerilhadeira está com fio exposto. Passa uma fita e usa? {pensa}[[pausa:3]] {resp}Não. Separe, identifique e comunique."),
  checklist(["Inspecione antes de cada uso", "Defeito: separe, etiquete e comunique", "Guarde seco e organizado"], "Ferramenta boa é ferramenta cuidada.",
            "Para levar: {c1}inspecione antes de cada uso. {c2}Defeito: separe, etiquete e comunique. {c3}Guarde seco e organizado. {fim}Ferramenta boa é ferramenta cuidada."),
]))

# ================================================================ INT-02 VISITANTES
R.append(roteiro_curso("INT02-1-visitantes", "Orientação de segurança para visitantes", "Orientação para visitantes e acesso eventual", 1, "INT-02 · Visitantes", FI("INT-02"), [
  foto([("fabrica-aerea.jpg",)], "Bem-vindo à obra da Palla Construções. {o}Antes de entrar no canteiro, alguns minutos de orientação para a sua segurança.",
       titulo="Orientação para visitantes", cap="INT-02", itens=[("o", "Antes de entrar no canteiro")]),
  cartoes("Os riscos do canteiro de montagem", [
    ("s", "triangle-alert", "Cargas suspensas", "peças içadas por guindaste", "vermelho"),
    ("q", "arrow-down-to-line", "Queda de materiais", "de níveis acima"),
    ("m", "truck", "Máquinas em movimento", "caminhões, guindastes, plataformas"),
    ("f", "flame", "Solda e corte", "fagulhas e radiação"),
  ], "Na montagem, os principais riscos são: {s}cargas suspensas, peças içadas por guindaste. {q}Queda de materiais de níveis acima. {m}Máquinas em movimento: caminhões, guindastes e plataformas. {f}E solda e corte, com fagulhas e radiação."),
  cartoes("Para entrar", [
    ("e", "hard-hat", "EPIs obrigatórios", "capacete, óculos, calçado fechado e o que a obra exigir"),
    ("a", "users", "Sempre acompanhado", "por alguém da Palla"),
    ("r", "footprints", "Só pelas rotas", "nunca em área isolada", "vermelho"),
    ("c", "camera-off", "Fotos só com autorização", None),
  ], "Para entrar: {e}use os EPIs obrigatórios: capacete, óculos, calçado fechado, e o que a obra exigir. {a}Esteja sempre acompanhado por alguém da Palla. {r}Circule só pelas rotas, e nunca entre em área isolada. {c}Fotos, só com autorização."),
  etapas("Em emergência", [
    ("a", "Siga o seu acompanhante", None, "users"),
    ("r", "Rota de fuga", "sem correr", "door-open"),
    ("p", "Ponto de encontro", "aguarde a contagem", "map-pin"),
  ], "Em uma emergência: {a}siga o seu acompanhante. {r}Saia pela rota de fuga, sem correr. {p}E vá para o ponto de encontro, para a contagem."),
  pergunta("Pode passar por baixo de uma peça sendo içada?", "Nunca", "contorne pela rota",
           "Sua vez: pode passar por baixo de uma peça sendo içada? {pensa}[[pausa:3]] {resp}Nunca. Contorne pela rota."),
  checklist(["EPIs obrigatórios", "Sempre acompanhado, só pelas rotas", "Nunca sob carga suspensa"], "Boa visita, com segurança.",
            "Para levar: {c1}EPIs obrigatórios. {c2}Sempre acompanhado, e só pelas rotas. {c3}Nunca sob carga suspensa. {fim}Boa visita, com segurança."),
]))

print("\n".join(R))
