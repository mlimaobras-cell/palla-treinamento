// Banco do Caderno do Módulo 6 – Metrologia e Topografia de Montagem (inclui complementares da revisão 2).
import type { Q } from "./tipos";

export const m6: Q[] = [
  ["M6-01", "B", "Quando as ligações definitivas podem ser completadas?", ["Logo que a peça é içada", "Depois que a parte da estrutura está alinhada, nivelada e aprumada", "Só no fim da obra", "Antes de montar as vigas"], "b", "NBR 8800, 12.3.4."],
  ["M6-02", "B", "Um instrumento está com a calibração vencida. Pode ser usado?", ["Sim, se parecer bom", "Sim, por mais um mês", "Não, sai de uso até recalibrar", "Sim, para medidas secundárias"], "c", "Calibração é obrigatória."],
  ["M6-03", "B", "Por que medir a partir do eixo e não da peça vizinha?", ["Para não acumular erro", "Porque é mais rápido", "Porque a trena é curta", "Não faz diferença"], "a", "Evita o erro acumulado."],
  ["M6-04", "I", "Qual destes NÃO faz parte da liberação dos chumbadores?", ["Quantidade e posição", "Projeção acima do concreto", "Rosca íntegra", "Cor da pintura do pilar"], "d", "A cor do pilar não é item de chumbador."],
  ["M6-05", "I", "Um chumbador está fora de posição. Qual a conduta?", ["Dobrar o chumbador até encaixar", "Cortar e soldar outro", "Comunicar cliente e engenharia e registrar no diário", "Alargar o furo da placa com maçarico"], "c", "Não se improvisa."],
  ["M6-06", "I", "Quando fazer o graute sob a placa de base?", ["Antes de montar o pilar", "Depois de alinhar, aprumar e dar o aperto final", "Depois de terminar a cobertura", "Não é necessário"], "b", "Após prumo, alinhamento e aperto final (N-293, 5.3.7)."],
  ["M6-07", "I", "Qual o desvio máximo de prumo de um pilar de 7,5 m?", ["7,5 mm", "15 mm", "25 mm", "37,5 mm"], "b", "7.500 ÷ 500 = 15 mm (NBR 8800, 12.3.3.1.1)."],
  ["M6-08", "I", "Pilar de 10 m com desvio de 22 mm numa direção. O resultado é:", ["Aprovado", "Reprovado: limite de 20 mm", "Aprovado: limite de 25 mm", "Não há limite"], "b", "10.000 ÷ 500 = 20 mm."],
  ["M6-09", "I", "Qual a tolerância de elevação de uma viga ligada a pilar?", ["± 1 mm", "+5 mm a −8 mm", "± 20 mm", "1:100"], "b", "NBR 8800, 12.3.3.1.2."],
  ["M6-10", "I", "Fresta de 3 mm numa emenda de pilar por contato, sem área de contato suficiente. O que fazer?", ["Aceitar", "Preencher com calço de aço de faces paralelas", "Preencher com graute", "Soldar sem consultar ninguém"], "b", "NBR 8800, 12.3.5."],
  ["M6-11", "I", "O laudo topográfico mostra desvio acima da tolerância. Qual a conduta?", ["Ignorar, se for pouco", "Definir a ação com o cliente e registrar no diário", "Refazer o laudo até dar dentro", "Seguir a montagem e corrigir no fim"], "b", "Registro e decisão com o cliente."],
  ["M6-12", "I", "Uma peça não encaixa. Antes de forçar, o encarregado deve:", ["Usar a marreta", "Medir a peça e comparar com a tolerância de fabricação", "Cortar a peça", "Trocar por outra peça parecida"], "b", "Medir antes de forçar."],
  ["M6-13", "I", "Qual o tamanho mínimo de referência de um calço metálico de nivelamento de base?", ["50 mm × 100 mm", "20 mm × 20 mm", "100 mm × 300 mm", "Não há mínimo"], "a", "N-293, 5.3.5."],
  ["M6-14", "I", "Pela N-293, qual a tolerância de elevação de uma plataforma (estrutura secundária)?", ["±3 mm", "±5 mm", "±12 mm", "±25 mm"], "c", "N-293, 6.1.2.2."],
  ["M6-15", "I", "Qual o desnível máximo entre chapas ou grades de piso numa emenda?", ["8 mm", "5 mm", "12 mm", "2 mm"], "d", "N-293, 6.1.2.2."],
  ["M6-16", "B", "Logo depois de instalados, os chumbadores devem:", ["Ficar expostos para a inspeção", "Ser pintados com a tinta de acabamento", "Receber proteção temporária: rosca engraxada e coberta", "Ser cortados no nível do concreto"], "c", "N-293, 5.3.3."],
  ["M6-17", "B", "Qual a ordem correta na base do pilar?", ["Graute, prumo, aperto final", "Prumo e alinhamento, aperto final, graute", "Aperto final, graute, prumo", "Graute antes de montar o pilar"], "b", "N-293, 5.3.7."],
];
