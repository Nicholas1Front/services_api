import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { redis } from "./config/redis.js";

async function startServer() {
  await prisma.$connect();
  logger.info("PostgreSQL connected");

  await redis.connect();
  logger.info("Redis connected");

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "HTTP server started");
  });

  let isShuttingDown = false;

  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info({ signal }, "Shutdown signal received");

    server.close(async (error) => {
      if (error) {
        logger.error({ err: error }, "Error while closing HTTP server");
      }

      await Promise.allSettled([
        prisma.$disconnect(),
        redis.quit(),
      ]);

      process.exit(error ? 1 : 0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch(async (error: unknown) => {
  logger.fatal({ err: error }, "Application startup failed");

  await Promise.allSettled([
    prisma.$disconnect(),
    redis.disconnect(),
  ]);

  process.exit(1);
});