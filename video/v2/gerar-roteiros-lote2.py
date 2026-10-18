# Lote 2: NR-12 (máquinas), sinaleiro/amarrador (aulas novas; reuso de M3), operador de guindaste compacto e operador de PEMT.
# Valores de capacidade, vento, inclinação e distância NÃO são dados aqui: remetem ao manual do fabricante, à tabela e ao plano.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from roteiros_lib import *

R = []
NOTA_PRES = "Material de apoio do treinamento presencial com prática no equipamento. Não habilita sozinho."
# ================================================================ NR-12
C, E = "NR-12 · Segurança em máquinas e equipamentos", "NR-12 · Máquinas"
FN = ["NR-12, item 12.16 e Anexo II", "db/catalogo.ts (NR12-MAQ)"]
NOTA12 = "Curso semipresencial: a etapa prática supervisionada na máquina é obrigatória (NR-12, Anexo II) e registrada pelo instrutor."
R.append(roteiro_curso("NR12-1-riscos", "Riscos mecânicos, elétricos e outros riscos", C, 1, E, FN, [
  abertura("cog", "Reconhecer os riscos das máquinas e ferramentas usadas na montagem.",
           "NR doze: segurança em máquinas e equipamentos. Aula um: os riscos."),
  cartoes("Riscos mecânicos", [
    ("p", "rotate-ccw", "Partes que giram", "disco, broca, eixo: enroscam roupa e luva", "vermelho"),
    ("c", "scissors", "Corte", "disco, serra, chapa"),
    ("pr", "hand", "Prensamento", "entre partes móveis"),
    ("pj", "sparkles", "Projeção", "fagulhas, fragmentos de disco"),
  ], "Os riscos mecânicos: {p}partes que giram, como disco, broca e eixo, que enroscam roupa, luva e cabelo. {c}Corte, por disco, serra e chapa. {pr}Prensamento, entre partes móveis. {pj}E projeção de fagulhas e de fragmentos, se um disco quebrar."),
  cartoes("Outros riscos", [
    ("e", "zap", "Choque elétrico", "cabo danificado, ligação improvisada"),
    ("r", "ear", "Ruído e vibração", None),
    ("f", "flame", "Incêndio", "fagulha perto de inflamável"),
    ("t", "thermometer", "Superfícies quentes", "peça recém-cortada ou soldada"),
  ], "E outros riscos: {e}choque elétrico, por cabo danificado ou ligação improvisada. {r}Ruído e vibração. {f}Incêndio, por fagulha perto de inflamável. {t}E queimadura, em peça recém-cortada ou soldada."),
  cartoes("Zona de perigo", [
    ("z", "triangle-alert", "Zona de perigo", "onde a máquina pode atingir alguém", "vermelho"),
    ("p", "shield", "Proteções e dispositivos", "existem para mantê-lo fora dela"),
  ], "{z}Toda máquina tem uma zona de perigo: o espaço onde ela pode atingir alguém. {p}As proteções e os dispositivos de segurança existem para manter você fora dela.", linha=True),
  caso("parque-fabril.jpg", [("c1", "Manga larga perto da furadeira"), ("c2", "Roupa justa e sem adornos perto de partes que giram")],
       "Exemplo: {c1}um montador usa a furadeira de base magnética com a manga da blusa solta. A broca enrosca o tecido e puxa o braço. {c2}Perto de partes que giram: roupa justa, sem adornos, cabelo preso."),
  pergunta("O que pode enroscar numa broca girando?", "Roupa e luva", "manga solta, adornos, cabelo",
           "Sua vez: o que pode enroscar numa broca girando? {pensa}[[pausa:3]] {resp}Roupa solta, luva, adornos e cabelo."),
  checklist(["Conheça a zona de perigo", "Roupa justa perto de partes que giram", "Cabo danificado: não use"], "A máquina não sabe que você está ali.",
            "Para levar: {c1}conheça a zona de perigo da máquina. {c2}Roupa justa perto de partes que giram. {c3}Cabo danificado: não use. {fim}A máquina não sabe que você está ali."),
], nota=NOTA12))
R.append(roteiro_curso("NR12-2-protecoes", "Proteções e dispositivos de segurança", C, 2, E, FN, [
  abertura("shield", "Saber como funcionam as proteções, quem pode removê-las e o que fazer se estiverem danificadas.",
           "Aula dois: as proteções e os dispositivos de segurança. Para que servem, quem pode remover, e o que fazer quando estão danificados."),
  cartoes("Tipos de proteção", [
    ("f", "shield", "Fixa", "só sai com ferramenta"),
    ("m", "door-closed", "Móvel com intertravamento", "abriu, a máquina para"),
    ("e", "octagon-x", "Parada de emergência", "botão vermelho, ao alcance", "vermelho"),
    ("c", "hand", "Comando de ação continuada", "soltou, parou"),
  ], "As proteções: {f}a fixa, que só sai com ferramenta. {m}A móvel com intertravamento: abriu, a máquina para. {e}O botão de parada de emergência, vermelho, sempre ao alcance. {c}E o comando de ação continuada, como o gatilho da esmerilhadeira: soltou, parou."),
  colunas("Remoção e dano", [
    ("Quem pode remover", "user-check", "azul", [("r1", "Só pessoa autorizada, para manutenção"), ("r2", "Com a máquina parada e bloqueada"), ("r3", "Recolocada antes de voltar a operar")]),
    ("Proteção danificada", "octagon-x", "vermelho", [("d1", "Não opere"), ("d2", "Sinalize a máquina"), ("d3", "Comunique a liderança")]),
  ], "{r1}A proteção só é removida por pessoa autorizada, para manutenção, {r2}com a máquina parada e bloqueada, {r3}e recolocada antes de voltar a operar. Se a proteção estiver danificada, ou faltando: {d1}não opere, {d2}sinalize a máquina, {d3}e comunique a liderança."),
  cartoes("Nunca", [
    ("b", "ban", "Burlar intertravamento", "fita, arame, calço", "vermelho"),
    ("g", "ban", "Travar o gatilho", "ação continuada existe por um motivo", "vermelho"),
    ("t", "ban", "Tirar a coifa do disco", None, "vermelho"),
  ], "E nunca: {b}burle um intertravamento com fita, arame ou calço. {g}Nunca trave o gatilho da ferramenta. {t}E nunca tire a coifa de proteção do disco.", linha=True),
  caso("equipamentos.jpg", [("c1", "Coifa retirada para caber no canto"), ("c2", "Use outra ferramenta ou outro método")],
       "Exemplo: {c1}para alcançar um canto da ligação, o montador retira a coifa da esmerilhadeira. Se o disco quebrar, os pedaços vão direto para ele. {c2}O certo é usar outra ferramenta ou outro método, definidos com o encarregado."),
  pergunta("A proteção da máquina está quebrada. Você pode operar com cuidado?", "Não", "não opere, sinalize e comunique",
           "Sua vez: a proteção da máquina está quebrada. Você pode operar com cuidado? {pensa}[[pausa:3]] {resp}Não. Não opere, sinalize e comunique."),
  checklist(["Proteção só sai com máquina bloqueada", "Danificada: não opere e comunique", "Nunca burle, nunca trave gatilho"], "Proteção burlada é acidente marcado.",
            "Para levar: {c1}proteção só sai com a máquina bloqueada, por quem é autorizado. {c2}Danificada: não opere, e comunique. {c3}Nunca burle, nunca trave o gatilho. {fim}Proteção burlada é acidente marcado."),
], nota=NOTA12))
R.append(roteiro_curso("NR12-3-bloqueio", "Bloqueio de energias perigosas e método de trabalho seguro", C, 3, E, FN, [
  abertura("lock", "Bloquear as energias antes de qualquer intervenção e trabalhar pelo método seguro.",
           "Aula três: bloqueio de energias perigosas, e o método de trabalho seguro."),
  etapas("Bloqueio antes de intervir", [
    ("i", "Identifique as energias", "elétrica, pneumática, hidráulica, mola, gravidade", "zap"),
    ("d", "Desligue", None, "circle-stop"),
    ("b", "Bloqueie e etiquete", "cadeado e etiqueta pessoal", "lock"),
    ("r", "Libere a energia residual", "pressão, mola, peça suspensa", "wind"),
    ("t", "Teste: tente ligar", "não pode partir", "circle-check", "verde"),
  ], "Antes de qualquer intervenção, como limpeza, ajuste ou troca de peça: {i}identifique as energias: elétrica, pneumática, hidráulica, molas e gravidade. {d}Desligue. {b}Bloqueie com o seu cadeado e a sua etiqueta. {r}Libere a energia que sobrou: pressão, mola, peça suspensa. {t}E teste: tente ligar; a máquina não pode partir. Só quem colocou o cadeado tira o cadeado."),
  cartoes("Método de trabalho seguro", [
    ("p", "clipboard-list", "Procedimento da tarefa", "conhecido antes de começar"),
    ("pt", "file-check", "Permissão de trabalho", "quando exigida"),
    ("a", "user-check", "Só o que você foi capacitado", "e autorizado a fazer"),
  ], "{p}Cada tarefa tem o seu procedimento, conhecido antes de começar. {pt}Quando exigida, há permissão de trabalho. {a}E você faz só aquilo para o que foi capacitado e autorizado.", linha=True),
  caso("parque-fabril.jpg", [("c1", "Troca de disco com a máquina na tomada"), ("c2", "Tire da tomada antes de trocar")],
       "Exemplo: {c1}para trocar o disco, um ajudante segura a esmerilhadeira ainda ligada na tomada. O gatilho é pressionado sem querer. {c2}Na ferramenta portátil, o bloqueio é simples: tire da tomada, ou a bateria, antes de trocar o acessório."),
  pergunta("Quem pode retirar o seu cadeado de bloqueio?", "Só você", "quem colocou, retira",
           "Sua vez: quem pode retirar o seu cadeado de bloqueio? {pensa}[[pausa:3]] {resp}Só você. Quem colocou o cadeado é quem retira."),
  checklist(["Desligue, bloqueie, libere e teste", "Ferramenta portátil: tomada ou bateria fora", "Só faça o que foi autorizado"], "Energia bloqueada, mão segura.",
            "Para levar: {c1}desligue, bloqueie, libere a energia residual e teste. {c2}Na ferramenta portátil, tomada ou bateria fora. {c3}E só faça o que foi autorizado. {fim}Energia bloqueada, mão segura."),
], nota=NOTA12))
R.append(roteiro_curso("NR12-4-esmerilhadeira-furadeira", "Esmerilhadeira e furadeira", C, 4, E, FN, [
  abertura("disc", "Usar esmerilhadeira e furadeira com segurança na montagem.",
           "Aula quatro: as duas ferramentas mais usadas na montagem, a esmerilhadeira e a furadeira."),
  etapas("Esmerilhadeira: antes de ligar", [
    ("r", "Rotação do disco ≥ rotação da máquina", "veja no disco e na placa", "gauge"),
    ("t", "Disco certo para a tarefa", "corte é corte; desbaste é desbaste", "disc"),
    ("i", "Disco sem trinca e dentro da validade", None, "eye"),
    ("c", "Coifa e empunhadura lateral no lugar", None, "shield"),
  ], "Esmerilhadeira, antes de ligar: {r}a rotação máxima do disco tem que ser igual ou maior que a da máquina; confira no disco e na placa. {t}Disco certo para a tarefa: disco de corte só corta; disco de desbaste só desbasta. {i}Disco sem trinca, e dentro da validade. {c}E coifa e empunhadura lateral no lugar."),
  cartoes("Esmerilhadeira: durante o uso", [
    ("d", "hand", "Duas mãos", "posição firme"),
    ("l", "users", "Ninguém na linha das fagulhas", None, "vermelho"),
    ("p", "timer", "Espere o disco parar", "antes de apoiar"),
    ("e", "glasses", "Óculos e protetor facial", "luvas e protetor auditivo"),
  ], "Durante o uso: {d}duas mãos e posição firme. {l}Ninguém na linha das fagulhas. {p}Espere o disco parar antes de apoiar a ferramenta. {e}E EPI: óculos com protetor facial, luvas e protetor auditivo."),
  cartoes("Furadeira", [
    ("f", "anchor", "Peça presa", "nunca segurada na mão"),
    ("m", "link", "Base magnética", "superfície limpa e cinta de segurança quando exigida"),
    ("b", "rotate-ccw", "Broca travou?", "solte o gatilho"),
    ("c", "hand", "Cavaco", "remova com gancho ou pincel, nunca com a mão"),
  ], "Furadeira: {f}a peça fica presa, nunca segurada na mão. {m}Na furadeira de base magnética, superfície limpa e plana, e a cinta ou corrente de segurança quando o fabricante exigir, principalmente em altura ou na vertical. {b}Se a broca travar, solte o gatilho. {c}E o cavaco se remove com gancho ou pincel, nunca com a mão."),
  caso("equipamentos.jpg", [("c1", "Disco de corte usado para desbaste"), ("c2", "O disco estoura: use o disco certo")],
       "Exemplo: {c1}para não trocar o disco, o montador usa o disco de corte de lado, para desbastar uma solda. O disco fino não aguenta esforço lateral e estoura. {c2}Disco de corte só corta. Para desbaste, troque pelo disco de desbaste."),
  pergunta("Posso usar o disco de corte para desbastar uma solda?", "Não", "o disco fino estoura no esforço lateral",
           "Sua vez: posso usar o disco de corte para desbastar uma solda? {pensa}[[pausa:3]] {resp}Não. O disco fino estoura com o esforço lateral. Troque pelo disco de desbaste."),
  checklist(["Rotação do disco ≥ da máquina", "Disco certo, coifa e duas mãos", "Furadeira: peça presa, base fixa"], "Cada disco tem a sua função.",
            "Para levar: {c1}rotação do disco igual ou maior que a da máquina. {c2}Disco certo, coifa e duas mãos. {c3}Na furadeira, peça presa e base fixa. {fim}Cada disco tem a sua função."),
], nota=NOTA12))
R.append(roteiro_curso("NR12-5-corte-solda", "Equipamentos de corte e máquinas de solda", C, 5, E, FN, [
  abertura("flame", "Usar equipamentos de corte e máquinas de solda com segurança e conhecer a etapa prática.",
           "Aula cinco: equipamentos de corte e máquinas de solda. E como funciona a etapa prática deste curso."),
  cartoes("Máquina de solda", [
    ("c", "zap", "Cabos íntegros", "sem emenda exposta"),
    ("t", "link", "Cabo de retorno (terra) perto da junta", "bem preso na peça"),
    ("d", "power", "Desligue para ajustes", "e ao terminar"),
    ("u", "droplets", "Local seco", "nada de solda com roupa ou luva molhada", "vermelho"),
  ], "Máquina de solda: {c}cabos íntegros, sem emenda exposta. {t}O cabo de retorno, o terra, preso perto da junta, firme na peça. {d}Desligue para fazer ajustes, e ao terminar. {u}E local seco: nada de soldar com roupa ou luva molhada."),
  cartoes("Corte", [
    ("o", "flame", "Oxicorte", "cilindros presos, válvula contra retrocesso de chama"),
    ("p", "zap", "Plasma", "cabos e tocha íntegros"),
    ("a", "fire-extinguisher", "Área preparada", "inflamáveis afastados, extintor perto"),
  ], "Corte: {o}no oxicorte, cilindros presos em pé, e dispositivo contra retrocesso de chama. {p}No plasma, cabos e tocha íntegros. {a}E sempre área preparada: inflamáveis afastados, e extintor por perto. O curso de soldagem e corte da Palla aprofunda esses cuidados."),
  cartoes("Etapa prática", [
    ("p", "hard-hat", "Na máquina, com o instrutor", "supervisionada"),
    ("r", "clipboard-check", "Registrada", "o curso só conclui depois dela"),
    ("m", "refresh-cw", "Mudou máquina ou método?", "nova capacitação"),
  ], "A etapa prática: {p}é feita na máquina, supervisionada pelo instrutor. {r}Ela é registrada, e o curso só conclui depois dela. {m}E sempre que mudar a máquina, o método ou o processo, a capacitação é refeita.", linha=True),
  caso("parque-fabril.jpg", [("c1", "Cabo terra preso longe, na estrutura"), ("c2", "Prenda perto da junta, na própria peça")],
       "Exemplo: {c1}o soldador prende o cabo terra num pilar distante, e a corrente passa por ligações e pela estrutura. Isso aquece e danifica peças. {c2}O cabo de retorno vai perto da junta, preso firme na própria peça."),
  pergunta("Onde prender o cabo de retorno da máquina de solda?", "Perto da junta", "firme, na própria peça",
           "Sua vez: onde prender o cabo de retorno da máquina de solda? {pensa}[[pausa:3]] {resp}Perto da junta, firme na própria peça."),
  checklist(["Cabos íntegros, terra perto da junta", "Corte com área preparada e extintor", "Prática na máquina conclui o curso"], "Equipamento conferido, trabalho seguro.",
            "Para levar: {c1}cabos íntegros, e terra perto da junta. {c2}Corte com área preparada e extintor. {c3}E a prática na máquina conclui o curso. {fim}Equipamento conferido, trabalho seguro."),
], nota=NOTA12))

