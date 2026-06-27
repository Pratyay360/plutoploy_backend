import { Hono } from "hono";
import { createAuth } from "../../../lib/auth";

const auth = new Hono();

auth.all("*", async (c) => {
	console.log("Auth route hit:", c.req.method, c.req.url);
	const authInstance = createAuth();
	return authInstance.handler(c.req.raw);
});

export default auth;
