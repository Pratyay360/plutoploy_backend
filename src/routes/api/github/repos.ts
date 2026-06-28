import { Hono } from "hono";
import { requireSession } from "../../../middleware/auth.middleware.js";
import { fetchUserRepos, getGitHubToken } from "../../../utils/github.js";

const githubRepos = new Hono();

githubRepos.get("/", requireSession, async (c) => {
	const session = c.get("session");

	const token = await getGitHubToken(session.user.id);

	if (!token) {
		return c.json({ error: "No GitHub account linked" }, 401);
	}

	try {
		const repos = await fetchUserRepos(token);

		return c.json({
			repos: repos.map((repo) => ({
				id: String(repo.id),
				full_name: repo.full_name,
				description: repo.description ?? "",
				html_url: repo.html_url,
				default_branch: repo.default_branch,
				private: repo.private,
				language: repo.language,
				updated_at: repo.updated_at,
			})),
		});
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to fetch GitHub repos";
		return c.json({ error: message }, 500);
	}
});

export default githubRepos;
