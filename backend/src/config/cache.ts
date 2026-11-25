import { logger } from "./logger.js";
import { redis } from "./redis.js";

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetchData: () => Promise<T>,
): Promise<T> {
  try {
    const cachedValue = await redis.get(key);

    if (cachedValue !== null) {
      return JSON.parse(cachedValue) as T;
    }
  } catch (error) {
    logger.warn({ err: error, key }, "Cache read failed");
  }

  const data = await fetchData();

  try {
    const serializedData = JSON.stringify(data);

    if (serializedData !== undefined) {
      await redis.set(key, serializedData, {
        EX: ttlSeconds,
      });
    }
  } catch (error) {
    logger.warn({ err: error, key }, "Cache write failed");
  }

  return data;
}
