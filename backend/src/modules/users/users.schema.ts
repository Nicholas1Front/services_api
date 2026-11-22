import { z } from "zod";
import { allowedRoles } from "./shared/allowedRoles.js";

const userNameSchema = z.string().trim().min(1).max(100);
const userEmailSchema = z.string().trim().email().toLowerCase();
const userPasswordSchema = z.string().min(8).max(72);

export const createUserSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
  role: z.string().trim().min(1),
});

export const updateOwnUserSchema = z.object({
  name: userNameSchema.optional(),
  email: userEmailSchema.optional(),
  password: userPasswordSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const updateUserSchema = updateOwnUserSchema.extend({
  role: z.string().trim().min(1).optional(),
});

export const findUsersByFiltersSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  role: z.enum(allowedRoles).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateOwnUserInput = z.infer<typeof updateOwnUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FindUsersByFiltersInput = z.infer<typeof findUsersByFiltersSchema>;
