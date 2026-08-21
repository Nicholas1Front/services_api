import {prisma} from '@/config/prisma';

class TasksRepository{

    // helpers
    async getServiceById(
        serviceId : string
    ){
        const service = await prisma.service.findUnique({
            where : {
                id : serviceId
            }
        })

        return service
    }

    async getUserById(
        userId : string
    ){
        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        });

        return user
    }

    // Tasks
    async createTask(
        serviceId : string,
        adminId : string,
        data : any
    ){
        const task = await prisma.task.create({
            data : {
                title : data.title,
                description : data.description,
                status : data.status,
                deliveryDate : data.deliveryDate,
                observations : data.observations,
                service : {
                    connect : {
                        id : serviceId
                    }
                },
                creator : {
                    connect : {
                        id : adminId
                    }
                },
                assignedTo : {
                    connect : {
                        id : data.assignedToId
                    }
                }

            }
        });

        const visibilityOfTask = await Promise.all(
            data.visibilityRoles.map((role:string)=>{
                return prisma.taskVisibility.create({
                    data : {
                        role : role,
                        task : {
                            connect : {
                                id : task.id
                            }
                        }
                    }
                })
            })
        )

        return {
            task : task,
            visibility : visibilityOfTask
        }
    }

    async updateTaskInfo(
        taskId : string,
        data : any
    ){
        const task = await prisma.task.update({
            where : {
                id : taskId
            },
            data : {
                title : data.title,
                description : data.description,
                deliveryDate : data.deliveryDate,
                observations : data.observations
            }
        })

        const visibility = await prisma.taskVisibility.findMany({
            where : {
                taskId : taskId
            }
        })

        return {
            task : task,
            visibility : visibility
        }
    }

    async updateTaskStatus(
        taskId : string,
        status : string
    ){
        const task = await prisma.task.update({
            where : {
                id : taskId
            },
            data : {
                status
            }
        })

        const visibility = await prisma.taskVisibility.findMany({
            where : {
                taskId : taskId
            }
        })

        return {
            task : task,
            visibility : visibility
        }
    }

    async updateTaskAssignedUser(
        taskId : string,
        targetUserId : string
    ){
        const task = await prisma.task.update({
            where : {
                id : taskId
            },
            data : {
                assignedTo : {
                    connect : {
                        id : targetUserId
                    }
                }
            }
        });

        const visibility = await prisma.taskVisibility.findMany({
            where : {
                taskId : taskId
            }
        })

        return {
            task : task,
            visibility : visibility
        }
    }

    async getTaskById(
        taskId : string
    ){
        const task = await prisma.task.findUnique({
            where : {
                id : taskId
            }
        })

        return task
    }

    async getTasksByFilters(
        filters : any
    ){
        const tasks = await prisma.task.findMany({
            where : {
                id : filters.id,
                serviceId : filters.serviceId,
                title : filters.title,
                description : filters.description,
                status : filters.status,
                assignedToId : filters.assignedToId,
                creatorId : filters.creatorId,
                deliveryDate : filters.deliveryDate,
                observations : filters.observations,
                createdAt : filters.createdAt,
                updatedAt : filters.updatedAt
            }
        })

        const results = await Promise.all(
            tasks.map(async (task)=>{
                const visibility = await prisma.taskVisibility.findMany({
                    where : {
                        taskId : task.id
                    }
                })

                const result = {
                    task : task,
                    visibility : visibility
                }

                return result
            })
        )

        return results
    }

    async getTasksByUserRole(
        role : string
    ){
        const visibility = await prisma.taskVisibility.findMany({
            where : {
                role : role
            }
        })

        const tasks = await Promise.all(
            visibility.map(async (taskVisibility)=>{
                const task = await prisma.task.findUnique({
                    where : {
                        id : taskVisibility.taskId
                    }
                })

                return {
                    task : task,
                    visibility : taskVisibility
                }
            })
        )

        return tasks
    }

    async deleteTaskById(
        taskId : string
    ){
        await prisma.task.delete({
            where : {
                id : taskId
            }
        })

        return true
    }

    // Task visibility

    async addVisibilityToTask(
        taskId : string,
        roles : any
    ){
        const taskVisibility = await Promise.all(
            roles.map(async(role:string)=>{
                const visibility = await prisma.taskVisibility.create({
                    data : {
                        role : role,
                        task : {
                            connect : {
                                id : taskId
                            }
                        }
                    }
                })

                return visibility
            })
        )

        return taskVisibility
    }

    async getTaskVisibilityByFilters(
        filters : any
    ){
        const taskVisibility = await prisma.taskVisibility.findMany({
            where : {
                taskId : filters.taskId,
                role : filters.role
            }
        })

        return taskVisibility
    }

    async deleteVisibilityByTaskId(
        taskId : string
    ){
        await prisma.taskVisibility.deleteMany({
            where : {
                taskId : taskId
            }
        })

        return true
    }

    async deleteVisibilityByRoles(
        taskId : string,
        roles : any
    ){
        const tasksDeleted = await Promise.all(
            roles.map(async(role:string)=>{
                return prisma.taskVisibility.deleteMany({
                    where : {
                        role : role,
                        id : taskId
                    }
                })
            })
        )

        return true
    }
}

export default new TasksRepository()