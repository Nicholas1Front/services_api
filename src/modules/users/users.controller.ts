import usersService from '@/modules/users/users.service';

import {
    createUserSchema
} from '@/modules/users/users.schema';

import type {Request, Response} from 'express';

class UsersController{
    async createFirstAdmin(
        req : Request,
        res : Response
    ){
        const {
            name,
            email,
            password
        } = createUserSchema.parse(req.body);

        const user = await usersService.createFirstAdmin({
            name,
            email,
            password,
            role : 'admin'
        })

        return res.status(201).json({
            message : 'First admin user created successfully',
            data : user
        })
    }
}

export default new UsersController();