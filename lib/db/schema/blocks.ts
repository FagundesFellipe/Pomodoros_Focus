import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { routines } from "./routines";

export const blocks = sqliteTable(
  "blocks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    routineId: text("routine_id")
      .notNull()
      .references(() => routines.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["focus", "rest"] }).notNull(),
    title: text("title").notNull(), // max 100 chars enforced at API layer
    durationMinutes: integer("duration_minutes").notNull(), // 1–720 enforced at API layer
    position: integer("position").notNull(),
    background: text("background"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("blocks_routine_id_idx").on(table.routineId),
    index("blocks_routine_position_idx").on(table.routineId, table.position),
  ],
);

export type Block = typeof blocks.$inferSelect;
export type NewBlock = typeof blocks.$inferInsert;
