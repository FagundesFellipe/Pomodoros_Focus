import type { Session, SessionState } from "@/lib/types/session";
import { detectCorruption } from "./storage";
import { isSnapshotValid } from "./snapshot";
import { calculateTimeRemaining } from "./time";

const VALID_STATES: SessionState[] = [
  "idle",
  "countdown",
  "running",
  "paused",
  "transitioning",
  "waiting",
  "completed",
];

export function validateAndRestoreSession(sessionData: unknown): Session | null {
  if (detectCorruption(sessionData)) {
    console.warn("Session data is corrupted, discarding");
    return null;
  }

  const data = sessionData as Record<string, unknown>;

  // Validate snapshot
  if (!isSnapshotValid(data.snapshot)) {
    console.warn("Invalid snapshot in session data");
    return null;
  }

  // Validate currentBlockIndex
  const currentBlockIndex = data.currentBlockIndex;
  if (
    typeof currentBlockIndex !== "number" ||
    !Number.isInteger(currentBlockIndex) ||
    currentBlockIndex < 0 ||
    currentBlockIndex >= (data.snapshot as unknown[]).length
  ) {
    console.warn("Invalid currentBlockIndex in session data");
    return null;
  }

  // Validate state
  const state = data.state as string;
  if (!VALID_STATES.includes(state as SessionState)) {
    console.warn("Invalid session state:", state);
    return null;
  }

  // Validate timestamps
  const expectedEndTime = data.expectedEndTime;
  const startedAt = data.startedAt;
  if (typeof expectedEndTime !== "number" || typeof startedAt !== "number") {
    console.warn("Invalid timestamps in session data");
    return null;
  }
  if (expectedEndTime < startedAt && state === "running") {
    console.warn("expectedEndTime is before startedAt for running session");
    return null;
  }

  // Attempt to recover timeRemaining from expectedEndTime if invalid
  let timeRemaining = data.timeRemaining;
  if (typeof timeRemaining !== "number" || timeRemaining < 0) {
    timeRemaining = calculateTimeRemaining(expectedEndTime);
  }

  const session: Session = {
    snapshot: data.snapshot as Session["snapshot"],
    currentBlockIndex,
    state: state as SessionState,
    timeRemaining: timeRemaining as number,
    expectedEndTime,
    startedAt,
    isPaused: typeof data.isPaused === "boolean" ? data.isPaused : false,
    pausedAt: typeof data.pausedAt === "number" ? data.pausedAt : undefined,
    config: (data.config as Session["config"]) ?? { autoAdvance: false, soundEnabled: true },
    schemaVersion: typeof data.schemaVersion === "number" ? data.schemaVersion : 1,
  };

  return session;
}
