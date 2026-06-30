import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Mirrors Better Auth's managed "user" table — used only for FK type references.
// Do NOT migrate this table via drizzle-kit; Better Auth manages it.
export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
