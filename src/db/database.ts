import { getDb } from "../lib/db.js";
// import { getEnv } from "../utils/env.js";
import { repos, deployments } from "./schema.js";
import { eq, desc } from "drizzle-orm";
import type { Context } from "hono";

function getDbFromContext(c: Context) {
	// const env = getEnv(c);
	return getDb(process.env.DATABASE_URL!);
}

export async function getReposList(c: Context) {
	const db = getDbFromContext(c);
	return db.select().from(repos);
}

export async function getRepoById(id: string, c: Context) {
	const db = getDbFromContext(c);
	const result = await db.select().from(repos).where(eq(repos.id, id)).limit(1);
	return result[0] ?? null;
}

export async function getDeploymentsList(c: Context) {
	const db = getDbFromContext(c);
	return db.select().from(deployments).orderBy(desc(deployments.id));
}

export async function getDeploymentById(id: string, c: Context) {
	const db = getDbFromContext(c);
	const result = await db
		.select()
		.from(deployments)
		.where(eq(deployments.id, id))
		.limit(1);
	return result[0] ?? null;
}

export async function addDeployment(
	deployment: {
		projectName: string;
		commitHash: string;
		branch: string;
		status: string;
		duration: string;
		repoFullName: string;
		runtime?: string;
		image?: string;
		subdomain?: string;
	},
	c: Context,
) {
	const db = getDbFromContext(c);
	const id = Math.random().toString(36).substring(2, 9);
	const timestamp = "Just now";

	await db.insert(deployments).values({
		id,
		projectName: deployment.projectName,
		commitHash: deployment.commitHash,
		branch: deployment.branch,
		status: deployment.status,
		duration: deployment.duration,
		timestamp,
		repoFullName: deployment.repoFullName,
		runtime: deployment.runtime,
		image: deployment.image,
		subdomain: deployment.subdomain,
	});

	return { ...deployment, id, timestamp };
}

export async function deleteDeploymentById(id: string, c: Context) {
	const db = getDbFromContext(c);
	await db.delete(deployments).where(eq(deployments.id, id));
}
