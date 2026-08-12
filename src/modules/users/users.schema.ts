import {z} from 'zod';

export const createUserSchema = z.object({
    name : z.string().min(3).max(50),
    email : z.string().email(),
    password : z.string().min(6).max(50),
    role : z.string().min(3).max(40)
})

export const updateUserSchema = z.object({
    name : z.string().max(50).optional(),
    email : z.string().email().optional(),
    password : z.string().min(6).max(50).optional(),
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)

export const updateUserRoleSchema = z.object({
    role : z.string().min(3).max(40)
})