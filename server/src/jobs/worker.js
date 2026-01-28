import { logger } from "../utils/logger.js";
import {
  isJobCompleted,
  markJobCompleted,
  markJobFailed,
} from "./jobExecution.model.js";
import { articlePublishedHandler } from "./handlers/articlePublished.job.js";

const queue = [];
let processing = false;

export const enqueueInternal = (job) => {
  queue.push(job);
  processQueue();
};

const processQueue = async () => {
  if (processing) return;
  processing = true;

  while (queue.length) {
    const job = queue.shift();

    if (await isJobCompleted(job.jobId)) {
      logger.warn("Duplicate job ignored", { jobId: job.jobId });
      continue;
    }

    try {
      logger.info("Job started", {
        jobId: job.jobId,
        type: job.type,
        attempt: job.attempts,
      });

      switch (job.type) {
        case "ARTICLE_PUBLISHED":
          await articlePublishedHandler(job.payload);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      await markJobCompleted(job);
      logger.info("Job completed", { jobId: job.jobId });
    } catch (err) {
      job.attempts += 1;

      logger.error("Job failed", {
        jobId: job.jobId,
        attempt: job.attempts,
        error: err.message,
      });

      if (job.attempts >= job.maxAttempts) {
        await markJobFailed(job);
        continue;
      }

      const delay = 2 ** job.attempts * 1000;
      setTimeout(() => queue.push(job), delay);
    }
  }

  processing = false;
};
