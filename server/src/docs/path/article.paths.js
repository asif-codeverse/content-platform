
export const articlePaths = {

    "/articles": {
        get: {
            tags: ["Articles - Public"],

            operationId: "listPublishedArticles",

            summary: "List published articles (paginated)",

            description:
                "Returns a paginated list of all articles with `status: PUBLISHED` and " +
                "`isDeleted: false`.\n\n" +
                "**HTTP Caching:**\n" +
                "- `Cache-Control: public, max-age=60, stale-while-revalidate=30` is set.\n" +
                "- `Last-Modified` header is set to the most recently updated published article's `updatedAt`.\n" +
                "- `If-Modified-Since` is respected: the server returns `304 Not Modified` " +
                "  when the collection hasn't changed since the client's last request.\n\n" +
                "**Redis Cache:** Results are cached per page/limit for 60 seconds.\n\n" +
                "**Query parameters:**\n" +
                "- `sort`: `newest` (default) or `oldest`\n" +
                "- `page`: defaults to `1`\n" +
                "- `limit`: defaults to `10`, server maximum is `15`",

            parameters: [
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
                    description: "Number of articles per page. Defaults to 10. Maximum is 15.",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 15,
                        default: 10,
                    },
                    example: 10,
                },
                {
                    name: "sort",
                    in: "query",
                    description: "Sort order. `newest` (default) sorts by `createdAt` descending.",
                    schema: {
                        type: "string",
                        enum: ["newest", "oldest"],
                        default: "newest",
                    },
                    example: "newest",
                },
            ],

            responses: {
                200: {
                    description:
                        "Published articles retrieved successfully. " +
                        "Includes pagination metadata in the `meta` field.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedArticleResponse",
                            },
                            example: {
                                success: true,
                                data: [
                                    {
                                        _id: "6866a2f3e12b4c1d0a9f5678",
                                        title: "Building Resilient Microservices with Node.js and Redis",
                                        slug: "building-resilient-microservices-with-nodejs-and-redis",
                                        content:
                                            "<h2>Introduction</h2><p>Redis is an in-memory data structure store...</p>",
                                        status: "PUBLISHED",
                                        views: 1842,
                                        isDeleted: false,
                                        author: {
                                            _id: "6865c1f8d34f9f1e9e9b1234",
                                            name: "Amara Okafor",
                                            email: "amara.okafor@example.com",
                                        },
                                        createdAt: "2026-03-10T09:15:00.000Z",
                                        updatedAt: "2026-06-28T11:45:00.000Z",
                                    },
                                ],
                                meta: {
                                    page: 1,
                                    limit: 10,
                                    total: 84,
                                    totalPages: 9,
                                },
                            },
                        },
                    },
                },

                304: {
                    description:
                        "Not Modified. The published articles collection has not changed " +
                        "since the `If-Modified-Since` header date provided by the client.",
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

        // ─── POST /articles 
        post: {
            tags: ["Articles - User"],

            operationId: "createArticle",

            summary: "Create a new draft article",

            description:
                "Creates a new article with `status: DRAFT`. The slug is auto-generated " +
                "from the title using `slugify` (lowercase, strict mode).\n\n" +
                "**Validation (Zod):**\n" +
                "- `title`: required, min 5 characters, max 150 characters\n" +
                "- `content`: required, min 1 character\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.\n\n" +
                "**Side effects on success:** Redis cache is invalidated for " +
                "`articles:published` and all `search:*` keys.\n\n" +
                "**Error cases:**\n" +
                "- Title already exists (slug collision) → `409 Conflict`",

            security: [{ bearerAuth: [] }],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ArticleRequest",
                        },
                        examples: {
                            newArticle: {
                                summary: "Typical article creation",
                                value: {
                                    title: "Building Resilient Microservices with Node.js and Redis",
                                    content:
                                        "<h2>Introduction</h2><p>Redis is an in-memory data structure store used as a cache, message broker, and database...</p>",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                201: {
                    description:
                        "Article created successfully as a DRAFT. The article is not yet publicly visible.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Article",
                            },
                            example: {
                                _id: "6866a2f3e12b4c1d0a9f5678",
                                title: "Building Resilient Microservices with Node.js and Redis",
                                slug: "building-resilient-microservices-with-nodejs-and-redis",
                                content:
                                    "<h2>Introduction</h2><p>Redis is an in-memory data structure store...</p>",
                                status: "DRAFT",
                                views: 0,
                                isDeleted: false,
                                author: "6865c1f8d34f9f1e9e9b1234",
                                createdAt: "2026-07-02T10:30:00.000Z",
                                updatedAt: "2026-07-02T10:30:00.000Z",
                            },
                        },
                    },
                },

                400: {
                    description:
                        "Request body failed Zod validation. " +
                        "Title must be 5–150 characters; content must be non-empty.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "title: String must contain at least 5 character(s)",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description: "Authenticated but role is not permitted (must be USER, EDITOR, or ADMIN).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Forbidden: insufficient rights",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                409: {
                    description:
                        "An article with the same title (and therefore the same slug) already exists.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Article with same title exists",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },
    },

    // ─── GET /articles/my 
    "/articles/my": {
        get: {
            tags: ["Articles - User"],

            operationId: "getMyArticles",

            summary: "List all articles authored by the current user",

            description:
                "Returns all non-deleted articles authored by the authenticated user, " +
                "sorted by `createdAt` descending (newest first). **No pagination** — " +
                "all matching articles are returned in a single response.\n\n" +
                "All statuses (`DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`) are included.\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.",

            security: [{ bearerAuth: [] }],

            responses: {
                200: {
                    description: "Author's articles retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true,
                                    },
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Article",
                                        },
                                    },
                                },
                            },
                            example: {
                                success: true,
                                data: [
                                    {
                                        _id: "6866a2f3e12b4c1d0a9f5678",
                                        title: "Building Resilient Microservices with Node.js and Redis",
                                        slug: "building-resilient-microservices-with-nodejs-and-redis",
                                        status: "PUBLISHED",
                                        views: 1842,
                                        isDeleted: false,
                                        author: "6865c1f8d34f9f1e9e9b1234",
                                        createdAt: "2026-03-10T09:15:00.000Z",
                                        updatedAt: "2026-06-28T11:45:00.000Z",
                                    },
                                    {
                                        _id: "6866b3f4e12b4c1d0a9f9012",
                                        title: "Understanding JWT Token Rotation",
                                        slug: "understanding-jwt-token-rotation",
                                        status: "DRAFT",
                                        views: 0,
                                        isDeleted: false,
                                        author: "6865c1f8d34f9f1e9e9b1234",
                                        createdAt: "2026-07-01T08:00:00.000Z",
                                        updatedAt: "2026-07-01T08:00:00.000Z",
                                    },
                                ],
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description: "Role not permitted.",
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

    // ─── GET /articles/my/stats 
    "/articles/my/stats": {
        get: {
            tags: ["Articles - User"],

            operationId: "getMyArticleStats",

            summary: "Get article statistics for the current user",

            description:
                "Returns aggregated statistics for all non-deleted articles authored by " +
                "the authenticated user. Uses a MongoDB `$group` aggregation pipeline.\n\n" +
                "**Requires authentication** (any role).",

            security: [{ bearerAuth: [] }],

            responses: {
                200: {
                    description: "User's article statistics retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true,
                                    },
                                    data: {
                                        $ref: "#/components/schemas/ArticleStats",
                                    },
                                },
                            },
                            example: {
                                success: true,
                                data: {
                                    total: 12,
                                    draft: 3,
                                    pending: 1,
                                    published: 7,
                                    rejected: 1,
                                    totalViews: 14382,
                                },
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
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

    // ─── /articles/my/:id 
    "/articles/my/{id}": {
        get: {
            tags: ["Articles - User"],

            operationId: "getMyArticleById",

            summary: "Get a single article authored by the current user",

            description:
                "Returns a specific article by its MongoDB ObjectId, but **only if the " +
                "authenticated user is the article's author** (ABAC enforcement via `canEditArticle`).\n\n" +
                "**Error cases:**\n" +
                "- Invalid ObjectId format → `400 Bad Request`\n" +
                "- Article not found or soft-deleted → `404 Not Found`\n" +
                "- Article belongs to another user (and caller is not ADMIN) → `403 Forbidden`\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article.",
                    schema: {
                        type: "string",
                    },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            responses: {
                200: {
                    description: "Article retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true,
                                    },
                                    data: {
                                        $ref: "#/components/schemas/Article",
                                    },
                                },
                            },
                        },
                    },
                },

                400: {
                    description: "The provided `id` is not a valid MongoDB ObjectId.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Invalid article id",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description:
                        "The article exists but belongs to a different user. " +
                        "Admins are exempt from this restriction.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Not allowed",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                404: {
                    description: "Article not found or has been soft-deleted.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Article not found",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },

        patch: {
            tags: ["Articles - User"],

            operationId: "updateMyArticle",

            summary: "Update an article authored by the current user",

            description:
                "Updates the `title` and/or `content` of an article owned by the " +
                "authenticated user. Both fields are optional in the request body — " +
                "only provided fields are updated.\n\n" +
                "**Business rules:**\n" +
                "- Only `DRAFT` or `REJECTED` articles can be edited (not `PENDING` or `PUBLISHED`).\n" +
                "- The user must own the article (ABAC via `canEditArticle`).\n" +
                "- If `title` is changed, the slug is regenerated and uniqueness is checked.\n\n" +
                "**Side effects on success:** Redis cache is invalidated for the old slug, " +
                "new slug, `articles:published`, and all `search:*` keys.\n\n" +
                "**Error cases:**\n" +
                "- Invalid ObjectId → `400 Bad Request`\n" +
                "- Article in non-editable state (`PENDING` or `PUBLISHED`) → `403 Forbidden`\n" +
                "- Slug collision with existing article → `409 Conflict`\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to update.",
                    schema: {
                        type: "string",
                    },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ArticleRequest",
                        },
                        examples: {
                            updateBoth: {
                                summary: "Update both title and content",
                                value: {
                                    title: "Building Resilient Microservices with Node.js, Redis, and BullMQ",
                                    content:
                                        "<h2>Introduction</h2><p>In this updated version we also cover BullMQ for job queues...</p>",
                                },
                            },
                            updateContentOnly: {
                                summary: "Update content only",
                                value: {
                                    content:
                                        "<h2>Introduction</h2><p>Updated introduction with new examples...</p>",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Article updated successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true,
                                    },
                                    data: {
                                        $ref: "#/components/schemas/Article",
                                    },
                                },
                            },
                        },
                    },
                },

                400: {
                    description: "Invalid ObjectId format.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Invalid article id",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description:
                        "Article cannot be edited — either the user does not own it, " +
                        "or it is in a non-editable state (PENDING or PUBLISHED).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            examples: {
                                wrongOwner: {
                                    summary: "User does not own the article",
                                    value: {
                                        success: false,
                                        message: "Not allowed to modify this article",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                wrongStatus: {
                                    summary: "Article is in a non-editable state",
                                    value: {
                                        success: false,
                                        message: "Only draft or rejected articles can be edited",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                            },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                409: {
                    description: "Another article already uses the new title (slug collision).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Another article already uses this title",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },

        delete: {
            tags: ["Articles - User"],

            operationId: "deleteMyArticle",

            summary: "Soft-delete an article authored by the current user",

            description:
                "Soft-deletes an article owned by the authenticated user by setting " +
                "`isDeleted: true` on the database document. The article is excluded from " +
                "all future listings.\n\n" +
                "**Business rules:**\n" +
                "- Only `DRAFT` or `REJECTED` articles can be deleted by the author " +
                "  (ADMIN can delete any status).\n" +
                "- The user must own the article (ABAC via `canEditArticle`).\n\n" +
                "**Side effects on success:** Redis cache is invalidated for " +
                "`articles:published` and all `search:*` keys.\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to delete.",
                    schema: {
                        type: "string",
                    },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            responses: {
                200: {
                    description:
                        "Article soft-deleted successfully. The document is retained in the " +
                        "database with `isDeleted: true`.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Article",
                            },
                            example: {
                                _id: "6866a2f3e12b4c1d0a9f5678",
                                title: "Understanding JWT Token Rotation",
                                slug: "understanding-jwt-token-rotation",
                                status: "DRAFT",
                                isDeleted: true,
                                views: 0,
                                author: "6865c1f8d34f9f1e9e9b1234",
                                createdAt: "2026-07-01T08:00:00.000Z",
                                updatedAt: "2026-07-02T10:45:00.000Z",
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description:
                        "Deletion is not permitted — user does not own the article, or it is " +
                        "in a non-deletable status (PENDING or PUBLISHED) for non-admin users.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            examples: {
                                wrongOwner: {
                                    summary: "User does not own the article",
                                    value: {
                                        success: false,
                                        message: "Not allowed to delete this article",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                wrongStatus: {
                                    summary: "Article status cannot be deleted",
                                    value: {
                                        success: false,
                                        message: "Only draft or rejected articles can be deleted",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                            },
                        },
                    },
                },

                404: {
                    description: "Article not found or already soft-deleted.",
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

    // ─── PATCH /articles/:id/submit 
    "/articles/{id}/submit": {
        patch: {
            tags: ["Articles - User"],

            operationId: "submitArticleForReview",

            summary: "Submit article for editorial review",

            description:
                "Transitions an article from `DRAFT` or `REJECTED` status to `PENDING`, " +
                "making it visible to admins in the review queue.\n\n" +
                "**Business rules:**\n" +
                "- Only `DRAFT` or `REJECTED` articles can be submitted.\n" +
                "- The user must own the article (ABAC via `canEditArticle`).\n\n" +
                "**Side effects on success:**\n" +
                "- An `ARTICLE_SUBMITTED` background job is enqueued with the optional " +
                "  `message` from the request body (forwarded to the notification system).\n" +
                "- Redis cache invalidated for `articles:published` and `search:*`.\n\n" +
                "**Role required:** `USER`, `EDITOR`, or `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to submit.",
                    schema: {
                        type: "string",
                    },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            requestBody: {
                required: false,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/MessageRequest",
                        },
                        example: {
                            message:
                                "This article covers the Redis integration pattern we discussed. Ready for review.",
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Article submitted for review. Status is now PENDING.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true,
                                    },
                                    message: {
                                        type: "string",
                                        example: "Article submitted for review",
                                    },
                                    data: {
                                        $ref: "#/components/schemas/Article",
                                    },
                                },
                            },
                        },
                    },
                },

                400: {
                    description:
                        "The article is in a state that cannot be submitted (must be DRAFT or REJECTED).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Only draft or rejected articles can be submitted",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description: "User does not own the article.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "You are not allowed to submit this article.",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
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

    // ─── GET /articles/all 
    "/articles/all": {
        get: {
            tags: ["Articles - Admin"],

            operationId: "getAllArticles",

            summary: "List all articles (admin/editor view)",

            description:
                "Returns a paginated list of all non-deleted articles regardless of status. " +
                "Supports filtering by `status` and text `search` via query parameters.\n\n" +
                "**Query parameters (via `parseQuery`):**\n" +
                "- `page`: defaults to 1\n" +
                "- `limit`: defaults to 10, max 15\n" +
                "- `sort`: `newest` (default) or `oldest`\n" +
                "- `status`: filter by article status (`DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`)\n" +
                "- `search`: case-insensitive regex search on `title` and `content`\n" +
                "- `slug`: exact slug match\n\n" +
                "**Role required:** `ADMIN` or `EDITOR`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: { type: "integer", minimum: 1, default: 1 },
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", minimum: 1, maximum: 15, default: 10 },
                },
                {
                    name: "sort",
                    in: "query",
                    schema: {
                        type: "string",
                        enum: ["newest", "oldest"],
                        default: "newest",
                    },
                },
                {
                    name: "status",
                    in: "query",
                    description: "Filter by article status.",
                    schema: {
                        type: "string",
                        enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
                    },
                    example: "PENDING",
                },
                {
                    name: "search",
                    in: "query",
                    description:
                        "Case-insensitive regex search applied to `title` and `content` fields.",
                    schema: { type: "string" },
                    example: "redis",
                },
                {
                    name: "slug",
                    in: "query",
                    description: "Exact slug match.",
                    schema: { type: "string" },
                    example: "building-resilient-microservices-with-nodejs-and-redis",
                },
            ],

            responses: {
                200: {
                    description: "Articles retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedArticleResponse",
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN or EDITOR).",
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

    // ─── GET /articles/id/:id 
    "/articles/id/{id}": {
        get: {
            tags: ["Articles - Admin"],

            operationId: "getArticleById",

            summary: "Get any article by MongoDB ObjectId",

            description:
                "Returns a single article by its MongoDB ObjectId, regardless of status. " +
                "Useful for editors previewing or reviewing a specific article before publication.\n\n" +
                "**Role required:** `ADMIN` or `EDITOR`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article.",
                    schema: { type: "string" },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            responses: {
                200: {
                    description: "Article retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/Article" },
                                },
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN or EDITOR).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Article not found",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },
    },

    // ─── GET /articles/stats 
    "/articles/stats": {
        get: {
            tags: ["Articles - Admin"],

            operationId: "getPlatformArticleStats",

            summary: "Get platform-wide article statistics",

            description:
                "Returns aggregated article statistics across the entire platform " +
                "(all authors, all statuses). Uses a MongoDB `$group` aggregation pipeline " +
                "on non-deleted articles.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            responses: {
                200: {
                    description: "Platform article statistics retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/ArticleStats" },
                                },
                            },
                            example: {
                                success: true,
                                data: {
                                    total: 247,
                                    draft: 38,
                                    pending: 12,
                                    published: 183,
                                    rejected: 14,
                                    totalViews: 982714,
                                },
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },

    // ─── GET /articles/pending 
    "/articles/pending": {
        get: {
            tags: ["Articles - Admin"],

            operationId: "getPendingArticles",

            summary: "List articles awaiting editorial review",

            description:
                "Returns all non-deleted articles with `status: PENDING`, sorted by " +
                "`createdAt` descending. **No pagination** — all pending articles are " +
                "returned in a single response.\n\n" +
                "The `author` field is populated with `name`, `email`, and `role`.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            responses: {
                200: {
                    description: "Pending articles retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: {
                                            allOf: [
                                                { $ref: "#/components/schemas/Article" },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        author: {
                                                            $ref: "#/components/schemas/PendingArticleAuthor",
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                            example: {
                                success: true,
                                data: [
                                    {
                                        _id: "6866c5a1e12b4c1d0a9f7890",
                                        title: "Optimizing MongoDB Aggregation Pipelines",
                                        slug: "optimizing-mongodb-aggregation-pipelines",
                                        status: "PENDING",
                                        views: 0,
                                        isDeleted: false,
                                        author: {
                                            _id: "6865d2a9d34f9f1e9e9b5678",
                                            name: "Kofi Mensah",
                                            email: "kofi.mensah@example.com",
                                            role: "USER",
                                        },
                                        createdAt: "2026-07-01T14:30:00.000Z",
                                        updatedAt: "2026-07-02T09:00:00.000Z",
                                    },
                                ],
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },

    // ─── /articles/:id 
    "/articles/{id}": {
        patch: {
            tags: ["Articles - Admin"],

            operationId: "updateArticle",

            summary: "Update any article (admin/editor)",

            description:
                "Updates the `title` and/or `content` of any article. Both fields are " +
                "optional in the request body.\n\n" +
                "**Business rules:**\n" +
                "- Non-ADMIN users can only edit articles in `DRAFT` status " +
                "  (ADMIN can edit any status).\n" +
                "- ABAC: `canEditArticle` is checked — the caller must own the article " +
                "  or be an ADMIN.\n" +
                "- If `title` is changed, the slug is regenerated and uniqueness is checked.\n\n" +
                "**Side effects on success:** Redis cache is invalidated for the old slug, " +
                "new slug, `articles:published`, and all `search:*` keys.\n\n" +
                "**Role required:** `ADMIN` or `EDITOR`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to update.",
                    schema: { type: "string" },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ArticleRequest",
                        },
                        example: {
                            title: "Building Resilient Microservices with Node.js, Redis, and BullMQ",
                            content:
                                "<h2>Introduction</h2><p>In this updated version we also cover BullMQ for job queues...</p>",
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Article updated successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Article",
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description:
                        "Update not permitted. Either the user does not own the article (for non-admin), " +
                        "or the article is not in an editable state.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            examples: {
                                wrongOwner: {
                                    summary: "Ownership check failed",
                                    value: {
                                        success: false,
                                        message: "Not allowed to modify this article",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                wrongStatus: {
                                    summary: "Non-ADMIN trying to edit non-DRAFT",
                                    value: {
                                        success: false,
                                        message: "Only draft articles can be edited",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                            },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                409: {
                    description: "Slug collision — another article already uses the new title.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Another article already uses this title",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },

        delete: {
            tags: ["Articles - Admin"],

            operationId: "deleteArticle",

            summary: "Soft-delete any article (admin)",

            description:
                "Soft-deletes any article by its MongoDB ObjectId, regardless of status " +
                "or ownership. Sets `isDeleted: true` on the document.\n\n" +
                "**Side effects on success:** Redis cache is invalidated for " +
                "`articles:published` and all `search:*` keys.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to delete.",
                    schema: { type: "string" },
                    example: "6866a2f3e12b4c1d0a9f5678",
                },
            ],

            responses: {
                200: {
                    description: "Article soft-deleted successfully.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Article" },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                404: {
                    description: "Article not found or already soft-deleted.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },

    // ─── PATCH /articles/:id/publish 
    "/articles/{id}/publish": {
        patch: {
            tags: ["Articles - Admin"],

            operationId: "publishArticle",

            summary: "Publish a pending article",

            description:
                "Transitions an article from `PENDING` to `PUBLISHED`, making it " +
                "publicly accessible via the public API.\n\n" +
                "**Business rules:**\n" +
                "- The article must be in `PENDING` status (already reviewed by editorial).\n" +
                "- Articles already `PUBLISHED` return `400 Bad Request`.\n\n" +
                "**Side effects on success:**\n" +
                "- An `ARTICLE_PUBLISHED` background job is enqueued (notifies the author).\n" +
                "- An optional `message` from the request body is forwarded to the job.\n" +
                "- Redis cache invalidated for `articles:published` and all `search:*` keys.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to publish.",
                    schema: { type: "string" },
                    example: "6866c5a1e12b4c1d0a9f7890",
                },
            ],

            requestBody: {
                required: false,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/MessageRequest",
                        },
                        example: {
                            message:
                                "Great article, Kofi! A few minor edits were made for consistency. Now live on the platform.",
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Article published successfully. Status is now PUBLISHED.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Article" },
                            example: {
                                _id: "6866c5a1e12b4c1d0a9f7890",
                                title: "Optimizing MongoDB Aggregation Pipelines",
                                slug: "optimizing-mongodb-aggregation-pipelines",
                                status: "PUBLISHED",
                                views: 0,
                                isDeleted: false,
                                author: {
                                    _id: "6865d2a9d34f9f1e9e9b5678",
                                    name: "Kofi Mensah",
                                    email: "kofi.mensah@example.com",
                                },
                                createdAt: "2026-07-01T14:30:00.000Z",
                                updatedAt: "2026-07-02T10:30:00.000Z",
                            },
                        },
                    },
                },

                400: {
                    description:
                        "The article cannot be published. It is either already PUBLISHED " +
                        "or not in PENDING status.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            examples: {
                                alreadyPublished: {
                                    summary: "Article is already published",
                                    value: {
                                        success: false,
                                        message: "Article is already published",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                notPending: {
                                    summary: "Article is not in PENDING status",
                                    value: {
                                        success: false,
                                        message: "Only pending articles can be published",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },

    // ─── PATCH /articles/:id/reject 
    "/articles/{id}/reject": {
        patch: {
            tags: ["Articles - Admin"],

            operationId: "rejectArticle",

            summary: "Reject a pending article",

            description:
                "Transitions an article from `PENDING` back to `DRAFT` status, indicating " +
                "that it requires revisions before it can be published.\n\n" +
                "**Business rules:**\n" +
                "- The article must be in `PENDING` status.\n\n" +
                "**Side effects on success:**\n" +
                "- An `ARTICLE_REJECTED` background job is enqueued (notifies the author).\n" +
                "- An optional `message` from the request body is forwarded to the job " +
                "  (typically contains editorial feedback).\n" +
                "- Redis cache invalidated for `articles:published` and all `search:*` keys.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the article to reject.",
                    schema: { type: "string" },
                    example: "6866c5a1e12b4c1d0a9f7890",
                },
            ],

            requestBody: {
                required: false,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/MessageRequest",
                        },
                        example: {
                            message:
                                "The technical accuracy needs improvement. Please add code examples " +
                                "and cite sources for the performance benchmarks.",
                        },
                    },
                },
            },

            responses: {
                200: {
                    description:
                        "Article rejected. Status has been reverted to DRAFT. " +
                        "The author can revise and resubmit.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Article" },
                            example: {
                                _id: "6866c5a1e12b4c1d0a9f7890",
                                title: "Optimizing MongoDB Aggregation Pipelines",
                                slug: "optimizing-mongodb-aggregation-pipelines",
                                status: "DRAFT",
                                views: 0,
                                isDeleted: false,
                                author: {
                                    _id: "6865d2a9d34f9f1e9e9b5678",
                                    name: "Kofi Mensah",
                                    email: "kofi.mensah@example.com",
                                },
                                createdAt: "2026-07-01T14:30:00.000Z",
                                updatedAt: "2026-07-02T10:45:00.000Z",
                            },
                        },
                    },
                },

                400: {
                    description: "The article is not in PENDING status and cannot be rejected.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Only pending articles can be rejected",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },

                404: {
                    description: "Article not found or soft-deleted.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },

    // ─── GET /articles/:slug 
    "/articles/{slug}": {
        get: {
            tags: ["Articles - Public"],

            operationId: "getArticleBySlug",

            summary: "Get a published article by slug",

            description:
                "Returns a single published (`status: PUBLISHED`) article identified by " +
                "its URL-safe slug.\n\n" +
                "**Redis Cache:** Results are cached per slug for 5 minutes (300 seconds). " +
                "Cache is invalidated when the article is updated or deleted.\n\n" +
                "**This route is registered last** in Express to avoid conflicting with " +
                "static paths like `/all`, `/pending`, `/stats`, `/my`, etc.",

            parameters: [
                {
                    name: "slug",
                    in: "path",
                    required: true,
                    description: "URL-safe slug of the article.",
                    schema: { type: "string" },
                    example: "building-resilient-microservices-with-nodejs-and-redis",
                },
            ],

            responses: {
                200: {
                    description: "Article retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/Article" },
                                },
                            },
                            example: {
                                success: true,
                                data: {
                                    _id: "6866a2f3e12b4c1d0a9f5678",
                                    title: "Building Resilient Microservices with Node.js and Redis",
                                    slug: "building-resilient-microservices-with-nodejs-and-redis",
                                    content:
                                        "<h2>Introduction</h2><p>Redis is an in-memory data structure store used as a cache, message broker, and database...</p>",
                                    status: "PUBLISHED",
                                    views: 1842,
                                    isDeleted: false,
                                    author: {
                                        _id: "6865c1f8d34f9f1e9e9b1234",
                                        name: "Amara Okafor",
                                        email: "amara.okafor@example.com",
                                    },
                                    createdAt: "2026-03-10T09:15:00.000Z",
                                    updatedAt: "2026-06-28T11:45:00.000Z",
                                },
                            },
                        },
                    },
                },

                404: {
                    description:
                        "No published article found with the given slug. " +
                        "The article may not exist, may be soft-deleted, or may not yet be published.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Article not found",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },
    },

    // ─── POST /articles/:slug/view 
    "/articles/{slug}/view": {
        post: {
            tags: ["Articles - Public"],

            operationId: "recordArticleView",

            summary: "Record a page view on an article",

            description:
                "Increments the `views` counter on a published article. The view is " +
                "processed **asynchronously** via a background job queue (`ARTICLE_VIEWED`) " +
                "to avoid blocking the request.\n\n" +
                "This endpoint is **public** — no authentication is required. It is intended " +
                "to be called by the frontend on every article page load.\n\n" +
                "**Note:** The view counter is incremented via `Article.findByIdAndUpdate` " +
                "with `$inc: { views: 1 }` in a background worker.",

            parameters: [
                {
                    name: "slug",
                    in: "path",
                    required: true,
                    description: "URL-safe slug of the article being viewed.",
                    schema: { type: "string" },
                    example: "building-resilient-microservices-with-nodejs-and-redis",
                },
            ],

            responses: {
                200: {
                    description:
                        "View recorded successfully. The view counter will be incremented asynchronously.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                },
                            },
                            example: {
                                success: true,
                            },
                        },
                    },
                },

                404: {
                    description: "No published article found with the given slug.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Article not found",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },
            },
        },
    },
};