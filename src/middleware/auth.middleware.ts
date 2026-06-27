import { createMiddleware } from "hono/factory";
import { createAuth } from "../lib/auth";
// import { getEnv } from "@/utils/env";

export const requireSession = createMiddleware(async (c, next) => {
	// const env = getEnv(c);
	const auth = createAuth();
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("session", session);
	await next();
});
