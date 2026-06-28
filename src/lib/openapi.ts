export const openApiSpec = {
	openapi: "3.1.0",
	info: {
		title: "PlutoPloy API",
		description:
			"Deployment platform API for managing repos, deployments, and GitHub integration.",
		version: "1.0.0",
	},
	servers: [
		{
			url: "https://plutoploy-backend.vercel.app",
			description: "Production",
		},
	],
	components: {
		securitySchemes: {
			cookie: {
				type: "apiKey",
				in: "cookie",
				name: "better-auth.session_token",
				description: "Session cookie set after GitHub OAuth login",
			},
		},
		schemas: {
			Error: {
				type: "object",
				properties: {
					error: { type: "string" },
				},
			},
			Repo: {
				type: "object",
				properties: {
					id: { type: "string" },
					project_name: { type: "string", nullable: true },
					description: { type: "string", nullable: true },
					commit_hash: { type: "string", nullable: true },
					branch: { type: "string", nullable: true },
					status: { type: "string", nullable: true },
					duration: { type: "string", nullable: true },
					timestamp: { type: "string", nullable: true },
					full_name: { type: "string", nullable: true },
					html_url: { type: "string", nullable: true },
				},
			},
			Deployment: {
				type: "object",
				properties: {
					id: { type: "string" },
					project_name: { type: "string", nullable: true },
					commit_hash: { type: "string", nullable: true },
					branch: { type: "string", nullable: true },
					status: { type: "string", nullable: true },
					duration: { type: "string", nullable: true },
					timestamp: { type: "string", nullable: true },
					repo_full_name: { type: "string", nullable: true },
					runtime: { type: "string", nullable: true },
					image: { type: "string", nullable: true },
					subdomain: { type: "string", nullable: true },
				},
			},
			GitHubRepo: {
				type: "object",
				properties: {
					id: { type: "string" },
					full_name: { type: "string" },
					description: { type: "string" },
					html_url: { type: "string" },
					default_branch: { type: "string" },
					private: { type: "boolean" },
					language: { type: "string", nullable: true },
					updated_at: { type: "string" },
				},
			},
		},
	},
	paths: {
		"/api/auth/ok": {
			get: {
				summary: "Health check",
				tags: ["Auth"],
				responses: {
					"200": {
						description: "Server is running",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										ok: { type: "boolean", example: true },
									},
								},
							},
						},
					},
				},
			},
		},
		"/api/auth/session": {
			get: {
				summary: "Get current session",
				tags: ["Auth"],
				security: [{ cookie: [] }],
				responses: {
					"200": {
						description: "Current session info",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										session: { type: "object" },
										user: { type: "object" },
									},
								},
							},
						},
					},
					"401": {
						description: "Not authenticated",
					},
				},
			},
		},
		"/api/auth/sign-in/social": {
			post: {
				summary: "Sign in with GitHub OAuth",
				tags: ["Auth"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									provider: {
										type: "string",
										enum: ["github"],
										example: "github",
									},
									callbackURL: {
										type: "string",
										description: "Redirect URL after OAuth",
										example: "http://localhost:3000/dashboard",
									},
								},
								required: ["provider"],
							},
						},
					},
				},
				responses: {
					"302": {
						description: "Redirect to GitHub OAuth",
					},
				},
			},
		},
		"/api/auth/sign-out": {
			post: {
				summary: "Sign out",
				tags: ["Auth"],
				security: [{ cookie: [] }],
				responses: {
					"200": {
						description: "Signed out successfully",
					},
				},
			},
		},
		"/api/repos": {
			get: {
				summary: "List all repos",
				tags: ["Repos"],
				security: [{ cookie: [] }],
				responses: {
					"200": {
						description: "List of repos",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										repos: {
											type: "array",
											items: { $ref: "#/components/schemas/Repo" },
										},
									},
								},
							},
						},
					},
					"401": { description: "Unauthorized" },
				},
			},
		},
		"/api/repos/{id}": {
			get: {
				summary: "Get repo by ID",
				tags: ["Repos"],
				security: [{ cookie: [] }],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: {
					"200": {
						description: "Repo details",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Repo" },
							},
						},
					},
					"404": { description: "Repo not found" },
				},
			},
		},
		"/api/deployments": {
			get: {
				summary: "List all deployments",
				tags: ["Deployments"],
				security: [{ cookie: [] }],
				responses: {
					"200": {
						description: "List of deployments",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										deployments: {
											type: "array",
											items: { $ref: "#/components/schemas/Deployment" },
										},
									},
								},
							},
						},
					},
					"401": { description: "Unauthorized" },
				},
			},
		},
		"/api/deployments/{id}": {
			get: {
				summary: "Get deployment by ID",
				tags: ["Deployments"],
				security: [{ cookie: [] }],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: {
					"200": {
						description: "Deployment details",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Deployment" },
							},
						},
					},
					"404": { description: "Deployment not found" },
				},
			},
			delete: {
				summary: "Delete deployment",
				tags: ["Deployments"],
				security: [{ cookie: [] }],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: {
					"200": {
						description: "Deleted successfully",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: { type: "boolean", example: true },
									},
								},
							},
						},
					},
					"404": { description: "Deployment not found" },
				},
			},
		},
		"/api/deploy": {
			post: {
				summary: "Deploy a container",
				tags: ["Deploy"],
				security: [{ cookie: [] }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									image: {
										type: "string",
										description: "Docker image to deploy",
										example: "nginx:latest",
									},
									subdomain: {
										type: "string",
										description: "Subdomain for the deployment",
										example: "my-app",
									},
									repo: {
										type: "string",
										description: "GitHub repo full name (optional)",
										example: "user/my-app",
									},
								},
								required: ["image", "subdomain"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Deployment created",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Deployment" },
							},
						},
					},
					"400": { description: "Invalid request" },
					"401": { description: "Unauthorized" },
				},
			},
		},
		"/api/github/repos": {
			get: {
				summary: "List GitHub repos for authenticated user",
				tags: ["GitHub"],
				security: [{ cookie: [] }],
				responses: {
					"200": {
						description: "GitHub repos",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										repos: {
											type: "array",
											items: { $ref: "#/components/schemas/GitHubRepo" },
										},
									},
								},
							},
						},
					},
					"401": { description: "Unauthorized or no GitHub account linked" },
				},
			},
		},
		"/api/inject-workflow": {
			post: {
				summary: "Inject GitHub Actions workflow into a repo",
				tags: ["GitHub"],
				security: [{ cookie: [] }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									repoFullName: {
										type: "string",
										description: "GitHub repo full name",
										example: "user/my-app",
									},
									runtime: {
										type: "string",
										description: "Runtime for the workflow",
										example: "node",
									},
									branch: {
										type: "string",
										description: "Branch to inject workflow into",
										example: "main",
									},
								},
								required: ["repoFullName", "runtime", "branch"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Workflow injected",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										buildId: { type: "string" },
										workflowPath: { type: "string" },
										workflowSha: { type: "string" },
										workflowUrl: { type: ["string", "null"] },
									},
								},
							},
						},
					},
					"400": { description: "Invalid request" },
					"401": { description: "Unauthorized" },
				},
			},
		},
	},
};
