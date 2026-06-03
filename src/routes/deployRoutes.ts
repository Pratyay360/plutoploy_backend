import { Hono } from "hono";
import { PodmanClient } from "@pratyay360/podman-ts";

const deployRoutes = new Hono();
const client = new PodmanClient();

deployRoutes.post("/pull", async (c) => {
  try {
    const body = await c.req.json();
    const { image, tag = "latest", tlsVerify = true } = body;

    if (!image) {
      return c.json({ error: "Image name is required" }, 400);
    }

    const repository = tag ? `${image}:${tag}` : image;
    const pulledImage = await client.images.pull(repository, { tlsVerify });

    return c.json({
      message: "Image pulled successfully",
      image: pulledImage,
    });
  } catch (error) {
    return c.json(
      {
        message: "Error pulling image",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.post("/deploy", async (c) => {
  try {
    const body = await c.req.json();
    const { image, name, tag = "latest", command, portMappings, environment, labels } = body;

    if (!image) {
      return c.json({ error: "Image name is required" }, 400);
    }

    const repository = tag ? `${image}:${tag}` : image;
    await client.images.pull(repository);

    const container = await client.containers.create({
      image: repository,
      name: name || undefined,
      command: command || undefined,
      portMappings: portMappings || undefined,
      env: environment || undefined,
      labels: labels || undefined,
    });

    await container.start();

    const inspect = await container.inspect();

    return c.json({
      message: "Container deployed successfully",
      container: {
        id: container.id,
        name: inspect.name,
        image: inspect.config?.image,
        status: inspect.state?.status,
        ports: inspect.hostConfig?.portBindings,
      },
    });
  } catch (error) {
    return c.json(
      {
        message: "Error deploying container",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.get("/containers", async (c) => {
  try {
    const containers = await client.containers.list({ all: true });
    return c.json({ containers });
  } catch (error) {
    return c.json(
      {
        message: "Error listing containers",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.post("/containers/:id/start", async (c) => {
  try {
    const { id } = c.req.param();
    const container = await client.containers.get(id);
    await container.start();
    return c.json({ message: "Container started", id });
  } catch (error) {
    return c.json(
      {
        message: "Error starting container",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.post("/containers/:id/stop", async (c) => {
  try {
    const { id } = c.req.param();
    const container = await client.containers.get(id);
    await container.stop();
    return c.json({ message: "Container stopped", id });
  } catch (error) {
    return c.json(
      {
        message: "Error stopping container",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.delete("/containers/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const container = await client.containers.get(id);
    await container.remove({ force: true });
    return c.json({ message: "Container removed", id });
  } catch (error) {
    return c.json(
      {
        message: "Error removing container",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.get("/images", async (c) => {
  try {
    const images = await client.images.list();
    return c.json({ images });
  } catch (error) {
    return c.json(
      {
        message: "Error listing images",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.delete("/images/:name", async (c) => {
  try {
    const { name } = c.req.param();
    await client.images.remove(name);
    return c.json({ message: "Image removed", name });
  } catch (error) {
    return c.json(
      {
        message: "Error removing image",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

deployRoutes.post("/prune", async (c) => {
  try {
    const result = await client.system.prune();
    return c.json({ message: "Prune completed", result });
  } catch (error) {
    return c.json(
      {
        message: "Error pruning",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export { deployRoutes };
