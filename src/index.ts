import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { auth } from "./lib/auth";
import { openApiSpec } from "./lib/openapi";
import deploy from "./routes/api/deploy";
import deployments from "./routes/api/deployments";
import repos from "./routes/api/repos";
import githubRepos from "./routes/api/github/repos";
import injectWorkflow from "./routes/api/inject-workflow";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openApiSpec));

// Better Auth handler — must use app.on with wildcard, NOT app.route
app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route("/api/deploy", deploy);
app.route("/api/deployments", deployments);
app.route("/api/repos", repos);
app.route("/api/github/repos", githubRepos);
app.route("/api/inject-workflow", injectWorkflow);

export { app };
