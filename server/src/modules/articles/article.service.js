import { Article } from "./article.model.js";
import slugify from "slugify";

export const createArticle = async ({ title, content, author }) => {
  const slug = slugify(title, { lower: true, strict: true });

  const existing = await Article.findOne({ slug });
  if (existing) {
    throw { statusCode: 409, message: "Article with same title exists" };
  }

  return Article.create({
    title,
    slug,
    content,
    author,
  });
};

export const getPublishedArticles = async () => {
  return Article.find({
    status: "PUBLISHED",
    isDeleted: false,
  }).sort({ createdAt: -1 });
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
