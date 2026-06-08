// Read data from Redis
import { redisClient } from "../config/redis.js";
import { logger } from "../utils/logger.js";

export const getCache = async (key) => {
    const data = await redisClient.get(key);

    if (!data) {
        logger.info("CACHE MISS", {
            key,
        });
        return null;
    }

    logger.info("CACHE HIT", {
        key,
    });

    return JSON.parse(data);
};

// Save data to Redis
export const setCache = async (
    key,
    value,
    ttl = 60,
) => {

    console.log("CACHE STORE:", key);

    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: ttl,
        },
    );
};

// Delete cache
export const deleteCache = async (key) => {
    await redisClient.del(key);
};


export const deleteByPattern = async (
    pattern
) => {

    const keys =
        await redisClient.keys(pattern);

    if (keys.length === 0) {
        return;
    }

    await redisClient.del(keys);

    logger.info("CACHE PATTERN DELETE", {
        pattern,
        deletedKeys: keys.length,
    });
};