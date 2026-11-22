import { z } from "zod";
import { allowedRoles } from "../users/shared/allowedRoles.js";
import { allowedServicesStatus } from "./shared/allowedServicesStatus.js";

const serviceTitleSchema = z.string().trim().min(1).max(150);
const serviceDescriptionSchema = z.string().trim().max(2000);
const serviceVisibilityRolesSchema = z.array(z.enum(allowedRoles));

const ensureUniqueRoles = (roles: string[]) =>
  new Set(roles).size === roles.length;

export const createServiceSchema = z.object({
  title: serviceTitleSchema,
  description: serviceDescriptionSchema.optional(),
  status: z.enum(allowedServicesStatus).default("PENDING"),
}).strict();

export const updateServiceSchema = z.object({
  title: serviceTitleSchema.optional(),
  description: serviceDescriptionSchema.nullable().optional(),
  status: z.enum(allowedServicesStatus).optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const addServiceVisibilitySchema = z.object({
  roles: serviceVisibilityRolesSchema
    .min(1)
    .refine(ensureUniqueRoles, { message: "Roles must not contain duplicates" }),
}).strict();

export const updateServiceVisibilitySchema = z.object({
  roles: serviceVisibilityRolesSchema.refine(
    ensureUniqueRoles,
    { message: "Roles must not contain duplicates" },
  ),
}).strict();

export const findServicesByFiltersSchema = z.object({
  title: z.string().trim().min(1).optional(),
  status: z.enum(allowedServicesStatus).optional(),
  ownerId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type AddServiceVisibilityInput = z.infer<typeof addServiceVisibilitySchema>;
export type UpdateServiceVisibilityInput = z.infer<typeof updateServiceVisibilitySchema>;
export type FindServicesByFiltersInput = z.infer<typeof findServicesByFiltersSchema>;