# ================================================================ SINALEIRO E AMARRADOR (aulas novas)
C, E = "Sinaleiro e amarrador de cargas", "NR-18 · Sinaleiro"
FN = ["NR-18, Anexo I; NR-11 (db/catalogo.ts, NR11-SIN)"]
PENDS = ["Carga horária e periodicidade: conferir no Anexo I da NR-18 vigente [VALIDAR]."]
R.append(roteiro_curso("SIN-1-papeis", "Papéis e responsabilidades na movimentação", C, 1, E, FN, [
  abertura("users", "Entender o papel do sinaleiro, do amarrador, do operador e do responsável pelo içamento.",
           "Sinaleiro e amarrador de cargas. Aula um: os papéis de cada um na movimentação."),
  cartoes("A equipe do içamento", [
    ("r", "clipboard-check", "Responsável pelo plano", "engenharia: plano de içamento"),
    ("o", "hard-hat", "Operador", "capacitado e autorizado no equipamento"),
    ("a", "link", "Amarrador", "escolhe e inspeciona acessórios, amarra conforme o plano"),
    ("s", "hand", "Sinaleiro", "único que orienta o operador"),
  ], "O içamento é trabalho de equipe. {r}O responsável pelo plano, da engenharia, define o equipamento, os acessórios e a configuração. {o}O operador, capacitado e autorizado naquele equipamento. {a}O amarrador escolhe e inspeciona os acessórios, e amarra a carga conforme o plano. {s}E o sinaleiro é o único que orienta o operador durante o movimento."),
  cartoes("Deveres do sinaleiro", [
    ("v", "eye", "Ver a carga e ser visto", "pelo operador"),
    ("i", "traffic-cone", "Garantir o isolamento", None),
    ("c", "radio", "Comunicação clara", "sinais padronizados ou rádio"),
    ("p", "octagon-x", "Parar diante do risco", None, "vermelho"),
  ], "O sinaleiro: {v}fica onde vê a carga e é visto pelo operador; se não houver visão, usa o rádio. {i}Garante que a área está isolada. {c}Usa sinais padronizados, combinados antes, ou o rádio, com confirmação. {p}E para a operação diante de qualquer risco."),
  cartoes("Identificação e autorização", [
    ("c", "id-card", "Identificado", "colete ou braçadeira, conforme a obra"),
    ("a", "file-check", "Autorizado pela empresa", "depois da capacitação e da prática"),
  ], "{c}O sinaleiro é identificado, com colete ou braçadeira, conforme a obra. {a}E só atua depois de capacitado, avaliado na prática, e autorizado formalmente pela empresa. Certificado não é autorização.", linha=True),
  caso("aranhas.jpg", [("c1", "Dois colegas fazendo sinais ao operador"), ("c2", "Um único sinaleiro; o resto só dá a parada")],
       "Exemplo: {c1}no içamento de uma escada metálica, dois montadores fazem sinais ao mesmo tempo, e o operador recebe ordens diferentes. {c2}Só um sinaleiro orienta o operador. Os outros só podem dar a parada de emergência."),
  pergunta("Quantas pessoas orientam o operador durante o içamento?", "Uma", "o sinaleiro designado",
           "Sua vez: quantas pessoas orientam o operador durante o içamento? {pensa}[[pausa:3]] {resp}Uma: o sinaleiro designado."),
  checklist(["Plano define equipamento e acessórios", "Amarrador inspeciona e amarra conforme o plano", "Um único sinaleiro, identificado e autorizado"], "Cada um no seu papel.",
            "Para levar: {c1}o plano define equipamento e acessórios. {c2}O amarrador inspeciona e amarra conforme o plano. {c3}Um único sinaleiro, identificado e autorizado. {fim}Cada um no seu papel."),
], PENDS, NOTA_PRES))
R.append(roteiro_curso("SIN-2-comunicacao", "Isolamento e comunicação por sinais e rádio", C, 5, E, FN, [
  abertura("radio", "Isolar a área e comunicar com clareza durante todo o içamento.",
           "Aula cinco: o isolamento, e a comunicação por sinais e por rádio."),
  etapas("Antes de içar", [
    ("p", "Confira o plano", "peso, raio, acessórios", "clipboard-list"),
    ("i", "Isole a área e o raio de giro", None, "traffic-cone"),
    ("c", "Combine os sinais com o operador", "e teste o rádio", "radio"),
    ("t", "Içamento de teste", "erga um pouco e pare: confira equilíbrio e amarração", "arrow-down-to-line"),
  ], "Antes de içar: {p}confira o plano: peso, raio e acessórios. {i}Isole a área e o raio de giro. {c}Combine os sinais com o operador e teste o rádio. {t}E faça o içamento de teste: erga um pouco, pare, e confira o equilíbrio e a amarração."),
  cartoes("Comunicação por rádio", [
    ("q", "user-check", "Quem fala", "identifique-se"),
    ("a", "message-circle", "A ação", "curta e clara"),
    ("c", "circle-check", "Confirmação", "o operador repete"),
    ("s", "octagon-x", "Silêncio no rádio?", "o operador para", "vermelho"),
  ], "Por rádio: {q}quem fala se identifica. {a}A ação é curta e clara. {c}O operador confirma, repetindo. {s}E combine: se o rádio ficar mudo, o operador para."),
  cartoes("Sinais", [
    ("p", "list-checks", "Padronizados", "conforme o padrão adotado pela obra"),
    ("v", "eye", "Visíveis", "braços claros, sem duplo sentido"),
    ("e", "octagon-x", "Parada de emergência", "qualquer pessoa pode dar", "vermelho"),
  ], "Os sinais manuais: {p}seguem o padrão adotado pela obra, treinado na prática. {v}São feitos de forma visível, sem duplo sentido. {e}E a parada de emergência pode ser dada por qualquer pessoa."),
  caso("icamento-ponte.jpg", [("c1", "Carga some atrás da estrutura"), ("c2", "Passa para o rádio ou um segundo sinaleiro combinado")],
       "Exemplo: {c1}durante o giro, a carga passa para trás de uma torre, e o operador perde de vista o sinaleiro. {c2}Antes de seguir, a comunicação passa para o rádio, ou para um sinaleiro auxiliar combinado no plano, com a troca anunciada."),
  pergunta("O rádio ficou mudo durante o movimento. O que o operador faz?", "Para", "e só retoma com contato confirmado",
           "Sua vez: o rádio ficou mudo durante o movimento. O que o operador faz? {pensa}[[pausa:3]] {resp}Para, e só retoma com o contato confirmado."),
  checklist(["Plano, isolamento, sinais e teste", "Rádio: quem, ação, confirmação", "Perdeu contato: para"], "Comunicação clara, carga segura.",
            "Para levar: {c1}plano, isolamento, sinais combinados e içamento de teste. {c2}No rádio: quem fala, a ação e a confirmação. {c3}Perdeu o contato: para. {fim}Comunicação clara, carga segura."),
], PENDS, NOTA_PRES))
R.append(roteiro_curso("SIN-3-prevencao", "Acidentes típicos e prevenção", C, 6, E, FN, [
  abertura("siren", "Conhecer os acidentes típicos de içamento e como evitá-los.",
           "Aula seis: os acidentes típicos de içamento, e como evitá-los."),
  cartoes("Acidentes típicos", [
    ("a", "link", "Acessório rompido", "acima da capacidade ou danificado", "vermelho"),
    ("c", "triangle-alert", "Carga desequilibrada", "gancho fora do centro de gravidade"),
    ("t", "construction", "Tombamento", "raio maior que o planejado, base cedeu", "vermelho"),
    ("p", "users", "Pessoa sob a carga", None, "vermelho"),
    ("e", "zap", "Contato com rede elétrica", None, "vermelho"),
  ], "Os acidentes típicos: {a}acessório rompido, por estar acima da capacidade ou danificado. {c}Carga desequilibrada, com o gancho fora do centro de gravidade. {t}Tombamento do equipamento, por raio maior que o planejado ou base que cedeu. {p}Pessoa sob a carga. {e}E contato com a rede elétrica."),
  cartoes("Prevenção", [
    ("pl", "clipboard-list", "Seguir o plano", "mudou algo? replanejar"),
    ("i", "eye", "Inspecionar acessórios", "antes de cada uso"),
    ("v", "wind", "Respeitar vento e clima", "limites do plano e do fabricante"),
    ("r", "zap", "Distância da rede elétrica", "definida no plano"),
  ], "A prevenção: {pl}seguir o plano; se algo mudar, como o peso, o raio ou a posição do equipamento, o içamento é replanejado. {i}Inspecionar os acessórios antes de cada uso. {v}Respeitar os limites de vento e clima do plano e do fabricante. {r}E manter a distância da rede elétrica definida no plano."),
  caso("transporte.jpg", [("c1", "Peça mais pesada que o romaneio"), ("c2", "Parar e consultar a engenharia")],
       "Exemplo: {c1}no içamento de teste, o equipamento indica peso maior do que o romaneio. {c2}O sinaleiro para, e a engenharia confere o peso e o plano antes de continuar."),
  pergunta("O peso real ficou maior que o do plano. O que fazer?", "Parar", "e replanejar com a engenharia",
           "Sua vez: o peso real ficou maior que o do plano. O que fazer? {pensa}[[pausa:3]] {resp}Parar, e replanejar com a engenharia."),
  checklist(["Mudou peso, raio ou posição: replaneje", "Acessórios inspecionados", "Vento, clima e rede elétrica: limites do plano"], "Içamento seguro é içamento planejado.",
            "Para levar: {c1}mudou peso, raio ou posição: replaneje. {c2}Acessórios sempre inspecionados. {c3}Vento, clima e rede elétrica dentro dos limites do plano. {fim}Içamento seguro é içamento planejado."),
], PENDS, NOTA_PRES))

