import type { BlockSnapshot, Session, SessionConfig } from "@/lib/types/session";
import { createSessionSnapshot } from "./snapshot";

export interface TraditionalSessionOptions {
  focusDurationMinutes: number; // e.g., 25
  restDurationMinutes: number; // e.g., 5
  cycles: number; // e.g., 4 (generates 4 focus + 4 rest = 8 blocks)
  config: SessionConfig;
}

export function createTraditionalSession(options: TraditionalSessionOptions): Session {
  const { focusDurationMinutes, restDurationMinutes, cycles, config } = options;

  if (cycles < 1 || cycles > 25) {
    throw new Error("Cycles must be between 1 and 25 (max 50 blocks)");
  }
  if (focusDurationMinutes < 1 || focusDurationMinutes > 720) {
    throw new Error("Focus duration must be between 1 and 720 minutes");
  }
  if (restDurationMinutes < 1 || restDurationMinutes > 720) {
    throw new Error("Rest duration must be between 1 and 720 minutes");
  }

  const blocks: Omit<BlockSnapshot, "id">[] = [];
  for (let i = 0; i < cycles; i++) {
    blocks.push({
      type: "focus",
      title: `Focus ${i + 1}`,
      hours: Math.floor(focusDurationMinutes / 60),
      minutes: focusDurationMinutes % 60,
      background: "gradient-purple",
      position: i * 2,
    });
    blocks.push({
      type: "rest",
      title: `Rest ${i + 1}`,
      hours: Math.floor(restDurationMinutes / 60),
      minutes: restDurationMinutes % 60,
      background: "gradient-blue",
      position: i * 2 + 1,
    });
  }

  const blocksWithId = blocks.map((b, index) => ({ ...b, id: `traditional-${index}` }));
  const routineLike = { id: "traditional", blocks: blocksWithId };
  const snapshot = createSessionSnapshot(routineLike);

  const session: Session = {
    snapshot,
    currentBlockIndex: 0,
    state: "idle",
    timeRemaining: 0,
    expectedEndTime: 0,
    startedAt: 0,
    isPaused: false,
    config,
    schemaVersion: 1,
  };

  return session;
}
