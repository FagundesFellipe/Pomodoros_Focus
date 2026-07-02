import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveSession, loadSession, clearSession, detectCorruption } from "@/lib/session/storage";
import type { Session } from "@/lib/types/session";

const mockStorage: Record<string, string> = {};

vi.stubGlobal("localStorage", {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
});

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  snapshot: Object.freeze([
    Object.freeze({
      id: "b1",
      type: "focus" as const,
      title: "Work",
      hours: 0,
      minutes: 25,
      background: "gradient-purple",
      position: 0,
    }),
  ]),
  currentBlockIndex: 0,
  state: "running",
  timeRemaining: 1_500_000,
  expectedEndTime: Date.now() + 1_500_000,
  startedAt: Date.now(),
  isPaused: false,
  config: { autoAdvance: false, soundEnabled: true },
  schemaVersion: 1,
  ...overrides,
});

describe("saveSession / loadSession", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it("saves and loads a session correctly", () => {
    const session = makeSession();
    saveSession(session);
    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.state).toBe("running");
    expect(loaded?.currentBlockIndex).toBe(0);
  });

  it("returns null when no session is stored", () => {
    expect(loadSession()).toBeNull();
  });

  it("returns null for wrong schema version", () => {
    const session = makeSession({ schemaVersion: 999 });
    // Manually store with wrong version
    mockStorage["pomodoro-session"] = JSON.stringify({
      ...session,
      schemaVersion: 999,
    });
    expect(loadSession()).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    mockStorage["pomodoro-session"] = "not-valid-json{{{";
    expect(loadSession()).toBeNull();
  });

  it("returns null for non-object JSON", () => {
    mockStorage["pomodoro-session"] = JSON.stringify(42);
    expect(loadSession()).toBeNull();
  });
});

describe("clearSession", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it("removes session from storage", () => {
    const session = makeSession();
    saveSession(session);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it("does not throw when nothing to clear", () => {
    expect(() => clearSession()).not.toThrow();
  });
});

describe("detectCorruption", () => {
  it("returns false for a valid session object", () => {
    const session = makeSession();
    expect(detectCorruption(session)).toBe(false);
  });

  it("returns true for null", () => {
    expect(detectCorruption(null)).toBe(true);
  });

  it("returns true for non-object", () => {
    expect(detectCorruption("string")).toBe(true);
    expect(detectCorruption(42)).toBe(true);
    expect(detectCorruption(undefined)).toBe(true);
  });

  it("returns true when a required field is missing", () => {
    const session = makeSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { snapshot: _snap, ...withoutSnapshot } = session;
    expect(detectCorruption(withoutSnapshot)).toBe(true);
  });

  it("returns true when config is missing", () => {
    const session = makeSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { config: _config, ...withoutConfig } = session;
    expect(detectCorruption(withoutConfig)).toBe(true);
  });

  it("returns false even if optional field pausedAt is missing", () => {
    const session = makeSession();
    expect(detectCorruption(session)).toBe(false);
  });
});
