import { Router } from "express";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

const router = Router();

router.get("/", async (req, res) => {

    const mongoReady = mongoose.connection.readyState === 1;
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    const redisReady = redisClient.isReady;

    if (!mongoReady || !redisReady) {
        return res.status(503).json({
            status: "not_ready",
            services: {
                mongodb: mongoReady,
                redis: redisReady,
            },
        });
    }

    return res.status(200).json({
        status: "ready",
        services: {
            mongodb: mongoReady,
            redis: redisReady,
        },
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

export default router;