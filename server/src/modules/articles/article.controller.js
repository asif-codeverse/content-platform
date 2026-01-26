import {
  createArticle,
  getPublishedArticles,
  publishArticle,
  softDeleteArticle,
  listArticles,
} from "./article.service.js";

import { generateETag } from "../../utils/etag.js";
import { logger } from "../../utils/logger.js";
import { parseQuery } from "../../utils/queryParser.js";

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

export const listPublished = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = parseQuery(req.query);

    const { articles, total } = await listArticles({
      filters: { status: "PUBLISHED" },
      sort,
      skip,
      limit,
    });

    // build stable response payload
    const responsePayload = {
      success: true,
      data: articles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // genetate Etag from full response (important)
    const etag = generateETag(responsePayload);

    // set caching headers
    res.setHeader("ETag", etag);
    res.setHeader(
      "Cache-Control",
      "public, max-age=60,stale-while-revalidate=30",
    );

    // conditionla request check
    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    return res.status(304).end();
  } catch (err) {
    next(err);
  }
};

export const publish = async (req, res, next) => {
  try {
    const article = await publishArticle(req.params.id);
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
