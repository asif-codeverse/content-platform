import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    statusCode,
    requestId: req.requestId,
    path: req.originalUrl,
  });

  res.status(statusCode).json({
    success: false,
    message: isServerError
      ? "Internal Server Error"
      : err.message,

    verificationRequired:
      err.verificationRequired,

    requestId: req.requestId,
    timestamp: Date.now(),
  });
};