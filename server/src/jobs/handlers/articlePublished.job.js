import { logger } from "../../utils/logger.js";
import { notifyArticlePublished } from "../../services/notification.service.js";

export const articlePublishedHandler = async ({
  articleId,
  message,
}) => {

  logger.info(
    "Handling ARTICLE_PUBLISHED job",
    {
      articleId,
    }
  );

  await notifyArticlePublished(
    articleId,
    message
  );

};