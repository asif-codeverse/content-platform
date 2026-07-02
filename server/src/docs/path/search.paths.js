export const searchPaths = {
    // ─── GET /search 
    "/search": {
        get: {
            tags: ["Search"],

            operationId: "searchArticles",

            summary: "Full-text search across published articles",

            description:
                "Performs a full-text search over all published (`status: PUBLISHED`) " +
                "articles using MongoDB's `$text` index on the `title` and `content` fields.\n\n" +
                "**Ranking:** Results are ranked by MongoDB text score (relevance). " +
                "Higher relevance scores appear first.\n\n" +
                "**Result shape:** Each item in `data` is a condensed `SearchResultItem` " +
                "containing `_id`, `title`, `slug`, `createdAt`, and an `excerpt` " +
                "(first 150 characters of `content`).\n\n" +
                "**Redis Cache:** Results are cached per `q`/`page`/`limit` combination " +
                "for **5 minutes** (300 seconds). Cache is invalidated on any article " +
                "create, update, publish, reject, or delete.\n\n" +
                "**Validation:**\n" +
                "- `q` must be at least **2 characters** (returns `400` otherwise).\n\n" +
                "**Pagination:**\n" +
                "- `page`: defaults to 1\n" +
                "- `limit`: defaults to 10, server maximum is 15",

            parameters: [
                {
                    name: "q",
                    in: "query",
                    required: true,
                    description:
                        "Search query string. Passed to MongoDB's `$text` operator. " +
                        "Must be at least 2 characters. Supports MongoDB text search operators " +
                        "(e.g. phrase search with `\"exact phrase\"`, negation with `-word`).",
                    schema: {
                        type: "string",
                        minLength: 2,
                    },
                    example: "redis caching strategies",
                },
                {
                    name: "page",
                    in: "query",
                    description: "Page number. Defaults to 1.",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1,
                    },
                    example: 1,
                },
                {
                    name: "limit",
                    in: "query",
                    description: "Number of results per page. Defaults to 10. Maximum is 15.",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 15,
                        default: 10,
                    },
                    example: 10,
                },
            ],

            responses: {
                200: {
                    description:
                        "Search completed successfully. Results are sorted by relevance score. " +
                        "`total` reflects the count of all matching documents (not just the current page).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedSearchResponse",
                            },
                            example: {
                                success: true,
                                data: [
                                    {
                                        _id: "6866a2f3e12b4c1d0a9f5678",
                                        title: "Building Resilient Microservices with Node.js and Redis",
                                        slug: "building-resilient-microservices-with-nodejs-and-redis",
                                        excerpt:
                                            "Redis is an in-memory data structure store used as a cache, " +
                                            "message broker, and database. In this article we explore how to integrate...",
                                        createdAt: "2026-03-10T09:15:00.000Z",
                                    },
                                    {
                                        _id: "6866b1d2e12b4c1d0a9f3456",
                                        title: "Redis Caching Strategies for High-Traffic APIs",
                                        slug: "redis-caching-strategies-for-high-traffic-apis",
                                        excerpt:
                                            "Effective caching is essential for scalable API design. In this guide " +
                                            "we compare cache-aside, write-through, and write-behind strategies...",
                                        createdAt: "2026-04-22T11:00:00.000Z",
                                    },
                                ],
                                meta: {
                                    page: 1,
                                    limit: 10,
                                    total: 7,
                                    totalPages: 1,
                                },
                            },
                        },
                    },
                },

                400: {
                    description:
                        "The `q` query parameter is missing or fewer than 2 characters.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Search query must contain atleast 2 characters",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                429: {
                    description:
                        "Rate limit exceeded. Maximum 100 requests per 15-minute window per IP.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                500: {
                    description: "Internal server error.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },
            },
        },
    },
};