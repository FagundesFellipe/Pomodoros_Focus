import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { blocks, routines } from "./schema";
import type { Block, Routine } from "./schema";

export async function getUserRoutines(userId: string): Promise<Routine[]> {
  return db.select().from(routines).where(eq(routines.userId, userId));
}

export async function getRoutineWithAccess(
  routineId: string,
  userId: string,
): Promise<Routine | null> {
  const [routine] = await db
    .select()
    .from(routines)
    .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));
  return routine ?? null;
}

export async function validateRoutineOwnership(
  routineId: string,
  userId: string,
): Promise<void> {
  const routine = await getRoutineWithAccess(routineId, userId);
  if (!routine) {
    throw new Error("Routine not found or access denied");
  }
}

export async function getBlocksForRoutine(
  routineId: string,
  userId: string,
): Promise<Block[]> {
  await validateRoutineOwnership(routineId, userId);
  return db
    .select()
    .from(blocks)
    .where(eq(blocks.routineId, routineId))
    .orderBy(blocks.position);
}
