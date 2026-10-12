# Checklist de validação legal e técnica

Nada abaixo foi validado por profissional habilitado ou pelo jurídico. A plataforma não possui credenciamento nem homologação de órgão público.

## Normas e parâmetros

- [ ] Conferir no texto oficial vigente da NR-18 (Portaria MTE nº 836/2026) as cargas, a periodicidade e a modalidade do Anexo I: básico (4 h), sinaleiro e amarrador (16 h), PEMT (4 h), equipamentos de guindar. Hoje estão marcados como **"A validar"**.
- [x] NR-35: Portaria MTE nº 1.259/2026 conferida (item 35.4.5, treinamento presencial; vigência em 16/07/2026; art. 8º dá 1 ano para refazer o inicial feito a distância).
- [ ] NR-35: responsável técnico revisar o material de apoio (db/conteudo/nr35.ts), as 28 questões e o Caderno do Instrutor, e aprovar o curso.
- [ ] NR-35: levantar quem fez o inicial a distância antes de 16/07/2026 e refazer/completar até 16/07/2027.
- [ ] NR-33: confirmar se a teoria pode ser EAD; detalhar o conteúdo do Anexo III.
- [ ] NR-12: definir e documentar a carga mínima por máquina com profissional legalmente habilitado.
- [ ] NR-6, NR-17, NR-23 e NR-26: aprovar carga e periodicidade internas (hoje marcadas como critério do empregador).
- [ ] Brigada de incêndio: verificar a legislação estadual; o curso NR23-INC é informativo.
- [ ] Ajustar a matriz por função ao PGR de cada obra e às exigências de cada contratante.

## Conteúdo

- [ ] Preencher os trechos marcados com **[A PREENCHER PELA PALLA]**: história, missão, visão, valores, organograma, canal de denúncias, política de álcool e drogas, regulamento disciplinar.
- [ ] Revisar e aprovar a Integração e o curso 5.2 na plataforma (responsável técnico).
- [ ] Gravar as videoaulas a partir dos roteiros e cadastrar os links.
- [ ] Desenvolver o conteúdo dos demais cursos.
- [ ] Elaborar o projeto pedagógico de cada curso EAD (NR-1, Anexo II, 3.1) e anexar.
- [ ] Definir o canal de dúvidas durante os cursos EAD (NR-1, Anexo II, 4.5).

## Certificado e assinatura

- [ ] Confirmar CNPJ e dados da empresa emissora (`EMPRESA_CNPJ`).
- [ ] Decidir o tipo de assinatura eletrônica (Lei 14.063/2020): a atual é um registro de aprovação com login individual e auditoria; avaliar assinatura qualificada ICP-Brasil para o responsável técnico.
- [ ] Validar o modelo de certificado frente ao item 1.7.1.1 da NR-1 e à NR-33, 33.6.5 (tipo de espaço confinado e anuência do responsável técnico).
- [ ] Definir o domínio definitivo antes de emitir certificados reais (QR Code).

## LGPD e segurança

- [ ] Revisar o aviso de privacidade (minuta em `/aviso-privacidade`) e indicar o encarregado de dados.
- [ ] Definir bases legais, prazos de retenção e procedimento de exclusão.
- [ ] Definir quem acessa o ASO (dado de saúde) e revisar os perfis.
- [ ] Implementar troca de senha, recuperação de senha e segundo fator para perfis administrativos.
- [ ] Teste de invasão ou revisão de segurança antes da publicação.
- [ ] Backup do banco e dos arquivos; guarda das chaves de criptografia.

## Operação

- [ ] Desativar os usuários de teste (`@palla.teste`) e apagar os dados fictícios.
- [ ] Cadastrar os responsáveis reais (responsável técnico, instrutores com qualificação e registro).
- [ ] Rodar `npm run test:fluxo` no ambiente de homologação.
- [ ] Piloto com uma obra e uma turma antes da adoção geral.
