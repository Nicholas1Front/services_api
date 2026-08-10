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
}

export default new AuthRepository();