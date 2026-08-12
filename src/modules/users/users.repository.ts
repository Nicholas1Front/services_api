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
}

export default new UsersRepository();