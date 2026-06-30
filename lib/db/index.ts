import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

function createDatabase() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

// Singleton: reused across invocations in the same serverless container.
// In dev, persist on globalThis to survive hot-reload without leaking connections.
const globalForDb = globalThis as unknown as { db: ReturnType<typeof createDatabase> };
export const db = globalForDb.db ?? createDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export type DB = typeof db;
