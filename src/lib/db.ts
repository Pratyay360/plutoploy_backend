import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl?: string) {
	const url = databaseUrl || process.env.DATABASE_URL;
	if (!url) {
		throw new Error("DATABASE_URL environment variable is missing");
	}
	if (!db) {
		const sql = new Pool({ connectionString: url });
		db = drizzle(sql, { schema });
	}
	return db;
}
