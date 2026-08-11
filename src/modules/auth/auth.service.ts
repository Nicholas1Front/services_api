import type {LoginDTO} from '@/modules/auth/auth.dto';
import {AppError} from '@/errors/AppError';
import authRepository from '@/modules/auth/auth.repository';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthService{
    async login(
        {email, password} : LoginDTO
    ){
        const user = await authRepository.findUserByEmail(email);

        if(!user){
            throw new AppError({
                message : "Invalid credentials or User not exists",
                statusCode : 401,
                code : "INVALID_CREDENTIALS"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatch){
            throw new AppError({
                message : "Invalid credentials",
                statusCode : 401,
                code : "INVALID_CREDENTIALS"
            })
        }

        const token = jwt.sign(
            {
                id : user.id,
                email : user.email,
                role : user.role
            },
            process.env.JWT_SECRET as string,
            {
                subject : user.id,
                expiresIn : "1d"
            }
        )

        return {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : token
        }
    }
}

export default new AuthService();
