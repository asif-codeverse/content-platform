import {
  createArticle,
  getPublishedArticles,
  publishArticle,
  softDeleteArticle,
} from "./article.service.js";

export const create = async (req, res, next) => {
  try {
    const article = await createArticle({
      ...req.body,
      author: req.user.id,
    });
    (res.status(201).json(article));
  } catch (err) {
    next(err);
  }
};

export const listPublished = async (req, res, next) => {
  try {        
    const articles = await getPublishedArticles(req.params.id);
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

export const publish = async (req, res, next) => {
  try {
    const article = await publishArticle(req.params.id);
    res.json(article);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const article = await softDeleteArticle(req.params.id);
    res.json(article);
  } catch (err) {
    next(err);
  }
};
