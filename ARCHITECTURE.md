# Architecture Overview

This repository is a **monorepo** containing a `client` (Next.js App Router) and a `server` (Express REST API), engineered using a **production-first architecture** with strict separation of concerns.

The system prioritizes:

* Correctness before convenience
* Security before feature velocity
* Deterministic behavior over implicit magic
* Explicit trust boundaries
* Reliability under retries and partial failures
* Evolvability without cross-module coupling

This is not a tutorial scaffold.
It is structured to behave predictably under load, mutation, retries, and concurrent access.

---

# Architectural Objectives

The system guarantees:

* Clear layer separation (transport → orchestration → domain → persistence)
* Stateless authentication with controlled refresh rotation
* Route-level RBAC + service-level ABAC (ownership enforcement)
* Deterministic domain mutations
* Safe asynchronous side-effect isolation
* Explicit query whitelisting
* Index-aligned data access
* HTTP-correct caching semantics
* SSR-aware frontend integration
* Evolvable modular boundaries

---

# Repository Structure

```
/
├── client/          # Next.js (App Router, TypeScript)
└── server/          # Express REST API
```

Frontend and backend evolve independently but are versioned together.

---

# Backend Architecture

The backend is an Express-based REST API structured around:

* Thin routing layer
* Deterministic controllers
* Pure domain services
* Controlled persistence access
* Isolated background processing

Controllers orchestrate.
Services enforce rules.
Persistence remains encapsulated.

---

# Core Entry Points

## app.js

Responsible for:

* Express initialization
* Global middleware registration
* Route mounting
* Error middleware registration

It does not start the server.

---

## server.js

Responsible for:

* Environment validation
* Database connection
* Worker startup
* HTTP server bootstrap

Startup is fail-fast:

* Server does not start without DB
* Worker does not start without queue initialization

This prevents partial runtime states.

---

# Source Layout

```
src/
├── config/
├── middlewares/
├── modules/
│   └── articles/
├── jobs/
├── utils/
├── app.js
└── server.js
```

All runtime code lives under `src/` to isolate tooling from execution logic.

---

# Layered Execution Model

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
 → Service (ABAC + domain logic)
 → Database
 → Response
 → Central Error Handler
```

Background jobs execute outside this request lifecycle.

Each layer owns exactly one responsibility.

---

# Authentication

Stateless JWT-based model.

### Access Token

* Short-lived
* Sent via `Authorization: Bearer`
* Required for protected routes
* Stored in frontend memory (not localStorage)

### Refresh Token

* Long-lived
* Stored in HttpOnly cookie
* Used only for rotation
* Never used for authorization decisions

This design supports horizontal scaling and protects against XSS token theft.

Passwords:

* Hashed with bcrypt
* Never logged
* Never returned

---

# Authorization Model

Authorization is enforced at two distinct layers.

---

## 1️⃣ RBAC (Route Boundary)

Roles:

* USER
* EDITOR
* ADMIN

Applied at route layer before controller execution.

Prevents unauthorized access from reaching domain logic.

---

## 2️⃣ ABAC (Ownership Enforcement)

Editors may:

* Update only their own articles
* Cannot modify others’ resources

Admins:

* Override ownership restrictions

Ownership rules:

* Enforced inside service layer
* Based on database state
* Never rely on client-supplied identifiers

Returns `403 Forbidden` on violation.

Prevents privilege escalation.

---

# Core Domain: Articles

Responsibilities:

* Draft → Publish lifecycle
* Ownership tracking
* Soft deletion
* Slug generation
* Deterministic state mutation

---

## Domain Guarantees

* Default state: `DRAFT`
* Only `PUBLISHED` visible publicly
* Logical deletion via `isDeleted`
* Slug uniqueness enforced at DB level
* Slug indexed for O(log n) lookup
* Timestamps enabled for mutation tracking

Domain services:

* Mutate state deterministically
* Never execute side effects directly

Side effects are delegated to the job system.

---

# Public vs Admin Access Separation

Public routes:

```
GET /articles
GET /articles/:slug
```

Admin routes:

```
GET /articles/all
POST /articles
PATCH /articles/:id
PATCH /articles/:id/publish
DELETE /articles/:id
```

Public endpoints:

* Enforce `status = PUBLISHED`
* Enforce `isDeleted = false`
* Are cacheable

Admin endpoints:

* Require authentication
* Never cached
* Support controlled filtering

This prevents accidental data exposure.

---

# Query Safety Model

All query parameters pass through `parseQuery()`.

Guarantees:

* Page validation
* Limit caps
* Sort whitelisting
* Controlled regex search
* Explicit filter construction
* No raw `req.query` passed to DB

This prevents:

* Injection
* Unbounded queries
* Resource exhaustion
* Index bypass

---

# Index Strategy

Compound index:

```
{ status, isDeleted, createdAt }
```

Supports:

* Published filtering
* Sorting
* Pagination

Unique index:

```
{ slug: 1 }
```

Execution plans verified using `IXSCAN`.

Indexes align with actual query patterns.

---

# HTTP Caching Model

Public endpoints implement conditional requests.

Mechanism:

* `Last-Modified` derived from latest `updatedAt`
* `If-Modified-Since` validated
* Returns `304 Not Modified` when safe

Headers:

```
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

