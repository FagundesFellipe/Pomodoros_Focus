import { z } from "zod";

// Max cycles keeps total blocks (cycles * 2) at or below the 50-block limit
// (section 10.6.5). 25 cycles => 50 blocks.
export const MAX_CYCLES = 25;

export const traditionalSchema = z
  .object({
    focusHours: z.number().int().min(0).max(12),
    focusMinutes: z.number().int().min(0).max(59),
    restHours: z.number().int().min(0).max(12),
    restMinutes: z.number().int().min(0).max(59),
    cycles: z
      .number()
      .int()
      .min(1, "At least 1 cycle required")
      .max(MAX_CYCLES, `Max ${MAX_CYCLES} cycles (${MAX_CYCLES * 2} blocks)`),
    autoAdvance: z.boolean(),
  })
  // Focus duration: at least 1 minute (RN: block min duration)
  .refine((d) => !(d.focusHours === 0 && d.focusMinutes === 0), {
    message: "Focus duration must be at least 1 minute",
    path: ["focusMinutes"],
  })
  // Focus duration: max 12 hours (RN-010)
  .refine((d) => !(d.focusHours === 12 && d.focusMinutes > 0), {
    message: "When hours is 12, minutes must be 0",
    path: ["focusMinutes"],
  })
  // Rest duration: at least 1 minute
  .refine((d) => !(d.restHours === 0 && d.restMinutes === 0), {
    message: "Rest duration must be at least 1 minute",
    path: ["restMinutes"],
  })
  // Rest duration: max 12 hours
  .refine((d) => !(d.restHours === 12 && d.restMinutes > 0), {
    message: "When hours is 12, minutes must be 0",
    path: ["restMinutes"],
  });

export type TraditionalValues = z.infer<typeof traditionalSchema>;
