import type {
  BlockSnapshot,
  Session,
  SessionConfig,
  SessionState,
} from "@/lib/types/session";
import type { RoutineWithBlocks } from "@/lib/types/routine";
import { createSessionSnapshot } from "./snapshot";
import { blockDurationMs } from "./time";

/**
 * Builds an immutable session snapshot from a persisted routine. DB blocks
 * store a single `durationMinutes`, so we split it back into hours + minutes to
 * match the {@link BlockSnapshot} shape. Blocks are ordered by `position`.
 */
export function buildRoutineSnapshot(
  routine: RoutineWithBlocks,
): readonly BlockSnapshot[] {
  const blocks = [...routine.blocks]
    .sort((a, b) => a.position - b.position)
    .map((block) => ({
      id: block.id,
      type: block.type,
      title: block.title,
      hours: Math.floor(block.durationMinutes / 60),
      minutes: block.durationMinutes % 60,
      background: block.background ?? "gradient-purple",
      position: block.position,
    }));
  return createSessionSnapshot({ id: routine.id, blocks });
}

/** Total duration of a snapshot in whole minutes. */
export function snapshotTotalMinutes(
  snapshot: readonly BlockSnapshot[],
): number {
  return snapshot.reduce((sum, block) => sum + block.hours * 60 + block.minutes, 0);
}

/** Human-readable total duration: "1h 30m", "2h", "45m" (section 10.7.1). */
export function formatTotalDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

// A session counts as "active" (would be discarded on replacement) whenever it
// has moved past preparation and is not finished. Freshly-prepared idle
// sessions and completed sessions never block a new start (section 10.8.2).
const ACTIVE_STATES: readonly SessionState[] = [
  "countdown",
  "running",
  "paused",
  "transitioning",
  "waiting",
];

export function isSessionActive(session: Session | null): session is Session {
  return session !== null && ACTIVE_STATES.includes(session.state);
}

/**
 * Creates a `running` session that starts at `now`. The first block's
 * `expectedEndTime` is timestamp-based (never counter-based) per the timer
 * architecture, so a reload can always recompute the remaining time.
 */
export function createRunningSession(
  snapshot: readonly BlockSnapshot[],
  config: SessionConfig,
  now: number = Date.now(),
): Session {
  const first = snapshot[0];
  if (!first) {
    throw new Error("Cannot start a session with an empty snapshot");
  }
  const duration = blockDurationMs(first.hours, first.minutes);
  return {
    snapshot,
    currentBlockIndex: 0,
    state: "running",
    timeRemaining: duration,
    expectedEndTime: now + duration,
    startedAt: now,
    isPaused: false,
    config,
    schemaVersion: 1,
  };
}
