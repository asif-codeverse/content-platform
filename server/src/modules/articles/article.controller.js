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
import { refreshTokens } from "../auth/auth.service.js";

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
      if (ifModifiedSince) {
        const since = new Date(ifModifiedSince);

        if (!isNaN(since) && since >= lastModified) {
          return res.status(304).end();
        }
      }
    }

    const { articles, total } = await listArticles({
      filters: { status: "PUBLISHED" },
      sort,
      skip,
      limit,
    });

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");

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

    if (process.env.NODE_ENV !== "test") {
      enqueueJob("ARTICLE_PUBLISHED", {
        articleId: article._id.toString(),
      });
    }

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
    const parsed = parseQuery(req.query);

    const filters = {
      status: "PUBLISHED",
      ...(parsed.filters || {}),
    };

    if (req.query.slug) {
      filters.slug = req.query.slug;
    }

    const { articles, total } = await listArticles({
      filters,
      sort: parsed.sort,
      skip: parsed.skip,
      limit: parsed.limit,
    });

    return res.json({
      success: true,
      data: articles,
      meta: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages: Math.ceil(total / parsed.limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const { articles } = await listArticles({
      filters: {
        slug,
        status: "PUBLISHED",
      },
      sort: {},
      skip: 0,
      limit: 1,
    });

    if (!articles.length) {
      return next({ statusCode: 404, message: "Article not found" });
    }
    return res.json({
      success: true,
      data: articles[0],
    });
  } catch (err) {
    next(err);
  }
};


export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw { statusCode: 400, message: "Refresh token required" };
    }

    const tokens = await refreshTokens(refreshToken);

    return res.json(tokens);
  } catch (err) {
    next(err);
  }
};