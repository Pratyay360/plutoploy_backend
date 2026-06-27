import { Hono } from "hono";
import { requireSession } from "../../middleware/auth.middleware.js";
import {
	getDeploymentsList,
	getDeploymentById,
	deleteDeploymentById,
} from "../../db/database.js";

const deployments = new Hono();

deployments.get("/", requireSession, async (c) => {
	const list = await getDeploymentsList(c);
	return c.json({ deployments: list });
});

deployments.get("/:id", requireSession, async (c) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "ID is required" }, 400);
	}
	const deployment = await getDeploymentById(id, c);
	if (!deployment) {
		return c.json({ error: "Deployment not found" }, 404);
	}
	return c.json({ deployment });
});

deployments.delete("/:id", requireSession, async (c) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "ID is required" }, 400);
	}
	const deployment = await getDeploymentById(id, c);
	if (!deployment) {
		return c.json({ error: "Deployment not found" }, 404);
	}
	await deleteDeploymentById(id, c);
	return c.json({ success: true });
});

export default deployments;
