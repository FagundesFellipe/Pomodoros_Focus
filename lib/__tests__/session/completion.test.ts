import { describe, it, expect } from "vitest";
import { handleBlockCompletion } from "@/lib/session/completion";
import type { Session } from "@/lib/types/session";

const makeBlock = (type: "focus" | "rest", hours = 0, minutes = 25, index = 0) =>
  Object.freeze({
    id: `b${index}`,
    type,
    title: type === "focus" ? "Work" : "Break",
    hours,
    minutes,
    background: "gradient-purple",
    position: index,
  });

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  snapshot: Object.freeze([makeBlock("focus", 0, 25, 0), makeBlock("rest", 0, 5, 1)]),
  currentBlockIndex: 0,
  state: "running",
  timeRemaining: 0,
  expectedEndTime: Date.now(),
  startedAt: Date.now() - 1500000,
  isPaused: false,
  config: { autoAdvance: false, soundEnabled: true },
  schemaVersion: 1,
  ...overrides,
});

describe("handleBlockCompletion", () => {
  it("returns isSessionComplete: true for the last block", () => {
    const session = makeSession({ currentBlockIndex: 1 }); // last block (index 1 of 2)
    const result = handleBlockCompletion(session, false);
    expect(result.isSessionComplete).toBe(true);
    expect(result.update.state).toBe("completed");
    expect(result.update.timeRemaining).toBe(0);
    expect(result.update.isPaused).toBe(false);
  });

  it("returns isSessionComplete: false for non-last block", () => {
    const session = makeSession({ currentBlockIndex: 0 });
    const result = handleBlockCompletion(session, false);
    expect(result.isSessionComplete).toBe(false);
  });

  it("non-last block with autoAdvance returns 'transitioning' state", () => {
    const session = makeSession({
      currentBlockIndex: 0,
      config: { autoAdvance: true, soundEnabled: true },
    });
    const result = handleBlockCompletion(session, false);
    expect(result.update.state).toBe("transitioning");
  });

  it("non-last block without autoAdvance returns 'waiting' state", () => {
    const session = makeSession({
      currentBlockIndex: 0,
      config: { autoAdvance: false, soundEnabled: true },
    });
    const result = handleBlockCompletion(session, false);
    expect(result.update.state).toBe("waiting");
  });

  it("manual completion returns 'running' state regardless of autoAdvance", () => {
    const sessionNoAuto = makeSession({
      currentBlockIndex: 0,
      config: { autoAdvance: false, soundEnabled: true },
    });
    const result = handleBlockCompletion(sessionNoAuto, true);
    expect(result.update.state).toBe("running");
  });

  it("manual completion with autoAdvance also returns 'running'", () => {
    const sessionWithAuto = makeSession({
      currentBlockIndex: 0,
      config: { autoAdvance: true, soundEnabled: true },
    });
    const result = handleBlockCompletion(sessionWithAuto, true);
    expect(result.update.state).toBe("running");
  });

  it("increments currentBlockIndex correctly", () => {
    const session = makeSession({ currentBlockIndex: 0 });
    const result = handleBlockCompletion(session, false);
    expect(result.update.currentBlockIndex).toBe(1);
  });

  it("calculates next block duration correctly", () => {
    const session = makeSession({ currentBlockIndex: 0 }); // next block is rest 5min
    const result = handleBlockCompletion(session, false);
    const expectedDuration = 5 * 60 * 1000;
    expect(result.update.timeRemaining).toBe(expectedDuration);
  });

  it("sets expectedEndTime in the future", () => {
    const now = Date.now();
    const session = makeSession({ currentBlockIndex: 0 });
    const result = handleBlockCompletion(session, false);
    expect(result.update.expectedEndTime).toBeGreaterThan(now);
  });

  it("resets isPaused to false", () => {
    const session = makeSession({ currentBlockIndex: 0, isPaused: true });
    const result = handleBlockCompletion(session, false);
    expect(result.update.isPaused).toBe(false);
  });
});
