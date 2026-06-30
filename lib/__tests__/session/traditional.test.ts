import { describe, it, expect } from "vitest";
import { createTraditionalSession } from "@/lib/session/traditional";
import type { SessionConfig } from "@/lib/types/session";

const defaultConfig: SessionConfig = { autoAdvance: false, soundEnabled: true };

describe("createTraditionalSession", () => {
  it("creates correct number of blocks (cycles * 2)", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 4,
      config: defaultConfig,
    });
    expect(session.snapshot).toHaveLength(8);
  });

  it("alternates Focus/Rest blocks", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 3,
      config: defaultConfig,
    });
    const types = session.snapshot.map((b) => b.type);
    expect(types).toEqual(["focus", "rest", "focus", "rest", "focus", "rest"]);
  });

  it("has sequential titles 'Focus 1', 'Rest 1', 'Focus 2', etc.", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 2,
      config: defaultConfig,
    });
    const titles = session.snapshot.map((b) => b.title);
    expect(titles).toEqual(["Focus 1", "Rest 1", "Focus 2", "Rest 2"]);
  });

  it("initial session state is 'idle'", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 1,
      config: defaultConfig,
    });
    expect(session.state).toBe("idle");
  });

  it("starts at block index 0", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 1,
      config: defaultConfig,
    });
    expect(session.currentBlockIndex).toBe(0);
  });

  it("throws error for > 25 cycles", () => {
    expect(() =>
      createTraditionalSession({
        focusDurationMinutes: 25,
        restDurationMinutes: 5,
        cycles: 26,
        config: defaultConfig,
      })
    ).toThrow("Cycles must be between 1 and 25");
  });

  it("throws error for 0 cycles", () => {
    expect(() =>
      createTraditionalSession({
        focusDurationMinutes: 25,
        restDurationMinutes: 5,
        cycles: 0,
        config: defaultConfig,
      })
    ).toThrow("Cycles must be between 1 and 25");
  });

  it("throws error for focus duration < 1 minute", () => {
    expect(() =>
      createTraditionalSession({
        focusDurationMinutes: 0,
        restDurationMinutes: 5,
        cycles: 1,
        config: defaultConfig,
      })
    ).toThrow("Focus duration must be between 1 and 720 minutes");
  });

  it("throws error for focus duration > 720 minutes", () => {
    expect(() =>
      createTraditionalSession({
        focusDurationMinutes: 721,
        restDurationMinutes: 5,
        cycles: 1,
        config: defaultConfig,
      })
    ).toThrow("Focus duration must be between 1 and 720 minutes");
  });

  it("throws error for rest duration < 1 minute", () => {
    expect(() =>
      createTraditionalSession({
        focusDurationMinutes: 25,
        restDurationMinutes: 0,
        cycles: 1,
        config: defaultConfig,
      })
    ).toThrow("Rest duration must be between 1 and 720 minutes");
  });

  it("correctly converts minutes to hours/minutes", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 90,
      restDurationMinutes: 10,
      cycles: 1,
      config: defaultConfig,
    });
    const focusBlock = session.snapshot[0];
    expect(focusBlock.hours).toBe(1);
    expect(focusBlock.minutes).toBe(30);
  });

  it("snapshot is frozen (immutable)", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 1,
      config: defaultConfig,
    });
    expect(Object.isFrozen(session.snapshot)).toBe(true);
  });

  it("schemaVersion is 1", () => {
    const session = createTraditionalSession({
      focusDurationMinutes: 25,
      restDurationMinutes: 5,
      cycles: 1,
      config: defaultConfig,
    });
    expect(session.schemaVersion).toBe(1);
  });
});
