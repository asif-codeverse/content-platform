import express from "express";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import articleRoutes from "./modules/articles/article.routes.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(apiLimiter);

// Global middlewares
app.use(express.json());

// Routes
app.use("/health", healthRoutes);

app.use("/auth", authRoutes);

app.use("/articles", articleRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
