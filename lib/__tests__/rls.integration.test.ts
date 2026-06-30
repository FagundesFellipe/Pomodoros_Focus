import { describe, it, expect, beforeAll, vi } from "vitest";
import { sql } from "drizzle-orm";

// vi.mock is hoisted — db must be created inside the factory.
// We retrieve it in beforeAll via dynamic import of the mocked module.
vi.mock("@/lib/db", async () => {
  const { drizzle } = await import("drizzle-orm/libsql");
  const { createClient } = await import("@libsql/client");
  const schema = await import("@/lib/db/schema");
  const client = createClient({ url: "file::memory:" });
  return { db: drizzle(client, { schema }) };
});

import {
  getUserRoutines,
  getRoutineWithAccess,
  validateRoutineOwnership,
  getBlocksForRoutine,
} from "@/lib/db/rls";

beforeAll(async () => {
  // Access the in-memory db created by the mock factory above.
  const { db } = await import("@/lib/db");
  const now = Date.now();

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`user\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`email\` text NOT NULL,
    \`emailVerified\` integer DEFAULT false NOT NULL,
    \`image\` text,
    \`createdAt\` integer NOT NULL,
    \`updatedAt\` integer NOT NULL
  )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS routines (
    \`id\` text PRIMARY KEY NOT NULL,
    \`user_id\` text NOT NULL REFERENCES \`user\`(\`id\`) ON DELETE CASCADE,
    \`name\` text NOT NULL,
    \`auto_advance\` integer DEFAULT false NOT NULL,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL
  )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS blocks (
    \`id\` text PRIMARY KEY NOT NULL,
    \`routine_id\` text NOT NULL REFERENCES routines(\`id\`) ON DELETE CASCADE,
    \`type\` text NOT NULL,
    \`title\` text NOT NULL,
    \`duration_minutes\` integer NOT NULL,
    \`position\` integer NOT NULL,
    \`background\` text,
    \`created_at\` integer NOT NULL
  )`);

  await db.run(
    sql`INSERT INTO \`user\` VALUES ('user-a','User A','a@test.com',0,null,${now},${now})`,
  );
  await db.run(
    sql`INSERT INTO \`user\` VALUES ('user-b','User B','b@test.com',0,null,${now},${now})`,
  );
  await db.run(
    sql`INSERT INTO routines VALUES ('routine-1','user-a','Morning',0,${now},${now})`,
  );
  await db.run(
    sql`INSERT INTO routines VALUES ('routine-2','user-b','Evening',0,${now},${now})`,
  );
  await db.run(
    sql`INSERT INTO blocks VALUES ('block-1','routine-1','focus','Deep Work',25,0,null,${now})`,
  );
  await db.run(
    sql`INSERT INTO blocks VALUES ('block-2','routine-1','rest','Break',5,1,null,${now})`,
  );
});

describe("RLS integration — real SQL predicates", () => {
  describe("getUserRoutines", () => {
    it("returns only routines belonging to user-a", async () => {
      const result = await getUserRoutines("user-a");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("routine-1");
    });

    it("returns only routines belonging to user-b", async () => {
      const result = await getUserRoutines("user-b");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("routine-2");
    });

    it("returns empty array for user with no routines", async () => {
      const result = await getUserRoutines("user-x");
      expect(result).toHaveLength(0);
    });
  });

  describe("getRoutineWithAccess", () => {
    it("returns routine when user owns it", async () => {
      const result = await getRoutineWithAccess("routine-1", "user-a");
      expect(result?.id).toBe("routine-1");
    });

    it("returns null when user does NOT own routine (data isolation)", async () => {
      const result = await getRoutineWithAccess("routine-1", "user-b");
      expect(result).toBeNull();
    });

    it("returns null for non-existent routine", async () => {
      const result = await getRoutineWithAccess("nonexistent", "user-a");
      expect(result).toBeNull();
    });
  });

  describe("validateRoutineOwnership", () => {
    it("resolves when user owns routine", async () => {
      await expect(
        validateRoutineOwnership("routine-1", "user-a"),
      ).resolves.toBeUndefined();
    });

    it("throws when user does not own routine", async () => {
      await expect(
        validateRoutineOwnership("routine-1", "user-b"),
      ).rejects.toThrow("Routine not found or access denied");
    });
  });

  describe("getBlocksForRoutine", () => {
    it("returns blocks in position order for owned routine", async () => {
      const result = await getBlocksForRoutine("routine-1", "user-a");
      expect(result).toHaveLength(2);
      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(1);
    });

    it("throws when user does not own routine", async () => {
      await expect(
        getBlocksForRoutine("routine-1", "user-b"),
      ).rejects.toThrow("Routine not found or access denied");
    });
  });
});
