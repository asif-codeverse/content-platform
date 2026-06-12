import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { withTimeout } from "./utils/withTimeout.js";
import { connectRedis, redisClient } from "./config/redis.js";

let server;

const startServer = async () => {
  try {
    await withTimeout(
      connectDB(),
      10000,
      "MongoDB connection"
    );
    await withTimeout(
      connectRedis(),
      5000,
      "Redis connection"
    );

    logger.info("Starting application", {
      environment: env.NODE_ENV,
      port: env.PORT,
    });
    server = app.listen(env.PORT, () => {
      logger.info("Server started successfully", {
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });
  } catch (err) {
    logger.error("Startup failed", {
      error: err.message,
    });

    process.exit(1);
  }
};

let isShuttingDown = false;

const gracefulShutdown = async (
  signal
) => {

  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    `${signal} received. Starting graceful shutdown`
  );

  if (!server) {
    process.exit(1);
  }
  server.close(async () => {

    logger.info(
      "HTTP server closed"
    );

    try {

      await mongoose.connection.close();

      logger.info(
        "MongoDB connection closed"
      );

      await redisClient.quit();

      logger.info(
        "Redis connection closed"
      );

      process.exit(0);

    } catch (err) {

      logger.error(
        "Error during shutdown",
        err
      );

      process.exit(1);
    }
  });
};

process.on(
  "SIGTERM",
  () => gracefulShutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => gracefulShutdown("SIGINT")
);

process.on(
  "unhandledRejection",
  async (reason) => {

    logger.error(
      "Unhandled Promise Rejection",
      {
        reason,
      }
    );

    await gracefulShutdown(
      "UNHANDLED_REJECTION"
    );
  }
);

process.on(
  "uncaughtException",
  async (error) => {

    logger.error(
      "Uncaught Exception",
      {
        message: error.message,
        stack: error.stack,
      }
    );

    await gracefulShutdown(
      "UNCAUGHT_EXCEPTION"
    );
  }
);

startServer();