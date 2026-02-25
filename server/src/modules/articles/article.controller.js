import {
  createArticle,
  getLatestPublishedUpdate,
  publishArticle,
  softDeleteArticle,
  listArticles,
  updateArticle,
} from "./article.service.js";

import { generateETag } from "../../utils/etag.js";
import { logger } from "../../utils/logger.js";
import { parseQuery } from "../../utils/queryParser.js";
import { enqueueJob } from "../../jobs/queue.js";

export const create = async (req, res, next) => {
  try {
    const article = await createArticle({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
    });

    return res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const article = await updateArticle(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
      },
      req.user,
    );

    return res.json(article);
  } catch (err) {
    next(err);
  }
};

export const listPublished = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = parseQuery(req.query);

    const lastModified = await getLatestPublishedUpdate();

    if (lastModified) {
      res.set("Last-Modified", lastModified.toUTCString());

      const ifModifiedSince = req.headers["if-modified-since"];
      if (ifModifiedSince && new Date(ifModifiedSince) >= lastModified) {
        return res.status(304).end();
      }
    }

    const { articles, total } = await listArticles({
      filters: { status: "PUBLISHED" },
      sort,
      skip,
      limit,
    });

    return res.json({
      success: true,
      data: articles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const publish = async (req, res, next) => {
  try {
    const article = await publishArticle(req.params.id);

    enqueueJob("ARTICLE_PUBLISHED",{
      articleId : article._id.toString(),
    });

    return res.json(article);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const article = await softDeleteArticle(req.params.id);
    return res.json(article);
  } catch (err) {
    next(err);
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const { page, limit, skip, sort, filters } = parseQuery(req.query);

    const { articles, total } = await listArticles({
      filters,
      sort,
      skip,
      limit,
    });

    logger.info("Articles fetched", {
      page,
      limit,
      filters,
      requestId: req.requestId,
    });

    return res.json({
      success: true,
      data: articles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
