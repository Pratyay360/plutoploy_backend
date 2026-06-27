import { Hono } from "hono";
import { requireSession } from "../../middleware/auth.middleware.js";
import { getGitHubToken, upsertWorkflowFile } from "../../utils/github.js";

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

	const session = c.get("session");
	const token = await getGitHubToken(session.user.id);

	if (!token) {
		return c.json({ error: "No GitHub account linked" }, 401);
	}

	const result = await upsertWorkflowFile({
		repoFullName,
		runtime,
		branch,
		token,
	});

	return c.json({
		buildId: result.commit.sha,
		workflowPath: result.content.path,
		workflowSha: result.content.sha,
		workflowUrl: result.content.html_url ?? result.commit.html_url ?? null,
	});
});

export default injectWorkflow;
