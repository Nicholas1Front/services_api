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
                role,
                createdAt : new Date(),
                updatedAt : new Date()
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

    async findUserByFilters(
        filters : any
    ){
        const users = await prisma.user.findMany({
            select : {
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