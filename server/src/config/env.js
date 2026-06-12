import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]),

  PORT: z.coerce.number().int().positive(),

  MONGODB_URI: z.string().startsWith("mongodb"),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRES_IN: z.string(),

  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  REDIS_URL: z.url()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid Environment Variables"
  );
  console.error(
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsed.data;