import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("MongoDB connected successfully", {
      uri: env.mongoUri.replace(/\/\/.*@/, "//***:***@"), // optional masking
    });
  } catch (err) {
    logger.error("MongoDB connection failed", err);

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};
