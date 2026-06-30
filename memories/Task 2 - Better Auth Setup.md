---
title: Task 2 - Better Auth Setup
type: report
permalink: pomodoros-focus/pomodoro-focus/task-2-better-auth-setup
tags:
- task-2
- auth
- better-auth
- next-js
- oauth
---

# Task 2 - Better Auth Setup

## Decisões

- **better-auth** escolhido conforme PRD; versão atual (2026) usa `socialProviders` em vez de `providers`
- **Drizzle + libSQL** instalados junto com auth pois Better Auth exige adaptador de banco — não é opcional
- **proxy.ts** em vez de **middleware.ts**: Next.js 16 deprecou `middleware`, o novo arquivo é `proxy.ts` com export `proxy` (não `middleware`). Edge runtime NÃO é suportado no proxy.
- **BETTER_AUTH_URL** obrigatório no `.env` — sem ele o Better Auth deriva a URL do request e callbacks/redirects podem falhar em produção
- `.env.example` precisa de exceção explícita `!.env.example` no `.gitignore` pois o padrão `.env*` o capturaria

## Arquitetura criada

| Arquivo | Papel |
|---------|-------|
| `lib/db.ts` | Conexão Turso via `@libsql/client` + Drizzle ORM |
| `lib/auth.ts` | Instância Better Auth (server-side), exporta `auth` e `Session` |
| `lib/auth-client.ts` | `createAuthClient` (client-side), exporta `useSession`, `signIn`, `signOut` |
| `app/api/auth/[...all]/route.ts` | Handler HTTP via `toNextJsHandler(auth)` |
| `proxy.ts` | Proteção de rotas: redireciona não-autenticados para `/login` |
| `app/login/page.tsx` | UI de login com Google + GitHub |
| `components/auth/logout-button.tsx` | Logout com warning de sessão ativa (CA-001) |
| `lib/auth-utils.ts` | Utilitários server: `getServerSession`, `getCurrentUser`, `requireAuth` |

## Erros e soluções

- **Lint warning `coverage/lcov-report`**: adicionado `coverage/**` ao `globalIgnores` do `eslint.config.mjs`
- **Pre-commit hook sem `.pre-commit-config.yaml`**: arquivo estava apenas em `feature/task-1-init-nextjs`; necessário fazer checkout do arquivo para o branch atual via `git checkout <branch> -- .pre-commit-config.yaml`
- **Cobertura abaixo de 80%**: `requireAuth` não testado inicialmente; adicionado mock de `next/navigation` com `vi.mock` + 2 casos de teste → cobertura subiu para 100%
- **`middleware` deprecated warning no build**: renomear arquivo e export function de `middleware` → `proxy`

## Variáveis de ambiente obrigatórias

```
TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
AUTH_SECRET          # openssl rand -base64 32
BETTER_AUTH_URL      # URL base do app (ex: https://dominio.vercel.app)
NEXT_PUBLIC_APP_URL  # mesma URL, exposta ao cliente
```

## Próximos passos (dependem desta tarefa)

- Configurar OAuth apps reais no Google Cloud Console e GitHub Developer Settings
- Preencher `.env.local` com credenciais reais
- Rodar `npx better-auth generate` para criar schema de tabelas no Turso
