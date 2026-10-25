# GRUPO PALLA | TREINAMENTO E INTEGRAÇÃO

Plataforma web da **Palla Construções** para integração, capacitação, avaliação, certificação e controle documental dos colaboradores que atuam nas obras de estrutura metálica.

> **Situação: MVP funcional, não validado juridicamente.** Conteúdos, parâmetros normativos, aviso de privacidade e modelo de assinatura precisam da revisão do responsável técnico e do jurídico antes do uso oficial. Veja `docs/checklist-validacao.md`.

## O que já funciona

| Área | Situação |
|---|---|
| Cadastro por link (convite), com CPF validado, cifrado e consentimento LGPD | Implementado |
| Cadastro de obras, contratantes, funções e convites | Implementado |
| Matriz de treinamentos por função, com ajustes por obra | Implementado |
| Matrícula automática pela matriz; condicionais incluídos pela SST com justificativa | Implementado |
| Ambiente de videoaulas com contagem de tempo (só com a aba visível), tempo mínimo e "continuar de onde parei" | Implementado (vídeos **simulados**: a aula exibe roteiro e narração até o vídeo ser gravado) |
| Avaliações com banco de questões, sorteio de questões e alternativas, nota, tentativas limitadas e reavaliação controlada | Implementado |
| Gabarito comentado após o envio | Implementado |
| Registro de atividades práticas e de turmas presenciais pelo instrutor, com evidências | Implementado |
| "Pendente de prática" até o registro APTO | Implementado |
| Aprovação do responsável técnico com checklist de requisitos | Implementado |
| Certificado PDF A4 horizontal de 2 páginas, com logo, marca-d'água, QR Code, número único e código de verificação | Implementado |
| Comprovante de etapa teórica (visual distinto, não é certificado) | Implementado |
| Página pública de verificação (sem CPF, nome abreviado) | Implementado |
| Cancelamento e reemissão com histórico | Implementado |
| Controle de validade e vencimento | Implementado |
| ASO, ficha de EPI e documentos da contratante, com conferência humana | Implementado (ASO só é **anexado**, nunca gerado) |
| Autorização formal por atividade (separada do certificado) | Implementado |
| Semáforo verde, amarelo e vermelho; liberação de acesso só por aprovação humana | Implementado |
| Painel com indicadores e filtros por obra, função, empresa, período e treinamento | Implementado |
| 7 perfis de acesso e registro de auditoria | Implementado |
| Conteúdo completo da Integração (13 aulas, 12 questões) e do curso 5.2 Segurança na montagem (3 aulas, 10 questões) | Implementado, **em revisão técnica** |
| Demais cursos do catálogo | Cadastrados com plano de ensino; **conteúdo pendente** |
| **Saúde e Segurança:** PGR (GHE, inventário de riscos com biblioteca de 13 ambientes, critério S×P, plano de ação, versões e histórico, documento para assinatura, inventário para a contratante) | Implementado — PGR só é aprovado com PDF assinado pelo profissional habilitado (NR-18, 18.4.2) |
| **PCMSO:** registro do programa assinado pelo médico, matriz de exames por GHE/função, próximo periódico sugerido na conferência do ASO, ASO com tipo de exame e conclusão (inapto = vermelho) | Implementado — a plataforma não elabora o PCMSO nem guarda prontuário |
| **Dossiê admissional** configurável (13 itens-base, sensíveis só para RH) e **termos assinados** pelo colaborador (ordem de serviço com os riscos do PGR, EPI, regulamento, álcool e drogas, imagem) | Implementado — assinatura eletrônica com senha, hash e IP; **não é ICP-Brasil**; modelos em revisão |
| **Quem assina e empresas parceiras:** cadastro do profissional do PGR (CREA/MTE), do médico do PCMSO (CRM) e do responsável pela empresa; logotipo da consultoria ou da clínica nos documentos, ao lado do da Palla; matriz de exames do PCMSO para a clínica | Implementado — dados copiados para o documento na aprovação |
| **Prazos e alertas** (exames, reciclagens, documentos, experiência, revisão do PGR, relatório do PCMSO, plano de ação, prazos avulsos) | Implementado no painel; aviso por e-mail **pendente** |
| Assinatura eletrônica qualificada (ICP-Brasil), envio de e-mail/SMS, upload em nuvem (S3), troca de senha e 2FA | **Pendente** |

## Requisitos

- Node.js 20 ou superior
- PostgreSQL 14 ou superior

## Instalação

```bash
npm install
cp .env.example .env          # preencha as variáveis (abaixo)
npm run db:migrate            # cria as tabelas
npm run db:seed               # catálogo, matriz, conteúdos e usuários de TESTE
npm run build
npm start                     # http://localhost:3000
```

### Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `DATABASE_URL` | Conexão PostgreSQL |
| `SESSION_SECRET` | Assinatura das sessões; mínimo 32 caracteres aleatórios |
| `CPF_KEY_HEX` | Chave AES-256 do CPF (`openssl rand -hex 32`). **Guarde em cofre: sem ela os CPFs não podem ser lidos** |
| `CPF_HMAC_KEY` | Chave do índice de CPF (evita duplicidade sem expor o CPF) |
| `APP_URL` | Endereço público, usado nos links de convite e no QR Code |
| `UPLOAD_DIR` | Pasta dos arquivos enviados (ASO, evidências) |
| `EMPRESA_NOME`, `EMPRESA_CNPJ` | Dados da empresa emissora no certificado |

### Usuários de teste (criados pelo seed)

Senha de todos: `Palla@2026`. **Apague ou desative antes de ir para produção.**

`admin@palla.teste` · `rh@palla.teste` · `sst@palla.teste` · `instrutor@palla.teste` · `rt@palla.teste` · `gestor@palla.teste`

Para criar usuários reais:

```bash
npm run usuario:criar -- "Nome Completo" email@palla.ind.br RESPONSAVEL_TECNICO "Engenheiro ..." "CREA-SP ..."
```

## Testes

```bash
npm run test:fluxo   # 47 verificações das regras: cadastro → certificação → liberação, reprovação, pendência prática, vencimento, documento irregular
npm run test:sst     # 48 verificações do módulo Saúde e Segurança (PGR, termos, dossiê, PCMSO, ASO, prazos)
npm run test:telas   # navegador real (Playwright) com o servidor rodando; gera capturas em saida-testes/telas
```

Os testes usam apenas dados fictícios (`dadoFicticio = true`) e uma obra de teste (`OBR-TESTE`).

## Estrutura

```
app/            telas (Next.js App Router): login, convite, colaborador, admin, verificar, api
components/     componentes de interface
db/             esquema (Drizzle), migrações, seed, catálogo e conteúdos dos cursos
lib/            sessão, permissões, criptografia, PDF, auditoria
lib/servicos/   regras de negócio (cadastro, aprendizagem, práticas, certificação, conformidade, documentos)
scripts/        testes e utilitários
docs/           manuais, manutenção e checklist de validação
```

## Decisões técnicas

- **Drizzle ORM** em vez de Prisma: é 100% JavaScript, sem binários externos, e roda no mesmo PostgreSQL.
- **Regras no servidor:** toda ação checa perfil e permissão no servidor (`lib/permissoes.ts`); o navegador não decide nada.
- **Certificado congelado:** os dados do certificado são gravados na emissão (`dados_snapshot`) com o hash SHA-256 do PDF. Mudanças no curso não alteram certificados já emitidos.
- **Sem assinaturas desenhadas:** o certificado registra a aprovação eletrônica do responsável técnico (login individual + auditoria). A assinatura qualificada ICP-Brasil é a evolução recomendada.

Documentação completa em `docs/`.
