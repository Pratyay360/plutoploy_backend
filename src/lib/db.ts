// import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl: string) {
	if (!db) {
		const sql = new Pool({ connectionString: databaseUrl });
		db = drizzle(sql, { schema });
	}
	return db;
}
