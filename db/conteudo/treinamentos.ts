// Treinamentos completos montados a partir dos roteiros v2 (video/v2/cenas): NR-18 básico, NR-6, NR-11 (auxiliar e sinaleiro),
// NR-12, operador de guindaste e de PEMT, cursos internos PAL-51 a PAL-57 e INT-02.
// Cada aula = um vídeo, com narração, material de leitura, situação real, pergunta e resumo. Banco de questões por curso.
// Onde o assunto já existe no mini curso (M1–M6), a aula reutiliza o mesmo vídeo e o mesmo texto.
// Status: EM REVISÃO pelo responsável técnico. Cursos presenciais: as aulas são material de apoio; a carga é cumprida na turma.
import type { CapituloSeed, QuestaoSeed } from "./integracao";
import { aulaDoRoteiroGenerico, roteiroPorCodigo } from "./apresentacoes";
import { aulaDoRoteiroV2, aulasV2, modulosMiniCurso, questoesDoModulo } from "./minicurso";

type Aula = { codigo: string; mc?: boolean };
type Def = { capitulos: { titulo: string; aulas: Aula[] }[]; questoes: () => QuestaoSeed[] };

const novo = (codigo: string): Aula => ({ codigo });
const mc = (codigo: string): Aula => ({ codigo, mc: true });

function montarAula(a: Aula, raiz: string) {
  if (!a.mc) return aulaDoRoteiroGenerico(roteiroPorCodigo(a.codigo, raiz), raiz);
  const pref = a.codigo.split("-")[0].toLowerCase() + "-";
  const r = aulasV2(pref, raiz).find((x) => x.codigo === a.codigo);
  if (!r) throw new Error(`Roteiro do mini curso não encontrado: ${a.codigo}`);
  return aulaDoRoteiroV2(r, raiz);
}

const q = (enunciado: string, alts: string[], correta: string, comentario: string, tipo: QuestaoSeed["tipo"] = "MULTIPLA_ESCOLHA"): QuestaoSeed =>
  ({ tipo, enunciado, alternativas: alts.map((texto, i) => ({ id: "abcd"[i], texto })), correta, comentario });
const s = (enunciado: string, alts: string[], correta: string, comentario: string) => q(enunciado, alts, correta, comentario, "SITUACIONAL");

/** Questões do mini curso reaproveitadas (sem marcar diagnóstica). */
function doMiniCurso(modulo: string, codigos?: string[]): QuestaoSeed[] {
  const m = modulosMiniCurso.find((x) => x.codigo === modulo);
  if (!m) return [];
  return questoesDoModulo(m).filter((x) => !codigos || codigos.includes(x.codigo!)).map((x) => ({ ...x, diagnostica: false }));
}
const basicas = (modulo: string, n: number) => doMiniCurso(modulo).filter((x) => x.nivel === "B").slice(0, n);

