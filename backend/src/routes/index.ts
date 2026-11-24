import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { notesRoutes } from "../modules/notes/notes.routes.js";
import { servicesRoutes } from "../modules/services/services.routes.js";
import { tasksRoutes } from "../modules/tasks/tasks.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/services", servicesRoutes);
router.use("/tasks", tasksRoutes);
router.use("/notes", notesRoutes);

export default router;
