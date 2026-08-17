import {prisma} from '@/config/prisma';

import type{
    createServiceDTO
} from '@/modules/services/services.dto';

class ServicesRepository{
    async createService(
        ownerId : string,
        data : createServiceDTO
    ){

        const service = await prisma.service.create({
            data : {
                title : data.title,
                description : data.description,
                status : data.status,
                owner : {
                    connect : {
                        id : ownerId
                    }
                }
            }
        })

        let serviceVisibility = new Array;

        data.visibilityRoles.forEach(async (role)=>{
            const permission = await prisma.serviceVisibility.create({
                data : {
                    role : role,
                    service : {
                        connect : {
                            id : service.id
                        }
                    }
                }
            })

            serviceVisibility.push(permission);
        })

        return {
            service_data : service,
            visibility : serviceVisibility
        }
    }

    async addVisibilityToService(
        serviceId : string,
        roles : any
    ){
        let serviceVisibility = new Array;

        roles.forEach(async (role:string)=>{
            const permission = await prisma.serviceVisibility.create({
                data : {
                    role : role,
                    service : {
                        connect : {
                            id : serviceId
                        }
                    }
                }
            })

            serviceVisibility.push(permission);
        })

        return serviceVisibility
    }

    async updateServiceInfo(
        serviceId : string,
        data : any
    ){
        const service = await prisma.service.update({
            where : {
                id : serviceId
            },
            data : {
                title : data.title,
                description : data.description,
                status : data.status,
                updatedAt : new Date(),
            }
        })

        return service
    }

    async updateServiceStatus(
        serviceId : string,
        status : string
    ){
        const service = await prisma.service.update({
            where : {
                id : serviceId
            },
            data : {
                status,
                updatedAt : new Date(),
            }
        });

        return service
    }

    async getServiceByFilters(
        filters : any
    ){
        const services = await prisma.service.findMany({
            where : {
                id : filters.id,
                title : filters.title,
                description : filters.description,
                status : filters.status,
                ownerId : filters.ownerId,
                createdAt : filters.createdAt,
                updatedAt : filters.updatedAt,
            }
        })

        return services
    }

    async getServiceById(
        id : string
    ){
        const service = await prisma.service.findUnique({
            where : {
                id
            }
        })

        return service
    }

    async getVisibilityByFilters(
        filters : any
    ){
        const permissions = await prisma.serviceVisibility.findMany({
            where : {
                id : filters.id,
                serviceId : filters.serviceId,
                role : filters.role
            }
        })

        return permissions
    }

    async deleteServiceById(
        id : string
    ){
        await prisma.service.deleteMany({
            where : {
                id
            }
        })

        return true
    }

    async deleteVisibilityByRole(
        serviceId : string,
        roles : any 
    ){
        roles.forEach(async (role:string)=>{
            await prisma.serviceVisibility.deleteMany({
                where : {
                    serviceId,
                    role
                }
            })
        })

        return true
    }
}

export default new ServicesRepository();