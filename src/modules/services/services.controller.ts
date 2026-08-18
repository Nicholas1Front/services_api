import type {Request, Response} from 'express';
import servicesService from '@/modules/services/services.service';
import {
    createServiceSchema,
    updateServiceInfoSchema,
    updateServiceStatusSchema,
    getServicesFiltersSchema,
    addVisibilityToServiceSchema,
    deleteVisibilityFromServiceSchema
} from '@/modules/services/services.schema';

import {AppError} from '@/errors/AppError';

class ServicesController{
    async createService(
        req: Request,
        res : Response
    ){
        const data = createServiceSchema.parse(req.body);

        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const service = await servicesService.createService(
            req.user.role,
            req.user.id,
            data
        )

        return res.status(200).json({
            message : "Service created successfully",
            data : service
        })
    }

    async addVisibilityToService(
        req : Request,
        res : Response
    ){
        const data = addVisibilityToServiceSchema.parse(req.body);

        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const service = await servicesService.addVisibilityToService(
            req.user.id,
            req.params.id as string,
            data
        )

        return res.status(200).json({
            message : "Service visibility added successfully",
            data : service
        })
    }

    async updateServiceInfo(
        req : Request,
        res : Response
    ){
        const data = updateServiceInfoSchema.parse(req.body);

        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const service = await servicesService.updateServiceInfo(
            req.user.id,
            req.params.id as string,
            data
        )

        return res.status(200).json({
            message : "Service info updated successfully",
            data : service
        })
    }

    async updateServiceStatus(
        req : Request,
        res : Response
    ){
        const data = updateServiceStatusSchema.parse(req.body);

        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const service = await servicesService.updateServiceStatus(
            req.user.id,
            req.params.id as string,
            data
        )

        return res.status(200).json({
            message : "Service status updated successfully",
            data : service
        })
    }

    async getServicesByFilters(
        req : Request,
        res : Response
    ){
        const filters = getServicesFiltersSchema.parse(req.query);

        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const services = await servicesService.getServicesByFilters(
            req.user.role,
            filters
        );

        return res.status(200).json({
            message : "Services retrived successfully",
            data : services
        })
    }

    async getServicesVisibleToUser(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const services = await servicesService.getServicesVisibleToUser(
            req.user.role
        );

        return res.status(200).json({
            message : "Services visible to user retrived successfully",
            data : services
        })
    }

    async deleteService(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        await servicesService.deleteService(
            req.user.id,
            req.params.id as string
        )

        return res.status(200).json({
            message : "Service deleted successfully"
        })
    }

    async deleteVisibilityFromService(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const data = deleteVisibilityFromServiceSchema.parse(req.body);

        const service = await servicesService.deleteVisibilityFromService(
            req.user.id,
            req.params.id as string,
            data
        )

        return res.status(200).json({
            message : "Service visibility deleted successfully",
            data : service
        })
    }
}

export default new ServicesController();