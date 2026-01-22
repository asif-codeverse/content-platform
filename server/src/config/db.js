import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info("MongoDB connected successfully", {
      uri: env.mongoUri.replace(/\/\/.*@/, "//***:***@"), // optional masking
    });
  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};
