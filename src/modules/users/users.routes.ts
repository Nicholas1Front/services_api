import {Router} from 'express';
import usersController from '@/modules/users/users.controller';

const router = Router();

router.post(
    '/first-admin',
    usersController.createFirstAdmin
) // Only a developer should be able to create the first admin user

export default router;