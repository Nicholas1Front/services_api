import {z} from 'zod';
import {
    optionalToNullSchema
} from '@/shared/helpers/optional.to.null.schema';

export const createServiceSchema = z.object({
    title : z.string().min(3),
    description : optionalToNullSchema(z.string()),
    status : z.string().min(3),
    visibilityRoles : z.array(
        z.string().min(1).toUpperCase()
    ).min(1)
})

export const updateServiceInfoSchema = z.object({
    title : z.string().min(3).optional(),
    description : z.string().optional(),
    status : z.string().min(3).optional(),
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)

export const updateServiceStatusSchema = z.string().min(3).toUpperCase();

export const getServicesFiltersSchema = z.object({
    id : z.string().optional(),
    title : z.string().optional(),
    description : z.string().optional(),
    status : z.string().toUpperCase().optional(),
    createdAt : z.coerce.date().optional(),
    updatedAt : z.coerce.date().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)

export const addVisibilityToServiceSchema = z.array(
    z.string().min(1).toUpperCase()
).min(1);

export const deleteVisibilityFromServiceSchema = z.array(
    z.string().min(1).toUpperCase()
).min(1);
