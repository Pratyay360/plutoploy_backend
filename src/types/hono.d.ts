import type { Context } from "hono";

declare module "hono" {
	interface ContextVariableMap {
		session: {
			user: { id: string };
			session: { id: string };
		};
	}
}
