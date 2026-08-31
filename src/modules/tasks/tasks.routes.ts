import {Router} from 'express';

import {authMiddleware} from '@/middlewares/auth.middleware';
import tasksController from '@/modules/tasks/tasks.controller';

const router = Router();

router.use(authMiddleware);

router.post(
    '/create-task',
    tasksController.createTask
)

router.patch(
    '/add-visibility-to-task',
    tasksController.addVisibilityToTask
)

router.put(
    '/update-task-info',
    tasksController.updateTaskInfo
)

router.patch(
    '/update-task-status',
    tasksController.updateTaskStatus
)

router.patch(
    '/update-task-assigned-user',
    tasksController.updateTaskAssignedUser
)

router.get(
    '/get-tasks-by-filters',
    tasksController.getTasksByFilters
)

router.get(
    '/get-user-tasks',
    tasksController.getUserTasks
)

router.delete(
    '/delete-task-by-id',
    tasksController.deleteTaskById
)

router.delete(
    '/delete-visibility-by-roles',
    tasksController.deleteVisibilityByRoles
)

export default router;