# ================================================================ OPERADOR DE GUINDASTE COMPACTO
C, E = "Operador de equipamento de guindar", "NR-18 · Guindaste"
FN = ["NR-18, Anexo I; NR-12, Anexo II (db/catalogo.ts, NR18-GUI)", "Plano logístico e de montagem — Obra Super JK (guindastes aranha sobre laje)"]
PENDG = ["Carga horária, proporção prática e periodicidade: conferir na NR-18 vigente [VALIDAR].", "Capacidades e limites: sempre do manual e da tabela do modelo."]
R.append(roteiro_curso("GUI-1-equipamento", "O equipamento e os seus riscos", C, 1, E, FN, [
  abertura("construction", "Conhecer o guindaste compacto, os seus componentes e os riscos da operação.",
           "Operador de equipamento de guindar. Aula um: o equipamento, e os seus riscos. A capacitação é específica para cada modelo."),
  foto([("aranhas.jpg", None, "Guindastes compactos e plataformas")], "Na montagem, os guindastes compactos, como os guindastes aranha, trabalham {l}em espaço reduzido e até sobre lajes, {p}com patolas que distribuem a carga. {m}Cada modelo tem o seu manual e a sua tabela de carga.",
       titulo="Guindaste compacto", itens=[("l", "Espaço reduzido, até sobre laje"), ("p", "Patolas distribuem a carga"), ("m", "Cada modelo, o seu manual e tabela")]),
  cartoes("Componentes", [
    ("p", "anchor", "Patolas e sapatas", "estabilizam o equipamento"),
    ("l", "move-horizontal", "Lança", "telescópica, com ângulo e comprimento"),
    ("g", "link", "Cabo, moitão e gancho", "com trava de segurança"),
    ("d", "gauge", "Dispositivos de segurança", "limitador de carga e indicadores do modelo"),
  ], "Os componentes principais: {p}patolas e sapatas, que estabilizam o equipamento. {l}A lança, com o seu ângulo e comprimento. {g}O cabo, o moitão e o gancho, com trava de segurança. {d}E os dispositivos de segurança do modelo, como o limitador de carga e os indicadores. Eles nunca são desativados."),
  cartoes("Riscos da operação", [
    ("t", "construction", "Tombamento", "base, patolamento, raio", "vermelho"),
    ("q", "arrow-down-to-line", "Queda da carga", None, "vermelho"),
    ("c", "zap", "Rede elétrica", None),
    ("a", "users", "Atropelamento e prensamento", "no deslocamento e no giro"),
  ], "Os riscos: {t}tombamento, por base, patolamento ou raio errados. {q}Queda da carga. {c}Contato com a rede elétrica. {a}E atropelamento e prensamento, no deslocamento e no giro."),
  pergunta("O limitador de carga atrapalha a operação. Pode desativar?", "Nunca", "dispositivo de segurança não se desativa",
           "Sua vez: o limitador de carga está atrapalhando a operação. Pode desativar? {pensa}[[pausa:3]] {resp}Nunca. Dispositivo de segurança não se desativa."),
  checklist(["Capacitação é por modelo", "Dispositivos de segurança sempre ativos", "Tombamento é o maior risco"], "Conheça a sua máquina antes de confiar nela.",
            "Para levar: {c1}a capacitação é por modelo. {c2}Os dispositivos de segurança ficam sempre ativos. {c3}E o tombamento é o maior risco. {fim}Conheça a sua máquina antes de confiar nela."),
], PENDG, NOTA_PRES))
R.append(roteiro_curso("GUI-2-estabilizacao", "Base, patolamento e nivelamento", C, 2, E, FN, [
  abertura("anchor", "Preparar a base e estabilizar o equipamento antes de qualquer içamento.",
           "Aula dois: a base, o patolamento e o nivelamento. É aqui que se evita o tombamento."),
  etapas("Estabilizar", [
    ("b", "Base verificada", "solo ou laje liberados pela engenharia", "layers"),
    ("s", "Sapatas sobre apoio adequado", "pranchões ou chapas, conforme o plano", "box"),
    ("p", "Patolamento conforme o fabricante", "configuração da tabela usada", "anchor"),
    ("n", "Nivelado", "dentro do limite do fabricante", "ruler"),
  ], "Para estabilizar: {b}a base é verificada; sobre laje, a capacidade é conferida e liberada pela engenharia. {s}As sapatas ficam sobre apoio adequado, como pranchões ou chapas, conforme o plano. {p}O patolamento segue o fabricante, na configuração da tabela que vai ser usada. {n}E o equipamento fica nivelado, dentro do limite do fabricante."),
  cartoes("Atenção à base", [
    ("v", "triangle-alert", "Valas, tampas e bordas", "nunca sob a sapata", "vermelho"),
    ("c", "cloud-rain", "Chuva", "solo amolece: reavalie"),
    ("m", "eye", "Acompanhe durante o içamento", "afundou? pare"),
  ], "Atenção à base: {v}valas, tampas e bordas de laje nunca ficam sob a sapata. {c}Depois de chuva, o solo amolece: reavalie. {m}E acompanhe durante o içamento: se a sapata afundar, pare.", linha=True),
  caso("aranhas.jpg", [("c1", "Sapata sobre tampa de caixa de passagem"), ("c2", "Reposicionar fora de tampas e valas")],
       "Exemplo: {c1}para ganhar alcance, o operador apoia uma sapata sobre a tampa de uma caixa de passagem. A tampa não é feita para essa carga. {c2}O equipamento é reposicionado, com todas as sapatas em base liberada."),
  pergunta("Pode apoiar a sapata sobre uma tampa de caixa no piso?", "Não", "só em base verificada e liberada",
           "Sua vez: pode apoiar a sapata sobre uma tampa de caixa no piso? {pensa}[[pausa:3]] {resp}Não. Só em base verificada e liberada."),
  checklist(["Base liberada, sobre laje com engenharia", "Patolamento do fabricante e nivelamento", "Sapata afundou: pare"], "Sem base, não há tabela que valha.",
            "Para levar: {c1}base liberada; sobre laje, com a engenharia. {c2}Patolamento do fabricante e nivelamento. {c3}Sapata afundou: pare. {fim}Sem base, não há tabela que valha."),
], PENDG, NOTA_PRES))
R.append(roteiro_curso("GUI-3-inspecao-limites", "Inspeção diária e limitações", C, 4, E, FN, [
  abertura("clipboard-check", "Fazer a inspeção diária e respeitar as limitações do equipamento.",
           "Aula quatro: a inspeção diária, e as limitações do equipamento."),
  cartoes("Inspeção diária (checklist do fabricante)", [
    ("c", "link", "Cabo de aço", "sem fios rompidos, amassamento ou corrosão"),
    ("g", "anchor", "Gancho e trava", "sem trinca ou abertura"),
    ("h", "droplets", "Hidráulico", "sem vazamento"),
    ("d", "gauge", "Dispositivos de segurança", "testados"),
    ("p", "layers", "Patolas e sapatas", "íntegras"),
    ("r", "file-check", "Registro", "checklist assinado"),
  ], "Antes de operar, a inspeção diária, pelo checklist do fabricante: {c}cabo de aço, sem fios rompidos, amassamento ou corrosão. {g}Gancho e trava, sem trinca nem abertura. {h}Sistema hidráulico, sem vazamento. {d}Dispositivos de segurança testados. {p}Patolas e sapatas íntegras. {r}E o checklist registrado. Defeito? O equipamento não opera."),
  cartoes("Limitações", [
    ("t", "list-checks", "Tabela de carga", "raio, lança e configuração"),
    ("v", "wind", "Vento", "limite do fabricante"),
    ("a", "ban", "Não arrastar carga", "nem puxar de lado", "vermelho"),
    ("e", "ban", "Não içar pessoas", "salvo equipamento e procedimento próprios", "vermelho"),
  ], "As limitações: {t}a tabela de carga, que depende do raio, do comprimento da lança e da configuração. {v}O vento, no limite do fabricante. {a}Nunca arraste a carga nem puxe de lado. {e}E nunca ice pessoas, salvo com equipamento e procedimento próprios para isso."),
  pergunta("O cabo de aço tem fios rompidos. Opera hoje e troca amanhã?", "Não", "defeito: o equipamento não opera",
           "Sua vez: o cabo de aço tem fios rompidos. Opera hoje e troca amanhã? {pensa}[[pausa:3]] {resp}Não. Com defeito, o equipamento não opera."),
  checklist(["Checklist diário do fabricante", "Tabela, vento e configuração", "Nunca arrastar nem puxar de lado"], "A inspeção de hoje evita o acidente de hoje.",
            "Para levar: {c1}checklist diário do fabricante. {c2}Respeite a tabela, o vento e a configuração. {c3}Nunca arraste nem puxe de lado. {fim}A inspeção de hoje evita o acidente de hoje."),
], PENDG, NOTA_PRES))
R.append(roteiro_curso("GUI-4-operacao", "Operação segura e comunicação", C, 5, E, FN, [
  abertura("hand", "Operar com movimentos seguros, em comunicação com o sinaleiro, e conhecer a avaliação prática.",
           "Aula cinco: a operação segura, a comunicação com o sinaleiro, e a avaliação prática."),
  cartoes("Na operação", [
    ("s", "move-horizontal", "Movimentos suaves", "sem trancos"),
    ("p", "users", "Nunca sobre pessoas", None, "vermelho"),
    ("a", "eye", "Atenção ao raio", "o raio aumenta ao baixar a lança"),
    ("d", "door-closed", "Nunca abandone com carga suspensa", None, "vermelho"),
  ], "Na operação: {s}movimentos suaves, sem trancos. {p}A carga nunca passa sobre pessoas. {a}Atenção ao raio: baixar a lança aumenta o raio, e reduz a capacidade. {d}E nunca abandone o equipamento com a carga suspensa."),
  cartoes("Comunicação", [
    ("u", "hand", "Um sinaleiro", "só ele orienta"),
    ("d", "circle-help", "Sinal duvidoso", "não execute"),
    ("p", "octagon-x", "Parada", "obedeça a qualquer pessoa", "vermelho"),
  ], "Na comunicação: {u}só o sinaleiro orienta. {d}Sinal duvidoso não se executa. {p}E a parada de emergência se obedece, venha de quem vier."),
  cartoes("Avaliação prática", [
    ("m", "construction", "No modelo da obra", "com o instrutor"),
    ("a", "file-check", "Autorização formal", "depois de aprovado"),
  ], "{m}A avaliação prática é feita no modelo usado na obra, com o instrutor. {a}Depois de aprovado, a empresa emite a autorização formal. Sem ela, você não opera.", linha=True),
  pergunta("Baixar a lança aumenta ou diminui a capacidade?", "Diminui", "o raio aumenta",
           "Sua vez: baixar a lança aumenta ou diminui a capacidade? {pensa}[[pausa:3]] {resp}Diminui, porque o raio aumenta."),
  checklist(["Movimento suave, nunca sobre pessoas", "Só o sinaleiro orienta; parada vale de todos", "Opera só com autorização"], "Quem opera, responde pela carga.",
            "Para levar: {c1}movimento suave, e nunca sobre pessoas. {c2}Só o sinaleiro orienta, mas a parada vale de todos. {c3}E opera só com autorização. {fim}Quem opera, responde pela carga."),
], PENDG, NOTA_PRES))

