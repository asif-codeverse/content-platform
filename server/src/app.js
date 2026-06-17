import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "./docs/swagger.js";

import healthRoutes from "./routes/health.routes.js";
import readinessRoutes from "./routes/readiness.routes.js"
import authRoutes from "./modules/auth/auth.routes.js";
import articleRoutes from "./modules/articles/article.routes.js";
import searchRoutes from "./modules/search/search.routes.js";

import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { httpLogger } from "./middlewares/httpLogger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))


// Global middlewares (order matters)
app.use(requestId);
app.use(httpLogger);
app.use(apiLimiter);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/readiness", readinessRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/search", searchRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler (must be last)
app.use(errorHandler);

export default app;