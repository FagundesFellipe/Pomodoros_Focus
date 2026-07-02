import { describe, it, expect } from "vitest";
import {
  calculateTimeRemaining,
  calculateExpectedEndTime,
  blockDurationMs,
  isBlockComplete,
  formatTimeRemaining,
} from "@/lib/session/time";

describe("calculateTimeRemaining", () => {
  it("returns correct remaining ms", () => {
    const now = 1000000;
    const expectedEndTime = 1001500;
    expect(calculateTimeRemaining(expectedEndTime, now)).toBe(1500);
  });

  it("returns 0 when past expectedEndTime", () => {
    const now = 1001500;
    const expectedEndTime = 1000000;
    expect(calculateTimeRemaining(expectedEndTime, now)).toBe(0);
  });

  it("returns 0 when exactly at expectedEndTime", () => {
    const ts = 1000000;
    expect(calculateTimeRemaining(ts, ts)).toBe(0);
  });
});

describe("calculateExpectedEndTime", () => {
  it("returns startTime + durationMs", () => {
    expect(calculateExpectedEndTime(1000, 5000)).toBe(6000);
  });

  it("handles zero duration", () => {
    expect(calculateExpectedEndTime(1000, 0)).toBe(1000);
  });
});

describe("blockDurationMs", () => {
  it("converts 25 minutes to 1500000 ms", () => {
    expect(blockDurationMs(0, 25)).toBe(1_500_000);
  });

  it("converts 1 hour to 3600000 ms", () => {
    expect(blockDurationMs(1, 0)).toBe(3_600_000);
  });

  it("converts 1 hour 30 minutes correctly", () => {
    expect(blockDurationMs(1, 30)).toBe(5_400_000);
  });

  it("converts 0 hours 1 minute to 60000 ms", () => {
    expect(blockDurationMs(0, 1)).toBe(60_000);
  });
});

describe("isBlockComplete", () => {
  it("returns true when timeRemaining is 0", () => {
    expect(isBlockComplete(0)).toBe(true);
  });

  it("returns true when timeRemaining is negative", () => {
    expect(isBlockComplete(-100)).toBe(true);
  });

  it("returns false when timeRemaining is positive", () => {
    expect(isBlockComplete(1000)).toBe(false);
  });
});

describe("formatTimeRemaining", () => {
  it("formats 25 minutes as '25:00'", () => {
    expect(formatTimeRemaining(25 * 60 * 1000)).toBe("25:00");
  });

  it("formats 5 seconds as '00:05'", () => {
    expect(formatTimeRemaining(5000)).toBe("00:05");
  });

  it("formats 1 hour 30 minutes as '01:30:00'", () => {
    expect(formatTimeRemaining(90 * 60 * 1000)).toBe("01:30:00");
  });

  it("formats 0 ms as '00:00'", () => {
    expect(formatTimeRemaining(0)).toBe("00:00");
  });

  it("formats 1 minute 30 seconds as '01:30'", () => {
    expect(formatTimeRemaining(90 * 1000)).toBe("01:30");
  });

  it("uses ceiling for fractional seconds", () => {
    // 1500ms = 1.5 seconds → ceil = 2 seconds
    expect(formatTimeRemaining(1500)).toBe("00:02");
  });

  it("formats 2 hours as '02:00:00'", () => {
    expect(formatTimeRemaining(2 * 3600 * 1000)).toBe("02:00:00");
  });
});
