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
            .select(
                "title slug content createdAt updatedAt"
            )
            .sort({
                score: {
                    $meta: "textScore",
                },
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Article.countDocuments(filter),
    ])

    return {
        articles,
        total,
    };
};