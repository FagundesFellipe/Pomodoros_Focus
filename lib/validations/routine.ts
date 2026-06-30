import { z } from "zod";

export const blockSchema = z.object({
  type: z.enum(["focus", "rest"]),
  title: z.string().min(1).max(100),
  durationMinutes: z.number().int().min(1).max(720),
  position: z.number().int().min(0),
  background: z.string().nullable().optional(),
});

export const routineSchema = z.object({
  name: z.string().min(1).max(80),
  autoAdvance: z.boolean().optional().default(false),
  blocks: z.array(blockSchema).max(50).optional(),
});

export const createRoutineSchema = routineSchema;

export const updateRoutineSchema = routineSchema.partial();

export type BlockInput = z.infer<typeof blockSchema>;
export type RoutineInput = z.infer<typeof routineSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
