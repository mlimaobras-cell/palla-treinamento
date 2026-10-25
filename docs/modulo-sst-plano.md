# Módulo Saúde e Segurança — PGR, PCMSO, ASO e dossiê admissional (25/10/2026)

**Prazo do usuário:** tudo pronto até **10/12/2026**.

**Onde fica:** dentro da plataforma que já está no ar (palla-treinamento.netlify.app), como uma nova área "Saúde e Segurança", usando o mesmo banco, os mesmos perfis e a mesma auditoria.

## 1. Avaliação da ideia

**Veredito:** a ideia é viável e faz sentido.

- A plataforma já guarda ASO, ficha de EPI e documentos da contratante, além de calcular o semáforo de acesso.
- O que falta é a camada que **explica por que** cada exame e cada treinamento é exigido. Essa camada é o PGR (riscos por GHE e função) e o PCMSO (exames por risco).
- Com isso, a matriz de treinamentos e os exames passam a sair do mesmo inventário de riscos, como a NR-1 espera.

### O que a lei diz (texto oficial consultado em 25/10/2026)

**NR-1 (última atualização: Portaria MTE 765/2025)**
- O PGR tem, no mínimo, **inventário de riscos e plano de ação** (1.5.7.1).
- Os documentos são **datados e assinados** sob responsabilidade da organização (1.5.7.2).
- O conteúdo mínimo do inventário está nas alíneas a–i do item 1.5.7.3.2.
- O histórico das atualizações deve ser guardado por **20 anos** (1.5.7.3.3.1).
- A avaliação de riscos é revista **a cada 2 anos** ou antes, por gatilhos: acidente, mudança de processo, pedido da CIPA etc. (1.5.4.4.6).
- A organização **define e documenta** os próprios critérios de severidade e probabilidade (1.5.4.4.2). A norma não traz matriz pronta.
- **Riscos psicossociais** entram no gerenciamento (1.5.3.1.4). Vigência em **26/05/2026** (Portaria 765/2025).
- Contratadas devem fornecer à contratante o **inventário de riscos e o plano de ação** do serviço (1.5.8). Isso se aplica à Palla em toda obra de cliente.
- Documentos das NR em meio digital: com **certificado ICP-Brasil** (1.6.2). Para que a digitalização de papel assinado tenha valor, também é preciso ICP-Brasil (1.6.3.1), e os originais continuam guardados conforme a lei (1.6.3.2).

**NR-18 (última atualização: Portaria MTE 203/2026)**
- O PGR é obrigatório no canteiro (18.4.1).
- Ele é **elaborado por profissional legalmente habilitado em segurança do trabalho** (18.4.2). Em obra de até 7 m e até 10 trabalhadores, pode ser profissional qualificado (18.4.2.1).
- Além do previsto na NR-1, deve conter (18.4.3):
  - projeto da área de vivência;
  - projeto elétrico provisório;
  - projetos de proteção coletiva;
  - SPIQ, quando aplicável;
  - relação de EPIs.
- Deve ser atualizado conforme a etapa da obra (18.4.3.1).
- Empresas contratadas entregam seu inventário para ser incluído no PGR do canteiro (18.4.4).

**NR-7**
- O PCMSO é **elaborado por médico do trabalho** indicado pela empresa e se baseia nos riscos do PGR.
- O ASO traz apto ou inapto, as aptidões específicas e os dados e a assinatura do médico examinador.
- O prontuário é guardado por **20 anos após o desligamento**, sob responsabilidade do médico.
- O relatório analítico é **anual**.

### O que a plataforma pode e não pode fazer

| Pode | Não pode |
|---|---|
| Montar o **inventário de riscos** por obra, ambiente, atividade, GHE e função, a partir de uma biblioteca da Palla | Emitir PGR "válido" sem a assinatura do profissional habilitado (NR-18, 18.4.2) |
| Gerar o **documento do PGR em PDF** (rascunho → revisão → aprovado → assinado), com histórico de versões guardado por 20 anos | Elaborar o PCMSO, que é ato do médico do trabalho |
| Registrar o **PCMSO recebido** (PDF assinado pelo médico) e a **matriz de exames por GHE** que o médico definir (exame, periodicidade) | Guardar **prontuário médico** ou resultado de exames. Isso é dado de saúde sob custódia do médico; a plataforma guarda só o ASO |
| Vincular cada **ASO** ao tipo de exame e à função, e calcular o próximo periódico pela periodicidade do PCMSO | Gerar ASO (regra já existente) |
| **Dossiê admissional**: checklist de documentos por função, envio pelo colaborador e conferência pelo RH | Inventar periodicidade de exame: o valor vem do PCMSO e é digitado pelo médico ou pela clínica |
| **Termos assinados eletronicamente** pelo colaborador (ciência de riscos, ordem de serviço, recebimento de EPI, regulamento, LGPD), com registro de data, hora, IP, hash e código de verificação | Afirmar que a assinatura simples substitui o ICP-Brasil nos documentos das NR (ver a decisão do jurídico abaixo) |
| **Alertas de prazo**: ASO periódico, certificados, revisão do PGR (2 anos), relatório anual do PCMSO, documentos com validade, contratos de experiência | |
| Exportar o **inventário de riscos da Palla para a contratante** (NR-1, 1.5.8 e NR-18, 18.4.4) | |

