import {createClient} from 'redis';

const redis = createClient({
    url : process.env.REDIS_URL || 'redis://localhost:6379'
})

redis.on('error', (error)=>{
    console.error('Redis client error :',error)
})

export const connectRedis = async()=>{
    if(!redis.isOpen){
        await redis.connect()
        console.log('Redis connected successfully')
    }
};

export {redis};