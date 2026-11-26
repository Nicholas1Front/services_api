
import { afterAll, beforeAll, afterEach, describe, expect, it, jest } from "@jest/globals";
import { redis } from "./redis.js";
import { getOrSetCache } from "./cache.js";

const cacheKey = `test:cache:${Date.now()}`;

beforeAll(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
});

afterEach(async () => {
  await redis.del(cacheKey);
});

afterAll(async () => {
  if (redis.isOpen) {
    await redis.quit();
  }
});

describe("getOrSetCache", () => {
  it("should fetch and cache data on cache miss", async () => {
    const fetchData = jest.fn<() => Promise<{ message: string }>>()
      .mockResolvedValue({ message: "Hello cache" });

    const result = await getOrSetCache(cacheKey, 30, fetchData);

    expect(result).toEqual({ message: "Hello cache" });
    expect(fetchData).toHaveBeenCalledTimes(1);

    const cachedValue = await redis.get(cacheKey);

    expect(cachedValue).toBe(JSON.stringify({ message: "Hello cache" }));
  });

  it("should return cached data without fetching again", async () => {
    await redis.set(
      cacheKey,
      JSON.stringify({ message: "Cached value" }),
      { EX: 30 },
    );

    const fetchData = jest.fn<() => Promise<{ message: string }>>();

    const result = await getOrSetCache(cacheKey, 30, fetchData);

    expect(result).toEqual({ message: "Cached value" });
    expect(fetchData).not.toHaveBeenCalled();
  });
});
