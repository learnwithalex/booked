import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  bookedDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // Single-flight connection; serverless-friendly (no pool reuse across
  // invocations beyond the module cache, prepared statements off).
  const client = postgres(url, { prepare: false, max: 1 });
  return drizzle(client, { schema });
}

export const db = globalForDb.bookedDb ?? createDb();

if (process.env.NODE_ENV !== "production") globalForDb.bookedDb = db;

export * from "./schema";
