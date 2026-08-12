import {z} from 'zod';
import { 
    createUserSchema,
    updateUserSchema,
    updateUserRoleSchema,
    findUsersFiltersSchema
} from '@/modules/users/users.schema';

export type createUserDTO = z.infer<typeof createUserSchema>;

export type updateUserDTO = z.infer<typeof updateUserSchema>;

export type updateUserRoleDTO = z.infer<typeof updateUserRoleSchema>;

export type findUsersFiltersDTO = z.infer<typeof findUsersFiltersSchema>;
