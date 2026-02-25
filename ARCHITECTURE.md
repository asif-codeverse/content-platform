# Architecture Overview

This repository is a **monorepo** containing a `client` and a `server`, designed with a **production-first backend architecture** and strict separation of concerns.

The backend mirrors real-world production systems and prioritizes:

* Correctness before convenience
* Security before feature velocity
* Observability before optimization
* Reliability before scale

---

# Architectural Objectives

The system is engineered to guarantee:

* Strict separation of responsibilities across layers
* Stateless authentication with explicit authorization boundaries
* Ownership-aware authorization (RBAC + ABAC)
* Defensive domain modeling with safe defaults
* Abuse prevention and bounded resource usage
* Structured observability and request traceability
* Explicit, controlled data access patterns
* Verified performance through indexing
* Reliable asynchronous processing with idempotency
* Predictable and evolvable system design

---

# Repository Structure

```
/
├── client/          # Frontend application
└── server/          # Backend REST API
```

Frontend and backend evolve independently but share versioning and deployment coordination.

---

# Backend Architecture

The backend is an **Express-based REST API** built for operational stability and clarity.

---

## Core Entry Points

### `app.js`

Responsible for:

* Express initialization
* Global middleware registration
* Route mounting
* Error middleware registration

### `server.js`

Responsible for:

* Environment validation
* Database connection
* HTTP server startup
* Startup logging

`app.js` never starts the server directly.
Infrastructure bootstrapping is isolated.

---

# Source Layout (`src/`)

```
src/
├── config/          # Env validation, DB connection
├── middlewares/     # Auth, RBAC, rate limit, error handling
├── modules/         # Feature-based business domains
├── jobs/            # Background job infrastructure
├── utils/           # Shared utilities
├── app.js
└── server.js
```

All runtime code is contained inside `src/` to isolate it from tooling.

---

# Feature-Based Modular Design

Each domain module encapsulates:

* Routes (transport mapping only)
* Controllers (request orchestration)
* Services (business logic)
* Models (schema + persistence)
* Validation rules

Modules do not import each other’s internals.
Business rules remain isolated.

---

# Authentication (Day 2)

Stateless JWT-based authentication.

### Access Token

* Short-lived
* Sent via `Authorization: Bearer`
* Required for protected routes

### Refresh Token

* Long-lived
* Stored in HttpOnly cookie
* Used only for token rotation

Passwords are hashed using bcrypt.
Plain text credentials are never logged or returned.

---

# Authorization (Day 3 & Day 12)

Authorization combines:

### 1. RBAC (Role-Based Access Control)

Roles:

* USER
* EDITOR
* ADMIN

Enforced at route boundary.

---

### 2. Ownership / ABAC (Attribute-Based Control)

Editors may modify only their own articles.
Admins may override ownership restrictions.

Ownership checks:

* Executed inside service layer
* Based on resource attributes (`author`)
* Return `403 Forbidden` on violation

Authorization is enforced both at:

* API boundary (RBAC)
* Domain layer (ownership)

---

# Core Domain: Articles (Day 4)

Responsibilities:

* Draft → Publish workflow
* Slug generation
* Ownership tracking
* Soft deletion
* Auditability

### Guarantees

* Default state: `DRAFT`
* Only `PUBLISHED` visible publicly
* Logical deletion via `isDeleted`
* Slugs unique and indexed

Domain mutations are pure and synchronous.

Side effects are asynchronous.

---

# Validation & Abuse Prevention (Day 5)

* Schema-based request validation
* Validation before controller execution
* Explicit field whitelisting
* Global rate limiting

Raw request input is never trusted.

---

# Logging & Observability (Day 6)

Structured logging using Winston.

Guarantees:

* No `console.log`
* Request ID correlation
* Full HTTP request timing
* Centralized error logging
* No stack traces leaked to clients
* Fail-fast startup behavior

Logs are structured for production analysis.

---

# Query Safety, Pagination & Filtering (Day 7)

List endpoints are defensive by design.

* Pagination with hard upper bounds
* Whitelisted filters
* Controlled regex search
* Centralized query parsing
* No raw `req.query` passed to database

Prevents:

* Injection
* Unbounded scans
* Resource exhaustion

---

# Indexing & Performance Engineering (Day 8)

Indexes are driven by observed query patterns.

### Index Strategy

```
{ status, isDeleted, createdAt }
```

Supports:

* Filtered listing
* Sorting
* Pagination

Unique index on `slug`.

Execution plans are verified.
Collection scans are treated as defects.

---

# HTTP Caching & Response Optimization (Day 9)

Public endpoints implement conditional requests.

### Strategy

* `Last-Modified` header
* `If-Modified-Since` handling
* Safe 304 responses

### Cache-Control

```
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

### Guarantees

* Only public endpoints cached
* Authenticated routes never cached
* Cache validity derived from actual data mutations

Correctness is prioritized over aggressiveness.

---

# Background Jobs & Reliability (Day 13)

The system supports reliable asynchronous side effects.

---

## Design Principles

* Controllers remain synchronous and fast
* Services perform domain mutations only
* Side effects execute asynchronously
* Jobs are idempotent
* Retries are bounded and exponential

---

## Job Architecture

```
src/jobs/
├── queue.js                 # In-memory queue + dispatcher
├── worker.js                # Execution, retry, backoff
├── jobExecution.model.js    # Idempotency persistence
└── handlers/
    └── articlePublished.job.js
```

---

## Execution Flow

1. Controller enqueues job
2. Queue pushes job into memory
3. Worker processes job
4. Handler executes side effect
5. Execution state persisted
6. Failures retry with exponential backoff
7. Permanent failures recorded

---

## Guarantees

* Each job executes at most once
* Duplicate executions are ignored
* Failures are logged
* Retries are bounded
* Domain services remain deterministic

This resembles an event-driven architecture.

---

# Request Execution Flow

```
Client
 → Express App
 → Rate Limiter
 → Request ID Middleware
 → HTTP Logger
 → Authentication
 → Authorization (RBAC)
 → Router
 → Controller
 → Service (includes ownership checks)
 → Database
 → Response
 → Central Error Handler
```

Background jobs execute outside this lifecycle.

---

# Infrastructure Guarantees

* MongoDB is required for startup
* Server fails fast if DB unavailable
* Environment validated at boot
* No partial initialization states

---

# Trust Boundaries

Trusted:

* `req.user` (derived from verified JWT)

Untrusted:

* `req.body`
* `req.query`
* Client-supplied headers

All untrusted data is validated and sanitized.

---

# Design Principles

* Thin controllers
* Pure domain services
* Explicit authorization rules
* Idempotent side effects
* Defensive query design
* Verified index usage
* Observability first
* Reliability before scale
* Incremental evolution

---

# Architectural Intent

This backend is built to:

* Demonstrate production reasoning
* Enforce ownership and role boundaries
* Handle asynchronous side effects safely
* Scale query patterns responsibly
* Support future horizontal scaling
* Minimize architectural rewrites

The system favors:

Clarity.
Correctness.
Safety.
Reliability.

Over speed of implementation.

---
