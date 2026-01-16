import express from 'express';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Global middlewares
app.use(express.json());

// Routes
app.use('/health', healthRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
