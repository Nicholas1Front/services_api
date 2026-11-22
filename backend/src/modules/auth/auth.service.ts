import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import type { LoginInput } from "./auth.schema.js";
import { authRepository } from "./auth.repository.js";

const TOKEN_EXPIRES_IN = "1h";

export const authService = {
  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        algorithm: "HS256",
        subject: user.id,
        expiresIn: TOKEN_EXPIRES_IN,
      },
    );

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      token,
      user: authenticatedUser,
    };
  },
};
