import { parseQuery } from "../../utils/queryParser.js";
import { searchArticles } from "./search.service.js";
import { getCache, setCache } from "../../services/cache.service.js";

export const search = async (
    req,
    res,
    next,
) => {
    try {
        const q = req.query.q;

        if (!q || q.trim().length < 2) {
            return next({
                statusCode: 400,
                message:
                    "Search query must contain atleast 2 characters",
            });
        }
        const {
            page,
            limit,
            skip,
        } = parseQuery(req.query);

        const cacheKey = `search:${q}:page:${page}:limit:${limit}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) return res.json(cachedData);

        const {
            articles,
            total,
        } = await searchArticles({
            query: q,
            skip,
            limit,
        });

        
        
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
            300,
        );

        return res.json(response);
    }
    catch (err) {
        next(err);
    }
};