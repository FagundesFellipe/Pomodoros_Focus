# Dev Workflow - POMODORO FOCUS

## Visão Geral

Workflow completo de desenvolvimento para o projeto, integrando Task Master AI, quality assurance, testes e versionamento.

```
┌──────────────────────────────────────────────────────────────┐
│                       DEV WORKFLOW                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   1. SYNC         Verificar main atualizada                  │
│       ↓                                                      │
│   2. QA           Lint + TypeCheck + Build                   │
│       ↓                                                      │
│   3. TASK         Obter próxima tarefa (Task Master)         │
│       ↓                                                      │
│   4. BRANCH       Criar branch feature                       │
│       ↓                                                      │
│   5. DEVELOP      Implementar + documentar                   │
│       ↓                                                      │
│   6. TEST         Cobertura ≥ 80%                            │
│       ↓                                                      │
│   7. SHIP         Commit + Push + PR                         │
│       ↓                                                      │
│   8. MEMORY       Registrar aprendizados                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Passo 1: Sincronizar com Remote

Manter a branch `main` sempre atualizada antes de iniciar qualquer trabalho.

```bash
# Trocar para main
git checkout main

# Pull mudanças remotas
git pull origin main

# Verificar status
git status
```

**Validação:**
- [ ] Branch atual é `main`
- [ ] Working tree limpa (sem alterações pendentes)
- [ ] Commit mais recente é o mesmo do remote

**Se houver conflitos:**
```bash
git stash
git pull origin main
git stash pop
# Resolver conflitos manualmente
```

---

## Passo 2: Quality Assurance (QA)

Rodar todas as verificações de qualidade antes de começar a codar.

```bash
# Lint - verificar estilo e padrões
npm run lint

# TypeCheck - verificar tipos TypeScript
npm run typecheck

# Build - verificar se compila sem erros
npm run build
```

**Validação:**
- [ ] `npm run lint` → 0 erros
- [ ] `npm run typecheck` → 0 erros TypeScript
- [ ] `npm run build` → build sucesso

**Se houver erros de lint:**
```bash
# Auto-corrigir erros fixáveis
npm run lint -- --fix

# Verificar o que mudou
git diff
```

**Ferramentas configuradas:**
| Ferramenta | Comando | Propósito |
|------------|---------|-----------|
| ESLint | `npm run lint` | Análise estática de código |
| TypeScript | `npm run typecheck` | Verificação de tipos |
| Prettier | `npm run format` | Formatação de código |
| Vitest | `npm run test` | Testes unitários |

---

## Passo 3: Obter Próxima Tarefa

Usar Task Master AI para identificar a próxima tarefa a ser trabalhada.

```bash
# Mostrar próxima tarefa disponível
task-master next

# Ver detalhes completos da tarefa
task-master show <id>

# Marcar como "em andamento"
task-master set-status --id=<id> --status=in-progress
```

**Via MCP (OpenCode/Claude Code):**
```
next_task          → Obtém próxima tarefa
get_task           → Mostra detalhes
set_task_status    → Atualiza status
```

**Validação:**
- [ ] Tarefa identificada com ID e título
- [ ] Dependências verificadas (todas concluídas)
- [ ] Subtarefas revisadas e planejadas
- [ ] Status alterado para `in-progress`

**Entender a tarefa:**
1. Ler `description` e `details` completos
2. Verificar `dependencies` - estão todas `done`?
3. Revisar `subtasks` - qual subtarefa começar?
4. Verificar `testStrategy` - como testar?

**Logar plano de implementação:**
```bash
task-master update-subtask --id=<id>.<subid> --prompt="Plano: [descrever abordagem]"
```

---

## Passo 4: Criar Branch

Criar branch com nomenclatura padronizada.

```bash
# Formato: feature/task-<id>-<slug-curto>
git checkout -b feature/task-1-init-nextjs

# Ou para fixes: fix/task-<id>-<slug>
# Ou para chores: chore/task-<id>-<slug>
```

**Convenção de nomes:**
| Tipo | Prefixo | Exemplo |
|------|---------|---------|
| Nova funcionalidade | `feature/` | `feature/task-4-routine-crud` |
| Correção de bug | `fix/` | `fix/task-2-auth-redirect` |
| Manutenção | `chore/` | `chore/task-1-config-deps` |
| Teste | `test/` | `test/task-6-snapshot-tests` |
| Documentação | `docs/` | `docs/task-3-db-schema` |

**Validação:**
- [ ] Branch criada a partir de `main` atualizada
- [ ] Nome segue o padrão `<tipo>/task-<id>-<slug>`
- [ ] `git status` mostra branch correta

---

## Passo 5: Desenvolvimento Iterativo

Implementar a tarefa seguindo as subtarefas e documentando progresso.

### 5.1 Planejar
```bash
# Revisar subtarefa atual
task-master show <id>.<subid>

# Logar abordagem de implementação
task-master update-subtask --id=<id>.<subid> --prompt="Implementar X usando Y porque Z"
```

### 5.2 Implementar
- Seguir boas práticas do projeto
- Commits incrementais a cada mudança significativa
- Rodar lint após cada bloco de código

### 5.3 Documentar Progresso
```bash
# Logar o que foi feito
task-master update-subtask --id=<id>.<subid> --prompt="Concluído: implementação do componente X com props Y"

