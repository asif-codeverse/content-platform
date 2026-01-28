import { logger } from "../../utils/logger.js";

export const articlePublishedHandler = async ({ articleId }) => {
  logger.info("Handling ARTICLE_PUBLISHED job", { articleId });

  // future:
  // - clear HTTP cache
  // - send emails
  // - update analytics

  await new Promise((res) => setTimeout(res, 500));
};
