import {
    createTaskSchema,
    updateTaskInfoSchema,
    updateTaskStatusSchema,
    getTasksFiltersSchema,
    addVisibilityToTaskSchema,
    deleteVisibilityFromTaskSchema
} from '@/modules/tasks/tasks.schema';

import {z} from 'zod';

export type createTaskDTO = z.infer<typeof createTaskSchema>;

export type updateTaskInfoDTO = z.infer<typeof updateTaskInfoSchema>;

export type updateTaskStatusDTO = z.infer<typeof updateTaskStatusSchema>;

export type getTasksFiltersDTO = z.infer<typeof getTasksFiltersSchema>;

export type addVisibilityToTaskDTO = z.infer<typeof addVisibilityToTaskSchema>;

export type deleteVisibilityFromTaskDTO = z.infer<typeof deleteVisibilityFromTaskSchema>;