---
title: Task 1 - Initialize Next.js Project
type: report
permalink: pomodoros-focus/memories/task-1-initialize-next.js-project
tags:
- task-1
- setup
- nextjs
- tailwind
- shadcn
- vitest
---

# Task 1 - Initialize Next.js Project

## Decisões

- **`create-next-app` não aceita diretório com espaços/maiúsculas** — projeto criado em `/tmp/pomodoro-focus` e copiado via `rsync` para o diretório real.
- **shadcn/ui** inicializado com preset **Nova** (Lucide + Geist). Flag `--base-color` não existe na versão atual — usar `-b radix`.
- **Tailwind v4** não usa `tailwind.config.ts`. Tema customizado vai em `app/globals.css` via `@theme inline {}`.
- **Tema roxo futurista** definido com variáveis oklch para integrar com shadcn e uma utility class `bg-futuristic-fallback` com gradientes radiais.
- **`.gitignore` sobrescrito pelo rsync** — entradas de `.claude/`, `.opencode/`, `.taskmaster/`, `.mcp.json` precisaram ser restauradas manualmente.
- `npm install --legacy-peer-deps` necessário por conflito entre `@testing-library/react` e React 19.

## Erros e Soluções

| Erro | Solução |
|------|---------|
| `create-next-app` falha com espaços no nome | Criar em `/tmp` e copiar com rsync |
| `--base-color` inválido no shadcn init | Usar `-b radix` |
| Peer deps conflict Testing Library + React 19 | `--legacy-peer-deps` |
| `@vitest/coverage-v8` ausente | Instalar separado com `--legacy-peer-deps` |
| `.gitignore` perdeu entradas de config | Restaurar manualmente após rsync |

## Arquitetura e libs modificadas

- `app/globals.css` — Tailwind v4 + paleta purple + variáveis shadcn sobrescritas com tema escuro oklch
- `app/layout.tsx` — Geist Sans/Mono + Abril Fatface via `next/font/google`, `lang="pt-BR"`, viewport com `themeColor`
- `eslint.config.mjs` — adicionado `eslint-config-prettier` para evitar conflito com Prettier
- `package.json` — scripts: `typecheck`, `format`, `format:check`, `test`, `test:watch`, `test:coverage`
- `vitest.config.ts` — jsdom, globals, setupFiles, coverage thresholds ≥ 80%, alias `@/*`
- `components/ui/` — Button, Input, Card, Dialog, Label (shadcn)
- `lib/utils.ts` — `cn()` utility gerada pelo shadcn

## Stack fixada

- Next.js 16.2.9, React 19.2.4, TypeScript 5 (strict)
- Tailwind CSS v4 + tw-animate-css + shadcn/tailwind.css
- shadcn/ui radix base, preset Nova
- Vitest 4 + @vitejs/plugin-react + jsdom + Testing Library
- Fontes: Geist Sans/Mono + Abril Fatface
