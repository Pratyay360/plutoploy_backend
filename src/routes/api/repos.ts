import { Hono } from "hono";
import { requireSession } from "../../middleware/auth.middleware";
import { getReposList, getRepoById } from "../../db/database";

const repos = new Hono();

repos.get("/", requireSession, async (c) => {
	const list = await getReposList(c);
	return c.json({ repos: list });
});

repos.get("/:id", requireSession, async (c) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "ID is required" }, 400);
	}
	const repo = await getRepoById(id, c);
	if (!repo) {
		return c.json({ error: "Repo not found" }, 404);
	}
	return c.json(repo);
});

export default repos;
