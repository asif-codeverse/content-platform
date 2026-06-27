import { Article } from "./article.model.js";
import slugify from "slugify";
import { canEditArticle } from "../../utils/authorization.js";
import mongoose from "mongoose";

// Create article (DRAFT by default)
export const createArticle = async ({ title, content, author }) => {
  const slug = slugify(title, { lower: true, strict: true });

  try {
    return await Article.create({
      title,
      slug,
      content,
      author,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw { statusCode: 409, message: "Article with same title exists" };
    }
    throw err;
  }
};

// update article
export const updateArticle = async (articleId, data, user) => {
  const article = await Article.findById(articleId);

  // Existence check
  if (!article || article.isDeleted) {
    throw {
      statusCode: 404,
      message: "Article not found",
    };
  }

  const oldSlug = article.slug;

  // ownership (ABAC enforcement)
  if (!canEditArticle(user, article)) {
    throw {
      statusCode: 403,
      message: "Not allowed to modify this article",
    };
  }

  if (
    article.status !==
    "DRAFT"
    &&
    user.role !== "ADMIN"
  ) {
    throw {
      statusCode: 403,
      message:
        "Only draft articles can be edited",
    };
  }

  if (data.title !== undefined) {
    const newSlug = slugify(data.title, { lower: true, strict: true });

    // prevent slug collision
    const existing = await Article.findOne({
      slug: newSlug,
      _id: { $ne: article._id },
    });
    if (existing) {
      throw {
        statusCode: 409,
        message: "Another article already uses this title",
      };
    }

    article.title = data.title;
    article.slug = newSlug;
  }



  if (data.content !== undefined) {
    article.content = data.content;
  }

  const updatedArticle = await article.save();
  return {
    article: updatedArticle,
    oldSlug,
  }
};

// Publish article (pure domain mutation)
export const publishArticle = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  if (article.status === "PUBLISHED") {
    throw {
      statusCode: 400,
      message: "Article is already published",
    };
  }
  if (article.status !== "PENDING") {
    throw {
      statusCode: 400,
      message: "Only pending articles can be published",
    };
  }

  article.status = "PUBLISHED";
  return article.save();
};

export const rejectArticle =
  async (articleId) => {

    const article =
      await Article.findById(
        articleId
      );

    if (
      !article ||
      article.isDeleted
    ) {
      throw {
        statusCode: 404,
        message: "Article not found",
      };
    }

    if (
      article.status !==
      "PENDING"
    ) {
      throw {
        statusCode: 400,
        message:
          "Only pending articles can be rejected",
      };
    }

    article.status =
      "DRAFT";

    return article.save();

  };

//Soft delete article
export const softDeleteArticle = async (articleId, user) => {
  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  if (!canEditArticle(user, article)) {
    throw {
      statusCode: 403,
      message: "Not allowed to delete this article",
    };
  }
  article.isDeleted = true;
  return article.save();
};

// List articles with filtering & pagination
export const listArticles = async ({ filters, sort, skip, limit }) => {
  const base = { isDeleted: false, ...filters };

  const [articles, total] = await Promise.all([
    Article.find(base)
      .populate("author", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Article.countDocuments(base),
  ]);

  return { articles, total };
};

// Used for HTTP caching (Last-Modified / ETag)
export const getLatestPublishedUpdate = async () => {
  const latest = await Article.findOne({
    status: "PUBLISHED",
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .select("updatedAt");

  return latest?.updatedAt;
};


export const getMyArticles = async (userId) => {

  return Article.find({
    author: userId,
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

};


export const submitForReview =
  async (
    articleId,
    user
  ) => {

    const article =
      await Article.findById(
        articleId
      );

    if (
      !article ||
      article.isDeleted
    ) {
      throw {
        statusCode: 404,
        message: "Article not found",
      };
    }

    if (
      !canEditArticle(
        user,
        article
      )
    ) {
      throw {
        statusCode: 403,
        message: "You are not allowed to submit this article.",
      };
    }

    if (
      article.status !== "DRAFT" &&
      article.status !== "REJECTED"
    ) {
      throw {
        statusCode: 400,
        message:
          "Only draft or rejected articles can be submitted",
      };
    }

    article.status =
      "PENDING";

    await article.save();

    return article;
  };

export const getPendingArticles =
  async () => {

    return Article.find({
      status: "PENDING",
      isDeleted: false,
    })
      .populate(
        "author",
        "name email role"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  };

export const getMyArticleById = async (
  articleId,
  user
) => {
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    throw {
      statusCode: 400,
      message: "Invalid article id",
    };
  }

  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw {
      statusCode: 404,
      message: "Article not found",
    };
  }

  if (!canEditArticle(user, article)) {
    throw {
      statusCode: 403,
      message: "Not allowed",
    };
  }

  return article;
};

export const updateMyArticle = async (articleId, data, user) => {
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    throw {
      statusCode: 400,
      message: "Invalid article id",
    };
  }
  const article = await Article.findById(articleId);

  // Existence check
  if (!article || article.isDeleted) {
    throw {
      statusCode: 404,
      message: "Article not found",
    };
  }

  const oldSlug = article.slug;

  // ownership (ABAC enforcement)
  if (!canEditArticle(user, article)) {
    throw {
      statusCode: 403,
      message: "Not allowed to modify this article",
    };
  }

  if (
    article.status !== "DRAFT" &&
    article.status !== "REJECTED"
  ) {
    throw {
      statusCode: 403,
      message: "Only draft or rejected articles can be edited",
    };
  }

  if (data.title !== undefined) {
    const newSlug = slugify(data.title, { lower: true, strict: true });

    // prevent slug collision
    const existing = await Article.findOne({
      slug: newSlug,
      _id: { $ne: article._id },
    });
    if (existing) {
      throw {
        statusCode: 409,
        message: "Another article already uses this title",
      };
    }

    article.title = data.title;
    article.slug = newSlug;
  }



  if (data.content !== undefined) {
    article.content = data.content;
  }

  const updatedArticle = await article.save();
  return {
    article: updatedArticle,
    oldSlug,
  }
};

export const incrementArticleViews = async (articleId) => {

  return Article.findByIdAndUpdate(
    articleId, {
    $inc: {
      views: 1,
    },
  },
    {
      returnDocument: 'after',
    }
  );
};

export const getArticleStats =
  async () => {

    const stats =
      await Article.aggregate([

        {
          $match: {
            isDeleted: false,
          },
        },

        {
          $group: {

            _id: null,

            total: {
              $sum: 1,
            },

            draft: {
              $sum: {
                $toInt: {
                  $eq: [
                    "$status",
                    "DRAFT",
                  ],
                },
              },
            },

            pending: {
              $sum: {
                $toInt: {
                  $eq: [
                    "$status",
                    "PENDING",
                  ],
                },
              },
            },

            published: {
              $sum: {
                $toInt: {
                  $eq: [
                    "$status",
                    "PUBLISHED",
                  ],
                },
              },
            },

            rejected: {
              $sum: {
                $toInt: {
                  $eq: [
                    "$status",
                    "REJECTED",
                  ],
                },
              },
            },

            totalViews: {
              $sum: "$views",
            },

          },
        },

      ]);

    return (
      stats[0] || {
        total: 0,
        draft: 0,
        pending: 0,
        published: 0,
        rejected: 0,
        totalViews: 0,
      }
    );

  };