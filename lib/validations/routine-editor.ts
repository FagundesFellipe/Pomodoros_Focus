import { z } from "zod";

export const blockEditorSchema = z
  .object({
    type: z.enum(["focus", "rest"]),
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Max 100 characters"),
    hours: z.number().int().min(0).max(12),
    minutes: z.number().int().min(0).max(59),
    background: z.string(),
    position: z.number().int().min(0),
  })
  .refine((data) => !(data.hours === 0 && data.minutes === 0), {
    message: "Duration must be at least 1 minute",
    path: ["minutes"],
  })
  .refine((data) => !(data.hours === 12 && data.minutes > 0), {
    message: "When hours is 12, minutes must be 0",
    path: ["minutes"],
  });

export const routineEditorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Max 80 characters"),
  autoAdvance: z.boolean(),
  blocks: z
    .array(blockEditorSchema)
    .min(1, "At least 1 block required")
    .max(50, "Max 50 blocks"),
});

export type BlockEditorValues = z.infer<typeof blockEditorSchema>;
export type RoutineEditorValues = z.infer<typeof routineEditorSchema>;
