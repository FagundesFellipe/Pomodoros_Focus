import { describe, it, expect } from "vitest";
import { canTransition, transitionState, getValidNextStates } from "@/lib/session/state-machine";
import type { SessionState } from "@/lib/types/session";

describe("canTransition", () => {
  it("allows idle → countdown", () => {
    expect(canTransition("idle", "countdown")).toBe(true);
  });

  it("allows countdown → running", () => {
    expect(canTransition("countdown", "running")).toBe(true);
  });

  it("allows running → paused", () => {
    expect(canTransition("running", "paused")).toBe(true);
  });

  it("allows running → transitioning", () => {
    expect(canTransition("running", "transitioning")).toBe(true);
  });

  it("allows running → waiting", () => {
    expect(canTransition("running", "waiting")).toBe(true);
  });

  it("allows running → completed", () => {
    expect(canTransition("running", "completed")).toBe(true);
  });

  it("allows paused → running", () => {
    expect(canTransition("paused", "running")).toBe(true);
  });

  it("allows transitioning → running", () => {
    expect(canTransition("transitioning", "running")).toBe(true);
  });

  it("allows waiting → running", () => {
    expect(canTransition("waiting", "running")).toBe(true);
  });

  it("disallows idle → running", () => {
    expect(canTransition("idle", "running")).toBe(false);
  });

  it("disallows idle → completed", () => {
    expect(canTransition("idle", "completed")).toBe(false);
  });

  it("disallows completed → running", () => {
    expect(canTransition("completed", "running")).toBe(false);
  });

  it("disallows completed → any state", () => {
    const allStates: SessionState[] = [
      "idle", "countdown", "running", "paused", "transitioning", "waiting", "completed",
    ];
    allStates.forEach((state) => {
      expect(canTransition("completed", state)).toBe(false);
    });
  });

  it("disallows paused → completed", () => {
    expect(canTransition("paused", "completed")).toBe(false);
  });
});

describe("transitionState", () => {
  it("returns next state for valid transition", () => {
    expect(transitionState("idle", "countdown")).toBe("countdown");
    expect(transitionState("running", "paused")).toBe("paused");
    expect(transitionState("paused", "running")).toBe("running");
  });

  it("throws error for invalid transition", () => {
    expect(() => transitionState("idle", "running")).toThrow(
      "Invalid state transition: idle → running"
    );
  });

  it("throws error for completed → any state", () => {
    expect(() => transitionState("completed", "idle")).toThrow();
  });
});

describe("getValidNextStates", () => {
  it("returns correct valid next states for idle", () => {
    expect(getValidNextStates("idle")).toEqual(["countdown"]);
  });

  it("returns correct valid next states for running", () => {
    const states = getValidNextStates("running");
    expect(states).toContain("paused");
    expect(states).toContain("transitioning");
    expect(states).toContain("waiting");
    expect(states).toContain("completed");
    expect(states).toHaveLength(4);
  });

  it("returns empty array for completed", () => {
    expect(getValidNextStates("completed")).toEqual([]);
  });

  it("returns a copy (mutation does not affect internal state)", () => {
    const states = getValidNextStates("idle");
    states.push("completed" as SessionState);
    // original should still only return ["countdown"]
    expect(getValidNextStates("idle")).toEqual(["countdown"]);
  });
});
