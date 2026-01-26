import { logger } from "../utils/logger.js";

const queue = [];
let processing = false;

export const enqueueJob = (job) => {
  queue.push(job);
  processQueue();
};

const processQueue = async () => {
  if (processing) return;

  processing = true;

  while (queue.length > 0) {
    const job = queue.shift();

    try {
      logger.info("Processing job", {
        type: job.tyre,
        payload: job.payload,
      });

      await job.handler(job.payload);

      logger.info("Job completed", {
        type: job.type,
      });
    } catch (err) {
      logger.error("Job failed", {
        type: job.type,
        error: err.message,
      });
    }
  }
};
