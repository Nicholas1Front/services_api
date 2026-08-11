import {z} from 'zod';

export const loginSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

export const logoutSchema = z.object({
    token : z.string()
})
