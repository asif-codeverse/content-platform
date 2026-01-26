import { logger } from "../utils/logger.js";

export const onArticlePublished = async ({ articleId }) => {
  // simulate async side effects
  logger.info("Running article publish side effects", { articleId });

  // examples
  //
  //


  await new Promise((res) => setTimeout(res, 300));
};
