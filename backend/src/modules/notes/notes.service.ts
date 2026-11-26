import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { invalidateDashboardCache } from "../dashboard/dashboard.cache.js";
import type {
  CreateNoteInput,
  FindNotesByFiltersInput,
  UpdateNoteInput,
} from "./notes.schema.js";
import { notesRepository } from "./notes.repository.js";

const findNoteOrFail = async (noteId: string) => {
  const note = await notesRepository.findById(noteId);

  if (!note) {
    throw new AppError("Note not found", 404, "NOTE_NOT_FOUND");
  }

  return note;
};

const ensureNoteVisibility = (
  actor: AuthenticatedUser,
  userId: string,
) => {
  if (actor.role !== "ADMIN" && actor.id !== userId) {
    throw new AppError("Note not found", 404, "NOTE_NOT_FOUND");
  }
};

const ensureNoteOwner = (
  actor: AuthenticatedUser,
  userId: string,
) => {
  if (actor.id !== userId) {
    throw new AppError("You cannot modify this note", 403, "FORBIDDEN");
  }
};

export const notesService = {
  async createNote(actor: AuthenticatedUser, input: CreateNoteInput) {
    const entity = await notesRepository.findEntity(input.entityTable, input.entityId);

    if (!entity) {
      throw new AppError("Referenced entity not found", 404, "NOTE_ENTITY_NOT_FOUND");
    }

    const note = await notesRepository.create({
      ...input,
      userId: actor.id,
    });

    await invalidateDashboardCache();

    return note;
  },

  async getNote(actor: AuthenticatedUser, noteId: string) {
    const note = await findNoteOrFail(noteId);
    ensureNoteVisibility(actor, note.userId);
    return note;
  },

  async findNotesByFilters(
    actor: AuthenticatedUser,
    filters: FindNotesByFiltersInput,
  ) {
    const [notes, total] = await notesRepository.findByFilters(filters, actor);

    return {
      notes,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  },

  async updateNote(
    actor: AuthenticatedUser,
    noteId: string,
    input: UpdateNoteInput,
  ) {
    const note = await findNoteOrFail(noteId);
    ensureNoteOwner(actor, note.userId);

    const updatedNote = await notesRepository.update(noteId, input);

    await invalidateDashboardCache();

    return updatedNote;
  },

  async deleteNote(actor: AuthenticatedUser, noteId: string) {
    const note = await findNoteOrFail(noteId);
    ensureNoteOwner(actor, note.userId);

    const deletedNote = await notesRepository.delete(noteId);

    await invalidateDashboardCache();

    return deletedNote;
  },
};
