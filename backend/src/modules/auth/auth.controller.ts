import type { RequestHandler } from "express";
import { AppError } from "../../config/app-error.js";
import { authService } from "./auth.service.js";
import { loginSchema } from "./auth.schema.js";

export const login: RequestHandler = async (req, res) => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid login data", 400, "INVALID_LOGIN_DATA");
  }

  const result = await authService.login(parsedBody.data);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const logout: RequestHandler = (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully. Discard the access token on the client.",
  });
};
