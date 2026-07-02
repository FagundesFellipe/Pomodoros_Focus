import { describe, it, expect } from "vitest";
import { traditionalSchema, MAX_CYCLES } from "@/lib/validations/traditional";

const validValues = {
  focusHours: 0,
  focusMinutes: 25,
  restHours: 0,
  restMinutes: 5,
  cycles: 4,
  autoAdvance: false,
};

describe("traditionalSchema", () => {
  it("accepts valid values", () => {
    expect(traditionalSchema.safeParse(validValues).success).toBe(true);
  });

  it("accepts max 12h focus (12h 0m)", () => {
    const result = traditionalSchema.safeParse({
      ...validValues,
      focusHours: 12,
      focusMinutes: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects focus duration of 0 (both hours and minutes zero)", () => {
    const result = traditionalSchema.safeParse({
      ...validValues,
      focusHours: 0,
      focusMinutes: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects focus over 12h (12h with minutes)", () => {
    const result = traditionalSchema.safeParse({
      ...validValues,
      focusHours: 12,
      focusMinutes: 30,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rest duration of 0", () => {
    const result = traditionalSchema.safeParse({
      ...validValues,
      restHours: 0,
      restMinutes: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rest over 12h", () => {
    const result = traditionalSchema.safeParse({
      ...validValues,
      restHours: 12,
      restMinutes: 15,
    });
    expect(result.success).toBe(false);
  });

  it("rejects minutes over 59", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, focusMinutes: 60 }).success,
    ).toBe(false);
  });

  it("rejects hours over 12", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, focusHours: 13 }).success,
    ).toBe(false);
  });

  it("rejects 0 cycles", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, cycles: 0 }).success,
    ).toBe(false);
  });

  it("accepts exactly MAX_CYCLES cycles", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, cycles: MAX_CYCLES }).success,
    ).toBe(true);
  });

  it("rejects cycles over MAX_CYCLES (would exceed 50 blocks)", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, cycles: MAX_CYCLES + 1 })
        .success,
    ).toBe(false);
  });

  it("rejects non-integer cycles", () => {
    expect(
      traditionalSchema.safeParse({ ...validValues, cycles: 2.5 }).success,
    ).toBe(false);
  });
});
