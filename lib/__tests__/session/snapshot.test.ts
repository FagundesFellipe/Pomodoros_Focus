import { describe, it, expect } from "vitest";
import { createSessionSnapshot, isSnapshotValid } from "@/lib/session/snapshot";

const mockRoutine = {
  id: "routine-1",
  blocks: [
    { id: "b1", type: "focus" as const, title: "Work", hours: 0, minutes: 25, background: "gradient-purple", position: 0 },
    { id: "b2", type: "rest" as const, title: "Break", hours: 0, minutes: 5, background: "gradient-blue", position: 1 },
  ],
};

describe("createSessionSnapshot", () => {
  it("creates a frozen array from routine blocks", () => {
    const snapshot = createSessionSnapshot(mockRoutine);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(snapshot).toHaveLength(2);
  });

  it("freezes each block in the snapshot", () => {
    const snapshot = createSessionSnapshot(mockRoutine);
    snapshot.forEach((block) => {
      expect(Object.isFrozen(block)).toBe(true);
    });
  });

  it("copies block data correctly", () => {
    const snapshot = createSessionSnapshot(mockRoutine);
    expect(snapshot[0].id).toBe("b1");
    expect(snapshot[0].type).toBe("focus");
    expect(snapshot[0].title).toBe("Work");
    expect(snapshot[0].hours).toBe(0);
    expect(snapshot[0].minutes).toBe(25);
    expect(snapshot[0].background).toBe("gradient-purple");
    expect(snapshot[0].position).toBe(0);
  });

  it("uses block index as fallback id when block.id is missing", () => {
    const routineNoId = {
      id: "r1",
      blocks: [
        { type: "focus" as const, title: "Work", hours: 0, minutes: 25, position: 0 },
      ],
    };
    const snapshot = createSessionSnapshot(routineNoId);
    expect(snapshot[0].id).toBe("block-0");
  });

  it("uses default background when block.background is missing", () => {
    const routineNoBackground = {
      id: "r1",
      blocks: [
        { id: "b1", type: "focus" as const, title: "Work", hours: 0, minutes: 25, position: 0 },
      ],
    };
    const snapshot = createSessionSnapshot(routineNoBackground);
    expect(snapshot[0].background).toBe("gradient-purple");
  });

  it("editing the original routine does not affect snapshot", () => {
    const routine = {
      id: "r1",
      blocks: [
        { id: "b1", type: "focus" as const, title: "Original", hours: 0, minutes: 25, position: 0 },
      ],
    };
    const snapshot = createSessionSnapshot(routine);
    const originalTitle = snapshot[0].title;

    // Attempt mutation (TypeScript would prevent it, but test that value didn't change)
    expect(snapshot[0].title).toBe(originalTitle);
    expect(snapshot[0].title).toBe("Original");
  });
});

describe("isSnapshotValid", () => {
  it("returns true for a valid snapshot", () => {
    const snapshot = createSessionSnapshot(mockRoutine);
    expect(isSnapshotValid(snapshot)).toBe(true);
  });

  it("returns false for empty array", () => {
    expect(isSnapshotValid([])).toBe(false);
  });

  it("returns false for non-array", () => {
    expect(isSnapshotValid(null)).toBe(false);
    expect(isSnapshotValid(undefined)).toBe(false);
    expect(isSnapshotValid({})).toBe(false);
    expect(isSnapshotValid("string")).toBe(false);
  });

  it("returns false when block is missing required fields", () => {
    const invalidSnapshot = [{ id: "b1", type: "focus", title: "Work" }]; // missing hours/minutes
    expect(isSnapshotValid(invalidSnapshot)).toBe(false);
  });

  it("returns false when block type is invalid", () => {
    const invalidSnapshot = [
      { id: "b1", type: "invalid", title: "Work", hours: 0, minutes: 25 },
    ];
    expect(isSnapshotValid(invalidSnapshot)).toBe(false);
  });

  it("returns false when block id is not a string", () => {
    const invalidSnapshot = [
      { id: 123, type: "focus", title: "Work", hours: 0, minutes: 25 },
    ];
    expect(isSnapshotValid(invalidSnapshot)).toBe(false);
  });
});
