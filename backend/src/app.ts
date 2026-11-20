import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { errorMiddleware } from "./config/error.middleware.js";
import { logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { redis } from "./config/redis.js";

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.get("/health/ready", async (_req, res) => {
  try {
    await Promise.all([
      prisma.$queryRaw`SELECT 1`,
      redis.ping(),
    ]);

    res.status(200).json({
      status: "ok",
      services: {
        database: "connected",
        redis: "connected",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Readiness check failed");

    res.status(503).json({
      status: "error",
      message: "A required dependency is unavailable",
    });
  }
});

// Keep the error handler after every route and middleware.
app.use(errorMiddleware);

export default app;
