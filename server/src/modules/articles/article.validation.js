import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(20),
});
