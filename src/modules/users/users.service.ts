import usersRepository from '@/modules/users/users.repository';
import type{
    createUserDTO
} from '@/modules/users/users.dto';

import {AppError} from '@/errors/AppError';

import bcrypt from 'bcrypt';

class UsersService{
    async createFirstAdmin(
        {name, email, password} : createUserDTO
    ){
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await usersRepository.createUser(
            name,
            email,
            passwordHash,
            'admin'
        )

        if(!user){
            throw new AppError({
                message : 'Error creating first admin user',
                statusCode : 500,
                code : 'INTERNAL_SERVER_ERROR'
            })
        }

        return user
    }
}

export default new UsersService();