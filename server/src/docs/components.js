export const components = {

  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description:
        "Short-lived JWT access token. Obtain it from `POST /auth/login`. " +
        "Paste the raw token value only — do **not** include the `Bearer ` prefix " +
        "when entering it in the Swagger UI Authorize dialog.",
    },
  },

  schemas: {
    // ─── Auth / User 

    User: {
      type: "object",
      description:
        "A registered platform user. Sensitive fields (password, " +
        "OTP hashes, refreshTokenVersion) are never returned by the API.",
      properties: {
        _id: {
          type: "string",
          description: "MongoDB ObjectId of the user.",
          example: "6865c1f8d34f9f1e9e9b1234",
        },
        name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          description: "Display name of the user.",
          example: "Amara Okafor",
        },
        email: {
          type: "string",
          format: "email",
          description: "Unique, lowercase email address.",
          example: "amara.okafor@example.com",
        },
        role: {
          type: "string",
          enum: ["USER", "EDITOR", "ADMIN"],
          description:
            "RBAC role. `USER` — standard author; `EDITOR` — can review all " +
            "articles; `ADMIN` — full platform control. Only `USER` and `EDITOR` " +
            "roles can be assigned via the API (Admin role cannot be modified).",
          example: "EDITOR",
        },
        emailVerified: {
          type: "boolean",
          description: "Whether the user has verified their email address.",
          example: true,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "ISO 8601 timestamp of account creation.",
          example: "2026-01-15T08:30:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "ISO 8601 timestamp of the last account update.",
          example: "2026-06-20T14:22:00.000Z",
        },
      },
    },


    ArticleAuthor: {
      type: "object",
      description:
        "Minimal author information embedded inside an Article response.",
      properties: {
        _id: {
          type: "string",
          example: "6865c1f8d34f9f1e9e9b1234",
        },
        name: {
          type: "string",
          example: "Amara Okafor",
        },
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
      },
    },


    PendingArticleAuthor: {
      type: "object",
      description:
        "Author information embedded in pending article responses. " +
        "Includes the `role` field so editors can identify the submitter's permissions.",
      properties: {
        _id: {
          type: "string",
          example: "6865c1f8d34f9f1e9e9b1234",
        },
        name: {
          type: "string",
          example: "Amara Okafor",
        },
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
        role: {
          type: "string",
          enum: ["USER", "EDITOR", "ADMIN"],
          example: "USER",
        },
      },
    },

    // ─── Article 
    Article: {
      type: "object",
      description:
        "A full article document as returned by the database. " +
        "The `author` field is populated with name and email (or name, email, " +
        "and role for pending article responses).",
      properties: {
        _id: {
          type: "string",
          description: "MongoDB ObjectId of the article.",
          example: "6866a2f3e12b4c1d0a9f5678",
        },
        title: {
          type: "string",
          description: "Article title. Must be between 5 and 150 characters.",
          example: "Building Resilient Microservices with Node.js and Redis",
        },
        slug: {
          type: "string",
          description:
            "URL-safe slug derived from the title using `slugify`. " +
            "Auto-generated on create; regenerated when the title is updated. " +
            "Must be unique across the platform.",
          example: "building-resilient-microservices-with-nodejs-and-redis",
        },
        content: {
          type: "string",
          description:
            "Full article body. Minimum 1 character. May contain HTML or Markdown " +
            "depending on the client implementation.",
          example:
            "<h2>Introduction</h2><p>Redis is an in-memory data structure store used as a cache, message broker, and database...</p>",
        },
        status: {
          type: "string",
          enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
          description:
            "Lifecycle state of the article.\n\n" +
            "- `DRAFT` — created but not yet submitted for review (default)\n" +
            "- `PENDING` — submitted by the author, awaiting admin/editor review\n" +
            "- `PUBLISHED` — approved and publicly visible\n" +
            "- `REJECTED` — reviewed and rejected; author may revise and resubmit",
          example: "PUBLISHED",
        },
        author: {
          $ref: "#/components/schemas/ArticleAuthor",
        },
        views: {
          type: "integer",
          description:
            "Number of times the article has been viewed. Incremented " +
            "asynchronously via a background job when `POST /{slug}/view` is called.",
          example: 1842,
        },
        isDeleted: {
          type: "boolean",
          description:
            "Soft-delete flag. Deleted articles are excluded from all " +
            "public and admin listings.",
          example: false,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "ISO 8601 timestamp of article creation.",
          example: "2026-03-10T09:15:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "ISO 8601 timestamp of the last article update.",
          example: "2026-06-28T11:45:00.000Z",
        },
      },
    },


    SearchResultItem: {
      type: "object",
      description:
        "A condensed article result returned by the search endpoint. " +
        "The `excerpt` is the first 150 characters of the article `content`.",
      properties: {
        _id: {
          type: "string",
          example: "6866a2f3e12b4c1d0a9f5678",
        },
        title: {
          type: "string",
          example: "Building Resilient Microservices with Node.js and Redis",
        },
        slug: {
          type: "string",
          example: "building-resilient-microservices-with-nodejs-and-redis",
        },
        excerpt: {
          type: "string",
          description: "First 150 characters of the article content.",
          example:
            "Redis is an in-memory data structure store used as a cache, message broker, and database. In this article we explore how to integrate...",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-03-10T09:15:00.000Z",
        },
      },
    },

    // ─── Request Bodies 
    RegisterRequest: {
      type: "object",
      required: ["name", "email", "password"],
      description:
        "Request body for user registration. A 6-digit email verification OTP " +
        "will be sent to the provided address upon success.",
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 50,
          description: "Full display name of the user.",
          example: "Amara Okafor",
        },
        email: {
          type: "string",
          format: "email",
          description: "Email address. Must be unique. Stored in lowercase.",
          example: "amara.okafor@example.com",
        },
        password: {
          type: "string",
          format: "password",
          minLength: 8,
          description: "Account password. Minimum 8 characters. Stored hashed.",
          example: "SecurePass@2026",
        },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      description: "Credentials for user login.",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
        password: {
          type: "string",
          format: "password",
          minLength: 8,
          example: "SecurePass@2026",
        },
      },
    },


    VerifyOtpRequest: {
      type: "object",
      required: ["email", "otp"],
      description:
        "Email address and the 6-digit OTP that was sent to that address.",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
        otp: {
          type: "string",
          minLength: 6,
          maxLength: 6,
          description: "6-digit one-time password.",
          example: "483927",
        },
      },
    },


    EmailRequest: {
      type: "object",
      required: ["email"],
      description: "Request body containing only an email address.",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
      },
    },


    ResetPasswordRequest: {
      type: "object",
      required: ["email", "otp", "password"],
      description:
        "Request body for completing a password reset. The OTP must have been " +
        "previously verified via POST /auth/verify-reset-otp.",
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "amara.okafor@example.com",
        },
        otp: {
          type: "string",
          minLength: 6,
          maxLength: 6,
          description: "The same 6-digit OTP used in the verify-reset-otp step.",
          example: "712483",
        },
        password: {
          type: "string",
          format: "password",
          minLength: 8,
          description: "New password. Minimum 8 characters.",
          example: "NewSecurePass@2026",
        },
      },
    },


    ArticleRequest: {
      type: "object",
      required: ["title", "content"],
      description:
        "Request body for creating or updating an article. Both fields are " +
        "required when creating. When updating, either or both may be provided.",
      properties: {
        title: {
          type: "string",
          minLength: 5,
          maxLength: 150,
          description:
            "Article title. The slug is auto-generated from this value " +
            "using `slugify`. Must be globally unique.",
          example: "Building Resilient Microservices with Node.js and Redis",
        },
        content: {
          type: "string",
          minLength: 1,
          description: "Full article body. Minimum 1 character.",
          example:
            "<h2>Introduction</h2><p>Redis is an in-memory data structure store...</p>",
        },
      },
    },


    MessageRequest: {
      type: "object",
      description:
        "Optional message body accepted by publish, reject, and submit " +
        "endpoints. The message is forwarded to the background notification job.",
      properties: {
        message: {
          type: "string",
          description:
            "Optional editorial note or feedback message. Forwarded to the " +
            "author via the notification system.",
          example:
            "Great article! Published to the homepage. A few minor edits were made for style consistency.",
        },
      },
    },

  
    RoleUpdateRequest: {
      type: "object",
      required: ["role"],
      description:
        "Request body for updating a user's role. Only `USER` and `EDITOR` " +
        "values are accepted. The `ADMIN` role cannot be assigned via the API.",
      properties: {
        role: {
          type: "string",
          enum: ["USER", "EDITOR"],
          description: "Target role to assign to the user.",
          example: "EDITOR",
        },
      },
    },

    // ─── Response Bodies 
    LoginResponse: {
      type: "object",
      description:
        "Successful login response. The `refreshToken` is set as an " +
        "`httpOnly` cookie (not visible in the JSON body). Use the `accessToken` " +
        "as the Bearer token for subsequent authenticated requests.",
      properties: {
        message: {
          type: "string",
          example: "Logged in",
        },
        accessToken: {
          type: "string",
          description: "Short-lived JWT access token.",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1YzFmOGQzNGY5ZjFlOWU5YjEyMzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxOTkwMjAwMCwiZXhwIjoxNzE5OTAyOTAwfQ.EXAMPLE_SIGNATURE",
        },
      },
    },


    RefreshResponse: {
      type: "object",
      description:
        "Successful token refresh. A new `refreshToken` cookie is also set " +
        "(token rotation is applied on every refresh).",
      properties: {
        accessToken: {
          type: "string",
          description: "New short-lived JWT access token.",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1YzFmOGQzNGY5ZjFlOWU5YjEyMzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxOTkwMjYwMCwiZXhwIjoxNzE5OTAzNTAwfQ.NEW_SIGNATURE",
        },
      },
    },

 
    MeResponse: {
      type: "object",
      description: "Current authenticated user's public profile.",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        data: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6865c1f8d34f9f1e9e9b1234",
            },
            name: {
              type: "string",
              example: "Amara Okafor",
            },
            email: {
              type: "string",
              format: "email",
              example: "amara.okafor@example.com",
            },
            role: {
              type: "string",
              enum: ["USER", "EDITOR", "ADMIN"],
              example: "EDITOR",
            },
          },
        },
      },
    },


    PaginationMeta: {
      type: "object",
      description:
        "Pagination metadata. `page` and `limit` default to 1 and 10 " +
        "respectively. `limit` is capped at 15 by the server.",
      properties: {
        page: {
          type: "integer",
          minimum: 1,
          description: "Current page number.",
          example: 1,
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 15,
          description: "Number of items per page. Server-enforced maximum is 15.",
          example: 10,
        },
        total: {
          type: "integer",
          description: "Total number of items matching the query.",
          example: 84,
        },
        totalPages: {
          type: "integer",
          description: "Total number of pages.",
          example: 9,
        },
      },
    },


    PaginatedArticleResponse: {
      type: "object",
      description: "Paginated list of articles.",
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
        meta: {
          $ref: "#/components/schemas/PaginationMeta",
        },
      },
    },

    PaginatedSearchResponse: {
      type: "object",
      description:
        "Paginated full-text search results. Items are ranked by relevance score.",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        data: {
          type: "array",
          items: {
            $ref: "#/components/schemas/SearchResultItem",
          },
        },
        meta: {
          $ref: "#/components/schemas/PaginationMeta",
        },
      },
    },

 
    ArticleStats: {
      type: "object",
      description:
        "Aggregated article statistics. `getArticleStats` is platform-wide " +
        "(admin only); `getMyArticleStats` is scoped to the authenticated user.",
      properties: {
        total: {
          type: "integer",
          description: "Total number of non-deleted articles.",
          example: 42,
        },
        draft: {
          type: "integer",
          description: "Number of articles in DRAFT status.",
          example: 6,
        },
        pending: {
          type: "integer",
          description: "Number of articles in PENDING status.",
          example: 5,
        },
        published: {
          type: "integer",
          description: "Number of articles in PUBLISHED status.",
          example: 28,
        },
        rejected: {
          type: "integer",
          description: "Number of articles in REJECTED status.",
          example: 3,
        },
        totalViews: {
          type: "integer",
          description: "Sum of all view counts across the matched articles.",
          example: 94217,
        },
      },
    },

 
    UploadResponse: {
      type: "object",
      description:
        "Response from a successful image upload. The returned `url` is a " +
        "Cloudinary CDN URL that can be stored as article cover images or embedded " +
        "inside article content.",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        data: {
          type: "object",
          properties: {
            url: {
              type: "string",
              format: "uri",
              description: "Public Cloudinary CDN URL of the uploaded image.",
              example:
                "https://res.cloudinary.com/content-platform/image/upload/v1719902000/content-platform/article-cover-xk9f3a.webp",
            },
            publicId: {
              type: "string",
              description:
                "Cloudinary public ID. Useful for managing or deleting the asset later.",
              example: "content-platform/article-cover-xk9f3a",
            },
          },
        },
      },
    },


    HealthResponse: {
      type: "object",
      description: "Application liveness check response.",
      properties: {
        status: {
          type: "string",
          enum: ["ok"],
          example: "ok",
        },
        version: {
          type: "string",
          example: "1.0.0",
        },
        uptime: {
          type: "number",
          description: "Process uptime in seconds.",
          example: 86403.71,
        },
        environment: {
          type: "string",
          enum: ["development", "test", "production"],
          example: "production",
        },
        timestamp: {
          type: "string",
          format: "date-time",
          example: "2026-07-02T10:30:00.000Z",
        },
      },
    },


    ReadinessResponse: {
      type: "object",
      description:
        "Readiness probe response indicating whether all dependent services " +
        "(MongoDB and Redis) are connected.",
      properties: {
        status: {
          type: "string",
          enum: ["ready", "not_ready"],
          example: "ready",
        },
        services: {
          type: "object",
          properties: {
            mongodb: {
              type: "boolean",
              description: "True when Mongoose connection readyState === 1.",
              example: true,
            },
            redis: {
              type: "boolean",
              description: "True when the Redis client `isReady` flag is true.",
              example: true,
            },
          },
        },
        uptime: {
          type: "number",
          description:
            "Process uptime in seconds. Only present in the 200 response.",
          example: 86403.71,
        },
        timestamp: {
          type: "integer",
          description:
            "Unix timestamp (milliseconds). Only present in the 200 response.",
          example: 1751452200000,
        },
      },
    },

    // ─── Generic Responses 
    SuccessResponse: {
      type: "object",
      description: "Generic success response.",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "Operation completed successfully.",
        },
      },
    },


    ErrorResponse: {
      type: "object",
      description:
        "Standard error response produced by the global error handler. " +
        "For 5xx errors the `message` is always `\"Internal Server Error\"` " +
        "to avoid leaking implementation details.",
      properties: {
        success: {
          type: "boolean",
          example: false,
        },
        message: {
          type: "string",
          example: "Article with same title exists",
        },
        verificationRequired: {
          type: "boolean",
          nullable: true,
          description:
            "Present and `true` only when the user attempts to log in " +
            "before verifying their email address.",
          example: true,
        },
        requestId: {
          type: "string",
          description:
            "Unique request identifier for log correlation. Generated per " +
            "request by the `requestId` middleware.",
          example: "req_01HXYZ3KQWM7VABCDE890FGH",
        },
        timestamp: {
          type: "integer",
          description: "Unix timestamp in milliseconds.",
          example: 1751452200000,
        },
      },
    },

    // ─── User List 
    UsersListResponse: {
      type: "object",
      description:
        "List of all registered users. Password and refreshTokenVersion " +
        "fields are excluded.",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        data: {
          type: "array",
          items: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
  },
};