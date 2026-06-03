import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { connectRedis } from "./config/redis.js";



const startServer = async () => {
  await connectDB();

  await connectRedis();

  app.listen(env.port, () => {
    logger.info("Server started successfully", {
      port: env.port,
      environment: env.nodeEnv,
    });
  });
};

startServer();
