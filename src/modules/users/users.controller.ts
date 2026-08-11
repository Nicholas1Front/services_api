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
}

export default new UsersController();