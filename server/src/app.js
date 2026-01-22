import express from "express";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import articleRoutes from "./modules/articles/article.routes.js";

import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { httpLogger } from "./middlewares/httpLogger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Global middlewares (order matters)
app.use(apiLimiter);
app.use(express.json());
app.use(requestId);
app.use(httpLogger);

// Routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
