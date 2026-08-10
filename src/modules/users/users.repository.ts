import {prisma} from '@/config/prisma';

class UsersRepository{
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
}

export default new UsersRepository();