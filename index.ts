import { app } from "./src";

Bun.serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("");
