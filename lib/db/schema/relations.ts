import { relations } from "drizzle-orm";
import { routines } from "./routines";
import { blocks } from "./blocks";

export const routinesRelations = relations(routines, ({ many }) => ({
  blocks: many(blocks),
}));

export const blocksRelations = relations(blocks, ({ one }) => ({
  routine: one(routines, {
    fields: [blocks.routineId],
    references: [routines.id],
  }),
}));
