import { enqueueJob } from "./jobRunner.js";
import { onArticlePublished } from "./article.jobs.js";

export const publishArticleJob = (articleId) => {
  enqueueJob({
    type: "ARTICLE_PUBLISHED",
    payload: { articleId },
    handler: onArticlePublished,
  });
};
