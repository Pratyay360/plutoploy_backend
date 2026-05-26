import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.json({
    message: "Deployment Platform API",
    status: "running",
    version: "1.0.0",
  });
});

app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

app.post("/deploy/:", async (c) => {
  const route = c.req.param("route");
  const body = await c.req.json();
  return c.json({ received: body, route, success: true });
});
