import {prisma} from '@/config/prisma';

class UsersRepository{

    async findUserById(
        id : string
    ){
        const user = await prisma.user.findUnique({
            where : {
                id
            }
        })

        return user
    }

    async findUserByEmail(
        email : string
    ){
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        return user
    }
    
    async findUserByFilters(
        filters : any
    ){
        const users = await prisma.user.findMany({
            where : {
                id : filters.id,
                name : filters.name,
                email : filters.email,
                role : filters.role,
                createdAt : filters.createdAt,
                updatedAt : filters.updatedAt
            }
        })

        return users
    }

    async createUser(
        name : string,
        email : string,
        password : string,
        role : string
    ){
        const user = await prisma.user.create({
            data : {
                name,
                email,
                passwordHash : password,
                role
            }
        })

        return user;
    }

    async updateUser(
        id : string,
        data : {
            name : string,
            email : string,
            passwordHash : string,
            role : string
        }
    ){
        const user = await prisma.user.update({
            where : {
                id
            },
            data : {
                ...data
            }
        })

        return user
    }

    async deleteUser(
        id : string
    ){
        await prisma.user.delete({
            where : {
                id
            }
        });

        return true
    }
}

export default new UsersRepository();