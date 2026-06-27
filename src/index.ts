import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import auth from "@/routes/api/auth/[...all]";
import deploy from "@/routes/api/deploy";
import deployments from "@/routes/api/deployments";
import repos from "@/routes/api/repos";
import githubRepos from "@/routes/api/github/repos";
import injectWorkflow from "@/routes/api/inject-workflow";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/api/auth", auth);
app.route("/api/deploy", deploy);
app.route("/api/deployments", deployments);
app.route("/api/repos", repos);
app.route("/api/github/repos", githubRepos);
app.route("/api/inject-workflow", injectWorkflow);

export { app };
