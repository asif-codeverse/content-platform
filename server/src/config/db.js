import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    // console.log(
    //   "Database:",
    //   env.MONGODB_URI
    // );
    await mongoose.connect(env.MONGODB_URI);

    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error("MongoDB connection failed", err);

    if (env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};
