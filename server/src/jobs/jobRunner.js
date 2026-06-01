import { v4 as uuid } from "uuid";
import { pushToQueue } from "./queue.js";
import { logger } from "../utils/logger.js";

export const enqueueJob = (type, payload) => {
  const job = {
    jobId: uuid(),
    type,
    payload,
    attempts: 0,
    maxAttempts: 5,
    createdAt: new Date(),
  };

  logger.info("Job Enqueued", {
    jobId: job.jobId,
    type,
  });

  pushToQueue(job);
};
