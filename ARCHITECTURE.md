# Architecture Overview

This repository is a **monorepo** containing a `client` and a `server`, engineered using a **production-first backend architecture** with strict separation of concerns.

The system prioritizes:

* Correctness before convenience
* Security before feature velocity
* Observability before optimization
* Reliability before scale
* Explicit boundaries over implicit behavior

This is not a tutorial architecture.
It is structured to behave predictably under load, mutation, retries, and partial failures.

---

# Architectural Objectives

The system guarantees:

* Clear layer separation (transport → orchestration → domain → persistence)
* Stateless authentication with strict authorization boundaries
* Role-based and ownership-based access control (RBAC + ABAC)
* Safe domain mutations with defensive defaults
* Explicit trust boundaries
* Controlled data access patterns
* Bounded resource usage
* Deterministic background processing
* HTTP-correct caching semantics
* Evolvable structure without cross-module coupling

---

# Repository Structure

```
/
├── client/          # Frontend (Next.js / React)
└── server/          # Backend REST API
```

Frontend and backend are independently evolvable but versioned together.

---

# Backend Architecture

The backend is an **Express-based REST API** structured around:

* Deterministic request handling
* Explicit domain logic
* Safe async side effects
* Controlled persistence access

---

# Core Entry Points

## `app.js`

Responsible for:

* Express initialization
* Global middleware registration
* Route mounting
* Error middleware registration

It does **not** start the HTTP server.

---

## `server.js`

Responsible for:

* Environment validation
* Database connection
* Server startup
* Boot-time logging

Server will not start if:

* Database connection fails
* Environment validation fails

This enforces fail-fast behavior.

---

# Source Layout (`src/`)

```
src/
├── config/          # Environment + infrastructure config
├── middlewares/     # Cross-cutting concerns
├── modules/         # Feature-based domains
├── jobs/            # Async processing infrastructure
├── utils/           # Shared primitives
├── app.js
└── server.js
```

All runtime code resides under `src/` to isolate tooling.

---

# Layered Execution Model

Request execution follows:

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

Background jobs execute **outside** this lifecycle.

Each layer has a single responsibility.

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
* Used only for rotation
* Never used for authorization decisions

Passwords:

* Hashed using bcrypt
* Never logged
* Never returned

System remains horizontally scalable because authentication is stateless.

---

# Authorization (Day 3 & Day 12)

Authorization is enforced at two levels:

---

## 1️⃣ RBAC (Role-Based Access Control)

Roles:

* USER
* EDITOR
* ADMIN

Enforced at route boundary.

Prevents unauthorized access before domain logic executes.

---

## 2️⃣ ABAC (Ownership Enforcement)

Editors may only modify their own articles.

Admins override ownership restrictions.

Ownership rules:

* Implemented in service layer
* Based on resource attributes
* Return `403 Forbidden` on violation
* Never rely on client-supplied ownership

This prevents privilege escalation.

---

# Core Domain: Articles

Responsibilities:

* Draft lifecycle
* Publish workflow
* Ownership tracking
* Soft deletion
* Slug generation

---

## Domain Guarantees

* Default state: `DRAFT`
* Only `PUBLISHED` visible publicly
* Logical deletion via `isDeleted`
* Slug uniqueness enforced at DB level
* Timestamps enabled for mutation tracking

Domain services:

* Mutate state deterministically
* Do not execute side effects directly

Side effects are delegated to job system.

---

# Validation & Abuse Prevention

* Schema-based validation before controllers
* Explicit field whitelisting
* Global rate limiting
* Query limit caps
* No raw `req.query` usage

All external input is untrusted.

---

# Query Safety & Data Access

List endpoints:

* Paginated
* Filter-restricted
* Sort-whitelisted
* Regex-controlled
* Index-aligned

Prevents:

* Injection
* Full collection scans
* Resource exhaustion

Query design matches index strategy.

---

# Indexing Strategy

Compound index:

```
{ status, isDeleted, createdAt }
```

Supports:

* Published filtering
* Sorting
* Pagination

Unique index on `slug`.

Execution plans are verified using `IXSCAN`.

Unused indexes are avoided to prevent write penalties.

---

# HTTP Caching Model

Public endpoints implement conditional requests.

### Mechanism

* `Last-Modified` derived from `updatedAt`
* `If-Modified-Since` validated
* `304 Not Modified` returned when safe

### Cache-Control

```
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

---

## Guarantees

* Only public endpoints cached
* Authenticated endpoints never cached
* Cache validity derived from real data mutations
* No manual cache invalidation required
* Correctness prioritized over aggressiveness

Cache invalidation is **data-driven**, not infrastructure-driven.

---

# Background Job System (Day 13)

Provides reliable asynchronous side-effect processing.

---

## Design Principles

* Controllers remain fast
* Services mutate domain only
* Jobs handle side effects
* Jobs are idempotent
* Retries use exponential backoff
* Duplicate executions ignored

---

## Job Architecture

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
2. Queue pushes job into memory
3. Worker processes job
4. Handler executes async side effect
5. Execution state persisted
6. Retries applied if failure
7. Permanent failure recorded

---

## Guarantees

* At-most-once execution semantics
* Idempotent processing
* Retry safety
* Failure visibility
* Domain logic isolation

This resembles event-driven architecture at small scale.

---

# Failure Model Awareness

System accounts for:

* DB unavailability at boot
* Duplicate job execution
* Retry exhaustion
* Unauthorized access attempts
* Malformed header inputs
* Malformed query parameters

Failures are logged and surfaced safely.

---

# Trust Boundaries

Trusted:

* `req.user` (derived from verified JWT)

Untrusted:

* `req.body`
* `req.query`
* Client headers
* Client role claims

All untrusted input is validated before use.

---

# Infrastructure Guarantees

* MongoDB required for startup
* No partial initialization state
* Structured logs for production observability
* Deterministic startup behavior

---

# System Characteristics

The system is:

* Stateless at API layer
* Deterministic in domain logic
* Safe under retries
* Safe under concurrent access
* HTTP-compliant
* Index-aware
* Ownership-aware
* Side-effect isolated

---

# Architectural Intent

This backend is intentionally designed to:

* Demonstrate production reasoning
* Support interview-grade discussion
* Scale horizontally
* Extend safely
* Avoid architectural rewrites
* Maintain predictable behavior under change

The architecture favors:

Clarity
Correctness
Security
Reliability
Explicitness

Over speed of implementation.

---

This version is now:

* Internally consistent
* Real-world defensible
* Interview-ready
* Production-oriented
* Conceptually mature