Guarantees:

* Only public endpoints cached
* Authenticated endpoints never cached
* Cache validity derived from real data mutations
* No manual invalidation logic required

Caching correctness is data-driven.

---

# Background Job System

Provides reliable asynchronous side-effect execution.

---

## Design Principles

* Controllers remain synchronous
* Services mutate domain only
* Jobs handle side effects
* Jobs are idempotent
* Duplicate executions safely ignored
* Exponential backoff retry
* Failure state persisted

---

## Job Structure

```
src/jobs/
├── queue.js
├── worker.js
├── jobExecution.model.js
└── handlers/
```

---

## Execution Flow

1. Controller enqueues job
2. Queue stores job
3. Worker picks job
4. Handler executes side effect
5. Execution state persisted
6. Retry applied if needed
7. Permanent failure recorded

Guarantees:

* At-most-once semantics
* Retry safety
* Failure visibility
* Domain isolation

This approximates event-driven architecture at application scale.

---

# Frontend Architecture (Next.js)

Frontend uses:

* App Router
* Server Components
* Dynamic route `[slug]`
* `generateMetadata()` for SEO
* ISR (`revalidate`)
* Proper `notFound()` handling

Public article page:

* Fetches via `/articles/:slug`
* Uses ISR (60 seconds)
* Generates dynamic metadata
* Returns real 404 for invalid slug

Layout metadata uses template pattern:

```
title: {
  default: "Content Platform",
  template: "%s | Content Platform"
}
```

This ensures correct SEO layering.

---

# Failure Model Awareness

System accounts for:

* DB unavailability at boot
* Duplicate job execution
* Retry exhaustion
* Unauthorized access attempts
* Malformed headers
* Malformed query parameters
* Invalid slugs
* Token expiration

Failures are:

* Logged
* Sanitized
* Surfaced safely

---

# Trust Boundaries

Trusted:

* `req.user` (verified JWT)

Untrusted:

* `req.body`
* `req.query`
* Client headers
* Client-provided role claims
* Slug parameters

All untrusted input validated before use.

---

# System Characteristics

The system is:

* Stateless at API layer
* Ownership-aware
* Role-aware
* Index-aligned
* Deterministic in domain logic
* Retry-safe
* Cache-correct
* SEO-aware
* Horizontally scalable
* Side-effect isolated

---

# Architectural Intent

This architecture is intentionally designed to:

* Demonstrate production reasoning
* Be interview-defensible
* Scale horizontally
* Evolve safely
* Avoid cross-layer leakage
* Avoid accidental exposure
* Avoid architectural rewrites

It favors:

Clarity
Correctness
Security
Determinism
Reliability
Explicitness

Over implementation speed.

---
