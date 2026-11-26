import { logger } from "../../config/logger.js";
import { redis } from "../../config/redis.js";

const dashboardCacheVersionKey = "dashboard:version";

export async function getDashboardCacheVersion(): Promise<string> {
  try {
    return (await redis.get(dashboardCacheVersionKey)) ?? "0";
  } catch (error) {
    logger.warn({ err: error }, "Dashboard cache version read failed");
    return "0";
  }
}

export async function invalidateDashboardCache(): Promise<void> {
  try {
    await redis.incr(dashboardCacheVersionKey);
  } catch (error) {
    logger.warn({ err: error }, "Dashboard cache invalidation failed");
  }
}
