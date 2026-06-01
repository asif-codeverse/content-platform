import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger.js";
import { processJob } from "./worker.js";

const queue = [];
let processing = false;

export const enqueueJob = (type, payload) => {
  const job = {
    jobId: uuid(),
    type,
    payload,
    attempts: 0,
    maxAttempts: 5,
    createdAt: new Date(),
  };

  logger.info("Job Enqueued", { jobId: job.jobId, type });

  queue.push(job);
  processQueue();
};

const processQueue = async () => {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift();
    await processJob(job);
  }

  processing = false;
};