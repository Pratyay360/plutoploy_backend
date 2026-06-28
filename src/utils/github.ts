import { getDb } from "../lib/db.js";
// import { getEnv } from "../utils/env.js";
import { account } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export interface GitHubRepo {
	id: number;
	full_name: string;
	description: string | null;
	html_url: string;
	default_branch: string;
	private: boolean;
	fork: boolean;
	language: string | null;
	updated_at: string;
}

export async function getGitHubToken(userId: string): Promise<string | null> {
	const db = getDb(process.env.DATABASE_URL!);
	const result = await db
		.select({ accessToken: account.accessToken })
		.from(account)
		.where(and(eq(account.userId, userId), eq(account.providerId, "github")))
		.limit(1);
	return result[0]?.accessToken ?? null;
}

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
	const repos: GitHubRepo[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		const res = await fetch(
			`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&type=all`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "Plutoploy",
				},
			},
		);

		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as GitHubRepo[];
		repos.push(...data);
		hasMore = data.length === 100;
		page++;
	}

	return repos;
}

export interface InjectWorkflowInput {
	repoFullName: string;
	runtime: string;
	branch: string;
	token: string;
}

function buildWorkflowYaml(input: Omit<InjectWorkflowInput, "token">) {
	return `name: PlutoPloy Deploy

on:
  push:
    branches:
      - ${input.branch}
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy ${input.repoFullName}
        run: |
          echo "Deploying ${input.repoFullName} on branch ${input.branch}"
          echo "Runtime: ${input.runtime}"
`;
}

export async function upsertWorkflowFile(input: InjectWorkflowInput) {
	const path = ".github/workflows/plutoploy.yml";
	const owner = input.repoFullName.split("/")[0];
	const repo = input.repoFullName.split("/")[1];

	if (!owner || !repo) {
		throw new Error("repoFullName must be in the form owner/repo");
	}

	const content = buildWorkflowYaml(input);
	const encodedContent = Buffer.from(content).toString("base64");
	const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	const existingRes = await fetch(
		`${baseUrl}?ref=${encodeURIComponent(input.branch)}`,
		{
			headers: {
				Authorization: `Bearer ${input.token}`,
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"User-Agent": "PlutoPloy",
			},
		},
	);

	let sha: string | undefined;
	if (existingRes.ok) {
		const existing = (await existingRes.json()) as { sha?: string };
		sha = existing.sha;
	} else if (existingRes.status !== 404) {
		throw new Error(
			`GitHub contents lookup failed: ${existingRes.status} ${existingRes.statusText}`,
		);
	}

	const writeRes = await fetch(baseUrl, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${input.token}`,
			Accept: "application/vnd.github+json",
			"Content-Type": "application/json",
			"X-GitHub-Api-Version": "2022-11-28",
			"User-Agent": "PlutoPloy",
		},
		body: JSON.stringify({
			message: `chore: inject plutoploy workflow for ${input.repoFullName}`,
			content: encodedContent,
			branch: input.branch,
			...(sha ? { sha } : {}),
		}),
	});

	if (!writeRes.ok) {
		const errorBody = await writeRes.text();
		throw new Error(
			`GitHub workflow write failed: ${writeRes.status} ${writeRes.statusText} ${errorBody}`,
		);
	}

	return (await writeRes.json()) as {
		content: { path: string; html_url?: string; sha: string };
		commit: { sha: string; html_url?: string };
	};
}
