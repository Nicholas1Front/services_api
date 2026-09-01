import {z} from 'zod';

export const createNoteSchema = z.object({
    title : z.string().min(3).toLowerCase().optional(),
    content : z.string().min(3),
    entityId: z.string().min(3),
    entityTable : z.string().min(3)
})

export const updateNoteSchema = z.object({
    title : z.string().min(3).optional(),
    content : z.string().min(3).optional(),
    entityId: z.string().min(3).optional(),
    entityTable : z.string().min(3).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for update note"}
)

export const getNotesFiltersSchema = z.object({
    title : z.string().min(3).optional(),
    content : z.string().min(3).optional(),
    entityId: z.string().min(3).optional(),
    entityTable : z.string().min(3).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)