import type {Request,Response} from 'express';

import {AppError} from '@/errors/AppError';

import {
    createTaskSchema,
    updateTaskInfoSchema,
    updateTaskStatusSchema,
    getTasksFiltersSchema,
    addVisibilityToTaskSchema,
    deleteVisibilityFromTaskSchema
} from '@/modules/tasks/tasks.schema'

import tasksService from '@/modules/tasks/tasks.service'

class TasksController{
    async createTask(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRORIZED'
            })
        }

        const data = createTaskSchema.parse(req.body);

        const task = await tasksService.createTask(
            req.params.id as string,
            req.user.id,
            data
        )

        return res.status(200).json({
            message : 'Task created successfully',
            data : task 
        })
    }

    async addVisibilityToTask(
        req: Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRORIZED'
            })
        }

        const data = addVisibilityToTaskSchema.parse(req.body);

        const task = await tasksService.addVisibilityToTask(
            req.params.id as string,
            req.user.id,
            data
        )

        return res.status(200).json({
            message : "Visibilities added to task successfully",
            data : task
        })
    }

    async updateTaskInfo(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        const data = updateTaskInfoSchema.parse(req.body);

        const task = await tasksService.updateTaskInfo(
            req.params.id as string,
            req.user.id,
            data
        );

        return res.status(200).json({
            message : "Task info updated successfully",
            data : task
        })
    }

    async updateTaskStatus(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        const data = updateTaskStatusSchema.parse(req.body);

        const task = await tasksService.updateTaskStatus(
            req.params.id as string,
            req.user.id,
            data
        )

        return res.status(200).json({
            message : "Status of task updated successfully",
            data : task
        })
    }

    async updateTaskAssignedUser(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        };

        const task = await tasksService.updateTaskAssignedUser(
            req.user.id,
            req.params.taskId as string,
            req.params.userId as string
        );

        return res.status(200).json({
            message : 'User signed to task successfully',
            data : task
        });

    }

    async getTasksByFilters(
        req: Request,
        res: Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        const filters = getTasksFiltersSchema.parse(req.query);

        const tasks = await tasksService.getTasksByFilters(
            req.user.role,
            filters
        )

        return res.status(200).json({
            message : "Tasks retrieved sucessfully",
            data : tasks
        })
    }

    async getUserTasks(
        req: Request,
        res: Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        const tasks = await tasksService.getUserTasksByRole(
            req.user.role
        );

        return res.status(200).json({
            message : 'User tasks retrieved successfully',
            data : tasks
        })
    }

    async deleteTaskById(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        await tasksService.deleteTaskById(
            req.params.id as string,
            req.user.id
        )

        return res.status(200).json({
            message : "Task deleted successfully"
        })
    }

    async deleteVisibilityByRoles(
        req:Request,
        res:Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHRIZED'
            })
        }

        const data = deleteVisibilityFromTaskSchema.parse(req.body);

        const task = await tasksService.deleteVisibilityByRoles(
            req.user.id,
            req.params.id as string,
            data
        )

        return res.status(200).json({
            message : "Visibility deleted from task successfully",
            data : task
        })
    }
}

export default new TasksController();
