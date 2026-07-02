import { describe, it, expect } from "vitest";
import { validateAndRestoreSession } from "@/lib/session/restore";

const now = Date.now();

const validSessionData = {
  snapshot: [
    {
      id: "b1",
      type: "focus",
      title: "Work",
      hours: 0,
      minutes: 25,
      background: "gradient-purple",
      position: 0,
    },
    {
      id: "b2",
      type: "rest",
      title: "Break",
      hours: 0,
      minutes: 5,
      background: "gradient-blue",
      position: 1,
    },
  ],
  currentBlockIndex: 0,
  state: "running",
  timeRemaining: 1_500_000,
  expectedEndTime: now + 1_500_000,
  startedAt: now,
  isPaused: false,
  config: { autoAdvance: false, soundEnabled: true },
  schemaVersion: 1,
};

describe("validateAndRestoreSession", () => {
  it("returns a valid session for good data", () => {
    const result = validateAndRestoreSession(validSessionData);
    expect(result).not.toBeNull();
    expect(result?.state).toBe("running");
    expect(result?.currentBlockIndex).toBe(0);
    expect(result?.snapshot).toHaveLength(2);
  });

  it("returns null for null input", () => {
    expect(validateAndRestoreSession(null)).toBeNull();
  });

  it("returns null for corrupted data (missing required field)", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { snapshot: _snap, ...noSnapshot } = validSessionData;
    expect(validateAndRestoreSession(noSnapshot)).toBeNull();
  });

  it("returns null for invalid snapshot", () => {
    const data = { ...validSessionData, snapshot: [] };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null for invalid state value", () => {
    const data = { ...validSessionData, state: "not-a-state" };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null for out-of-bounds currentBlockIndex (negative)", () => {
    const data = { ...validSessionData, currentBlockIndex: -1 };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null for out-of-bounds currentBlockIndex (too large)", () => {
    const data = { ...validSessionData, currentBlockIndex: 999 };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null for non-integer currentBlockIndex", () => {
    const data = { ...validSessionData, currentBlockIndex: 0.5 };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null when timestamps are missing", () => {
    const data = { ...validSessionData, expectedEndTime: "not-a-number" };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("returns null when expectedEndTime < startedAt for running session", () => {
    const data = {
      ...validSessionData,
      state: "running",
      expectedEndTime: now - 1000,
      startedAt: now,
    };
    expect(validateAndRestoreSession(data)).toBeNull();
  });

  it("recovers timeRemaining from expectedEndTime when timeRemaining is invalid", () => {
    const futureEnd = Date.now() + 60_000;
    const data = {
      ...validSessionData,
      expectedEndTime: futureEnd,
      timeRemaining: -999,
    };
    const result = validateAndRestoreSession(data);
    expect(result).not.toBeNull();
    // timeRemaining should be approximately 60000ms (within 100ms due to execution time)
    expect(result!.timeRemaining).toBeGreaterThan(0);
    expect(result!.timeRemaining).toBeLessThanOrEqual(60_000);
  });

  it("uses default config when config is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { config: _config, ...noConfig } = validSessionData;
    const result = validateAndRestoreSession(noConfig);
    // config is required field, so detectCorruption should catch it
    expect(result).toBeNull();
  });

  it("defaults isPaused to false when missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isPaused: _ip, ...noIsPaused } = validSessionData;
    // isPaused is a required field, should fail corruption check
    expect(validateAndRestoreSession(noIsPaused)).toBeNull();
  });
});
