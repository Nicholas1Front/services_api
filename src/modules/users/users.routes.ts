import {Router} from 'express';
import {authMiddleware} from '@/middlewares/auth.middleware';
import usersController from '@/modules/users/users.controller';

const router = Router();

router.post(
    '/first-admin',
    usersController.createFirstAdmin
) // Only a developer should be able to create the first admin user

router.post(
    '/create-user',
    authMiddleware,
    usersController.createUser
)

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

router.delete(
    '/delete-user/:id',
    authMiddleware,
    usersController.deleteUser
)

router.get(
    '/get-users',
    authMiddleware,
    usersController.findUsers
)


export default router;