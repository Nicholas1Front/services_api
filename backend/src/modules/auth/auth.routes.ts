import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { login, logout } from "./auth.controller.js";

const router = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.post("/login", loginRateLimit, login);
router.post("/logout", authMiddleware, logout);

export { router as authRoutes };
