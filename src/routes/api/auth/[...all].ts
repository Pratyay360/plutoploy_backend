import { Hono } from "hono";
import { createAuth } from "@/lib/auth";
import { getEnv } from "@/utils/env";

const auth = new Hono();

auth.on(["GET", "POST"], "/*", async (c) => {
  const env = getEnv(c);
  const authInstance = createAuth(env);
  return authInstance.handler(c.req.raw);
});

export default auth;
