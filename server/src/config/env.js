import dotenv from "dotenv";
import z from "zod";

dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : ".env",
});

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production",
  ]),

  PORT: z.coerce.number().int().positive(),

  MONGODB_URI: z.string().startsWith("mongodb"),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRES_IN: z.string(),

  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  CLIENT_URL: z.string().url().optional(),
  CLIENT_URL_PROD: z.string().url().optional(),

  REDIS_URL: z.string().url(),

  BREVO_API_KEY:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.string(),

  EMAIL_FROM:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.string().email(),

  CLOUDINARY_CLOUD_NAME:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.string(),

  CLOUDINARY_API_KEY:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.string(),

  CLOUDINARY_API_SECRET:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid Environment Variables");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;