import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createUser,
  deleteUser,
  findUserById,
  findUsersByFilters,
  getOwnProfile,
  updateOwnProfile,
  updateUser,
} from "./users.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", getOwnProfile);
router.patch("/me", updateOwnProfile);

router.post("/", createUser);
router.get("/find-users-by-filters", findUsersByFilters);
router.get("/:id", findUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as usersRoutes };
