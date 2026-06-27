import { app } from "./src";

import { HonoBase } from "hono/hono-base";

export default new HonoBase({
	fetch: app.fetch,
});
