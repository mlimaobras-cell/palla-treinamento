// Banco do Caderno do Módulo 3 – Montagem, Içamento e Rigging (inclui as complementares da revisão 2).
// M3-16 (nº mínimo de parafusos antes de soltar o gancho) está [VALIDAR] com a engenharia e fica FORA das provas online.
import type { Q } from "./tipos";

export const m3: Q[] = [
  ["M3-01", "B", "Uma peça chegou amassada. Qual a conduta certa?", ["Descarregar e avisar no fim da obra", "Anotar no romaneio com assinatura do motorista, fotografar e abrir RNC no mesmo dia", "Desamassar com marreta", "Recusar a carga inteira"], "b", "Registro na descarga e RNC no mesmo dia."],
  ["M3-02", "B", "Quais peças são conferidas 100% contra o romaneio?", ["Só os pilares", "Só os parafusos", "Pilares, vigas, tesouras, terças, contraventos, tirantes e parafusos", "Nenhuma; confere-se por amostragem"], "c", "Conferência de 100% das peças principais."],
  ["M3-03", "B", "A altura máxima de uma pilha de pilares e vigas é:", ["1 m", "2 m", "3 m", "Não há limite"], "b", "Pilha de no máximo 2 m (instrução de armazenamento)."],
  ["M3-04", "B", "Como armazenar pilares e vigas?", ["Direto no chão, para não cair", "Sobre caibros, com a alma a 90° do solo, sem acumular água", "Em pé, encostados na cerca", "Empilhados sem calço"], "b", "Sobre caibros e com a alma a 90°."],
  ["M3-05", "B", "Quando usar balancim na descarga?", ["Em peças acima de 6 m", "Só em telhas", "Nunca", "Só à noite"], "a", "Peças acima de 6 m."],
  ["M3-06", "B", "Durante o içamento, como se controla o giro da peça?", ["Segurando a peça com as mãos embaixo dela", "Com corda guia, à distância", "Subindo na peça", "Não se controla"], "b", "Corda guia, à distância."],
  ["M3-07", "B", "A capacidade de um guindaste:", ["É sempre a mesma, a escrita no equipamento", "Diminui quando o raio e a lança aumentam", "Aumenta com o raio", "Depende só do operador"], "b", "A capacidade vem da tabela de carga, para cada raio e configuração."],
  ["M3-08", "B", "Uma cinta com a etiqueta ilegível deve ser:", ["Usada em cargas leves", "Usada com cuidado", "Retirada de uso", "Lavada e reutilizada"], "c", "Sem identificação, fora de uso."],
  ["M3-09", "I", "Uma viga de 2.000 kg é içada com duas pernas a 45°. Qual a carga em cada perna?", ["1.000 kg", "1.410 kg", "2.000 kg", "2.820 kg"], "b", "1.000 kg por perna × 1,41 (fator do ângulo de 45°)."],
  ["M3-10", "I", "Quanto pesa um perfil W 310 × 32,7 com 12 m, sem acessórios?", ["327 kg", "392 kg", "3.270 kg", "32,7 kg"], "b", "32,7 kg/m × 12 m ≈ 392 kg."],
  ["M3-11", "B", "Quem dá os sinais ao operador durante o içamento?", ["Qualquer pessoa da equipe", "Um único sinaleiro combinado com o operador", "O cliente", "Ninguém; o operador decide sozinho"], "b", "Um único sinaleiro."],
  ["M3-12", "B", "Os estais provisórios podem ser retirados:", ["No fim de cada dia", "Quando a montagem do pilar termina", "Depois do contraventamento definitivo instalado", "Antes de montar as vigas"], "c", "Só após o travamento definitivo."],
  ["M3-13", "I", "Por que montar primeiro o vão contraventado?", ["Porque é o mais fácil", "Para estabilizar a estrutura antes de avançar", "Para economizar parafusos", "Porque o cliente pede"], "b", "Estabilidade antes de avançar."],
  ["M3-14", "I", "A rosca de um chumbador está danificada e não dá para recuperar. O que fazer?", ["Soldar a porca no chumbador", "Comunicar imediatamente à engenharia", "Cortar o chumbador", "Montar o pilar sem aquela porca"], "b", "Não se improvisa: comunicar à engenharia."],
  ["M3-15", "B", "Sobre estrutura ainda não travada, o montador deve:", ["Trabalhar sem cinto para ter mobilidade", "Usar linha de vida e talabarte duplo, sempre conectado", "Usar só capacete", "Esperar o vento parar e trabalhar sem proteção"], "b", "Linha de vida e talabarte duplo, sempre conectado."],
  ["M3-17", "B", "Como se solta a manilha de um pilar recém-assentado e estaiado?", ["Subindo pelo pilar", "Por uma corda amarrada ao pino, ou pela plataforma com operador habilitado", "Sacudindo o cabo do guindaste", "Cortando a cinta"], "b", "Ninguém sobe no pilar para soltar o gancho."],
  ["M3-18", "B", "A peça está chegando à posição. Como guiá-la?", ["Com as mãos, segurando a aba", "Com corda-guia, de fora da projeção da carga", "Empurrando com o pé", "Subindo na peça"], "b", "Mão fora da carga: só corda-guia."],
  ["M3-19", "I", "Uma peça galvanizada vai ser içada. O que pode ficar em contato com ela?", ["Cabo de aço direto", "Corrente", "Cinta de poliéster com proteção nas quinas", "Qualquer acessório com capacidade suficiente"], "c", "Cabo de aço em galvanizado não é permitido (N-293, 5.4.5)."],
  ["M3-20", "I", "Uma cinta de poliéster amarela, em uso vertical, tem capacidade de:", ["1 t", "2 t", "3 t", "5 t"], "c", "NBR 15637: amarelo = 3 t. Confira sempre a etiqueta."],
  ["M3-21", "B", "Em altura, como se levam parafusos e ferramentas?", ["Nos bolsos", "Bolsa fechada e amarrada, ferramentas presas por cabo, nada arremessado", "Jogando de baixo para cima", "Em balde aberto"], "b", "Queda de objeto é risco grave para quem está embaixo."],
];
