// Banco do Caderno do Módulo 2 – Leitura e Interpretação de Projetos.
import type { Q } from "./tipos";

export const m2: Q[] = [
  ["M2-01", "B", "Qual desenho a equipe de montagem usa no dia a dia?", ["Desenho de projeto", "Desenho de fabricação", "Desenho de montagem", "Desenho de arquitetura"], "c", "O desenho de montagem é o documento principal da equipe."],
  ["M2-02", "B", "Na obra há duas cópias do mesmo desenho, revisão 1 e revisão 3. Qual usar?", ["A revisão 1, que é a original", "A revisão 3, a última", "Qualquer uma", "As duas, conferindo as diferenças na hora"], "b", "Monte sempre pela última revisão."],
  ["M2-03", "B", "O pilar C5 fica:", ["Na quinta coluna da lista de material", "No cruzamento do eixo C com o eixo 5", "A 5 metros do eixo C", "No nível +5,000"], "b", "A posição é o cruzamento dos eixos."],
  ["M2-04", "B", "O que significa “EL +6,000” num desenho?", ["6 mil quilos", "6 metros acima do nível de referência da obra", "6 milímetros de comprimento", "Eixo L, posição 6"], "b", "Nível em metros, a partir da referência da obra."],
  ["M2-05", "B", "Por que medir a partir dos eixos e não da peça vizinha?", ["Porque é mais rápido", "Para não acumular o erro de uma peça na próxima", "Porque a trena não alcança", "Não faz diferença"], "b", "Medir do eixo evita o erro acumulado."],
  ["M2-06", "B", "A marca de uma peça aparece:", ["Só na etiqueta da peça", "Só no desenho", "Na peça, no romaneio e no desenho de montagem", "Só na nota fiscal"], "c", "A marca aparece nos três lugares."],
  ["M2-07", "B", "No símbolo de solda, a bandeira significa:", ["Solda de fábrica", "Solda de campo", "Solda em todo o contorno", "Solda proibida"], "b", "Bandeira = solda de campo."],
  ["M2-08", "I", "No símbolo de solda, o triângulo desenhado abaixo da linha de referência indica:", ["Solda de filete do lado da seta", "Solda de filete do lado oposto", "Solda de chanfro", "Solda de campo"], "a", "Abaixo da linha = lado da seta."],
  ["M2-09", "B", "“4 Ø 3/4″ × 65 · A325” significa:", ["4 parafusos A325 de 3/4″ e 65 mm de comprimento", "Parafuso de 4 mm com rosca de 3/4″", "65 parafusos de 3/4″", "4 furos de 65 mm"], "a", "Quantidade, diâmetro, comprimento e especificação."],
  ["M2-10", "I", "Como deve ser montada uma viga com contraflecha?", ["Com a curva para baixo", "Com a curva para cima", "Desempenada antes de montar", "Tanto faz"], "b", "A contraflecha é montada para cima."],
  ["M2-11", "I", "Segundo a NBR 8800, o desenho de montagem deve indicar também:", ["O preço das peças", "Os elementos provisórios essenciais à estabilidade durante a montagem", "O nome dos montadores", "A cor de cada peça"], "b", "NBR 8800, item 4.4."],
  ["M2-12", "B", "O desenho não mostra o nível de uma viga. O que fazer?", ["Montar no nível da viga vizinha", "Perguntar ao encarregado antes de montar", "Escolher o nível mais fácil", "Deixar a viga no chão"], "b", "Na dúvida, pergunte antes de montar."],
];
