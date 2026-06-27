import { app } from "./src";

export default {
	fetch: app.fetch,
};

if (typeof Bun !== "undefined") {
	console.log("Server running on http://localhost:3000");
}
