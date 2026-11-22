import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../config/app-error.js";
import { env } from "../config/env.js";
import { jwtPayloadSchema } from "../modules/auth/auth.schema.js";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;
  const tokenMatch = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    return next(new AppError("Authentication required", 401, "AUTHENTICATION_REQUIRED"));
  }

  let decodedToken: string | jwt.JwtPayload;

  try {
    decodedToken = jwt.verify(tokenMatch[1], env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }

  const parsedPayload = jwtPayloadSchema.safeParse(decodedToken);

  if (!parsedPayload.success) {
    return next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }

  req.user = {
    id: parsedPayload.data.sub,
    name: parsedPayload.data.name,
    email: parsedPayload.data.email,
    role: parsedPayload.data.role,
  };

  next();
};
