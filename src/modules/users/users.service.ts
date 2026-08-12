import usersRepository from '@/modules/users/users.repository';
import type{
    createUserDTO,
    updateUserDTO,
    updateUserRoleDTO
} from '@/modules/users/users.dto';

import {AppError} from '@/errors/AppError';

import {allowedUserRoles} from '@/shared/users.roles.list'

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

    async updateUser(
        requesterId : string,
        targetId : string,
        requesterRole : string,
        {
            name,
            email,
            password
        } : updateUserDTO
    ){
        if(
            requesterRole !== 'ADMIN' || targetId !== requesterId
        ){
            throw new AppError({
                message : 'Forbidden access to update user',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        let existingUser = await usersRepository.findUserById(targetId);

        if(!existingUser){
            throw new AppError({
                message : 'User not found',
                statusCode : 404,
                code : 'USER_NOT_FOUND'
            })
        }

        if(name !== undefined){
            existingUser.name = name
        }

        if(email !== undefined){
            const existingEmail = await usersRepository.findUserByEmail(email);

            if(existingEmail){
                throw new AppError({
                    message : 'Email already exists',
                    statusCode : 400,
                    code : "EMAIL_ALREADY_EXISTS"
                })
            }

            if(!existingEmail){
                existingUser.email = email
            }
        }

        if(password !== undefined){
            const passwordMatch = await bcrypt.compare(
                existingUser.passwordHash,
                password
            );

            if(passwordMatch){
                throw new AppError({
                    message : 'New password cannot be the same as the old one',
                    statusCode : 400,
                    code : 'NEW_PASSWORD_SAME_AS_OLD_ONE'
                })
            }

            if(!passwordMatch){
                const newPassword = await bcrypt.hash(password, 10);

                existingUser.passwordHash = newPassword
            }
        }

        let updatedUser = await usersRepository.updateUser(
            targetId,
            {
                name : existingUser.name,
                email : existingUser.email,
                passwordHash : existingUser.passwordHash,
                role : existingUser.role
            }
        )

        if(!updatedUser){
            throw new AppError({
                message : "Error updating user",
                statusCode : 500,
                code : "INTERNAL_SERVER_ERROR"
            })
        }

        return {
            id : updatedUser.id,
            name : updatedUser.name,
            email : updatedUser.email,
            role : updatedUser.role,
            createdAt : updatedUser.createdAt,
            updatedAt : updatedUser.updatedAt
        }

    }

    async updateUserRole(
        targetId : string,
        requesterRole : string,
        {
            role
        } : updateUserRoleDTO
    ){

        if(requesterRole !== 'ADMIN'){
            throw new AppError({
                message : 'Forbidden access to update user role',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        let existingUser = await usersRepository.findUserById(targetId);

        if(!existingUser){
            throw new AppError({
                message : "User not found",
                statusCode : 404,
                code : 'USER_NOT_FOUND'
            })
        }

        if(!allowedUserRoles.includes(role)){
            throw new AppError({
                message : 'Invalid user role',
                statusCode : 400,
                code : "INVALID_USER_ROLE"
            })
        }

        if(existingUser.role === 'ADMIN' && role !== 'ADMIN'){
            throw new AppError({
                message : 'Cannot change user role to a non-admin role',
                statusCode : 400,
                code : "CANNOT_CHANGE_USER_ROLE_TO_NON_ADMIN_ROLE"
            })
        }

        existingUser.role = role

        let updatedUser = await usersRepository.updateUser(
            targetId,
            {
                name : existingUser.name,
                email : existingUser.email,
                passwordHash : existingUser.passwordHash,
                role : existingUser.role
            }
        )

        if(!updatedUser){
            throw new AppError({
                message : "Error updating user role",
                statusCode : 500,
                code : "INTERNAL_SERVER_ERROR"
            })
        }

        return {
            id : updatedUser.id,
            name : updatedUser.name,
            email : updatedUser.email,
            role : updatedUser.role,
            createdAt : updatedUser.createdAt,
            updatedAt : updatedUser.updatedAt
        }
    }
}

export default new UsersService();