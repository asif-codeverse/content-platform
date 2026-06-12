import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
    logger.error("Redis Error", err);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info(
            "Redis connected successfully"
        );
    } catch (err) {
        logger.error(
            "Redis connection failed",
            err
        );
        throw err;
    }
};