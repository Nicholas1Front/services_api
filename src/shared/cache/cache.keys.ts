export const cacheKeys = {
    // cache keys for notes module
    notes : {
        user : (userId : string) => `notes:user:${userId}`,
        filters : (filters : {
            id? : string,
            userId? : string,
            title? : string,
            content? : string,
            entityId? : string,
            entityTable? : string
        })=> {
            const filterKey = Object.entries(filters)
                .filter(([, value])=> value !== undefined)
                .sort(([keyA, keyB])=> keyA.localeCompare(keyB))
                .map(([key, value])=> `${key}:${value}`)
                .join('|')
            
            return `notes:filters:${filterKey}`
        }
    }
}