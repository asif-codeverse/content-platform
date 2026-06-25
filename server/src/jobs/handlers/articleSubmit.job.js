import { logger } from "../../utils/logger.js";
import { Article } from "../../modules/articles/article.model.js";
import { User } from "../../modules/auth/auth.model.js";
import { sendArticleSubmittedNotification, } from "../../services/notification.service.js";

export const articleSubmitHandler = async (payload) => {
    logger.info("ARTICLE_SUBMITTED_HANDLER", {
        articleId: payload.articleId,
        submittedBy: payload.submittedBy,
        message: payload.message,
    });
    const article =
        await Article.findById(
            payload.articleId
        ).populate(
            "author",
            "name email"
        );

    if (!article) {
        return;
    }

    const admins =
        await User.find({
            role: "ADMIN",
        });

    if (!admins.length) {
        return;
    }

    await sendArticleSubmittedNotification({
        admins,
        article,
        message:payload.message,
    });

    // Future:
    // - Create in-app notification
    // - Push to Slack/Discord
};