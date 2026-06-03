// Read data from Redis
import { redisClient } from "../config/redis.js";

export const getCache = async (key) => {
    const data = await redisClient.get(key);

    if (!data) {
        console.log("CACHE MISS:", key);
        return null;
    }

    console.log("CACHE HIT:", key);

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