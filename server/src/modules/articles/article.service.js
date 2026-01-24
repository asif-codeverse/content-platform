import { Article } from "./article.model.js";
import slugify from "slugify";

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

export const getPublishedArticles = async () => {
  return Article.find({
    status: "PUBLISHED",
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const publishArticle = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  article.status = "PUBLISHED";
  return article.save();
};

export const softDeleteArticle = async (articleId) => {
  const article = await Article.findById(articleId);
  if (!article || article.isDeleted) {
    throw { statusCode: 404, message: "Article not found" };
  }

  article.isDeleted = true;
  return article.save();
};

export const listArticles = async ({ filters, sort, skip, limit }) => {
  const base = { isDeleted: false, ...filters };

  const articles = await Article.find(base)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select("-__v");

  const total = await Article.countDocuments(base);

  return { articles, total };
};
