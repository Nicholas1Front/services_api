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
  const isInvalidJson =
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400;

  const statusCode = isAppError ? error.statusCode : isInvalidJson ? 400 : 500;
  const code = isAppError
    ? error.code
    : isInvalidJson
      ? "INVALID_JSON"
      : "INTERNAL_SERVER_ERROR";

  const message =
    isAppError || isInvalidJson
      ? error.message
      : env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : String(error);

  logger.error(
    {
      err: error,
      statusCode,
      code,
      method: req.method,
      path: req.originalUrl,
    },
    "Request failed",
  );

  res.status(statusCode).json({
    status: "error",
    message,
    code,
  });
};
