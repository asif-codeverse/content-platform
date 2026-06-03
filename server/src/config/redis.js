import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redisClient = createClient({
    url: env.redisUrl,
});

redisClient.on("error", (err) => {
    logger.error("Redis Error", err);
});

export const connectRedis = async () => {
    await redisClient.connect();

    logger.info("Redis Connected Successfully");
};