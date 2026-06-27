import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
// import type { Env } from "@/types/config";

const dbInstances = new Map<
  string,
  ReturnType<typeof drizzle<typeof schema>>
>();

function getDb(databaseUrl: string) {
  let db = dbInstances.get(databaseUrl);
  if (!db) {
    const sql = new Pool({ connectionString: databaseUrl });
    db = drizzle(sql, { schema });
    dbInstances.set(databaseUrl, db);
  }
  return db;
}

export function createAuth() {
  const db = getDb(process.env.DATABASE_URL!);
  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    baseURL: process.env.BETTER_AUTH_URL!,
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        scope: ["repo", "user:email", "read:org"],
      },
    },
  });
}
