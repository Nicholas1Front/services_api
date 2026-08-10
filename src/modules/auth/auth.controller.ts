import authService from '@/modules/auth/auth.service';
import type {Request, Response} from 'express';
import {AppError} from '@/errors/AppError';
import {
    loginSchema
} from '@/modules/auth/auth.schema';

class AuthController{
    async login(
        req : Request,
        res : Response
    ){
        const {
            email, 
            password
        } = loginSchema.parse(req.body);

        const result = await authService.login({email, password});

        return res.status(200).json({
            message : "Login successful",
            data : result
        })
    }
}

export default new AuthController();