# ================================================================ OPERADOR DE PEMT
C, E = "Operador de plataforma elevatória (PEMT)", "NR-18 · PEMT"
FN = ["NR-18, Anexo I (db/catalogo.ts, NR18-PEMT)", "Conteúdo conforme norma técnica nacional vigente e manual do fabricante"]
PENDP = ["Carga horária e periodicidade: conferir no Anexo I da NR-18 vigente [VALIDAR].", "Limites de vento, inclinação e carga: manual e placa do modelo."]
R.append(roteiro_curso("PEMT-1-tipos-riscos", "Tipos de PEMT e riscos", C, 1, E, FN, [
  abertura("construction", "Conhecer os tipos de plataforma elevatória e os seus riscos.",
           "Operador de plataforma elevatória móvel de trabalho, a PEMT. Aula um: os tipos, e os riscos."),
  cartoes("Tipos de PEMT", [
    ("t", "arrow-down-to-line", "Tesoura", "sobe na vertical"),
    ("a", "move-horizontal", "Articulada ou telescópica", "lança: alcança por cima e para o lado"),
  ], "Os tipos mais comuns: {t}a tesoura, que sobe na vertical. {a}E a articulada ou telescópica, com lança, que alcança por cima de obstáculos e para o lado. Cada modelo tem comandos, limites e manual próprios.", linha=True),
  cartoes("Riscos", [
    ("t", "construction", "Tombamento", "terreno, inclinação, vento, carga", "vermelho"),
    ("e", "hand", "Esmagamento", "contra a estrutura acima da cesta", "vermelho"),
    ("q", "arrow-down-to-line", "Queda", "do operador ou de material"),
    ("r", "zap", "Rede elétrica", None),
  ], "Os riscos: {t}tombamento, por terreno, inclinação, vento ou excesso de carga. {e}Esmagamento do operador contra a estrutura acima da cesta, como uma viga. {q}Queda do operador ou de material. {r}E contato com a rede elétrica."),
  caso("aranhas.jpg", [("c1", "Operador prensado entre a cesta e a viga"), ("c2", "Movimentos lentos perto da estrutura, olhando para cima")],
       "Exemplo: {c1}subindo sob uma viga, o operador olha para os comandos e não para cima, e fica prensado entre o guarda-corpo e a viga. {c2}Perto da estrutura, os movimentos são lentos, olhando na direção do movimento."),
  pergunta("Qual o risco ao subir a cesta sob uma viga?", "Esmagamento", "olhe para cima e mova devagar",
           "Sua vez: qual o risco ao subir a cesta sob uma viga? {pensa}[[pausa:3]] {resp}Esmagamento contra a viga. Olhe para cima, e mova devagar."),
  checklist(["Conheça o tipo e o manual do modelo", "Tombamento: terreno, vento e carga", "Perto da estrutura: devagar e olhando"], "A cesta é o seu local de trabalho: respeite os limites.",
            "Para levar: {c1}conheça o tipo e o manual do modelo. {c2}Tombamento depende de terreno, vento e carga. {c3}Perto da estrutura, devagar e olhando. {fim}A cesta é o seu local de trabalho: respeite os limites."),
], PENDP, NOTA_PRES))
R.append(roteiro_curso("PEMT-2-inspecao", "Inspeção diária e dispositivos de segurança", C, 2, E, FN, [
  abertura("clipboard-check", "Fazer a inspeção antes do uso e testar os dispositivos de segurança.",
           "Aula dois: a inspeção diária, e os dispositivos de segurança da plataforma."),
  cartoes("Inspeção antes do uso", [
    ("g", "fence", "Guarda-corpo e portão", "fechamento automático"),
    ("p", "droplets", "Hidráulico", "sem vazamento"),
    ("n", "circle-check", "Pneus e rodas", None),
    ("c", "hand", "Comandos", "da cesta e do solo"),
    ("e", "octagon-x", "Parada de emergência", "testada", "vermelho"),
    ("d", "arrow-down-to-line", "Descida de emergência", "testada"),
  ], "Antes do uso, pelo checklist do fabricante: {g}guarda-corpo e portão, com fechamento. {p}Sistema hidráulico, sem vazamento. {n}Pneus e rodas. {c}Comandos da cesta e do solo funcionando. {e}A parada de emergência testada. {d}E a descida de emergência testada."),
  cartoes("Dispositivos de segurança", [
    ("i", "gauge", "Alarme de inclinação", "a máquina avisa e bloqueia"),
    ("s", "list-checks", "Limite de carga", "placa do modelo"),
    ("r", "ban", "Nunca desativar", None, "vermelho"),
  ], "Os dispositivos de segurança: {i}o alarme de inclinação, que avisa e bloqueia. {s}O limite de carga, indicado na placa do modelo. {r}E eles nunca são desativados. Defeito encontrado? A plataforma não opera, e o checklist registra.", linha=True),
  pergunta("O alarme de inclinação está apitando. Pode silenciar e seguir?", "Não", "desça, reposicione e corrija",
           "Sua vez: o alarme de inclinação está apitando. Pode silenciar e seguir? {pensa}[[pausa:3]] {resp}Não. Desça, reposicione e corrija a causa."),
  checklist(["Checklist do fabricante antes do uso", "Teste parada e descida de emergência", "Dispositivo nunca desativado"], "Plataforma com defeito fica no chão.",
            "Para levar: {c1}checklist do fabricante antes do uso. {c2}Teste a parada e a descida de emergência. {c3}Dispositivo de segurança nunca desativado. {fim}Plataforma com defeito fica no chão."),
], PENDP, NOTA_PRES))
R.append(roteiro_curso("PEMT-3-condicoes", "Terreno, rede elétrica, vento e carga", C, 3, E, FN, [
  abertura("wind", "Avaliar o local antes de elevar: terreno, rede elétrica, vento e carga.",
           "Aula três: as condições do local. Terreno, rede elétrica, vento e carga."),
  cartoes("Antes de elevar", [
    ("t", "layers", "Terreno firme e nivelado", "inclinação dentro do limite do fabricante"),
    ("b", "triangle-alert", "Buracos, valas e bordas", "afaste-se", "vermelho"),
    ("r", "zap", "Rede elétrica", "distância definida na análise de risco", "vermelho"),
    ("v", "wind", "Vento", "acima do limite do fabricante: não eleve"),
    ("c", "package", "Carga máxima", "pessoas + materiais, pela placa"),
  ], "Antes de elevar: {t}terreno firme e nivelado, com inclinação dentro do limite do fabricante. {b}Afaste-se de buracos, valas e bordas de laje. {r}Rede elétrica: mantenha a distância definida na análise de risco. {v}Vento acima do limite do fabricante: não eleve. {c}E a carga máxima, pessoas mais materiais, é a da placa."),
  colunas("A cesta não é", [
    ("Não é", "ban", "vermelho", [("n1", "Guindaste: não pendure carga"), ("n2", "Escada: não suba no guarda-corpo"), ("n3", "Ponte: não saia da cesta em altura")]),
    ("É", "circle-check", "verde", [("s1", "Local de trabalho com guarda-corpo"), ("s2", "Materiais dentro da cesta, dentro do limite")]),
  ], "A cesta não é guindaste: {n1}não pendure carga nela. {n2}Não é escada: não suba no guarda-corpo. {n3}E não é ponte: não saia da cesta em altura, salvo procedimento específico aprovado. A cesta é {s1}um local de trabalho com guarda-corpo, {s2}com os materiais dentro dela e dentro do limite."),
  caso("aranhas.jpg", [("c1", "Perfil amarrado pendurado na cesta"), ("c2", "Movimentar o material com o equipamento de guindar")],
       "Exemplo: {c1}para levar um perfil até a cobertura, a equipe amarra a peça pendurada do lado de fora da cesta. Isso muda o equilíbrio e a carga. {c2}O material é movimentado com equipamento de guindar; a cesta leva só o que cabe dentro dela."),
  pergunta("Pode pendurar uma peça do lado de fora da cesta?", "Não", "a cesta não é guindaste",
           "Sua vez: pode pendurar uma peça do lado de fora da cesta? {pensa}[[pausa:3]] {resp}Não. A cesta não é guindaste."),
  checklist(["Terreno firme, longe de bordas", "Rede elétrica e vento: limites", "Carga da placa; nada pendurado"], "Avalie o chão antes de olhar para cima.",
            "Para levar: {c1}terreno firme, longe de bordas. {c2}Rede elétrica e vento dentro dos limites. {c3}Carga da placa, e nada pendurado. {fim}Avalie o chão antes de olhar para cima."),
], PENDP, NOTA_PRES))
R.append(roteiro_curso("PEMT-4-operacao-emergencia", "Operação, cinto na cesta e emergência", C, 4, E, FN + ["NR-35"], [
  abertura("hand", "Operar a plataforma, usar o cinto ancorado e agir numa emergência.",
           "Aula quatro: a operação, o cinto na cesta, e a emergência."),
  cartoes("Na operação", [
    ("p", "eye", "Olhe na direção do movimento", None),
    ("d", "move-horizontal", "Deslocar com a cesta baixa", "conforme o fabricante"),
    ("i", "traffic-cone", "Área abaixo isolada", None),
    ("c", "construction", "Cinto ancorado", "no ponto indicado da cesta"),
  ], "Na operação: {p}olhe sempre na direção do movimento. {d}Desloque a máquina com a cesta baixa, conforme o fabricante. {i}Isole a área abaixo. {c}E use o cinto paraquedista com talabarte ancorado no ponto indicado pelo fabricante da cesta. Na plataforma tipo tesoura, siga o fabricante e a análise de risco."),
  etapas("Emergência", [
    ("p", "Parada de emergência", "na cesta ou no solo", "octagon-x", "vermelho"),
    ("s", "Alguém no solo que conhece os comandos", "sempre que houver gente na cesta", "user-check"),
    ("d", "Descida de emergência", "conforme o manual", "arrow-down-to-line"),
    ("r", "Plano de resgate", "antes de começar", "clipboard-list"),
  ], "Na emergência: {p}parada de emergência, na cesta ou no solo. {s}Sempre tenha alguém no solo que conheça os comandos e a descida de emergência. {d}A descida segue o manual do modelo. {r}E o plano de resgate é feito antes de começar."),
  cartoes("Autorização", [
    ("a", "file-check", "Avaliação no modelo da obra", "e autorização formal"),
  ], "{a}A avaliação operacional é feita no modelo da obra, e só com a autorização formal da empresa você opera.", linha=True),
  pergunta("Quem deve saber baixar a plataforma em emergência?", "Alguém no solo", "treinado nos comandos do modelo",
           "Sua vez: quem deve saber baixar a plataforma numa emergência? {pensa}[[pausa:3]] {resp}Alguém no solo, treinado nos comandos daquele modelo."),
  checklist(["Olhe na direção do movimento", "Cinto ancorado no ponto da cesta", "Alguém no solo para a descida de emergência"], "Nunca suba sem um plano para descer.",
            "Para levar: {c1}olhe na direção do movimento. {c2}Cinto ancorado no ponto da cesta. {c3}E alguém no solo para a descida de emergência. {fim}Nunca suba sem um plano para descer."),
], PENDP, NOTA_PRES))

print("\n".join(R))
