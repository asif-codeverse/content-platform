import { Article } from "./article.model.js";
import slugify from "slugify";
import { canEditArticle } from "../../utils/authorization.js";

/**
 * Create article (DRAFT by default)
 */
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
    throw { statusCode: 404, message: "Article not found" };
  }

  // ownership (ABAC enforcement)
  if (!canEditArticle(user, article)) {
    throw {
      statusCode: 403,
      message: "Not allowed to modify this article",
    };
  }

  // explicit field whitelisting
  if (data.title !== undefined) {
    article.title = data.title;
    article.slug = slugify(data.title, { lower: true, strict: true });
  }
  if (data.content !== undefined) {
    article.content = data.content;
  }
  return article.save();
};

/**
 * Publish article (pure domain mutation)
 */
export const publishArticle = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  article.status = "PUBLISHED";
  return article.save();
};

/**
 * Soft delete article
 */
export const softDeleteArticle = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  article.isDeleted = true;
  return article.save();
};

/**
 * List articles with filtering & pagination
 */
export const listArticles = async ({ filters, sort, skip, limit }) => {
  const base = { isDeleted: false, ...filters };

  const articles = await Article.find(base).sort(sort).skip(skip).limit(limit);

  const total = await Article.countDocuments(base);

  return { articles, total };
};

/**
 * Used for HTTP caching (Last-Modified / ETag)
 */
export const getLatestPublishedUpdate = async () => {
  const latest = await Article.findOne({
    status: "PUBLISHED",
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .select("updatedAt");

  return latest?.updatedAt;
};
