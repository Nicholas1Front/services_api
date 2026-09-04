import {redis} from '@/config/redis';

export class CacheService {
    async get<T>(key : string) : Promise<T | null>{
        const data = await redis.get(key);

        if(!data){ return null;}

        return JSON.parse(data) as T;
    }

    async set<T>(
        key : string,
        value : T,
        ttlInSeconds = 60
    ): Promise<void>{
        await redis.set(
            key,
            JSON.stringify(value),
            {
                EX : ttlInSeconds
            }
        )
    }

    async delete(key : string): Promise<void>{
        await redis.del(key);
    }
}

export const cacheService = new CacheService();