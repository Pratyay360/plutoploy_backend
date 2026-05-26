import { Hono } from "hono";
import { Container, PodmanClient } from "@pratyay360/podman-ts";

const deployRoutes = new Hono();

deployRoutes.post("/", async (c) => {
  // const body = await c.req.json();
  try {
    // const { image } = body;
    // const container = Container({ image });
    // await container.run(
    return c.json({ message: "Deployment created" });
  } catch (error) {
    return c.json({
      message: "Error creating deployment",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

deployRoutes.post("/pull", async (c) => {
  try {
    const body = await c.req.json();
    const { image } = body;
    const container = Container({ image });
    await container.run();
    return c.json({ message: "pull image" });
  } catch (error) {
    return c.json({
      message: "Error pulling image",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

deployRoutes.post("/prune", async (c) => {
  try {
    // authenticate
    const body = await PodmanClient.system.prune();
    return c.json({ message: "prune image", body });
  } catch (error) {
    return c.json({
      message: "Error pruning image",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export { deployRoutes };
