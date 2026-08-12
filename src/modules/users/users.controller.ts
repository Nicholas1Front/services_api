import usersService from '@/modules/users/users.service';

import {
    createUserSchema,
    updateUserSchema,
    updateUserRoleSchema
} from '@/modules/users/users.schema';

import {AppError} from '@/errors/AppError';

import type {Request, Response} from 'express';

class UsersController{
    async createFirstAdmin(
        req : Request,
        res : Response
    ){
        const user = await usersService.createFirstAdmin({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            role : 'admin'
        })

        return res.status(201).json({
            message : 'First admin user created successfully',
            data : user
        })
    }
    async updateUser(
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

        const {
            name,
            email,
            password
        } = updateUserSchema.parse(req.body);

        const user = await usersService.updateUser(
            req.params.id as string, // targetId
            req.user.id, //requesterId
            req.user.role, // requesterRole
            {
                name,
                email,
                password
            }
        )

        return res.status(200).json({
            message : 'User updated successfully',
            data : user
        })
    }

    async updateUserRole(
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

        const {
            role
        } = updateUserRoleSchema.parse(req.body)

        const user = await usersService.updateUserRole(
            req.params.id as string, // targetId
            req.user.role, // requesterRole
            {
                role
            }
        )

        return res.status(200).json({
            message : 'User role updated successfully',
            data : user
        })
    }
}

export default new UsersController();