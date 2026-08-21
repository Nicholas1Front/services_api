import tasksRepository from "@/modules/tasks/tasks.repository";

import {AppError} from "@/errors/AppError";

import type{
    createTaskDTO,
    updateTaskInfoDTO,
    updateTaskStatusDTO,
    getTasksFiltersDTO,
    addVisibilityToTaskDTO,
    deleteVisibilityFromTaskDTO
} from '@/modules/tasks/tasks.dto';

import{allowedTasksStatus} from '@/shared/tasks.status.list'

import {allowedUserRoles} from '@/shared/users.roles.list'

class TasksService{
    async createTask(
        serviceId : string,
        requesterId : string,
        data : createTaskDTO
    ){
        const existingService = await tasksRepository.getServiceById(
            serviceId
        );

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(requesterId !== existingService.ownerId){
            throw new AppError({
                message : 'Forbidden access to create task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(!allowedTasksStatus.includes(data.status)){
            throw new AppError({
                message : 'Invalid task status',
                statusCode : 400,
                code : 'INVALID_TASK_STATUS'
            })
        }

        const task = await tasksRepository.createTask(
            serviceId,
            requesterId, // adminId
            data
        )

        if(!task){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return task

    }

    async addVisibilityToTask(
        taskId : string,
        requesterId : string,
        data : addVisibilityToTaskDTO
    ){
        const rawTasks = await tasksRepository.getTasksByFilters({
            id : taskId
        })

        if(!rawTasks || rawTasks.length === 0){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        if(rawTasks[0]?.task.creatorId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to add visibility to task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const existingTaskData = rawTasks[0]?.task;
        const existingTaskVisibility = rawTasks[0]?.visibility;
        const RolesAlreadyAdded = rawTasks[0]?.visibility.map((visibility)=>{
            return visibility.role
        })

        data.visibilityRoles.forEach((role)=>{

            if(!allowedUserRoles.includes(role)){
                throw new AppError({
                    message : 'Invalid user role',
                    statusCode : 400,
                    code : "INVALID_USER_ROLE"
                })
            }

            if(RolesAlreadyAdded.includes(role)){
                throw new AppError({
                    message : 'Role already added to task',
                    statusCode : 400,
                    code : 'ROLE_ALREADY_ADDED'
                })
            }
        })

        const updatedVisibility = await tasksRepository.addVisibilityToTask(
            taskId,
            data.visibilityRoles
        )

        if(!updatedVisibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return {
            task : existingTaskData,
            visibility : [...existingTaskVisibility, ...updatedVisibility]
        }
    }

    async updateTaskInfo(
        requesterId : string,
        taskId : string,
        data : updateTaskInfoDTO
    ){
        let existingTask = await tasksRepository.getTaskById(taskId)

        if(!existingTask){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        if(existingTask.creatorId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to update task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(data.title !== undefined){
            existingTask.title = data.title;
        }

        if(data.description !== undefined){
            existingTask.description = data.description;
        }

        if(data.deliveryDate !== undefined){
            existingTask.deliveryDate = data.deliveryDate;
        }

        if(data.observations !== undefined){
            existingTask.observations = data.observations;
        }

        const updatedTask = await tasksRepository.updateTaskInfo(
            taskId,
            existingTask
        )

        if(!updatedTask){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const visibility = await tasksRepository.getTaskVisibilityByFilters({
            taskId : taskId
        })

        if(!visibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return {
            task : updatedTask,
            visibility : visibility
        }
        
    }

    async updateTaskStatus(
        taskId : string,
        requesterId : string,
        status : updateTaskStatusDTO
    ){
        const rawTasks = await tasksRepository.getTasksByFilters({
            id : taskId
        });

        if(!rawTasks || rawTasks.length === 0){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        const existingTask = rawTasks[0];
        const isCreator = existingTask?.task.creatorId === requesterId;
        const isAssignedTo = existingTask?.task.assignedToId === requesterId;

        if(!isCreator && !isAssignedTo){
            throw new AppError({
                message : 'Forbidden access to update task status',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(!allowedTasksStatus.includes(status)){
            throw new AppError({
                message : 'Invalid task status',
                statusCode : 400,
                code : 'INVALID_TASK_STATUS'
            })
        }

        const taskIsCancelled = existingTask?.task.status === 'CANCELLED'
        const taskIsBlocked = existingTask?.task.status === 'BLOCKED'

        if((taskIsCancelled || taskIsBlocked) && !isCreator){
            throw new AppError({
                message : 'Forbidden access to update task status - task is cancelled or blocked by creator',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if((status === 'CANCELLED' || status === 'BLOCKED') && !isCreator){
            throw new AppError({
                message : 'Forbidden access to update task status - only creator can cancel or block task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const updatedTask = await tasksRepository.updateTaskStatus(taskId, status)

        if(!updatedTask){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return updatedTask
    }

    async updateTaskAssignedUser(
        requesterId : string,
        taskId : string,
        targetUserId : string
    ){
        const existingTask = await tasksRepository.getTaskById(taskId);

        if(!existingTask){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        if(existingTask.creatorId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to update task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const user = await tasksRepository.getUserById(targetUserId);

        if(!user){
            throw new AppError({
                message : 'User not found',
                statusCode : 404,
                code : 'USER_NOT_FOUND'
            })
        }

        const updatedTask = await tasksRepository.updateTaskAssignedUser(taskId, targetUserId);

        if(!updatedTask){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return updatedTask
    }

    async getTasksByFilters(
        requesterRole : string,
        filters : getTasksFiltersDTO
    ){
        if(requesterRole !== 'ADMIN'){
            throw new AppError({
                message : 'Cannot get tasks - Forbidden access',
                statusCode : 403,
                code : 'CANNOT_GET_TASKS_FORBBIDEN_ACCESS'
            })
        }

        const tasks = await tasksRepository.getTasksByFilters(filters);

        return tasks
    }

    async getUserTasksByRole(
        role : string
    ){
        const tasks = await tasksRepository.getTasksByUserRole(role);

        if(!tasks){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return tasks
    }

    async deleteTaskById(
        taskId : string,
        requesterId : string
    ){
        const existingTask = await tasksRepository.getTaskById(taskId)

        if(!existingTask){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        if(existingTask.creatorId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to delete task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const deletedTask = await tasksRepository.deleteTaskById(taskId);

        if(!deletedTask){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const deletedTaskVisibility = await tasksRepository.deleteVisibilityByTaskId(taskId);

        if(!deletedTaskVisibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return true
    }

    async deleteVisibilityByRoles(
        requesterId : string,
        taskId : string,
        data : deleteVisibilityFromTaskDTO
    ){
        const rawTask = await tasksRepository.getTasksByFilters({id : taskId});

        if(!rawTask || rawTask.length === 0){
            throw new AppError({
                message : 'Task not found',
                statusCode : 404,
                code : 'TASK_NOT_FOUND'
            })
        }

        const existingTaskData = rawTask[0]?.task;
        const existingTaskVisibility = rawTask[0]?.visibility;
        const rolesExisting = rawTask[0]?.visibility.map((visibility)=>{return visibility.role});

        if(existingTaskData?.creatorId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to delete visibility from task',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        data.visibilityRoles.forEach((role:string)=>{
            if(!rolesExisting?.includes(role)){
                throw new AppError({
                    message : 'Visibility role not found',
                    statusCode : 404,
                    code : 'VISIBILITY_ROLE_NOT_FOUND'
                })
            }

            if(!allowedUserRoles.includes(role)){
                throw new AppError({
                    message : 'Invalid visibility role',
                    statusCode : 400,
                    code : 'INVALID_VISIBILITY_ROLE'
                })
            }
        })

        const deletedVisibility = await tasksRepository.deleteVisibilityByRoles(
            taskId,
            data.visibilityRoles
        )

        if(!deletedVisibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const resultVisibility = existingTaskVisibility?.map((visibility)=>{
            if(!data.visibilityRoles.includes(visibility.role)){
                return visibility;
            }
        })

        return{
            task : existingTaskData,
            visibility : resultVisibility
        }
    }
}

export default new TasksService();