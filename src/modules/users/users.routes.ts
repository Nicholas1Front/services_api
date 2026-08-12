import {Router} from 'express';
import {authMiddleware} from '@/middlewares/auth.middleware';
import usersController from '@/modules/users/users.controller';

const router = Router();

router.post(
    '/first-admin',
    usersController.createFirstAdmin
) // Only a developer should be able to create the first admin user

router.put(
    '/update-user/:id',
    authMiddleware,
    usersController.updateUser
)

router.patch(
    '/update-user-role/:id',
    authMiddleware,
    usersController.updateUserRole
)

export default router;