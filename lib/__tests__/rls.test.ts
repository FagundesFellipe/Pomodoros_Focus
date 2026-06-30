import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
  },
}));

import { db } from "@/lib/db";
import {
  getUserRoutines,
  getRoutineWithAccess,
  validateRoutineOwnership,
  getBlocksForRoutine,
} from "@/lib/db/rls";

const mockRoutine = {
  id: "routine-1",
  userId: "user-1",
  name: "Morning Focus",
  autoAdvance: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBlock = {
  id: "block-1",
  routineId: "routine-1",
  type: "focus" as const,
  title: "Deep Work",
  durationMinutes: 25,
  position: 0,
  background: null,
  createdAt: new Date(),
};

function mockChain(result: unknown) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue(result),
  };
  chain.where.mockResolvedValue(result);
  vi.mocked(db.select).mockReturnValue(chain as never);
  return chain;
}

describe("RLS utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserRoutines", () => {
    it("returns routines belonging to the user", async () => {
      mockChain([mockRoutine]);
      const result = await getUserRoutines("user-1");
      expect(result).toEqual([mockRoutine]);
    });

    it("returns empty array when user has no routines", async () => {
      mockChain([]);
      const result = await getUserRoutines("user-1");
      expect(result).toEqual([]);
    });
  });

  describe("getRoutineWithAccess", () => {
    it("returns routine when user owns it", async () => {
      mockChain([mockRoutine]);
      const result = await getRoutineWithAccess("routine-1", "user-1");
      expect(result).toEqual(mockRoutine);
    });

    it("returns null when routine belongs to another user", async () => {
      mockChain([]);
      const result = await getRoutineWithAccess("routine-1", "user-2");
      expect(result).toBeNull();
    });

    it("returns null when routine does not exist", async () => {
      mockChain([]);
      const result = await getRoutineWithAccess("nonexistent", "user-1");
      expect(result).toBeNull();
    });
  });

  describe("validateRoutineOwnership", () => {
    it("resolves when user owns the routine", async () => {
      mockChain([mockRoutine]);
      await expect(validateRoutineOwnership("routine-1", "user-1")).resolves.toBeUndefined();
    });

    it("throws when user does not own the routine", async () => {
      mockChain([]);
      await expect(validateRoutineOwnership("routine-1", "user-2")).rejects.toThrow(
        "Routine not found or access denied",
      );
    });
  });

  describe("getBlocksForRoutine", () => {
    it("returns ordered blocks when user owns the routine", async () => {
      const selectMock = vi.mocked(db.select);
      const ownershipChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockRoutine]),
      };
      const blocksChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([mockBlock]),
      };
      selectMock.mockReturnValueOnce(ownershipChain as never);
      selectMock.mockReturnValueOnce(blocksChain as never);

      const result = await getBlocksForRoutine("routine-1", "user-1");
      expect(result).toEqual([mockBlock]);
    });

    it("throws when user does not own the routine", async () => {
      const selectMock = vi.mocked(db.select);
      const ownershipChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      selectMock.mockReturnValueOnce(ownershipChain as never);

      await expect(getBlocksForRoutine("routine-1", "user-2")).rejects.toThrow(
        "Routine not found or access denied",
      );
    });
  });
});
