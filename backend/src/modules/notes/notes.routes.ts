import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createNote,
  deleteNote,
  findNotesByFilters,
  getNote,
  updateNote,
} from "./notes.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/find-notes-by-filters", findNotesByFilters);
router.post("/", createNote);
router.get("/:id", getNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export { router as notesRoutes };
