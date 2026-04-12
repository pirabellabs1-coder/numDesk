import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Global singleton to survive hot reload in development
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
  pgClient: ReturnType<typeof postgres> | undefined;
};

export function getDb() {
  if (!globalForDb.db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    globalForDb.pgClient = postgres(connectionString, {
      prepare: false,
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    globalForDb.db = drizzle(globalForDb.pgClient, { schema });
  }
  return globalForDb.db;
}

export type Database = ReturnType<typeof getDb>;
