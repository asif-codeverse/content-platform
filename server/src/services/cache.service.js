// Read data from Redis
import { redisClient } from "../config/redis.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export const getCache = async (key) => {
    if (process.env.NODE_ENV === "test") {
        return null;
    }
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
    if (process.env.NODE_ENV === "test") {
        return;
    }

    logger.info("CACHE STORE:", {
        key,
    });

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
    if (process.env.NODE_ENV === "test") {
        return null;
    }
    await redisClient.del(key);
};


export const deleteByPattern = async (
    pattern
) => {
    if (process.env.NODE_ENV === "test") {
        return null;
    }

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

export const incrementCachedArticleViews = async (slug) => {
    if (env.NODE_ENV === "test") return;

    const key = `article:${slug}`;
    const cached = await redisClient.get(key);

    if (!cached) return;

    const article = JSON.parse(cached);

    if (article?.data?.views !== undefined) article.data.views += 1;

    await redisClient.set(
        key,
        JSON.stringify(article), { EX: 300, }
    );

    logger.info(
        "CACHE VIEW UPDATED",
        {
            key,
            views:
                article.data.views,
        }
    );
};