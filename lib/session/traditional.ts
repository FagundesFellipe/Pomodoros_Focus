import type { BlockSnapshot, Session, SessionConfig } from "@/lib/types/session";
import { createSessionSnapshot } from "./snapshot";

export interface TraditionalBlockOptions {
  focusDurationMinutes: number; // e.g., 25
  restDurationMinutes: number; // e.g., 5
  cycles: number; // e.g., 4 (generates 4 focus + 4 rest = 8 blocks)
}

export interface TraditionalSessionOptions extends TraditionalBlockOptions {
  config: SessionConfig;
}

const MAX_CYCLES = 25;
const MAX_DURATION_MINUTES = 720; // 12 hours

function assertTraditionalOptions(options: TraditionalBlockOptions): void {
  const { focusDurationMinutes, restDurationMinutes, cycles } = options;
  if (cycles < 1 || cycles > MAX_CYCLES) {
    throw new Error("Cycles must be between 1 and 25 (max 50 blocks)");
  }
  if (focusDurationMinutes < 1 || focusDurationMinutes > MAX_DURATION_MINUTES) {
    throw new Error("Focus duration must be between 1 and 720 minutes");
  }
  if (restDurationMinutes < 1 || restDurationMinutes > MAX_DURATION_MINUTES) {
    throw new Error("Rest duration must be between 1 and 720 minutes");
  }
}

/**
 * Generates an alternating Focus/Rest block sequence for Traditional Mode
 * (section 10.6.6). Blocks carry stable `traditional-<index>` ids so the
 * snapshot is deterministic. Throws if durations/cycles violate block rules.
 */
export function generateTraditionalBlocks(options: TraditionalBlockOptions): BlockSnapshot[] {
  assertTraditionalOptions(options);
  const { focusDurationMinutes, restDurationMinutes, cycles } = options;

  const blocks: BlockSnapshot[] = [];
  for (let i = 0; i < cycles; i++) {
    blocks.push({
      id: `traditional-${i * 2}`,
      type: "focus",
      title: `Focus ${i + 1}`,
      hours: Math.floor(focusDurationMinutes / 60),
      minutes: focusDurationMinutes % 60,
      background: "gradient-purple",
      position: i * 2,
    });
    blocks.push({
      id: `traditional-${i * 2 + 1}`,
      type: "rest",
      title: `Rest ${i + 1}`,
      hours: Math.floor(restDurationMinutes / 60),
      minutes: restDurationMinutes % 60,
      background: "gradient-blue",
      position: i * 2 + 1,
    });
  }
  return blocks;
}

export function createTraditionalSession(options: TraditionalSessionOptions): Session {
  const { config, ...blockOptions } = options;

  const blocksWithId = generateTraditionalBlocks(blockOptions);
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
