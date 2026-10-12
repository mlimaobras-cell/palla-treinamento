# Manutenção e publicação

## Publicação recomendada

| Item | Recomendação |
|---|---|
| Aplicação | Servidor Node.js 20+ (VPS, Render, Railway, Fly.io) ou contêiner Docker |
| Banco | PostgreSQL gerenciado com backup diário e retenção mínima de 30 dias |
| Arquivos | Volume persistente ou armazenamento compatível com S3 (adaptar `lib/servicos/documentos.ts`) |
| HTTPS | Obrigatório (o cookie de sessão é `secure` em produção) |
| Domínio | Ex.: `treinamento.palla.ind.br`; ajuste `APP_URL` antes de emitir certificados, porque o QR Code usa esse endereço |

Passos:

```bash
npm ci
npm run db:migrate
npm run db:seed        # só na primeira vez; depois desative os usuários @palla.teste
npm run build
NODE_ENV=production npm start
```

Usuários de teste: `UPDATE usuarios SET ativo = false WHERE email LIKE '%@palla.teste';`

## Chaves

- `CPF_KEY_HEX` e `CPF_HMAC_KEY` nunca podem mudar depois do primeiro cadastro real. Guarde em cofre de senhas, com cópia segura.
- `SESSION_SECRET` pode ser trocado; todos os usuários precisarão entrar de novo.

## Atualizar conteúdo de um curso

1. Edite o arquivo em `db/conteudo/` (ou crie um novo seguindo o modelo de `integracao.ts`).
2. Inclua no `db/seed.ts` com `carregarConteudo`.
3. Rode `npm run db:seed`. O seed recarrega aulas e questões; matrículas e certificados não são afetados.
4. Peça ao responsável técnico a revisão e a aprovação do conteúdo na plataforma.

## Quando uma NR mudar

1. Atualize a matriz legal (documento de Fase 1).
2. Em **Cursos → curso → Validar parâmetros legais**, ajuste carga, reciclagem, modalidade e a versão da norma.
3. Revise o conteúdo e aprove de novo. Certificados já emitidos mantêm os dados da época (snapshot).
4. Avalie a necessidade de treinamento eventual (NR-1, 1.7.1.2.3).

## Mudanças no banco

```bash
# edite db/schema.ts
npm run db:gerar      # gera o SQL em db/migracoes
npm run db:migrate    # aplica
```

## Rotinas

| Frequência | Rotina |
|---|---|
| Diária | Conferir backup; olhar o painel (vencimentos em 60 dias) |
| Semanal | Revisar alertas de liberados com situação alterada |
| Mensal | Revisar auditoria de acessos a documentos de saúde |
| A cada 2 anos | Revalidar projetos pedagógicos (NR-1, Anexo II, 3.3) |
| Ao mudar uma NR | Procedimento acima |

## Retenção de dados

Registros de capacitação: no mínimo 2 anos após o fim da validade do curso (NR-1, Anexo II, 4.7.1), além dos prazos trabalhistas. O sistema não apaga registros automaticamente. A política de exclusão deve ser definida com o jurídico.
