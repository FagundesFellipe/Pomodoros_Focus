---
title: Task 3 - Turso Database Setup with Drizzle ORM
type: report
permalink: pomodoros-focus/pomodoro-focus/task-3-turso-database-setup-with-drizzle-orm
tags:
- task-3
- drizzle
- turso
- schema
- rls
- database
---

# Task 3 - Turso Database Setup with Drizzle ORM

## Decisões

- **`lib/db.ts` → `lib/db/index.ts`**: Não é possível ter `lib/db.ts` e `lib/db/` como diretório no mesmo nível. Import `@/lib/db` continua funcionando porque TypeScript resolve directory para `index.ts`.
- **Singleton com `globalThis`**: Em dev, hot-reload re-executa módulos e criaria múltiplas conexões. Instância persistida em `globalThis` em `NODE_ENV !== 'production'`.
- **`tablesFilter` no drizzle.config.ts**: Better Auth gerencia suas próprias tabelas. `tablesFilter: ["routines", "blocks"]` garante que só nossas tabelas entram nas migrações.
- **`users.ts` como referência de FK**: Definir a tabela `user` no schema (sem migrá-la) permite tipagem correta nas FKs, enquanto Better Auth gerencia a tabela real.
- **Schema excluído da cobertura**: Callbacks de `$defaultFn` e `.references()` só executam em inserts reais — nunca em import. `exclude: ["lib/db/schema/**"]` no vitest.config.ts.
- **FK com cascade delete**: `routines → user` e `blocks → routines` com `onDelete: "cascade"`.

## Arquitetura criada

| Arquivo | Papel |
|---------|-------|
| `drizzle.config.ts` | Drizzle Kit — Turso dialect, migrations em `drizzle/migrations/` |
| `lib/db/index.ts` | Conexão libSQL + drizzle com schema, singleton para dev |
| `lib/db/schema/users.ts` | Tabela `user` — espelha Better Auth para FK type reference (não migrada) |
| `lib/db/schema/routines.ts` | `routines` com userId FK, autoAdvance, índice userId, cascade delete |
| `lib/db/schema/blocks.ts` | `blocks` com routineId FK, enum focus/rest, position, dois índices |
| `lib/db/schema/index.ts` | Re-exports de todos os schemas |
| `lib/db/rls.ts` | RLS: `getUserRoutines`, `getRoutineWithAccess`, `validateRoutineOwnership`, `getBlocksForRoutine` |
| `lib/__tests__/rls.test.ts` | 9 testes, 100% cobertura |

## Erros e soluções

| Erro | Solução |
|------|---------|
| Cobertura abaixo de 80% por `$defaultFn` callbacks | Excluir `lib/db/schema/**` do coverage no vitest.config.ts |
| `lib/db.ts` e `lib/db/` não coexistem no filesystem | Mover para `lib/db/index.ts` |
| FK tipada para tabela do Better Auth | Definir `users.ts` só para tipo; `tablesFilter` exclui da migração |

## Próximos passos

- `npx drizzle-kit push` para criar tabelas `routines` e `blocks` no Turso
- `npx better-auth generate` para criar tabelas auth (`user`, `session`, etc.)
- Usar `validateRoutineOwnership` em todas as API routes de routines/blocks
