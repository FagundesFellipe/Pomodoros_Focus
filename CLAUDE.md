# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

---

## Project Overview

**Pomodoros Focus** is a Next.js web app for focus management, built around the Pomodoro technique but with fully independent, configurable blocks per routine rather than fixed cycles. The PRD is at `docs/pomo_focus_prd.md`.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** React, Tailwind CSS, shadcn/ui, React Hook Form, Zod
- **Auth:** Better Auth (Google + GitHub OAuth)
- **Database:** Turso (libSQL remote) + Drizzle ORM
- **Session persistence:** `localStorage` + `BroadcastChannel`
- **Testing:** Vitest, Testing Library, Playwright
- **Hosting:** Vercel

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run lint -- --fix # Auto-fix lint errors
npm run typecheck    # TypeScript check
npm run format       # Prettier
npm run test         # Vitest (unit + component)
npm run test:coverage # Coverage report (target ≥ 80%)
```

Run a single test file:
```bash
npm run test -- path/to/file.test.ts
npm run test -- --grep "test name"
```

## Dev Workflow

See `docs/DEV_WORKFLOW.md` for the full 8-step workflow. Summary:

1. Sync `main`: `git pull origin main`
2. QA: lint + typecheck + build
3. Get next task: `task-master next`
4. Branch: `git checkout -b feature/task-<id>-<slug>`
5. Implement, logging progress via `task-master update-subtask`
6. Test: `npm run test:coverage` — must hit ≥ 80%
7. Ship: commit + push + PR (`/dev-ship`)
8. Update task status: `task-master set-status --id=<id> --status=done`

**Branch naming:** `feature/task-<id>-<slug>`, `fix/task-<id>-<slug>`, `chore/`, `test/`, `docs/`

**Commit format (Conventional Commits):**
```
feat(task-<id>): short description

- Change 1
- Change 2

Task: <id>
```

## Core Domain Concepts

Understanding these is essential before touching timer or session logic:

- **Block** — atomic unit with: type (`focus`|`rest`), title, duration (hours + minutes, min 1m, max 12h), position, background. No inheritance between blocks.
- **Routine** — saved ordered sequence of up to 50 blocks. Max 5 routines per user.
- **Session** — active execution of a routine or Traditional Mode. Only one session active per browser at a time.
- **Snapshot** — immutable copy of a routine created when a session starts. Editing the original routine never affects an in-progress session.
- **Traditional Mode** — generates a temporary block sequence from `focusDuration × N cycles + restDuration × N cycles` without saving a routine.

## Timer Architecture

The timer is timestamp-based, not counter-based:

```
remainingTime = expectedEndTime - Date.now()
```

**Never use `setInterval` as a source of truth.** Visual updates tick every second but recalculate from `expectedEndTime`.

**Session states:**
```
idle → countdown (3s) → running ⇄ paused
running → transitioning → running  (auto-advance on)
running → waiting → running        (auto-advance off)
running|paused → completed         (last block done)
```

**On page reload (F5):** Restore from `localStorage`, recalculate remaining time using `expectedEndTime`. If `expectedEndTime` already passed: conclude only the active block, then start the next block from the moment of return (full duration). Never skip multiple blocks.

**Multi-tab sync:** Use `BroadcastChannel`. On any state change, persist to `localStorage` and broadcast. Other tabs re-read state from storage. Transitions must be idempotent to avoid double-processing.

## Business Rules

Critical constraints — the backend must enforce these, not just the UI:

| Rule | Value |
|------|-------|
| Max routines per user | 5 |
| Max blocks per routine | 50 |
| Block min duration | 1 minute |
| Block max duration | 12 hours |
| Active sessions per browser | 1 |
| Block types | `focus`, `rest` |

- Duration is hours + minutes only (no seconds)
- Block order is free — foco/descanso can appear in any sequence
- "Skip & advance" and "complete early" are the same action (no distinction in MVP)

## Key UX Constraints

- Timer screen has no "End session" button — replacement only when starting a new session
- Selecting a routine does NOT start the timer — a preparation screen always shows first
- 3-second countdown before first block starts
- Editing a routine during an active session: allowed, but the session snapshot is untouched
- Sound only on natural block end (not on pause, skip, or manual advance)
- Background change per block; fallback is CSS-only purple futuristic gradient (no external image)

## Security

- All routes that read/write routines require authentication
- Validate routine ownership server-side (never trust frontend-provided IDs alone)
- Better Auth manages sessions via secure cookies
- Validate all input sizes server-side (name ≤ 80 chars, block title ≤ 100 chars, max blocks, max routines)
