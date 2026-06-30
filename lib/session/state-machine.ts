import type { SessionState } from "@/lib/types/session";

const VALID_TRANSITIONS: Record<SessionState, SessionState[]> = {
  idle: ["countdown"],
  countdown: ["running"],
  running: ["paused", "transitioning", "waiting", "completed"],
  paused: ["running"],
  transitioning: ["running"],
  waiting: ["running"],
  completed: [],
};

export function canTransition(from: SessionState, to: SessionState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function transitionState(current: SessionState, next: SessionState): SessionState {
  if (!canTransition(current, next)) {
    throw new Error(`Invalid state transition: ${current} → ${next}`);
  }
  return next;
}

export function getValidNextStates(current: SessionState): SessionState[] {
  return [...VALID_TRANSITIONS[current]];
}
