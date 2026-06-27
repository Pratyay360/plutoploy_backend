import { Hono } from "hono";
import { requireSession } from "../../../middleware/auth.middleware.js";
// import { getEnv } from "../../../utils/env.js";
import { fetchUserRepos, getGitHubToken } from "../../../utils/github.js";

const githubRepos = new Hono();

githubRepos.get("/", requireSession, async (c) => {
	// const env = getEnv(c);
	const session = c.get("session");

	const token = await getGitHubToken(session.user.id);

	if (!token) {
		return c.json({ error: "No GitHub account linked" }, 401);
	}

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
});

export default githubRepos;
