import { app } from "./src";
export default {
  fetch: app.fetch,
};

// Local dev with Bun
if (typeof Bun !== "undefined") {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log("Server running on http://localhost:3000");
}
