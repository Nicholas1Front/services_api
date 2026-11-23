import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  findTasksByFilters,
  getTask,
  updateTask,
  updateTaskDeliveryDate,
} from "./tasks.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/find-tasks-by-filters", findTasksByFilters);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.patch("/:id/delivery-date", updateTaskDeliveryDate);
router.delete("/:id", deleteTask);

export { router as tasksRoutes };
