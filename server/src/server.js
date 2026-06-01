import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";



const startServer = async () => {
  await connectDB();

const PORT = Number(env.port) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  logger.info("Server started successfully", {
    port: PORT,
    environment: env.nodeEnv,
  });
});

};

startServer();
