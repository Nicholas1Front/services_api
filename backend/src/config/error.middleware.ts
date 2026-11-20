import type { ErrorRequestHandler } from "express";
import { AppError } from "./app-error.js";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const message =
    isAppError || env.NODE_ENV !== "production"
      ? error instanceof Error
        ? error.message
        : String(error)
      : "Internal server error";

  logger.error(
    {
      err: error,
      statusCode,
      method: req.method,
      path: req.originalUrl,
    },
    "Request failed",
  );

  res.status(statusCode).json({
    status: "error",
    message,
  });
};
