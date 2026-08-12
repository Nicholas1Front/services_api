import usersService from '@/modules/users/users.service';

import {
    createUserSchema,
    updateUserSchema,
    updateUserRoleSchema,
    findUsersFiltersSchema
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

    async createUser(
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

        const data = createUserSchema.parse(req.body);

        const user = await usersService.createUser(
            req.user.role,
            {
                name : data.name,
                email : data.email,
                password : data.password,
                role : data.role
            }
        )

        return res.status(200).json({
            message : "User created successfully",
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

    async findUsers(
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

        const filters = findUsersFiltersSchema.parse(req.query);

        const users = await usersService.findUsersByFilters(
            req.user.role,
            {
                ...filters
            }
        )

        return res.status(200).json({
            message : "Users retrived successfully",
            data : users
        })
    }

    async deleteUser(
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

        await usersService.deleteUser(
            req.params.id as string,
            req.user.role
        )

        return res.status(200).json({
            message : "User deleted successfully",
            data : true
        })
    }
}

export default new UsersController();