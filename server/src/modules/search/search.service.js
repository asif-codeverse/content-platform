import { Article } from "../articles/article.model.js";

export const searchArticles = async ({
    query,
    skip,
    limit,
}) => {
    const filter = {
        status: "PUBLISHED",
        isDeleted: false,
        $text: {
            $search: query,
        },
    };

    const [articles, total] = await Promise.all([
        Article.find(
            filter,
            {
                score: {
                    $meta: "textScore",
                },
            }
        )
            .select("title slug content createdAt")
            .sort({
                score: {
                    $meta: "textScore",
                },
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Article.countDocuments(filter),
    ]);

    const formattedArticles = articles.map((article) => ({
        _id: article._id,
        title: article.title,
        slug: article.slug,
        createdAt: article.createdAt,
        excerpt: article.content.slice(0, 150),
    }));

    return {
        articles: formattedArticles,
        total,
    };
};