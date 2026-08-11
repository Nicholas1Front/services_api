import {prisma} from '@/config/prisma';

class AuthRepository{
    async findUserByEmail(
        email : string
    ){
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        return user
    }

    async findUserById(
        id : string
    ){
        const user = await prisma.user.findUnique({
            where : {
                id : id
            }
        })

        return user
    }
}

export default new AuthRepository();