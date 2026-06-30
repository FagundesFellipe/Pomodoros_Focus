import { NextRequest } from "next/server";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { routines, blocks } from "@/lib/db/schema";
import { updateRoutineSchema } from "@/lib/validations/routine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { id } = await params;

  const routine = await db.query.routines.findFirst({
    where: eq(routines.id, id),
    with: { blocks: { orderBy: asc(blocks.position) } },
  });

  if (!routine) return Response.json({ error: "Not found" }, { status: 404 });
  if (routine.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  return Response.json(routine);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { id } = await params;

  const existing = await db.query.routines.findFirst({
    where: eq(routines.id, id),
  });

  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  if (existing.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = updateRoutineSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  const { blocks: blockInputs, ...routineFields } = parsed.data;

  if (blockInputs !== undefined && blockInputs.length > 50)
    return Response.json({ error: "Maximum 50 blocks per routine" }, { status: 400 });

  await db.transaction(async (tx) => {
    await tx
      .update(routines)
      .set({ ...routineFields, updatedAt: new Date() })
      .where(eq(routines.id, id));

    if (blockInputs !== undefined) {
      await tx.delete(blocks).where(eq(blocks.routineId, id));
      if (blockInputs.length > 0) {
        await tx.insert(blocks).values(
          blockInputs.map((b, i) => ({
            routineId: id,
            type: b.type,
            title: b.title,
            durationMinutes: b.durationMinutes,
            position: b.position ?? i,
            background: b.background ?? null,
          })),
        );
      }
    }
  });

  const result = await db.query.routines.findFirst({
    where: eq(routines.id, id),
    with: { blocks: { orderBy: asc(blocks.position) } },
  });

  return Response.json(result);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { id } = await params;

  const existing = await db.query.routines.findFirst({
    where: eq(routines.id, id),
  });

  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  if (existing.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  await db.transaction(async (tx) => {
    await tx.delete(blocks).where(eq(blocks.routineId, id));
    await tx.delete(routines).where(eq(routines.id, id));
  });

  return new Response(null, { status: 204 });
}
