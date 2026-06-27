import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth.js";

export const requireSession = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("session", session);
	await next();
});
