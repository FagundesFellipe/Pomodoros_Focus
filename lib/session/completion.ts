import type { Session, SessionState, SessionUpdate } from "@/lib/types/session";
import { canTransition } from "./state-machine";
import { blockDurationMs, calculateExpectedEndTime, getCurrentTimestamp } from "./time";

export interface BlockCompletionResult {
  update: SessionUpdate;
  isSessionComplete: boolean;
}

export function handleBlockCompletion(
  session: Session,
  isManual: boolean
): BlockCompletionResult {
  const { snapshot, currentBlockIndex, config } = session;
  const isLastBlock = currentBlockIndex >= snapshot.length - 1;

  if (isLastBlock) {
    return {
      update: {
        state: "completed" as SessionState,
        timeRemaining: 0,
        isPaused: false,
      },
      isSessionComplete: true,
    };
  }

  const nextIndex = currentBlockIndex + 1;
  const nextBlock = snapshot[nextIndex];
  const now = getCurrentTimestamp();
  const nextDuration = blockDurationMs(nextBlock.hours, nextBlock.minutes);
  const nextExpectedEnd = calculateExpectedEndTime(now, nextDuration);

  // Manual completion always advances immediately
  // Natural completion respects autoAdvance setting
  let nextState: SessionState;
  if (isManual || config.autoAdvance) {
    nextState = isManual ? "running" : "transitioning";
  } else {
    nextState = "waiting";
  }

  // Validate transition
  if (!canTransition(session.state, nextState)) {
    nextState = "running";
  }

  return {
    update: {
      state: nextState,
      currentBlockIndex: nextIndex,
      timeRemaining: nextDuration,
      expectedEndTime: nextExpectedEnd,
      isPaused: false,
      pausedAt: undefined,
    },
    isSessionComplete: false,
  };
}
