import servicesRepository from "@/modules/services/services.repository";
import type{
    createServiceDTO,
    updateServiceInfoDTO,
    updateServiceStatusDTO,
    getServicesFiltersDTO,
    addVisibilityToServiceDTO,
    deleteVisibilityFromServiceDTO
} from "@/modules/services/services.dto";

import {AppError} from "@/errors/AppError";

import {
    allowedServicesStatus
} from '@/shared/services.status.list'

import {
    allowedUserRoles
} from '@/shared/users.roles.list'


class ServicesService{
    async createService(
        requesterRole : string,
        ownerId : string,
        data : createServiceDTO
    ){
        if(requesterRole !== 'ADMIN'){
            throw new AppError({
                message : 'Cannot create service - Forbidden access',
                statusCode : 403,
                code : 'CANNOT_CREATE_SERVICE_FORBBIDEN_ACCESS'
            })
        }

        if(!allowedServicesStatus.includes(data.status)){
            throw new AppError({
                message : 'Invalid service status',
                statusCode : 400,
                code : 'INVALID_SERVICE_STATUS'
            })
        }

        data.visibilityRoles.forEach((role)=>{
            if(!allowedUserRoles.includes(role)){
                throw new AppError({
                    message : 'Invalid user role',
                    statusCode : 400,
                    code : "INVALID_USER_ROLE"
                })
            }
        })

        const service = await servicesRepository.createService(
            ownerId,
            data
        );


        if(!service){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return service
    }

    async updateServiceInfo(
        requesterId : string,
        serviceId : string,
        data : updateServiceInfoDTO
    ){
        let existingService = await servicesRepository.getServiceById(serviceId);

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(existingService.ownerId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to update service',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(data.title !== undefined){
            existingService.title = data.title;
        }

        if(data.description !== undefined){
            existingService.description = data.description;
        }

        if(data.status !== undefined){
            if(!allowedServicesStatus.includes(data.status)){
                throw new AppError({
                    message : 'Invalid service status',
                    statusCode : 400,
                    code : 'INVALID_SERVICE_STATUS'
                })
            }

            existingService.status = data.status;
        }

        const updatedService = await servicesRepository.updateServiceInfo(
            serviceId,
            existingService
        );

        if(!updatedService){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const visibilityFromService = await servicesRepository.getVisibilityByFilters({
            serviceId : serviceId
        });

        if(!visibilityFromService){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return {
            service : updatedService,
            visibility : visibilityFromService
        }
    }

    async updateServiceStatus(
        requesterId : string,
        serviceId : string,
        status : updateServiceStatusDTO
    ){
        let existingService = await servicesRepository.getServiceById(serviceId);

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(existingService.ownerId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to update service',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(!allowedServicesStatus.includes(status)){
            throw new AppError({
                message : 'Invalid service status',
                statusCode : 400,
                code : 'INVALID_SERVICE_STATUS'
            })
        }

        const updatedService = await servicesRepository.updateServiceStatus(
            serviceId,
            status
        );

        if(!updatedService){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const visibilityFromService = await servicesRepository.getVisibilityByFilters({
            serviceId : serviceId
        });

        if(!visibilityFromService){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return {
            service : updatedService,
            visibility : visibilityFromService
        }
    }

    async getServicesByFilters(
        requesterRole : string,
        filters : getServicesFiltersDTO
    ){
        if(requesterRole !== 'ADMIN'){
            throw new AppError({
                message : 'Cannot get services - Forbidden access',
                statusCode : 403,
                code : 'CANNOT_GET_SERVICES_FORBBIDEN_ACCESS'
            })
        }

        let results = new Array;

        let services = await servicesRepository.getServiceByFilters(filters);

        if(!services){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        results = await Promise.all(
            services.map(async(service)=>{
                const visibility = await servicesRepository.getVisibilityByFilters({
                    serviceId : service.id
                });

                return {
                    service : service,
                    visibility : visibility
                }
            })
        )

        return results
    }

    async getServicesVisibleToUser(
        requesterRole : string
    ){
        const permissions = await servicesRepository.getVisibilityByFilters({
            role : requesterRole
        });

        if(!permissions){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        let services = new Array;

        services = await Promise.all(
            permissions.map(async(permission)=>{
                return await servicesRepository.getServiceById(permission.serviceId)
            })
        )

        return services;
    }

    async deleteService(
        requesterId : string,
        serviceId : string
    ){
        let existingService = await servicesRepository.getServiceById(serviceId);

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(existingService.ownerId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to delete service',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const deletedService = await servicesRepository.deleteServiceById(serviceId);

        if(!deletedService){
            throw new AppError({
                message : "Internal server error",
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return true
    }

    // Permissions/Visibility by roles down here

    async addVisibilityToService(
        requesterId : string,
        serviceId : string,
        roles : addVisibilityToServiceDTO
    ){
        let existingService = await servicesRepository.getServiceById(serviceId);

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(existingService.ownerId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to add visibility to service',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        const visibilityFromService = await servicesRepository.getVisibilityByFilters({
            serviceId : serviceId
        });

        if(!visibilityFromService){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const rolesAlreadyVisible = visibilityFromService.map((role)=>role.role);

        roles.forEach((role)=>{
            if(!allowedUserRoles.includes(role)){
                throw new AppError({
                    message : `Invalid user role - ${role}`,
                    statusCode : 400,
                    code : "INVALID_USER_ROLE"
                })
            }
        });

        roles.forEach((role)=>{
            if(rolesAlreadyVisible.includes(role)){
                throw new AppError({
                    message : `Role already visible - ${role}`,
                    statusCode : 400,
                    code : "ROLE_ALREADY_VISIBLE"
                })
            }
        })

        const addedVisibility = await servicesRepository.addVisibilityToService(serviceId, roles);

        if(!addedVisibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return {
            service : existingService,
            visibility : [...visibilityFromService, ...addedVisibility]
        }

    }

    async deleteVisibilityFromService(
        requesterId : string,
        serviceId : string,
        roles : deleteVisibilityFromServiceDTO
    ){
        let existingService = await servicesRepository.getServiceById(serviceId);

        if(!existingService){
            throw new AppError({
                message : 'Service not found',
                statusCode : 404,
                code : 'SERVICE_NOT_FOUND'
            })
        }

        if(existingService.ownerId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to delete visibility from service',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        let visibilityFromService = await servicesRepository.getVisibilityByFilters({
            serviceId : serviceId
        });

        if(!visibilityFromService){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const rolesFromService = visibilityFromService.map((role)=>role.role);

        roles.forEach((role)=>{
            if(!rolesFromService.includes(role)){
                throw new AppError({
                    message : `Role not found - ${role}`,
                    statusCode : 400,
                    code : "ROLE_NOT_FOUND"
                })
            }
        });

        const deletedVisibility = await servicesRepository.deleteVisibilityByRole(serviceId, roles);

        if(!deletedVisibility){
            throw new AppError({
                message : 'Internal server error',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        const visibilityAfterDeletion = new Array;

        visibilityFromService.forEach((role)=>{
            if(!roles.includes(role.role)){
                visibilityAfterDeletion.push(role);
            }
        })

        return {
            service : existingService,
            visibility : visibilityAfterDeletion
        }
        
    }

}

export default new ServicesService();