import { pgTable, text } from "drizzle-orm/pg-core";

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
});

export const repos = pgTable("repos", {
	id: text("id").primaryKey(),
	projectName: text("project_name"),
	description: text("description"),
	commitHash: text("commit_hash"),
	branch: text("branch"),
	status: text("status"),
	duration: text("duration"),
	timestamp: text("timestamp"),
	fullName: text("full_name"),
	htmlUrl: text("html_url"),
});

export const deployments = pgTable("deployments", {
	id: text("id").primaryKey(),
	projectName: text("project_name"),
	commitHash: text("commit_hash"),
	branch: text("branch"),
	status: text("status"),
	duration: text("duration"),
	timestamp: text("timestamp"),
	repoFullName: text("repo_full_name"),
	runtime: text("runtime"),
	image: text("image"),
	subdomain: text("subdomain"),
});
