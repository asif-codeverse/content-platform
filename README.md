# Content Platform

> A high-performance, open-source publishing platform engineered for complex editorial workflows.

Content Platform is a production-grade, headless content management system built with Next.js 16, Express, MongoDB, and Redis. It provides a robust foundation for digital publishers, offering explicit trust boundaries, stateless authentication, aggressive caching, and a clear separation of concerns out of the box. Designed for professional editorial teams, the platform seamlessly handles the entire lifecycle of digital content—from initial drafts to global publication.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## Table of Contents

- [Content Platform](#content-platform)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Live Demo](#live-demo)
  - [Visual Walkthrough](#visual-walkthrough)
    - [Public Discovery](#public-discovery)
    - [Authentication](#authentication)
    - [Administration](#administration)
  - [Core Capabilities](#core-capabilities)
    - [Identity \& Access Management (IAM)](#identity--access-management-iam)
    - [Editorial Workflow Management](#editorial-workflow-management)
    - [Data Discovery \& Performance](#data-discovery--performance)
    - [Background Processing](#background-processing)
  - [Architecture Overview](#architecture-overview)
  - [Repository Structure](#repository-structure)
  - [Data Models](#data-models)
    - [User Schema (`auth.model.js`)](#user-schema-authmodeljs)
    - [Article Schema (`article.model.js`)](#article-schema-articlemodeljs)
  - [System Workflows](#system-workflows)
    - [Authentication \& Token Rotation Flow](#authentication--token-rotation-flow)
    - [Complex Editorial Lifecycle](#complex-editorial-lifecycle)
  - [Authorization Matrix](#authorization-matrix)
  - [Comprehensive API Reference](#comprehensive-api-reference)
    - [1. Identity Verification](#1-identity-verification)
    - [2. Creating an Editorial Draft](#2-creating-an-editorial-draft)
    - [3. Fetching Paginated \& Cached Search Results](#3-fetching-paginated--cached-search-results)
  - [Caching Strategy](#caching-strategy)
    - [Primary Redis Key Structures](#primary-redis-key-structures)
    - [Cache Flow \& Invalidation Matrix](#cache-flow--invalidation-matrix)
    - [HTTP ETag Optimization](#http-etag-optimization)
  - [Security \& Production Principles](#security--production-principles)
  - [Local Development Guide](#local-development-guide)
    - [Prerequisites](#prerequisites)
    - [1. Repository Setup](#1-repository-setup)
    - [2. Dependency Installation](#2-dependency-installation)
    - [3. Execution](#3-execution)
  - [Environment Variables](#environment-variables)
    - [Server Application (`server/.env`)](#server-application-serverenv)
    - [Client Application (`client/.env.local`)](#client-application-clientenvlocal)
  - [Infrastructure \& Deployment](#infrastructure--deployment)
    - [Recommended Production Topology](#recommended-production-topology)
    - [Docker Deployment](#docker-deployment)
  - [Testing Strategy](#testing-strategy)
    - [Executing the Test Suite](#executing-the-test-suite)
    - [Validated Areas](#validated-areas)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Future Roadmap](#future-roadmap)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)

---

## Project Overview

Content Platform addresses the critical need for a modern, scalable, and secure content management system built entirely with open-source technologies. It provides a frictionless experience for digital publishers, editorial teams, and independent creators who demand complete control over their content pipeline without being locked into proprietary SaaS platforms.

The intended users include:
- **Creators & Editors**: Drafting rich media articles with complex formatting.
- **Administrators & Reviewers**: Governing publishing workflows, rejecting drafts, and managing user roles.
- **End-Users (Readers)**: Consuming and discovering published content rapidly.

The architectural philosophy explicitly centers on **stateless authentication**, **aggressive multi-tier caching**, and **defense in depth**. The system is highly reliable, cache-aware, and production-oriented from the ground up, utilizing modern infrastructure paradigms like asynchronous event queues and optimized ETag generation.

---

## Live Demo

Experience the platform in a live production environment:

- **Frontend Application (Vercel)**: [https://content-platform-v1.vercel.app/](https://content-platform-v1.vercel.app/)
- **Backend API (Render)**: [https://content-platform-api-8ars.onrender.com/](https://content-platform-api-8ars.onrender.com/)
- **Swagger Documentation**: [https://content-platform-api-8ars.onrender.com/docs](https://content-platform-api-8ars.onrender.com/docs)
- **Source Code**: [https://github.com/asif-codeverse/content-platform](https://github.com/asif-codeverse/content-platform)

---

## Visual Walkthrough

### Public Discovery

![Home](docs/screenshots/home.png)

![Articles](docs/screenshots/articles.png)

![Search](docs/screenshots/search.png)

### Authentication

![Login](docs/screenshots/login.png)

![Register](docs/screenshots/register.png)

![Email Verification](docs/screenshots/verify-email.png)

### Administration

![Admin Dashboard](docs/screenshots/admindashboard.png)

![Pending Reviews](docs/screenshots/pending.png)

![Swagger](docs/screenshots/swagger.png)

> **Note:** Original high-resolution screenshots are available in `docs/screenshots/`.
---

## Core Capabilities

### Identity & Access Management (IAM)
- **Stateless Authentication**: The system issues short-lived JWT access tokens (typically 15 minutes) coupled with long-lived, HTTP-Only, secure refresh cookies.
- **Refresh Token Rotation**: Every time a refresh token is used, a new one is issued, and the `refreshTokenVersion` in the database is incremented, automatically invalidating compromised tokens and effectively neutralizing session hijacking.
- **Granular Access Control**: Employs rigorous Role-Based Access Control (RBAC) across `USER`, `EDITOR`, and `ADMIN` tiers. This is heavily reinforced by Attribute-Based Access Control (ABAC), ensuring users can only modify resources they strictly own.
- **Secure Onboarding**: Brevo-powered One-Time Password (OTP) email verification, complete with expiration timestamps (`emailOtpExpiresAt`), ensuring secure user validation and password reset workflows.

### Editorial Workflow Management
- **State Machine Integration**: Implements strict state transitions enforced at the database level (`DRAFT` → `PENDING` → `PUBLISHED` / `REJECTED`).
- **Rich Text Authoring**: Features an integrated headless TipTap editor in the Next.js frontend, providing robust markdown formatting and seamless inline image rendering capabilities.
- **Asset Management**: Direct, secure backend integration with Cloudinary for scalable, optimized media hosting and dynamic image delivery.
- **Auditable Metrics**: View counters are reliably tracked and incremented via background workers to avoid blocking the main event loop during read-heavy traffic.

### Data Discovery & Performance
- **Full-Text Indexing**: Leverages native MongoDB text indexes (`{ title: "text", content: "text" }`) for high-speed, weighted text searches combined with robust offset pagination.
- **Multi-Tier Caching**: A dedicated Redis layer caches individual article payloads, heavily queried paginated lists, and complex search results to eliminate redundant database traversals.
- **Network Optimization**: Deeply integrated ETag generation allows the Express server to return `304 Not Modified` headers for unchanged resources, heavily reducing bandwidth overhead.

### Background Processing
- **Custom Event Queue**: Implements an efficient in-memory job execution system paired with persistent MongoDB state tracking (`jobExecution.model.js`) to prevent duplicate executions across horizontal scaling.
- **Asynchronous Execution**: Completely offloads non-critical paths like article publication events, complex view count increments, and email dispatching to background workers.
- **Fault Tolerance**: Automatic exponential backoff and retry mechanisms for failed jobs (`2 ** job.attempts * 100` milliseconds).

---

## Architecture Overview
The system utilizes a heavily decoupled architecture, fully isolating the Next.js SSR presentation layer from the Express business logic, and utilizing a distinct worker architecture for intensive tasks.

```mermaid
flowchart TD

    subgraph "Client Tier"
        Browser["Browser / Mobile"]
        NextJS["Next.js 16 SSR Frontend"]
    end

    subgraph "Service Tier"
        Express["Express.js REST API"]
        Worker["Asynchronous Job Worker"]
    end

    subgraph "Data Tier"
        Mongo[(MongoDB Atlas Cluster)]
        Redis[(Redis Cloud Cache)]
    end

    subgraph "External Dependencies"
        Cloudinary["Cloudinary CDN"]
        Brevo["Brevo Transactional API"]
    end

    Browser -->|HTTPS / UI Interactions| NextJS
    NextJS -->|RESTful API Calls| Express
    Browser -.->|"Direct API calls (CSR)"| Express

    Express <-->|Mongoose ODM| Mongo
    Express <-->|Cache Hit/Miss| Redis

    Express -->|Upload Media| Cloudinary
    Express -->|Dispatch OTPs| Brevo

    Express -.->|Enqueue Event Payload| Worker
    Worker <-->|Track Job Execution State| Mongo
```

---

## Repository Structure

The monorepo structure cleanly separates concerns, enforcing strict boundaries between the React frontend and the Node.js backend.

```text
content-platform/
├── client/                 # Next.js 16 Frontend (App Router architecture)
│   ├── app/                # Server components, layouts, and dynamic routes
│   │   ├── articles/       # Public article reading views
│   │   ├── dashboard/      # Protected editorial and admin interfaces
│   │   ├── login/          # Authentication entry points
│   │   └── search/         # Discovery interfaces
│   ├── components/         # Modular React components
│   │   ├── editor/         # TipTap Rich Text Editor implementations
│   │   ├── ui/             # Reusable atomic UI elements (Tailwind)
│   │   └── motion/         # Framer Motion animation wrappers
│   ├── lib/                # Client-side utility functions
│   ├── services/           # Axios interceptors and API client wrappers
│   └── types/              # Global TypeScript interfaces
│
├── server/                 # Express.js Backend API
│   ├── src/
│   │   ├── config/         # Environment variables (`env.js`) and DB connectors
│   │   ├── jobs/           # In-memory queue, worker loop, and job handlers
│   │   ├── middlewares/    # Express middlewares (Auth, RBAC, Rate Limiting, Validation)
│   │   ├── modules/        # Domain-driven feature modules (The core application logic)
│   │   │   ├── articles/   # Article models, controllers, routes, and validation
│   │   │   ├── auth/       # Identity lifecycle and token management
│   │   │   ├── search/     # Discovery routing
│   │   │   ├── upload/     # Media ingestion via Cloudinary
│   │   │   └── users/      # Account administration
│   │   ├── services/       # Core agnostic integrations (Redis Cache, Brevo Email)
│   │   └── utils/          # Helper utilities (Winston Logger, Error constructors)
│   ├── __tests__/          # Jest integration test suites
│   └── test-utils/         # Testing helpers (MongoDB Memory Server setup)
│
├── docs/                   # Architectural diagrams and static placeholder assets
└── .github/workflows/      # GitHub Actions CI/CD pipelines (Backend, Frontend, Docker)
```

---

## Data Models

The core domain logic is driven by robust Mongoose schemas. Below are simplified representations of the core models.

### User Schema (`auth.model.js`)
Tracks identity, Role-Based Access Control, and multi-factor authentication states.

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "EDITOR", "ADMIN"], default: "USER" },
  emailVerified: { type: Boolean, default: false },
  emailOtp: { type: String, default: null },
  emailOtpExpiresAt: { type: Date, default: null },
  refreshTokenVersion: { type: Number, default: 0 } // Core to the Token Rotation strategy
}
```

### Article Schema (`article.model.js`)
Tracks the complex editorial lifecycle, relations, and search indexing.

```javascript
{
  title: { type: String, required: true, text: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true, text: true },
  status: { type: String, enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"], default: "DRAFT" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isDeleted: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}
```

---

## System Workflows

### Authentication & Token Rotation Flow

```text
[Registration Payload] → [Generate OTP] → [Brevo Dispatch Email]
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
        [Submit OTP]                                                        [Login]
      (Sets emailVerified)                                                     │
                                                                               ▼
     [Access Token (15m)] ◄──────────────────────────────────────── [Refresh Token (7d)]
      (Used for standard API calls)                                 (HTTP-Only, Secure Cookie)
               │                                                               │
               ▼                                                               ▼
       [Protected API Endpoint] ◄────────────────────────────────── [Token Rotation Endpoint]
                                                                  (Increments token version, 
                                                                   issues new cookie & access token)
```

### Complex Editorial Lifecycle

```text
[EDITOR / AUTHOR]
   │
   ├── POST /articles ─────────► [DRAFT] ◄─── (Iterative Edits via PATCH /articles/my/:id)
   │
   └── PATCH /:id/submit ──────► [PENDING] 
                                    │
[ADMINISTRATOR]                     │
   │                                ├── PATCH /:id/reject ───► [REJECTED]
   │                                │                          (Author receives notification)
   └── PATCH /:id/publish ──────────► [PUBLISHED]
                                          │
                                          ├──► (Triggers Redis Cache Invalidation via Worker)
                                          └──► [AVAILABLE TO READERS via GET /articles]
```

---

## Authorization Matrix

The platform employs a dual-layered security model combining standard **RBAC** (Role-Based Access Control) with **ABAC** (Attribute-Based Access Control). ABAC strictly checks if `req.user.id === resource.author.toString()`.

| Endpoint / Action | Endpoint Path | `USER` | `ADMIN` |
|---|---|:---:|:---:|
| **Read Published Articles** | `GET /` or `GET /:slug` | ✅ | ✅ |
| **Manage Own Profile** | `GET /auth/me` | ✅ | ✅ |
| **View Own Drafts** | `GET /articles/my` | ✅ | ✅ |
| **Create Articles** | `POST /articles` | ✅ | ✅ |
| **Edit Own Articles** | `PATCH /articles/my/:id` | ✅ | ✅ |
| **Submit Articles for Review** | `PATCH /articles/:id/submit` | ✅ | ✅ |
| **Review Pending Articles** | `GET /articles/pending` | ❌ | ✅ |
| **Publish / Reject Articles** | `PATCH /articles/:id/(publish\|reject)` | ❌ | ✅ |
| **Delete Any Article** | `DELETE /articles/:id` | ❌ | ✅ |
| **Manage Platform Users** | `PATCH /users/:id/role` | ❌ | ✅ |

---

## Comprehensive API Reference

Swagger UI is automatically generated and available locally at `http://localhost:5001/docs`. Below are core examples demonstrating the API contract.

### 1. Identity Verification

**Request:** `POST /api/v1/auth/verify-email`
```bash
curl -X POST http://localhost:5001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

### 2. Creating an Editorial Draft

**Request:** `POST /api/v1/articles`
```bash
curl -X POST http://localhost:5001/api/v1/articles \
  -H "Authorization: Bearer <JWT_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Future of Open Source Headless CMS",
    "content": "<h1>Introduction</h1><p>Modern architectures rely heavily on decoupled systems...</p>"
  }'
```

**Response (201 Created):**
```json
{
  "message": "Article created successfully",
  "data": {
    "title": "The Future of Open Source Headless CMS",
    "slug": "the-future-of-open-source-headless-cms",
    "status": "DRAFT",
    "author": "64abcdef1234567890",
    "createdAt": "2023-10-01T12:00:00Z"
  }
}
```

### 3. Fetching Paginated & Cached Search Results

**Request:** `GET /api/v1/search?q=headless&page=1&limit=10`
```bash
curl -X GET "http://localhost:5001/api/v1/search?q=headless&page=1&limit=10"
```

**Response (200 OK) - Pulled from Redis if cached:**
```json
{
  "data": [
    {
      "title": "The Future of Open Source Headless CMS",
      "slug": "the-future-of-open-source-headless-cms"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

---

## Caching Strategy

The system relies aggressively on **Redis** to deliver lightning-fast response times (often sub-10ms) and to significantly reduce database connection pooling exhaustion during high traffic spikes.

### Primary Redis Key Structures
- **Article Lists**: `articles:published:page:{page}:limit:{limit}`
- **Single Article Resolution**: `article:{slug}`
- **Full Text Search**: `search:{query}:page:{page}:limit:{limit}`

### Cache Flow & Invalidation Matrix
To prevent stale content from being served to readers, surgical cache invalidation is executed programmatically when mutations occur:
- **On `PUBLISH`**: Wipes all `articles:published:*` keys and the specific `article:{slug}`.
- **On `UPDATE` (Published)**: Wipes `article:{slug}` and `search:*`.
- **On `DELETE`**: Wipes all list, search, and specific article keys.

### HTTP ETag Optimization
Even when Redis returns cached JSON, the backend utilizes `ETag` hashing. If the frontend requests a resource it has recently fetched, and the ETag matches the request's `If-None-Match` header, the Express server skips payload transmission and returns an empty HTTP `304 Not Modified`, saving vast amounts of bandwidth for mobile clients.

---

## Security & Production Principles

The codebase is engineered strictly around production-grade security postures.

1. **Defense in Depth**:
   - **Helmet.js**: Injects strict HTTP security headers (HSTS, NoSniff, XSS Filters).
   - **Express Rate Limiter**: Actively throttles excessive requests per IP, preventing brute-force password attacks and aggressive scraping.
   - **Zod Validation**: All incoming request bodies, queries, and parameters are rigorously validated and stripped of unknown properties before ever reaching the controller layer.
2. **Stateless Scalability**: The backend retains absolutely no session memory. JWTs and decentralized Redis caching allow infinite horizontal scaling across multiple Kubernetes pods or PaaS instances without requiring complex sticky sessions.
3. **Explicit Trust Boundaries**: Client payloads are intrinsically distrusted. The backend relies solely on the decoded `req.user.id` from the verified JWT—never trusting an `authorId` supplied in a JSON body.
4. **Resilience Under Failure**: Background jobs, utilizing `jobExecution.model.js`, feature an exponential backoff algorithm, ensuring that transient failures in email delivery (Brevo API timeouts) or database spikes do not result in dropped tasks.

---

## Local Development Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **Database**: Local MongoDB instance (`mongodb://localhost:27017`) or a free Atlas Cluster.
- **Cache**: Local Redis Server (`redis://localhost:6379`).

### 1. Repository Setup

```bash
git clone https://github.com/asif-codeverse/content-platform.git
cd content-platform
```

### 2. Dependency Installation

You can install all dependencies concurrently from the root directory:

```bash
npm install
```

### 3. Execution

Start both the Next.js frontend and the Express backend concurrently with hot-reloading enabled:

```bash
npm run dev
```

- **Frontend Client**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:5001/api/v1`
- **Swagger Documentation**: Accessible at `http://localhost:5001/docs`

---

## Environment Variables

Proper configuration is critical. Duplicate the `.env.example` files in both `/client` and `/server` and populate them.

### Server Application (`server/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Express server listening port | `5001` |
| `NODE_ENV` | Environment context | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/content-platform` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `CLIENT_URL` | CORS Origin for the frontend | `http://localhost:3000` |
| `JWT_ACCESS_SECRET` | Secret key for signing Access Tokens | *Requires strong cryptographic string* |
| `JWT_REFRESH_SECRET` | Secret key for signing Refresh Tokens | *Requires strong cryptographic string* |
| `ACCESS_TOKEN_EXPIRES_IN`| Lifespan of the short-lived access token | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN`| Lifespan of the secure HTTP-Only refresh cookie | `7d` |
| `BREVO_API_KEY` | Transactional email API key from Brevo | `xkeysib-...` |
| `EMAIL_FROM` | Sender identity for OTP emails | `noreply@yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary instance identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |

### Client Application (`client/.env.local`)

| Variable | Description | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | The fully qualified URL to the backend API | `http://localhost:5001/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | The public URL of the frontend application | `http://localhost:3000` |

---

## Infrastructure & Deployment

The platform is designed to be easily deployable across modern cloud infrastructure providers, supporting both native build-packs and containerized deployment strategies.

### Recommended Production Topology
- **Frontend Layer**: Deployed on **Vercel** to leverage optimal Next.js edge caching, image optimization logic, and global serverless distribution.
- **Backend Service**: Deployed as a scalable Node web service on **Render**, keeping the Express API and internal background job worker unified.
- **Persistence Layer**: Hosted on **MongoDB Atlas** for high availability, automated backups, and global replication.
- **Caching Layer**: Hosted on **Redis Cloud** for sub-millisecond, persistent in-memory caching.
- **Asset Delivery**: Media is ingested securely on the backend, stored, optimized, and delivered globally via **Cloudinary**.

### Docker Deployment

For standardized environments, Docker Compose configurations are provided. To launch the entire stack (including local MongoDB and Redis containers) for testing:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

---

## Testing Strategy

Quality assurance is paramount. The repository maintains rigorous test coverage utilizing **Jest** and **Supertest**, backed by `MongoDB Memory Server` to guarantee complete test isolation without requiring a live database connection.

### Executing the Test Suite

```bash
cd server
npm run test
```

### Validated Areas
- **Identity Workflows**: Complete integration testing of Registration, Login, and Refresh Token Rotation mechanics.
- **Authorization Enforcement**: Validating that RBAC strictly blocks Editors from utilizing Admin endpoints, and ABAC strictly blocks Users from altering content they do not own.
- **State Machine Integrity**: Ensuring the pipeline (`DRAFT` → `PENDING` → `PUBLISHED`) transitions correctly and rejects invalid state jumps.
- **Cache Consistency**: Asserting that Redis cache hit/miss behavior functions as expected during read/write sequences.

---

## CI/CD Pipeline

Continuous Integration is strictly orchestrated via GitHub Actions `.github/workflows/`. Every pull request triggers concurrent workflows:

1. **Frontend Integrity (`frontend-ci.yml`)**: Verifies ESLint compliance and validates that the Next.js `npm run build` succeeds without compilation errors.
2. **Backend Validation (`backend-ci.yml`)**: Executes the full Jest integration test suite against the backend business logic.
3. **Container Readiness (`docker-ci.yml`)**: Builds the Dockerfile to ensure containerized deployments remain functional and do not bloat.

---

## Future Roadmap

The platform is under active development. Planned upcoming features include:

- **OAuth 2.0 Integration**: Seamless Single Sign-On (SSO) via Google and GitHub.
- **Reader Engagement Tools**: User Bookmarks, Reading Lists, and a Threaded Commenting System.
- **Real-Time Capabilities**: In-App WebSockets Notifications for Editor/Admin state changes.
- **Advanced Telemetry**: Detailed Article Analytics tracking read-time and bounce rates.
- **Internationalization (i18n)**: Comprehensive Multi-language Support routing.
- **Editorial Experience**: Automated AI-Powered Content Recommendations and Draft Autosave functionalities.

---

## Contributing

We strongly encourage open-source contributions to improve the platform. To contribute:

1. Fork the repository.
2. Create a specific feature branch: `git checkout -b feature/advanced-search`.
3. Commit your changes utilizing conventional commits: `git commit -m 'feat: implement advanced search filters'`.
4. Ensure the entire test suite passes locally: `npm run test` (in the `/server` directory).
5. Push your changes: `git push origin feature/advanced-search`.
6. Open a detailed Pull Request explaining the rationale and technical approach.

Please ensure your code meticulously adheres to the existing architectural principles, leverages Zod for all new inputs, and includes appropriate Jest test coverage.

---

## License

This project is open-sourced under the terms of the [MIT License](LICENSE).

---

## Author

**Mohd Asif**
- **GitHub**: [asif-codeverse](https://github.com/asif-codeverse)
- **LinkedIn**: [Mohd Asif](https://www.linkedin.com/in/mohd-asif-011805tz/)
