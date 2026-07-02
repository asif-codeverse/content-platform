export const tags = [
  {
    name: "Health",
    description:
      "Liveness and readiness probes. These endpoints are used by load balancers " +
      "and orchestration systems (e.g., Kubernetes, Render, Railway) to verify that " +
      "the API process is alive (`/health`) and that all downstream dependencies — " +
      "MongoDB and Redis — are connected and ready to serve traffic (`/readiness`).",
  },

  {
    name: "Authentication",
    description:
      "User registration, email verification, login, token refresh, logout, " +
      "and password reset flows.\n\n" +
      "**Token Strategy**\n" +
      "- `POST /auth/login` returns a short-lived **access token** in the JSON body and " +
      "  sets a long-lived **refresh token** as an `httpOnly` cookie.\n" +
      "- Use the access token as `Authorization: Bearer <token>` on every protected request.\n" +
      "- Refresh the access token via `POST /auth/refresh` (the refresh token cookie is " +
      "  sent automatically by the browser or can be provided manually).\n" +
      "- Token rotation is applied on every refresh — a new refresh token cookie is issued " +
      "  and the previous version is invalidated via `refreshTokenVersion`.\n\n" +
      "**Email Verification**\n" +
      "Registration sends a 6-digit OTP to the provided email. The account cannot log in " +
      "until the OTP is verified via `POST /auth/verify-email`. OTPs expire after 10 minutes " +
      "and can be re-requested after a 60-second cooldown.",
  },

  {
    name: "Articles - Public",
    description:
      "Endpoints accessible without authentication.\n\n" +
      "- `GET /articles` — paginated list of all published articles with HTTP caching " +
      "  (`Cache-Control: public, max-age=60, stale-while-revalidate=30` and " +
      "  `Last-Modified` / `If-Modified-Since` support).\n" +
      "- `GET /articles/:slug` — fetch a single published article by its URL slug.\n" +
      "- `POST /articles/:slug/view` — record an article view (asynchronously increments " +
      "  the `views` counter via a background job).",
  },

  {
    name: "Articles - User",
    description:
      "Endpoints for authenticated users (roles: `USER`, `EDITOR`, `ADMIN`) to " +
      "manage their own articles.\n\n" +
      "**Article Lifecycle**\n" +
      "```\n" +
      "DRAFT ──[submit]──> PENDING ──[publish]──> PUBLISHED\n" +
      "                         └──[reject]──> DRAFT (revision)\n" +
      "```\n" +
      "- Authors can only edit their own articles.\n" +
      "- Only `DRAFT` and `REJECTED` articles can be edited or re-submitted.\n" +
      "- Only `DRAFT` and `REJECTED` articles can be deleted by the author.",
  },

  {
    name: "Articles - Admin",
    description:
      "Elevated endpoints for editorial and administrative workflows.\n\n" +
      "- **EDITOR + ADMIN**: `GET /articles/all` (all articles), `GET /articles/id/:id`, " +
      "  `PATCH /articles/:id` (update any article).\n" +
      "- **ADMIN only**: `GET /articles/stats`, `GET /articles/pending`, " +
      "  `PATCH /articles/:id/publish`, `PATCH /articles/:id/reject`, " +
      "`DELETE /articles/:id`.\n\n" +
      "Publishing triggers a background notification job that emails the author. " +
      "Rejection also triggers a notification job and reverts the article to `DRAFT` status.",
  },

  {
    name: "Search",
    description:
      "Full-text search across all published articles.\n\n" +
      "Search uses MongoDB's `$text` index on the `title` and `content` fields, " +
      "ranking results by relevance score. Results are paginated and cached in Redis " +
      "for 5 minutes. The query string `q` must be at least 2 characters.",
  },

  {
    name: "Upload",
    description:
      "Image upload for article cover photos and inline content images.\n\n" +
      "Accepts `multipart/form-data` with a single `image` field. Images are streamed " +
      "directly to Cloudinary (stored under the `content-platform/` folder). " +
      "Supported types: all `image/*` MIME types. Maximum file size: **5 MB**.\n\n" +
      "Requires authentication (`Bearer` token). The returned `url` is a Cloudinary CDN " +
      "URL that can be embedded in article content.",
  },

  {
    name: "Users",
    description:
      "User management endpoints. Accessible to **ADMIN** only.\n\n" +
      "- `GET /users` — list all registered users (sorted by creation date, newest first; " +
      "  `password` and `refreshTokenVersion` are excluded from the response).\n" +
      "- `PATCH /users/:id/role` — update a user's role. Only `USER` and `EDITOR` can be " +
      "  assigned; the `ADMIN` role cannot be set or removed via the API.",
  },
];