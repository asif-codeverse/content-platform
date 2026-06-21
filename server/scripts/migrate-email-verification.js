import mongoose from "mongoose";
import dotenv from "dotenv";

import { User } from "../src/modules/auth/auth.model.js";

dotenv.config();

await mongoose.connect(
  process.env.MONGODB_URI
);

const result =
  await User.updateMany(
    {
      emailVerified: {
        $exists: false,
      },
    },
    {
      $set: {
        emailVerified: true,
      },
    }
  );

console.log(result);

process.exit(0);

/**
 * One-time migration.
 * Executed on 2026-06-21.
 * Marks all pre-verification users as verified.
 */