import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env";

dotenv.config({ path: envFile });

const requiredEnvVars = [
  "MONGODB_URI",
  "REDIS_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};