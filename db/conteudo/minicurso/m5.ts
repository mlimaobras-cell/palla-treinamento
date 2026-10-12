// Banco do Caderno do Módulo 5 – Soldagem Estrutural Aplicada (inclui complementares da revisão 2).
// Referências AWS D1.1 citadas pela edição 2010 (mesma do material); conferir na edição em uso pela Palla.
import type { Q } from "./tipos";

export const m5: Q[] = [
  ["M5-01", "B", "O que é a WPS?", ["O certificado do soldador", "A especificação do procedimento de soldagem, com processo, consumível e parâmetros", "A nota fiscal do eletrodo", "O relatório de ultrassom"], "b", "Definição de WPS."],
  ["M5-02", "B", "Um soldador pode soldar uma junta sem WPS aprovada se for experiente?", ["Sim", "Sim, se o encarregado autorizar verbalmente", "Não", "Sim, em ligações secundárias"], "c", "Sem WPS aprovada, a solda não começa."],
  ["M5-03", "B", "A qualificação do soldador perde a validade se ele ficar sem usar o processo por mais de:", ["1 mês", "6 meses", "2 anos", "Nunca perde"], "b", "AWS D1.1, cap. 4."],
  ["M5-04", "B", "Por que o eletrodo básico (E7018) fica na estufa?", ["Para soldar mais rápido", "Para evitar umidade, que causa trinca por hidrogênio", "Para economizar energia", "Para mudar a cor da solda"], "b", "A umidade gera hidrogênio na solda."],
  ["M5-05", "I", "Pela AWS D1.1, quanto tempo no máximo o eletrodo E70XX básico pode ficar fora da estufa?", ["30 minutos", "4 horas", "12 horas", "Um turno inteiro"], "b", "AWS D1.1:2010, 5.3.2 e Tabela 5.1 (coluna A)."],
  ["M5-06", "B", "Qual a faixa mínima de limpeza em volta do bisel antes de soldar?", ["5 mm", "20 mm", "100 mm", "Não precisa limpar"], "b", "Faixa de 20 mm."],
  ["M5-07", "I", "Junta de chapa de 20 mm: qual o desalinhamento máximo?", ["1 mm", "2 mm", "3 mm", "5 mm"], "b", "10% de 20 mm = 2 mm, que é menor que 3 mm."],
  ["M5-08", "B", "Pode-se resfriar a solda com água para acelerar o serviço?", ["Sim", "Só no verão", "Não, o resfriamento é natural (salvo previsão na WPS)", "Sim, se for pouca água"], "c", "Resfriamento natural."],
  ["M5-09", "I", "Qual a perna mínima de filete numa chapa de 10 mm, quando o projeto não especifica?", ["3 mm", "5 mm", "6 mm", "8 mm"], "b", "Tabela de filete mínimo (AWS D1.1)."],
  ["M5-10", "B", "Qual o critério da AWS D1.1 para trincas?", ["Aceita até 2 mm", "Aceita se estiver fora do cordão", "Nenhuma trinca é aceita", "Aceita uma por metro"], "c", "Nenhuma trinca é aceita."],
  ["M5-11", "I", "Em chapa de 16 mm com carga estática, a mordedura em geral pode ter no máximo:", ["0,25 mm", "1 mm", "3 mm", "5 mm"], "b", "Chapa até 25 mm: 1 mm."],
  ["M5-12", "B", "Que defeito é um buraco no fim do cordão?", ["Porosidade", "Cratera", "Mordedura", "Respingo"], "b", "Cratera."],
  ["M5-13", "I", "Quais as condições mínimas para a inspeção visual?", ["Qualquer luz, a qualquer distância", "1000 lux, até 600 mm, ângulo de pelo menos 30°", "100 lux e lupa obrigatória", "Só com ultrassom"], "b", "Condições da inspeção visual (VT)."],
  ["M5-14", "B", "Como se marca no projeto uma solda de campo inspecionada?", ["Em azul", "Em amarelo", "Em verde", "Não se marca"], "b", "Amarelo = solda inspecionada (padrão de PIT de montagem)."],
  ["M5-15", "B", "Qual destas é medida contra incêndio na solda?", ["Soldar perto de tintas para ganhar tempo", "Permissão de trabalho a quente, extintor e vigia de fogo", "Usar luva de algodão", "Tirar a máscara para enxergar melhor"], "b", "Trabalho a quente controlado."],
  ["M5-16", "B", "Qual a referência de ponteamento (comprimento mínimo do ponto e intervalo máximo)?", ["20 mm e 600 mm", "10 mm e 100 mm", "50 mm e 400 mm", "100 mm e 1.000 mm"], "c", "N-293, 5.6.6."],
  ["M5-17", "B", "Como se remove um cachorro ponteado na peça?", ["Cortando acima da peça, esmerilhando e inspecionando o local com LP ou PM", "A marretadas", "Deixando na peça, se não atrapalhar", "Arrancando com a alavanca"], "a", "Dispositivo nunca é removido a golpe."],
  ["M5-18", "I", "Uma solda de topo pode ser interrompida antes de terminar?", ["A qualquer momento", "Só no fim do turno", "Nunca", "Só depois de preencher pelo menos 25% da seção da junta"], "d", "N-293, 5.6.8."],
  ["M5-19", "I", "Qual a temperatura máxima de referência para corrigir empeno com calor localizado?", ["300 °C", "550 °C", "900 °C", "Sem limite"], "b", "N-293, 5.7.15."],
  ["M5-20", "I", "Numa viga biapoiada, onde evitar uma emenda de topo não prevista?", ["No terço do vão", "Em lugar nenhum, se a solda for boa", "A L/8 junto dos apoios e a L/8 de cada lado do meio do vão", "Só nos apoios"], "c", "N-293, Figura 1."],
  ["M5-21", "B", "No início do turno, como se testam os pinos (stud bolts)?", ["Os 2 primeiros: colar de 360° e dobra de cerca de 30°", "Um a cada 100 pinos, por ultrassom", "Só visual, sem dobra", "Torque de 50 N·m em todos"], "a", "AWS D1.1, 7.7.1."],
];
