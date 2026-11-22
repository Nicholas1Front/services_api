import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  addServiceVisibility,
  createService,
  deleteService,
  findServicesByFilters,
  getService,
  updateService,
  updateServiceVisibility,
} from "./services.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/find-services-by-filters", findServicesByFilters);
router.post("/", createService);
router.get("/:id", getService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);
router.post("/:id/visibility", addServiceVisibility);
router.put("/:id/visibility", updateServiceVisibility);

export { router as servicesRoutes };
