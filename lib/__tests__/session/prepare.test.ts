import { describe, it, expect } from "vitest";
import {
  buildRoutineSnapshot,
  snapshotTotalMinutes,
  formatTotalDuration,
  isSessionActive,
  createRunningSession,
} from "@/lib/session/prepare";
import type { BlockSnapshot, Session, SessionState } from "@/lib/types/session";
import type { RoutineWithBlocks } from "@/lib/types/routine";

function makeSnapshot(
  blocks: Array<Partial<BlockSnapshot>>,
): readonly BlockSnapshot[] {
  return blocks.map((b, i) => ({
    id: b.id ?? `b-${i}`,
    type: b.type ?? "focus",
    title: b.title ?? `Block ${i + 1}`,
    hours: b.hours ?? 0,
    minutes: b.minutes ?? 25,
    background: b.background ?? "gradient-purple",
    position: b.position ?? i,
  }));
}

describe("buildRoutineSnapshot", () => {
  const routine: RoutineWithBlocks = {
    id: "r1",
    userId: "u1",
    name: "Deep Work",
    autoAdvance: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blocks: [
      {
        id: "blk-2",
        routineId: "r1",
        type: "rest",
        title: "Break",
        durationMinutes: 65, // 1h 5m
        position: 1,
        background: "gradient-blue",
        createdAt: new Date(),
      },
      {
        id: "blk-1",
        routineId: "r1",
        type: "focus",
        title: "Focus",
        durationMinutes: 25,
        position: 0,
        background: null,
        createdAt: new Date(),
      },
    ],
  };

  it("orders blocks by position and splits durationMinutes into h/m", () => {
    const snapshot = buildRoutineSnapshot(routine);
    expect(snapshot.map((b) => b.id)).toEqual(["blk-1", "blk-2"]);
    expect(snapshot[0]).toMatchObject({ type: "focus", hours: 0, minutes: 25 });
    expect(snapshot[1]).toMatchObject({ type: "rest", hours: 1, minutes: 5 });
  });

  it("falls back to a default background when block has none", () => {
    const snapshot = buildRoutineSnapshot(routine);
    expect(snapshot[0].background).toBe("gradient-purple");
    expect(snapshot[1].background).toBe("gradient-blue");
  });

  it("produces a frozen, immutable snapshot", () => {
    const snapshot = buildRoutineSnapshot(routine);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot[0])).toBe(true);
  });
});

describe("snapshotTotalMinutes", () => {
  it("sums hours and minutes across all blocks", () => {
    const snapshot = makeSnapshot([
      { hours: 1, minutes: 0 },
      { hours: 0, minutes: 25 },
      { hours: 2, minutes: 30 },
    ]);
    expect(snapshotTotalMinutes(snapshot)).toBe(60 + 25 + 150);
  });
});

describe("formatTotalDuration", () => {
  it("formats hours and minutes together", () => {
    expect(formatTotalDuration(90)).toBe("1h 30m");
  });
  it("formats whole hours without minutes", () => {
    expect(formatTotalDuration(120)).toBe("2h");
  });
  it("formats minutes only", () => {
    expect(formatTotalDuration(45)).toBe("45m");
  });
  it("formats zero as 0m", () => {
    expect(formatTotalDuration(0)).toBe("0m");
  });
});

describe("isSessionActive", () => {
  const base: Session = {
    snapshot: makeSnapshot([{ minutes: 25 }]),
    currentBlockIndex: 0,
    state: "idle",
    timeRemaining: 0,
    expectedEndTime: 0,
    startedAt: 0,
    isPaused: false,
    config: { autoAdvance: false, soundEnabled: true },
    schemaVersion: 1,
  };

  it("returns false for null", () => {
    expect(isSessionActive(null)).toBe(false);
  });

  it.each<SessionState>(["idle", "completed"])(
    "returns false for non-active state %s",
    (state) => {
      expect(isSessionActive({ ...base, state })).toBe(false);
    },
  );

  it.each<SessionState>([
    "countdown",
    "running",
    "paused",
    "transitioning",
    "waiting",
  ])("returns true for active state %s", (state) => {
    expect(isSessionActive({ ...base, state })).toBe(true);
  });
});

describe("createRunningSession", () => {
  const snapshot = makeSnapshot([
    { hours: 0, minutes: 25 },
    { hours: 0, minutes: 5 },
  ]);

  it("creates a running session anchored to expectedEndTime", () => {
    const now = 1_000_000;
    const session = createRunningSession(
      snapshot,
      { autoAdvance: true, soundEnabled: false },
      now,
    );
    const durationMs = 25 * 60 * 1000;
    expect(session.state).toBe("running");
    expect(session.currentBlockIndex).toBe(0);
    expect(session.startedAt).toBe(now);
    expect(session.expectedEndTime).toBe(now + durationMs);
    expect(session.timeRemaining).toBe(durationMs);
    expect(session.isPaused).toBe(false);
    expect(session.config).toEqual({ autoAdvance: true, soundEnabled: false });
    expect(session.schemaVersion).toBe(1);
  });

  it("throws on an empty snapshot", () => {
    expect(() =>
      createRunningSession([], { autoAdvance: false, soundEnabled: true }),
    ).toThrow(/empty snapshot/i);
  });
});
