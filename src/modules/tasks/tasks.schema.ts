import {z} from 'zod';

import {
    optionalToNullSchema
} from '@/shared/helpers/optional.to.null.schema';

export const createTaskSchema = z.object({
    assignedToId : optionalToNullSchema(z.string()),
    title : z.string().min(3),
    description : z.string().min(3),
    status : z.string().min(3),
    deliveryDate : z.coerce.date(),
    observations : z.string().optional(),
    visibilityRoles : z.array(
        z.string().min(1).toUpperCase()
    ).min(1)
})

export const updateTaskInfoSchema = z.object({
    title : z.string().min(3).optional(),
    description : z.string().optional(),
    deliveryDate : z.coerce.date().optional(),
    observations : z.string().optional(), 
})

export const updateTaskStatusSchema = z.string().min(3).toUpperCase();

export const getTasksFiltersSchema = z.object({
    id : z.string().optional(),
    serviceId : z.string().optional(),
    title : z.string().optional(),
    description : z.string().optional(),
    assignedToId : z.string().optional(),
    creatorId : z.string().optional(),
    status : z.string().toUpperCase().optional(),
    createdAt : z.coerce.date().optional(),
    updatedAt : z.coerce.date().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)

export const addVisibilityToTaskSchema = z.object({
    visibilityRoles : z.array(
        z.string().min(1).toUpperCase()
    ).min(1)
})

export const deleteVisibilityFromTaskSchema = z.object({
    visibilityRoles : z.array(
        z.string().min(1).toUpperCase()
    ).min(1)
})