import { z } from "zod";
import { allowedRoles } from "../users/shared/allowedRoles.js";
import { allowedTaskStatus } from "./shared/allowedTaskStatus.js";

const taskTitleSchema = z.string().trim().min(1).max(150);
const taskDescriptionSchema = z.string().trim().min(1).max(2000);
const taskVisibilityRolesSchema = z.array(z.enum(allowedRoles));

const ensureUniqueRoles = (roles: string[]) =>
  new Set(roles).size === roles.length;

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  status: z.enum(allowedTaskStatus).default("PENDING"),
  assignedToId: z.string().uuid().nullable().optional(),
  deliveryDate: z.coerce.date().nullable().optional(),
  observations: z.string().trim().max(2000).nullable().optional(),
  roles: taskVisibilityRolesSchema
    .min(1)
    .refine(ensureUniqueRoles, { message: "Roles must not contain duplicates" }),
}).strict();

export const updateTaskSchema = z.object({
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema.optional(),
  status: z.enum(allowedTaskStatus).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  observations: z.string().trim().max(2000).nullable().optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const updateTaskDeliveryDateSchema = z.object({
  deliveryDate: z.coerce.date().nullable(),
}).strict();

export const findTasksByFiltersSchema = z.object({
  title: z.string().trim().min(1).optional(),
  status: z.enum(allowedTaskStatus).optional(),
  serviceId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskDeliveryDateInput = z.infer<typeof updateTaskDeliveryDateSchema>;
export type FindTasksByFiltersInput = z.infer<typeof findTasksByFiltersSchema>;
