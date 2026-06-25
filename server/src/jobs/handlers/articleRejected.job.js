import { logger } from "../../utils/logger.js";
import {
  notifyArticleRejected,
} from "../../services/notification.service.js";

export const articleRejectedHandler =
  async ({
    articleId,
    message,
  }) => {

    logger.info(
      "Handling ARTICLE_REJECTED job",
      {
        articleId,
      }
    );

    await notifyArticleRejected(
      articleId,
      message
    );

  };