# Logar problemas encontrados
task-master update-subtask --id=<id>.<subid> --prompt="Problema: conflito de tipos, resolvido com Z"
```

### 5.4 Subtarefa Completa
```bash
# Avançar para próxima subtarefa
task-master set-status --id=<id>.<subid> --status=done
task-master show <id>.<subid+1>
```

**Regras:**
- Uma subtarefa por vez
- Lint rodar após cada mudança
- Commit incrementais com mensagens descritivas
- Logar decisões técnicas no Task Master
- Nunca começar outra tarefa sem a minha permissão.

---

## Passo 6: Testes com Cobertura

Criar e rodar testes garantindo cobertura mínima de 80%.

```bash
# Rodar todos os testes
npm run test

# Rodar com cobertura
npm run test:coverage

# Rodar testes específicos
npm run test -- --grep "nome do teste"
```

**Meta de Cobertura:**
| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Lines | ≥ 80% | ≥ 90% |
| Branches | ≥ 80% | ≥ 85% |
| Functions | ≥ 80% | ≥ 90% |
| Statements | ≥ 80% | ≥ 90% |

**Estratégia de Testes (por tipo de tarefa):**

| Tipo | Abordagem | Exemplo |
|------|-----------|---------|
| Componente UI | Render + interação | `render(<Button />)` + `fireEvent.click()` |
| API Route | Request/Response | `GET /api/routines` retorna 200 |
| Hook | Render hook | `renderHook(useCounter)` |
| Utilitário | Input/Output puro | `formatTime(1500)` → `"25:00"` |
| Integração | Fluxo completo | Login → Redirect → Dashboard |

**Criar testes:**
```bash
# Criar arquivo de teste na pasta de testes
# Exemplo: src/__tests__/button.test.tsx
```

**Validação:**
- [ ] Todos os testes passando
- [ ] Cobertura ≥ 80% em todas as métricas
- [ ] Testes cobrem casos principais e edge cases
- [ ] Testes são independentes (não dependem de ordem)

---

## Passo 7: Commit, Push e PR

Finalizar com commits limpos e Pull Request descritivo.

### 7.1 Commit (Conventional Commits)

```bash
# Adicionar arquivos
git add .

# ou adicionar específicos
git add src/components/button.tsx src/components/__tests__/button.test.tsx

# Commit com mensagem convencional
git commit -m "feat(task-<id>): <descrição curta>"

# Exemplo:
git commit -m "feat(task-1): initialize next.js project with typescript

- Create Next.js 15 app with App Router
- Configure TypeScript strict mode
- Set up base directory structure
- Add ESLint and Prettier configuration

Task: 1"
```

**Formato de mensagem:**
```
<tipo>(task-<id>): <descrição curta>

<lista de mudanças>

Task: <id> | Refs: <refs adicionais>
```

**Tipos permitidos:**
| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `test` | Adição/correção de testes |
| `chore` | Manutenção, dependências, config |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudar comportamento |
| `style` | Formatação (não muda lógica) |
| `perf` | Melhoria de performance |

### 7.2 Push

```bash
# Push da branch
git push -u origin feature/task-<id>-<slug>
```

### 7.3 Pull Request

```bash
# Criar PR via CLI
gh pr create \
  --title "Task <id>: <título da tarefa>" \
  --body "## Resumo
Implementa a tarefa <id> do Task Master.

## Mudanças
- <lista de mudanças principais>

## Testes
- [ ] Testes unitários criados/passando
- [ ] Cobertura ≥ 80%
- [ ] Lint sem erros
- [ ] Build compilando

## Tarefa
Task Master ID: <id>
Closes: <link para issue se houver>"

# Ou abrir PR no navegador
gh pr create --web
```

**Checklist do PR:**
- [ ] Título claro e descritivo
- [ ] Body com resumo das mudanças
- [ ] Testes documentados
- [ ] Branch seguindo convenção de nomes
- [ ] Commits limpos (squash se necessário)

---

## Passo 8: Memória (Placeholder)

Registrar aprendizados, decisões técnicas e contexto para sessões futuras.

**O que registrar:**
- Decisões de arquitetura e por quê
- Problemas encontrados e soluções
- Padrões adotados no projeto
- Configurações importantes
```

**Alternativa atual - Arquivos markdown:**
```bash
# Criar memória automaticamente em /memories
echo "# Task <id> - <título>
## Decisões
## Erros e soluções
## Arquitetura e libs modificadas e por que" > /memories/task-<id>.md
```

---

## Comandos Rápidos

### Workflow Completo
```bash
# Via OpenCode
/dev-workflow

# Via Claude Code
/dev-workflow
```

### Comandos Isolados

| Comando | Descrição |
|---------|-----------|
| `/dev-qa` | Rodar lint + typecheck + build |
| `/dev-ship` | Commit + push + PR |
| `/tm-next` | Próxima tarefa Task Master |
| `/tm-done <id>` | Marcar tarefa como concluída |

---

## Referência Rápida

### Task Master
```bash
task-master next                           # Próxima tarefa
task-master show <id>                      # Detalhes da tarefa
task-master set-status --id=<id> --status=in-progress   # Iniciar
task-master set-status --id=<id> --status=done          # Concluir
task-master update-subtask --id=<id>.<subid> --prompt="..."  # Log
```

### Git
```bash
git status                                 # Ver alterações
git checkout -b feature/task-<id>-<slug>   # Criar branch
git add .                                  # Stage tudo
git commit -m "feat(task-<id>): ..."       # Commit
git push -u origin <branch>                # Push
gh pr create --web                         # Criar PR
```

### Quality
```bash
npm run lint                               # ESLint
npm run lint -- --fix                      # Auto-fix
npm run typecheck                          # TypeScript
npm run build                              # Build
npm run test                               # Testes
npm run test:coverage                      # Cobertura
```
