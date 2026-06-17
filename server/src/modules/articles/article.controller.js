import {
  createArticle,
  getLatestPublishedUpdate,
  publishArticle,
  softDeleteArticle,
  listArticles,
  updateArticle,
} from "./article.service.js";

import {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern,
} from "../../services/cache.service.js";

import { logger } from "../../utils/logger.js";
import { parseQuery } from "../../utils/queryParser.js";
import { enqueueJob } from "../../jobs/queue.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { env } from "../../config/env.js";

export const create = asyncHandler(async (req, res) => {
  const article = await createArticle({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
  });

  logger.info("ARTICLE_CREATED", {
    articleId: article._id,
    authorId: req.user.id,
    title: article.title,
  });

  await deleteCache("articles:published");
  await deleteByPattern("search:*");

  return res.status(201).json(article);
});

export const update = asyncHandler(async (req, res) => {
  const { article, oldSlug } = await updateArticle(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
    },
    req.user,
  );

  logger.info("ARTICLE_UPDATED", {
    articleId: article._id,
    updatedBy: req.user.id,
  });

  await deleteCache("articles:published");
  await deleteCache(`article:${oldSlug}`);
  await deleteCache(`article:${article.slug}`);
  await deleteByPattern("search:*");

  return res.json(article);
});

export const listPublished = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseQuery(req.query);

  const cacheKey =
    `articles:published:page:${page}:limit:${limit}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

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

  res.set(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=30",
  );

  const response = {
    success: true,
    data: articles,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(
    cacheKey,
    response,
    60,
  );

  return res.json(response);
});

export const publish = asyncHandler(async (req, res) => {
  const article = await publishArticle(req.params.id);

  logger.info("ARTICLE_PUBLISHED", {
    articleId: article._id,
    publishedBy: req.user.id,
  });

  await deleteCache("articles:published");
  await deleteByPattern("search:*");

  if (env.NODE_ENV !== "test") {
    enqueueJob("ARTICLE_PUBLISHED", {
      articleId: article._id.toString(),
    });
  }

  return res.json(article);
});

export const remove = asyncHandler(async (req, res) => {
  const article = await softDeleteArticle(
    req.params.id,
    req.user
  );

  logger.info("ARTICLE_DELETED", {
    articleId: article._id,
    deletedBy: req.user.id,
  });

  await deleteCache("articles:published");
  await deleteByPattern("search:*");

  return res.json(article);
});

export const getArticles = asyncHandler(async (req, res) => {
  const parsed = parseQuery(req.query);

  const filters = {
    isDeleted: false,
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
});

export const getBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const cacheKey = `article:${slug}`;
  const cachedArticle = await getCache(cacheKey);

  if (cachedArticle) {
    logger.info("ARTICLE CACHE HIT", { slug });
    return res.json(cachedArticle);
  }

  logger.info("ARTICLE CACHE MISS", { slug });

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
    throw {
      statusCode: 404,
      message: "Article not found",
    };
  }

  const response = {
    success: true,
    data: articles[0],
  };

  await setCache(cacheKey, response, 300);

  return res.json(response);
});

export const getArticleById =
  asyncHandler(async (req, res) => {

    const { articles } =
      await listArticles({
        filters: {
          _id: req.params.id,
        },
        sort: {},
        skip: 0,
        limit: 1,
      });

    if (!articles.length) {
      throw {
        statusCode: 404,
        message: "Article not found",
      };
    }

    return res.json({
      success: true,
      data: articles[0],
    });
  });