export const TREINAMENTOS: Record<string, Def> = {
  "NR18-BAS": {
    capitulos: [
      { titulo: "O canteiro e os seus riscos", aulas: [novo("NR18-1-riscos-canteiro"), novo("NR18-2-protecoes")] },
      { titulo: "Equipamentos, acessos e materiais", aulas: [novo("NR18-3-maquinas-materiais"), novo("NR18-4-escadas-andaimes")] },
      { titulo: "Emergências e montagem metálica", aulas: [novo("NR18-5-emergencias-montagem")] },
    ],
    questoes: () => [
      q("Qual destes é um dos riscos mais graves da construção?", ["Queda de altura", "Usar crachá", "Participar do DDS", "Ler o projeto"], "a", "Queda de pessoas e de materiais está entre as principais causas de acidentes graves na obra."),
      q("Onde fazer as refeições na obra?", ["Na frente de trabalho", "Na área de vivência", "Sobre a laje", "Dentro do depósito"], "b", "Alimentação e descanso somente na área de vivência."),
      q("Qual a ordem correta das medidas de proteção?", ["EPI, coletiva, eliminar", "Eliminar, coletiva, organização, EPI", "Coletiva, EPI, eliminar", "Só EPI"], "b", "Primeiro eliminar o risco; depois proteção coletiva, organização e, por último, EPI."),
      s("Um trecho de guarda-corpo foi retirado para passar uma peça. O que fazer ao terminar?", ["Deixar como está até o fim do turno", "Recolocar antes de liberar a área; enquanto aberto, isolar", "Avisar só no dia seguinte", "Colocar uma fita e seguir"], "b", "Proteção coletiva removida para uma tarefa é recolocada antes de liberar a área."),
      q("Quem pode operar um equipamento na obra?", ["Qualquer um com experiência", "Quem é capacitado e autorizado naquele equipamento", "O ajudante mais antigo", "Qualquer um, se for rápido"], "b", "Só opera quem é capacitado e autorizado."),
      q("Escada de mão serve para:", ["Trabalho prolongado em altura", "Acesso; trabalho prolongado em plataforma ou andaime", "Apoio de cargas", "Ponte entre lajes"], "b", "Escada é acesso; trabalho prolongado em plataforma ou andaime liberado."),
      q("Como evitar queda de materiais?", ["Bolsa fechada, ferramenta amarrada, rodapé e isolamento abaixo", "Trabalhar mais rápido", "Jogar as peças para baixo com cuidado", "Usar só capacete"], "a", "Medidas combinadas: bolsa, amarração, rodapé e isolamento."),
      q("Andaime pode ser usado antes de liberado?", ["Sim, se parecer firme", "Não; só depois de inspecionado e liberado", "Sim, por pouco tempo", "Só pelo encarregado"], "b", "Andaime só é usado após montagem conforme projeto e liberação registrada."),
      s("Um colega caiu e está inconsciente. Primeiro passo?", ["Puxá-lo para fora rapidamente", "Avaliar se o local é seguro e acionar o socorro pelo plano da obra", "Dar água", "Esperar alguém ver"], "b", "Não vire a segunda vítima: avalie, acione o socorro e isole."),
      q("Qual risco é típico da montagem metálica?", ["Instabilidade da estrutura incompleta", "Ruído de escritório", "Digitação", "Nenhum"], "a", "Estrutura incompleta pode tombar; segue-se o plano e a estabilidade provisória."),
    ],
  },
  "NR06-EPI": {
    capitulos: [
      { titulo: "Fundamentos do EPI", aulas: [novo("NR06-1-conceito-ca"), novo("NR06-2-uso-cuidados")] },
      { titulo: "EPIs da montagem", aulas: [novo("NR06-3-cabeca-olhos-ouvidos"), novo("NR06-4-maos-pes-respiracao"), novo("NR06-5-cinturao-pratica")] },
    ],
    questoes: () => [
      q("O que garante que um equipamento pode ser usado como EPI?", ["O preço", "O Certificado de Aprovação (CA) válido", "A cor", "A marca famosa"], "b", "EPI só pode ser comercializado e usado com CA válido."),
      q("Quem fornece o EPI?", ["O trabalhador compra", "A empresa, gratuitamente", "O cliente da obra", "O sindicato"], "b", "Fornecimento gratuito, adequado ao risco e em perfeito estado."),
      q("Dever do trabalhador quanto ao EPI:", ["Adaptar para ficar confortável", "Usar só para a finalidade, guardar, conservar e comunicar danos", "Emprestar a colegas", "Usar só quando o encarregado olha"], "b", "Uso para a finalidade, guarda, conservação e comunicação de dano ou perda."),
      s("Uma peça bateu no seu capacete. Ele parece inteiro, com uma pequena rachadura.", ["Continua usando", "Troca o capacete", "Passa fita na rachadura", "Pinta por cima"], "b", "Capacete que sofreu impacto é substituído."),
      q("No esmerilhamento, a proteção dos olhos e do rosto é:", ["Só óculos", "Óculos e protetor facial", "Nenhuma", "Só boné"], "b", "Óculos com protetor facial por cima."),
      q("Quando usar o protetor auditivo?", ["Só nos primeiros minutos", "Todo o tempo de exposição ao ruído", "Só à tarde", "Quando lembrar"], "b", "Retirar por pouco tempo já reduz muito a proteção."),
      q("Luva de vaqueta protege contra solvente?", ["Sim", "Não; usar a luva indicada na FDS", "Só se estiver molhada", "Só no inverno"], "b", "Cada luva protege contra riscos específicos."),
      q("O que atrapalha a vedação do respirador?", ["Barba na área de vedação", "Óculos de grau sempre", "Capacete", "Uniforme"], "a", "Pelos na área de vedação comprometem a proteção."),
      s("O cinturão segurou uma queda e parece inteiro.", ["Volta ao uso após limpeza", "Sai de uso", "Usa só no chão", "Empresta para outro"], "b", "Equipamento que reteve uma queda sai de uso."),
      q("O curso de NR-6 da Palla termina quando:", ["Assistir aos vídeos", "Concluir as aulas, a avaliação e a prática de ajuste e inspeção com o instrutor", "Receber o EPI", "Assinar a ficha"], "b", "A etapa prática é registrada e é requisito para concluir."),
    ],
  },
  "NR11-AUX": {
    capitulos: [
      { titulo: "Carga suspensa", aulas: [novo("AUX-1-carga-suspensa"), novo("AUX-2-isolamento-corda")] },
      { titulo: "Comunicação e acessórios", aulas: [novo("AUX-3-sinais-parada"), mc("M3-5-acessorios")] },
    ],
    questoes: () => [
      q("Pode passar sob uma carga parada no ar?", ["Sim, se for rápido", "Nunca", "Só com capacete", "Só o encarregado"], "b", "Ninguém fica nem passa sob carga suspensa."),
      q("Quem não está na tarefa deve ficar:", ["Perto, para ajudar", "Fora da área isolada e do raio de giro", "Sob a lança", "Segurando a corda"], "b", "Fora da área isolada e do raio de giro do equipamento."),
      s("A peça gira e começa a puxar a corda-guia.", ["Segura mais forte", "Enrola no braço", "Solta a corda, sai e avisa o sinaleiro", "Corre junto"], "c", "A corda só guia; se puxar, solte."),
      q("A corda-guia deve ter comprimento para:", ["Você ficar fora da projeção da carga", "Amarrar a peça no chão", "Segurar o peso", "Nada"], "a", "Mantém o auxiliar fora da projeção da carga."),
      q("Quem orienta o operador durante o içamento?", ["Todos", "Um único sinaleiro designado", "O auxiliar mais perto", "Ninguém"], "b", "Um sinaleiro por içamento."),
      q("Quem pode dar a parada de emergência?", ["Só o sinaleiro", "Qualquer pessoa que veja o risco", "Só o operador", "Só o engenheiro"], "b", "Qualquer pessoa pode dar a parada."),
      ...doMiniCurso("MC-M3").filter((x) => /acess|cinta|manilha|gancho|cabo/i.test(x.enunciado)).slice(0, 4),
    ],
  },
  "NR11-SIN": {
    capitulos: [
      { titulo: "Equipe e acessórios", aulas: [novo("SIN-1-papeis"), mc("M3-5-acessorios")] },
      { titulo: "Carga, ângulo e plano", aulas: [mc("M3-piloto-lingada"), mc("M3-3-plano")] },
      { titulo: "Operação segura", aulas: [novo("SIN-2-comunicacao"), novo("SIN-3-prevencao")] },
    ],
    questoes: () => [
      q("Quem define equipamento, acessórios e configuração do içamento?", ["O sinaleiro na hora", "O plano de içamento da engenharia", "O motorista", "O auxiliar"], "b", "O plano define e o sinaleiro/amarrador executa conforme ele."),
      q("Função do amarrador:", ["Operar o guindaste", "Escolher e inspecionar acessórios e amarrar conforme o plano", "Assinar a nota fiscal", "Isolar a rua"], "b", "Inspeção e amarração conforme o plano."),
      q("O sinaleiro atua quando:", ["Tem o certificado", "Está capacitado, avaliado na prática e autorizado pela empresa", "O operador pede", "Sabe os sinais"], "b", "Certificado não é autorização: precisa de autorização formal."),
      s("O rádio fica mudo durante o movimento.", ["O operador continua devagar", "O operador para e só retoma com contato confirmado", "O sinaleiro grita", "Ninguém faz nada"], "b", "Perda de comunicação: parada."),
      q("Antes de içar de fato, o que se faz?", ["Içamento de teste: erguer pouco, parar e conferir equilíbrio e amarração", "Nada", "Soltar a corda-guia", "Girar a carga"], "a", "O teste confirma equilíbrio, amarração e peso."),
      s("O peso real ficou maior que o do plano.", ["Segue com cuidado", "Para e replaneja com a engenharia", "Aumenta a velocidade", "Tira um acessório"], "b", "Mudou peso, raio ou posição: replanejar."),
      ...doMiniCurso("MC-M3").filter((x) => !/armazen|pilha|romaneio|caibro/i.test(x.enunciado)).slice(0, 8),
    ],
  },
  "NR18-GUI": {
    capitulos: [
      { titulo: "O equipamento e a base", aulas: [novo("GUI-1-equipamento"), novo("GUI-2-estabilizacao")] },
      { titulo: "Capacidade e inspeção", aulas: [mc("M3-3-plano"), novo("GUI-3-inspecao-limites")] },
      { titulo: "Operação", aulas: [novo("GUI-4-operacao")] },
    ],
    questoes: () => [
      q("A capacitação de operador de equipamento de guindar é:", ["Genérica, vale para qualquer equipamento", "Específica para o equipamento e o modelo", "Só teórica", "Dispensável com experiência"], "b", "Capacitação específica; um curso genérico não habilita todos os modelos."),
      q("O limitador de carga pode ser desativado quando atrapalha?", ["Sim", "Nunca", "Só no fim do dia", "Só com vento"], "b", "Dispositivos de segurança nunca são desativados."),
      q("Guindaste sobre laje exige:", ["Nada especial", "Capacidade da laje verificada e liberada pela engenharia", "Só pranchões", "Só nivelamento"], "b", "A base sobre laje é verificada e liberada pela engenharia."),
      s("A sapata está sobre a tampa de uma caixa de passagem.", ["Opera com cuidado", "Reposiciona o equipamento em base liberada", "Coloca mais um pranchão e segue", "Opera só com carga leve"], "b", "Sapata só em base verificada."),
      q("Baixar a lança faz o quê com a capacidade?", ["Aumenta", "Diminui, porque o raio aumenta", "Não muda", "Depende do operador"], "b", "Maior raio, menor capacidade (tabela de carga)."),
      q("Cabo de aço com fios rompidos na inspeção diária:", ["Opera hoje e troca amanhã", "Equipamento não opera até corrigir", "Opera com metade da carga", "Ignora"], "b", "Defeito na inspeção: não opera."),
      q("Pode arrastar a carga ou puxá-la de lado?", ["Sim, devagar", "Não", "Só peças leves", "Só com sinaleiro"], "b", "Arrastar ou puxar de lado sobrecarrega e desestabiliza."),
      q("Quando o operador obedece a parada de emergência?", ["Só do sinaleiro", "De qualquer pessoa", "Só do encarregado", "Nunca"], "b", "A parada vale de qualquer pessoa."),
      ...doMiniCurso("MC-M3").filter((x) => /tabela|raio|plano|capacidade/i.test(x.enunciado)).slice(0, 3),
    ],
  },
  "NR18-PEMT": {
    capitulos: [
      { titulo: "Conhecer a plataforma", aulas: [novo("PEMT-1-tipos-riscos"), novo("PEMT-2-inspecao")] },
      { titulo: "Operar com segurança", aulas: [novo("PEMT-3-condicoes"), novo("PEMT-4-operacao-emergencia")] },
    ],
    questoes: () => [
      q("A plataforma tipo tesoura se movimenta:", ["Na vertical", "Em qualquer direção com lança", "Só na horizontal", "Gira 360° no alto"], "a", "A tesoura sobe na vertical; a articulada alcança por cima e para o lado."),
      s("Subindo sob uma viga, o principal risco é:", ["Ruído", "Esmagamento contra a viga", "Frio", "Nenhum"], "b", "Perto da estrutura: devagar e olhando na direção do movimento."),
      q("O alarme de inclinação apitou. O que fazer?", ["Silenciar e seguir", "Descer, reposicionar e corrigir a causa", "Subir mais rápido", "Desligar o alarme"], "b", "Dispositivos de segurança não se desativam."),
      q("A carga máxima da cesta inclui:", ["Só materiais", "Pessoas e materiais, conforme a placa", "Só pessoas", "Nada"], "b", "Pessoas + materiais, pela placa do modelo."),
      q("Pode pendurar peças do lado de fora da cesta?", ["Sim, se amarradas", "Não; a cesta não é guindaste", "Só tubos", "Só em tesoura"], "b", "Nada pendurado; movimentação de material com equipamento de guindar."),
      q("Vento acima do limite do fabricante:", ["Eleva devagar", "Não eleva", "Eleva só metade", "Eleva com cinto"], "b", "Respeitar o limite do fabricante."),
      q("Quem deve conhecer a descida de emergência?", ["Ninguém", "Alguém no solo, treinado no modelo", "Só o fabricante", "Só o operador na cesta"], "b", "Sempre alguém no solo apto a baixar a plataforma."),
      q("Na plataforma articulada, o cinto fica:", ["Solto", "Ancorado no ponto indicado pelo fabricante na cesta", "Preso na estrutura do prédio", "Preso no guarda-corpo em qualquer ponto"], "b", "Ponto de ancoragem indicado pelo fabricante."),
    ],
  },
  "NR12-MAQ": {
    capitulos: [
      { titulo: "Riscos e proteções", aulas: [novo("NR12-1-riscos"), novo("NR12-2-protecoes"), novo("NR12-3-bloqueio")] },
      { titulo: "Equipamentos da montagem", aulas: [novo("NR12-4-esmerilhadeira-furadeira"), novo("NR12-5-corte-solda")] },
    ],
    questoes: () => [
      q("O que é a zona de perigo de uma máquina?", ["O depósito", "O espaço onde a máquina pode atingir alguém", "O quadro elétrico", "A área de vivência"], "b", "Proteções existem para manter o trabalhador fora da zona de perigo."),
      q("Proteção danificada: o que fazer?", ["Operar com cuidado", "Não operar, sinalizar e comunicar", "Remover de vez", "Consertar com fita"], "b", "Máquina sem proteção íntegra não opera."),
      q("Quem pode remover uma proteção?", ["Qualquer operador", "Pessoa autorizada, para manutenção, com a máquina parada e bloqueada", "O ajudante", "Ninguém nunca"], "b", "Remoção controlada e recolocação antes de operar."),
      q("Ordem do bloqueio de energias:", ["Ligar, testar, bloquear", "Identificar, desligar, bloquear e etiquetar, liberar energia residual, testar", "Só desligar", "Só etiquetar"], "b", "Sequência completa de bloqueio."),
      q("Quem retira o cadeado de bloqueio?", ["Qualquer colega", "Quem colocou", "O primeiro que chegar", "O operador do turno seguinte"], "b", "Cada um retira o próprio cadeado."),
      q("Rotação máxima do disco em relação à da esmerilhadeira:", ["Pode ser menor", "Igual ou maior", "Tanto faz", "Metade"], "b", "Disco com rotação inferior à da máquina pode estourar."),
      s("Usar disco de corte para desbastar uma solda.", ["Pode, se for rápido", "Não; o disco fino estoura com esforço lateral", "Pode sem a coifa", "Pode com luva"], "b", "Cada disco tem a sua função."),
      q("Na furadeira, a peça deve estar:", ["Segurada na mão", "Presa", "Solta", "Apoiada no joelho"], "b", "Peça presa; base magnética fixa e com cinta quando exigida."),
      q("Onde prender o cabo de retorno (terra) da máquina de solda?", ["Em qualquer pilar", "Perto da junta, firme na peça", "No quadro elétrico", "No andaime"], "b", "Evita corrente passando pela estrutura e aquecimento de ligações."),
      q("Quando refazer a capacitação de NR-12?", ["Nunca", "Quando mudar máquina, método ou processo", "Só a cada 10 anos", "Quando quiser"], "b", "A NR-12 não fixa periodicidade; exige reciclagem nas mudanças."),
    ],
  },
  "PAL-51": {
    capitulos: [
      { titulo: "Recebimento, identificação e armazenagem", aulas: [mc("M3-1-recebimento"), mc("M2-4-etiqueta"), mc("M2-2-lendo"), mc("M3-2-armazenagem")] },
      { titulo: "Planejamento, sequência e estabilidade", aulas: [mc("M1-2-estabilidade"), mc("M3-6-sequencia"), mc("M3-3-plano")] },
      { titulo: "Posicionar, alinhar, ligar e liberar", aulas: [mc("M6-3-prumo"), mc("M4-5-sequencia"), mc("M5-2-preparar"), mc("M5-4-inspecao")] },
    ],
    questoes: () => [...basicas("MC-M1", 2), ...basicas("MC-M2", 2), ...basicas("MC-M3", 3), ...basicas("MC-M4", 2), ...basicas("MC-M5", 2), ...basicas("MC-M6", 2)],
  },
  "PAL-53": {
    capitulos: [{ titulo: "Familiarização por modelo", aulas: [novo("PAL53-1-familiarizacao")] }],
    questoes: () => [
      q("A familiarização por modelo substitui a capacitação de operador de PEMT?", ["Sim", "Não; complementa", "Só para tesoura", "Só para articulada"], "b", "Complementa a capacitação NR-18 do operador."),
      q("Onde estão os limites de carga, vento e inclinação do modelo?", ["Na memória do operador", "No manual e na placa do modelo", "No celular", "Em qualquer modelo parecido"], "b", "O manual do modelo é a referência."),
      q("Chegou outro modelo na obra. O que fazer antes de operar?", ["Nada", "Nova familiarização no modelo", "Ler só o adesivo", "Pedir a um colega"], "b", "Cada modelo exige familiarização."),
      q("O que o registro da familiarização traz?", ["Modelo, número de série, data, instrutor e resultado", "Só o nome", "Só a data", "Nada"], "a", "Registro completo por modelo."),
      q("A familiarização termina com:", ["Assinatura sem prática", "Avaliação operacional com o instrutor", "Um vídeo", "Uma foto"], "b", "Avaliação operacional registrada."),
    ],
  },
  "PAL-54": {
    capitulos: [{ titulo: "Familiarização por modelo", aulas: [novo("PAL54-1-familiarizacao")] }],
    questoes: () => [
      q("A tabela de carga de um modelo vale para outro?", ["Sim", "Não", "Se forem da mesma marca", "Só para cargas leves"], "b", "Cada modelo e configuração tem a sua tabela."),
      q("A familiarização por modelo substitui a capacitação de operador de equipamento de guindar?", ["Sim", "Não; complementa", "Só no primeiro ano", "Só sobre laje"], "b", "Complementa e não substitui."),
      q("O que a familiarização cobre?", ["Só os comandos", "Manual, tabela, estabilização, dispositivos, inspeção e operação supervisionada", "Só a inspeção", "Só o transporte"], "b", "Cobertura completa do modelo."),
      q("A operação supervisionada é:", ["Opcional", "Parte da familiarização, com avaliação registrada", "Feita por vídeo", "Feita sem instrutor"], "b", "Avaliação registrada por modelo."),
      q("Dispositivos e indicadores do modelo podem ser desativados?", ["Sim", "Nunca", "Só no controle remoto", "Só com pressa"], "b", "Dispositivos de segurança nunca são desativados."),
    ],
  },
  "PAL-55": {
    capitulos: [
      { titulo: "Riscos da soldagem e do corte", aulas: [novo("PAL55-1-eletrico-radiacao"), novo("PAL55-2-fumos")] },
      { titulo: "Incêndio e gases", aulas: [novo("PAL55-3-incendio-pt"), novo("PAL55-4-cilindros-oxicorte")] },
    ],
    questoes: () => [
      q("Umidade na solda elétrica:", ["Não interfere", "Aumenta o risco de choque", "Melhora o arco", "Esfria a peça"], "b", "Luvas, roupas e piso secos."),
      q("Quem está perto da solda precisa de proteção?", ["Não", "Sim: biombo, distância e proteção dos olhos", "Só o soldador", "Só à noite"], "b", "A radiação atinge quem está perto."),
      q("Soldar aço galvanizado exige:", ["Nada", "Exaustão, posição fora da pluma e respirador", "Só luva", "Água na peça"], "b", "Fumos de zinco podem causar febre e mal-estar."),
      q("Onde posicionar o rosto em relação ao fumo?", ["Sobre o fumo", "Fora da pluma, com ventilação", "Atrás da máscara sem ventilação", "Tanto faz"], "b", "Evita inalar o fumo."),
      q("Antes de cortar, o que se faz com inflamáveis?", ["Nada", "Afasta ou cobre com manta resistente ao fogo", "Molha", "Ignora"], "b", "Preparar a área contra fagulhas."),
      s("Terminou o corte sobre um forro.", ["Vai embora", "Inspeciona a área depois", "Liga o ventilador", "Joga água em tudo"], "b", "Fagulha pode virar fogo minutos depois."),
      q("Cilindros devem ficar:", ["Deitados", "Em pé e presos", "Soltos", "Ao sol"], "b", "Cilindro solto tomba e vira projétil."),
      q("Teste de vazamento no oxicorte:", ["Com chama", "Com água e sabão", "Com o nariz", "Não se faz"], "b", "Nunca com chama."),
      q("Óleo ou graxa em contato com oxigênio:", ["Lubrifica", "Pode inflamar", "Não faz nada", "Melhora a vedação"], "b", "Oxigênio com óleo ou graxa é risco de fogo."),
    ],
  },
  "PAL-56": {
    capitulos: [
      { titulo: "Ferramentas elétricas", aulas: [novo("NR12-4-esmerilhadeira-furadeira"), novo("PAL56-2-parafusadeira-impacto")] },
      { titulo: "Torque e cuidados", aulas: [mc("M4-4-metodos"), novo("PAL56-4-inspecao-guarda")] },
    ],
    questoes: () => [
      q("A chave de impacto define o aperto final da ligação?", ["Sim", "Não; o aperto final segue o método da ligação", "Só em A325", "Só em altura"], "b", "Ver módulo de parafusos (M4)."),
      q("Pode usar cano de extensão na chave?", ["Sim", "Não", "Só em porca presa", "Só com luva"], "b", "Ferramenta adequada; peça ajuda."),
      q("O soquete da chave de impacto deve estar:", ["Solto", "Certo para a porca e travado com pino e anel", "Qualquer tamanho", "Engraxado"], "b", "Evita que o soquete se solte."),
      s("Cabo da esmerilhadeira com fio exposto.", ["Passa fita e usa", "Separa, etiqueta e comunica", "Usa com luva", "Usa no seco"], "b", "Defeito: separar, identificar, comunicar."),
      q("Em altura, as ferramentas ficam:", ["No bolso", "Amarradas ou na bolsa", "Soltas na viga", "Com o colega"], "b", "Evita queda de material."),
      q("Rotação máxima do disco em relação à da máquina:", ["Menor", "Igual ou maior", "Tanto faz", "Metade"], "b", "Disco abaixo da rotação da máquina pode estourar."),
      ...doMiniCurso("MC-M4").filter((x) => /torqu|chave|aperto/i.test(x.enunciado)).slice(0, 3),
    ],
  },
  "PAL-57": {
    capitulos: [{ titulo: "Leitura e interpretação de projetos", aulas: [mc("M2-1-documentos"), mc("M2-2-lendo"), mc("M2-3-simbolos"), mc("M2-4-etiqueta")] }],
    questoes: () => doMiniCurso("MC-M2"),
  },
  "INT-02": {
    capitulos: [{ titulo: "Orientação para visitantes", aulas: [novo("INT02-1-visitantes")] }],
    questoes: () => [
      q("Visitante pode circular sozinho no canteiro?", ["Sim", "Não; sempre acompanhado por alguém da Palla", "Só de manhã", "Só se conhecer a obra"], "b", "Acompanhamento obrigatório."),
      q("Pode passar sob uma peça sendo içada?", ["Sim, rápido", "Nunca", "Com capacete", "Se o sinaleiro deixar"], "b", "Ninguém sob carga suspensa."),
      q("EPIs mínimos para visitante:", ["Nenhum", "Capacete, óculos, calçado fechado e o que a obra exigir", "Só colete", "Só capacete"], "b", "Conforme as regras da obra."),
      q("Em emergência, o visitante:", ["Procura a saída sozinho", "Segue o acompanhante até o ponto de encontro", "Fica parado", "Volta para o carro"], "b", "Rota de fuga e ponto de encontro com o acompanhante."),
      q("Fotos na obra:", ["Livres", "Só com autorização", "Só do lado de fora", "Só de pessoas"], "b", "O projeto e as instalações pertencem ao cliente."),
    ],
  },
};

export const CURSOS_TREINAMENTO = Object.keys(TREINAMENTOS);

export function capitulosTreinamento(curso: string, raiz = process.cwd()): CapituloSeed[] {
  return TREINAMENTOS[curso].capitulos.map((c) => ({ titulo: c.titulo, aulas: c.aulas.map((a) => montarAula(a, raiz)) }));
}
export const questoesTreinamento = (curso: string) => TREINAMENTOS[curso].questoes();
/** Códigos dos vídeos novos usados pelos treinamentos (para conferir se já foram publicados). */
export const videosNovos = () => [...new Set(Object.values(TREINAMENTOS).flatMap((d) => d.capitulos.flatMap((c) => c.aulas.filter((a) => !a.mc).map((a) => a.codigo))))];
