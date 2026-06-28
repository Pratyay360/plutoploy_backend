import { Hono } from "hono";
import { addDeployment } from "../../db/database.js";
import { requireSession } from "../../middleware/auth.middleware.js";

const deploy = new Hono();

deploy.post("/", requireSession, async (c) => {
	const body = await c.req
		.json<{
			image: string;
			subdomain: string;
			repo?: string;
		}>()
		.catch(() => null);

	if (!body) {
		return c.json({ error: "Invalid or missing request body" }, 400);
	}

	const { image, subdomain, repo } = body;

	if (!image || !subdomain) {
		return c.json({ error: "Missing image or subdomain" }, 400);
	}

	const projectName = repo?.split("/").pop() ?? "custom-app";

	const newDeployment = await addDeployment(
		{
			projectName,
			commitHash: "latest",
			branch: "main",
			status: "success",
			duration: "10s",
			repoFullName: repo ?? projectName,
			image,
			subdomain,
		},
		c,
	);

	return c.json(newDeployment);
});

export default deploy;