### "PGR e PCMSO completos para os mais diversos ambientes"

**Biblioteca-base de ambientes e atividades** (revisada pelo profissional habilitado antes de ir para produção):
- canteiro de montagem metálica;
- fábrica e oficina de estruturas (corte, furação, solda, jateamento, pintura);
- trabalho em altura (PEMT, andaime, cobertura);
- içamento;
- soldagem e corte a quente;
- pintura industrial;
- espaço confinado (quando houver);
- montagem dentro de indústria em operação (riscos do cliente);
- almoxarifado e pátio;
- área de vivência;
- escritório de obra e administrativo;
- deslocamento (veículos).

**Riscos e medidas de cada ambiente:** cada um traz perigos (físicos, químicos, biológicos, ergonômicos e psicossociais, de acidentes), possíveis lesões, medidas de prevenção e exames *sugeridos para avaliação do médico* (marcados como sugestão, nunca como exigência).

**Por obra:** o PGR da obra é montado escolhendo os ambientes e atividades e ajustando ao local.

## 2. Decisões que dependem da Palla (não bloqueiam o desenvolvimento)

1. **Quem assina o PGR:** nome, registro e qualificação do profissional legalmente habilitado em segurança do trabalho.
2. **Médico do trabalho / clínica** responsável pelo PCMSO, para enviar o PCMSO e a matriz de exames.
3. **Assinatura dos documentos das NR:**
   - (a) ICP-Brasil, por um provedor como D4Sign, Clicksign ou ZapSign com certificado, mais e-CPF/e-CNPJ dos responsáveis;
   - (b) assinatura eletrônica da plataforma para os termos internos, com guarda dos originais em papel do que for documento de NR.
   - **Recomendação:** (b) agora e (a) quando o jurídico aprovar.
4. **Lista de documentos admissionais** que o RH exige. Já vem um padrão configurável.
5. **Envio de e-mail** dos alertas: um provedor (Resend, SendGrid ou o e-mail da Palla via SMTP). Até lá, os alertas aparecem no painel e por notificação no aparelho (já existe).
6. **Critério de risco:** matriz 5×5 sugerida (severidade × probabilidade). A Palla precisa aprovar, porque a NR-1 exige critério documentado pela organização.

## 3. Cronograma até 10/12

| Semana | Entrega |
|---|---|
| 26/10–01/11 | Modelo de dados; **dossiê admissional**; **termos com assinatura eletrônica** pelo colaborador; **painel de vencimentos e alertas** |
| 02/11–08/11 | **PGR**: biblioteca de ambientes e atividades, GHE, inventário, matriz de risco configurável, plano de ação com responsável e prazo, versões |
| 09/11–15/11 | **PCMSO**: cadastro do PCMSO recebido, matriz de exames por GHE, ASO vinculado ao tipo de exame, próximo periódico, alerta, exportação para a clínica |
| 16/11–22/11 | **Conteúdo**: inventário-base dos ambientes; PDF do PGR e do inventário para a contratante |
| 23/11–29/11 | Testes do fluxo completo com dados fictícios; e-mail dos alertas (se o provedor for definido) |
| 30/11–10/12 | Validação pelo profissional habilitado e pelo médico; carga das obras e da equipe reais; treinamento do RH e da SST; ajustes |

## 4. Situação

| Item | Situação |
|---|---|
| Integração narrada | Já existe na plataforma (INT-01, 13 aulas com vídeo). O artifact separado era só para revisão de conteúdo |
| Módulo Saúde e Segurança | Em desenvolvimento, iniciado em 25/10 |

## Fontes
- [NR-01 atualizada (gov.br)](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-01-atualizada-2025-i-1.pdf)
- [NR-18 atualizada 2026 (gov.br)](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-18-atualizada-2026.pdf)
- [CBIC — Nova NR-7](https://cbic.org.br/nova-nr-7-sobre-saude-ocupacional-e-pcmso-entra-em-vigor-dia-3-1/)
- [Guia Trabalhista — riscos psicossociais](https://www.guiatrabalhista.com.br/tematicas/nr1-riscos-psicossociais.htm)
