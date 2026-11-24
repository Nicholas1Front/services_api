import { z } from "zod";
import { allowedNoteEntities } from "./shared/allowedNoteEntities.js";

const noteTitleSchema = z.string().trim().min(1).max(150);
const noteContentSchema = z.string().trim().min(1).max(10000);

export const createNoteSchema = z.object({
  title: noteTitleSchema,
  content: noteContentSchema,
  entityId: z.string().uuid(),
  entityTable: z.enum(allowedNoteEntities),
}).strict();

export const updateNoteSchema = z.object({
  title: noteTitleSchema.optional(),
  content: noteContentSchema.optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const findNotesByFiltersSchema = z.object({
  title: z.string().trim().min(1).optional(),
  entityId: z.string().uuid().optional(),
  entityTable: z.enum(allowedNoteEntities).optional(),
  userId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type FindNotesByFiltersInput = z.infer<typeof findNotesByFiltersSchema>;
