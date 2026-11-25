import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getDashboard, getServiceDetails } from "./dashboard.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getDashboard);
router.get("/services/:id", getServiceDetails);

export { router as dashboardRoutes };
