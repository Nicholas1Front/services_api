import {
    loginSchema,
    logoutSchema,
} from '@/modules/auth/auth.schema';
import {z} from 'zod';

export type LoginDTO = z.infer<typeof loginSchema>;
export type LogoutDTO = z.infer<typeof logoutSchema>;

export type MeDTO = {
    id : string;
}