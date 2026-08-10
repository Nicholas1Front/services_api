import {z} from 'zod';
import { createUserSchema } from './users.schema';

export type createUserDTO = z.infer<typeof createUserSchema>;
