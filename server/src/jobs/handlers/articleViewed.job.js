import { incrementArticleViews } from "../../modules/articles/article.service.js";
import { incrementCachedArticleViews } from "../../services/cache.service.js";

export const articleViewedHandler =
    async ({
        articleId,
        slug,
    }) => {
        // Update MongoDB
        await incrementArticleViews(articleId);

        // Update Redis cache (if present)
        await incrementCachedArticleViews(slug);
    };