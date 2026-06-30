import { describe, it, expect } from "vitest";
import {
  blockSchema,
  routineSchema,
  createRoutineSchema,
  updateRoutineSchema,
} from "@/lib/validations/routine";

const validBlock = {
  type: "focus" as const,
  title: "Deep Work",
  durationMinutes: 25,
  position: 0,
};

describe("blockSchema", () => {
  it("accepts valid block", () => {
    expect(blockSchema.safeParse(validBlock).success).toBe(true);
  });

  it("accepts rest type", () => {
    expect(blockSchema.safeParse({ ...validBlock, type: "rest" }).success).toBe(true);
  });

  it("rejects invalid type", () => {
    expect(blockSchema.safeParse({ ...validBlock, type: "break" }).success).toBe(false);
  });

  it("rejects empty title", () => {
    expect(blockSchema.safeParse({ ...validBlock, title: "" }).success).toBe(false);
  });

  it("accepts title at max 100 chars", () => {
    expect(blockSchema.safeParse({ ...validBlock, title: "a".repeat(100) }).success).toBe(true);
  });

  it("rejects title over 100 chars", () => {
    expect(blockSchema.safeParse({ ...validBlock, title: "a".repeat(101) }).success).toBe(false);
  });

  it("accepts durationMinutes at min 1", () => {
    expect(blockSchema.safeParse({ ...validBlock, durationMinutes: 1 }).success).toBe(true);
  });

  it("rejects durationMinutes at 0", () => {
    expect(blockSchema.safeParse({ ...validBlock, durationMinutes: 0 }).success).toBe(false);
  });

  it("accepts durationMinutes at max 720", () => {
    expect(blockSchema.safeParse({ ...validBlock, durationMinutes: 720 }).success).toBe(true);
  });

  it("rejects durationMinutes at 721", () => {
    expect(blockSchema.safeParse({ ...validBlock, durationMinutes: 721 }).success).toBe(false);
  });

  it("rejects fractional durationMinutes", () => {
    expect(blockSchema.safeParse({ ...validBlock, durationMinutes: 1.5 }).success).toBe(false);
  });

  it("accepts optional background", () => {
    expect(blockSchema.safeParse({ ...validBlock, background: "purple" }).success).toBe(true);
  });

  it("accepts null background", () => {
    expect(blockSchema.safeParse({ ...validBlock, background: null }).success).toBe(true);
  });
});

describe("routineSchema", () => {
  it("accepts valid routine", () => {
    expect(routineSchema.safeParse({ name: "Morning Focus" }).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(routineSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("accepts name at max 80 chars", () => {
    expect(routineSchema.safeParse({ name: "a".repeat(80) }).success).toBe(true);
  });

  it("rejects name over 80 chars", () => {
    expect(routineSchema.safeParse({ name: "a".repeat(81) }).success).toBe(false);
  });

  it("defaults autoAdvance to false", () => {
    const result = routineSchema.safeParse({ name: "Test" });
    expect(result.success && result.data.autoAdvance).toBe(false);
  });

  it("accepts 50 blocks", () => {
    const manyBlocks = Array.from({ length: 50 }, (_, i) => ({ ...validBlock, position: i }));
    expect(routineSchema.safeParse({ name: "Test", blocks: manyBlocks }).success).toBe(true);
  });

  it("rejects 51 blocks", () => {
    const manyBlocks = Array.from({ length: 51 }, (_, i) => ({ ...validBlock, position: i }));
    expect(routineSchema.safeParse({ name: "Test", blocks: manyBlocks }).success).toBe(false);
  });
});

describe("createRoutineSchema", () => {
  it("requires name", () => {
    expect(createRoutineSchema.safeParse({}).success).toBe(false);
  });

  it("accepts without blocks", () => {
    expect(createRoutineSchema.safeParse({ name: "Test" }).success).toBe(true);
  });
});

describe("updateRoutineSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    expect(updateRoutineSchema.safeParse({}).success).toBe(true);
  });

  it("accepts partial update with only name", () => {
    expect(updateRoutineSchema.safeParse({ name: "Updated" }).success).toBe(true);
  });

  it("still validates name length if provided", () => {
    expect(updateRoutineSchema.safeParse({ name: "a".repeat(81) }).success).toBe(false);
  });

  it("still validates blocks if provided", () => {
    const manyBlocks = Array.from({ length: 51 }, (_, i) => ({ ...validBlock, position: i }));
    expect(updateRoutineSchema.safeParse({ blocks: manyBlocks }).success).toBe(false);
  });
});
