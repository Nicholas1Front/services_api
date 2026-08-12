import {
    loginSchema,
} from '@/modules/auth/auth.schema';
import {z} from 'zod';

export type LoginDTO = z.infer<typeof loginSchema>;
export type LogoutDTO = {
    id : string
}

export type MeDTO = {
    id : string;
}