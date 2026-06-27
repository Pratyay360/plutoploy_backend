import type { Context } from "hono";
import type { Env } from "@/types/config";

export function getEnv(c: Context): Env {
	if (c.env?.DATABASE_URL) {
		return c.env as unknown as Env;
	}

	const {
		DATABASE_URL,
		BETTER_AUTH_URL,
		BETTER_AUTH_SECRET,
		GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET,
	} = process.env;

	if (!DATABASE_URL || !BETTER_AUTH_URL || !BETTER_AUTH_SECRET) {
		throw new Error(
			"Missing required environment variables. Make sure .env file is loaded.",
		);
	}

	return {
		DATABASE_URL,
		BETTER_AUTH_URL,
		BETTER_AUTH_SECRET,
		GITHUB_CLIENT_ID: GITHUB_CLIENT_ID ?? "",
		GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET ?? "",
		KV_NAMESPACE: {} as unknown as KVNamespace,
	};
}
