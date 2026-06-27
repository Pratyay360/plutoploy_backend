import { Hono } from "hono";
import { requireSession } from "../../middleware/auth.middleware";

const injectWorkflow = new Hono();

injectWorkflow.post("/", requireSession, async (c) => {
	const body = await c.req.json<{
		repoFullName: string;
		runtime: string;
		branch: string;
	}>();

	if (!body) {
		return c.json({ error: "Request body is required" }, 400);
	}

	const { repoFullName, runtime, branch } = body;

	if (!repoFullName || !runtime || !branch) {
		return c.json({ error: "Missing repoFullName, runtime, or branch" }, 400);
	}
	const buildId = Math.random().toString(36).substring(2, 15);

	return c.json({ buildId });
});

export default injectWorkflow;
