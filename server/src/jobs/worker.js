import { logger } from "../utils/logger.js";
import {
  isJobCompleted,
  markJobCompleted,
  markJobFailed,
} from "./jobExecution.model.js";
import { articlePublishedHandler } from "./handlers/articlePublished.job.js";

export const processJob = async (job) => {
  if (await isJobCompleted(job.jobId)) {
    logger.warn("Duplicate Job Ignored", { jobId: job.jobId });
    return;
  }

  try {
    logger.info("Job Started", { jobId: job.jobId, type: job.type });

    if (job.type === "ARTICLE_PUBLISHED") {
      await articlePublishedHandler(job.payload);
    } else {
      logger.error("Unknown job type", { type: job.type });
      return;
    }

    await markJobCompleted(job);
    logger.info("Job Completed", { jobId: job.jobId });
  } catch (err) {
    job.attempts += 1;

    logger.error("Job Failed", {
      jobId: job.jobId,
      attempt: job.attempts,
      error: err.message,
    });

    if (job.attempts >= job.maxAttempts) {
      await markJobFailed(job);
      return;
    }

    const delay = 2 ** job.attempts * 100;
    setTimeout(() => processJob(job), delay);
  }
};