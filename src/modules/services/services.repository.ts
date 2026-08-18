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

        let serviceVisibility = await Promise.all(
            data.visibilityRoles.map((role:string)=>{
                return prisma.serviceVisibility.create({
                    data : {
                        role : role,
                        service : {
                            connect : {
                                id : service.id
                            }
                        }
                    }
                })
            })
        )

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

        serviceVisibility = await Promise.all(
            roles.map((role:string)=>{
                return prisma.serviceVisibility.create({
                    data : {
                        role : role,
                        service : {
                            connect : {
                                id : serviceId
                            }
                        }
                    }
                })
            })
        )

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
                status : data.status
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
                status
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
        await prisma.service.delete({
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
        let servicesDeleted = await Promise.all(
            roles.map((role:string)=>{
                return prisma.serviceVisibility.deleteMany({
                    where : {
                        role : role,
                        serviceId : serviceId
                    }
                })
            })
        )
        return servicesDeleted
    }
}

export default new ServicesRepository();