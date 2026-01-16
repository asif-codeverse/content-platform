content-platform/
│
├── client/                          # Frontend (Next.js / React)
│   ├── src/
│   │   ├── app/                     # App router / pages
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx             # Home page
│   │   │   └── articles/
│   │   │       └── [slug]/
│   │   │           └── page.jsx     # Article page (SSR)
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── lib/                     # Client-side helpers
│   │   │   ├── apiClient.js         # Axios / fetch wrapper
│   │   │   └── seo.js               # Meta tag helpers
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useAuth.js
│   │   │
│   │   ├── styles/                  # Global styles
│   │   │   └── globals.css
│   │   │
│   │   └── constants/               # Frontend constants
│   │       └── roles.js
│   │
│   ├── public/                      # Static assets
│   │   └── images/
│   │
│   ├── next.config.js
│   └── package.json
│
├── server/                          # Backend (Express)
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server bootstrap
│   │
│   │   ├── config/                  # Infrastructure & env config
│   │   │   ├── env.js               # Loads & validates env vars
│   │   │   ├── db.js                # MongoDB connection
│   │   │   ├── redis.js             # Redis connection
│   │   │   └── constants.js         # App-wide constants
│   │
│   │   ├── modules/                 # Feature-based modules
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js       # Route definitions
│   │   │   │   ├── auth.controller.js   # HTTP logic
│   │   │   │   ├── auth.service.js      # Business logic
│   │   │   │   ├── auth.validation.js   # Request validation
│   │   │   │   └── auth.model.js        # User schema
│   │   │
│   │   │   ├── user/
│   │   │   │   ├── user.routes.js
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.service.js
│   │   │   │   └── user.model.js
│   │   │
│   │   │   ├── article/
│   │   │   │   ├── article.routes.js
│   │   │   │   ├── article.controller.js
│   │   │   │   ├── article.service.js
│   │   │   │   ├── article.validation.js
│   │   │   └── article.model.js
│   │   │
│   │   │   ├── admin/
│   │   │   │   ├── admin.routes.js
│   │   │   │   ├── admin.controller.js
│   │   │   │   └── admin.service.js
│   │   │
│   │   │   └── search/
│   │   │       ├── search.routes.js
│   │   │       └── search.service.js
│   │
│   │   ├── middlewares/             # Cross-cutting concerns
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   ├── rbac.middleware.js   # Role-based access
│   │   │   ├── rateLimiter.js       # API rate limiting
│   │   │   └── error.middleware.js  # Central error handler
│   │
│   │   ├── jobs/                    # Background jobs
│   │   │   ├── email.job.js
│   │   │   └── viewCount.job.js
│   │
│   │   ├── utils/                   # Shared helpers
│   │   │   ├── logger.js            # Structured logging
│   │   │   ├── asyncHandler.js      # Async error wrapper
│   │   │   ├── apiResponse.js       # Standard API response
│   │   │   └── slugify.js
│   │
│   │   ├── routes.js                # Central route loader
│   │   └── docs/                    # API & system docs
│   │
│   ├── tests/                       # Backend tests
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── nginx/
│   └── default.conf                 # Reverse proxy config
│
├── docker-compose.yml
├── README.md
├── ARCHITECTURE.md
└── .gitignore
