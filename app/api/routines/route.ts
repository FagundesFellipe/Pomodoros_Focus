import { NextRequest } from "next/server";
import { count, eq, desc, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { routines, blocks } from "@/lib/db/schema";
import { createRoutineSchema } from "@/lib/validations/routine";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const [{ value: routineCount }] = await db
    .select({ value: count() })
    .from(routines)
    .where(eq(routines.userId, userId));

  if (routineCount >= 5) {
    return Response.json(
      { error: "Maximum 5 routines allowed per user" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createRoutineSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, autoAdvance, blocks: blockInputs } = parsed.data;

  const result = await db.transaction(async (tx) => {
    const [routine] = await tx
      .insert(routines)
      .values({ userId, name, autoAdvance })
      .returning();

    const insertedBlocks =
      blockInputs && blockInputs.length > 0
        ? await tx
            .insert(blocks)
            .values(
              blockInputs.map((b) => ({
                routineId: routine.id,
                type: b.type,
                title: b.title,
                durationMinutes: b.durationMinutes,
                position: b.position,
                background: b.background ?? null,
              })),
            )
            .returning()
        : [];

    return { ...routine, blocks: insertedBlocks };
  });

  return Response.json(result, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const userRoutines = await db
    .select()
    .from(routines)
    .where(eq(routines.userId, userId))
    .orderBy(desc(routines.updatedAt));

  const routineIds = userRoutines.map((r) => r.id);

  const blockCounts =
    routineIds.length > 0
      ? await db
          .select({ routineId: blocks.routineId, value: count() })
          .from(blocks)
          .where(inArray(blocks.routineId, routineIds))
          .groupBy(blocks.routineId)
      : [];

  const countMap = new Map(blockCounts.map((bc) => [bc.routineId, bc.value]));

  const result = userRoutines.map((r) => ({
    ...r,
    blockCount: countMap.get(r.id) ?? 0,
  }));

  return Response.json({ routines: result });
}
