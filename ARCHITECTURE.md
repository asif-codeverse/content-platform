# Architecture Overview

This repository is a **monorepo** containing a `client` and a `server`, designed with a **production-first backend architecture** and strict separation of concerns.

The backend is intentionally engineered to mirror **real-world production systems**, prioritizing correctness, security, observability, performance, and long-term maintainability over tutorial simplicity or rapid prototyping.

---

## Architectural Objectives

The system is designed to achieve the following objectives:

* Clear separation of responsibilities across architectural layers
* Stateless, secure authentication and explicit authorization boundaries
* Robust domain modeling with defensive defaults
* Protection against abuse, misuse, and accidental overload
* End-to-end observability and request traceability
* Controlled, explicit, and safe data access patterns
* Measurable performance characteristics and scalability paths
* Incremental, intentional architectural evolution over time

---

## Repository Structure

```
/
├── client/          # Frontend application (independent concern)
└── server/          # Backend REST API
```

The frontend and backend evolve independently while sharing a single repository to support coordinated development, versioning, and deployment workflows.

---

## Backend Architecture

The backend is an **Express-based REST API**, designed for scalability, security, and operational stability.

### Core Entry Points

#### `app.js`

Responsible for:

* Express application configuration
* Global middleware registration
* Route mounting
* Centralized error middleware registration

#### `server.js`

Responsible for:

* Infrastructure bootstrapping
* Database connection initialization
* HTTP server startup
* Startup and lifecycle logging

Application configuration and infrastructure concerns are deliberately isolated to preserve clarity and testability.

---

## Source Layout (`src/`)

All application runtime code resides under `src/` to clearly separate execution logic from tooling and deployment artifacts.

```
src/
├── config/          # Environment and infrastructure configuration
├── middlewares/     # Cross-cutting concerns
├── modules/         # Feature-based domains
├── utils/           # Shared utilities
├── app.js
└── server.js
```

---

## Feature-Based Modular Design

The system follows a **feature-based modular architecture**, where each domain is fully self-contained.

Each module owns:

* Routes (HTTP mapping only)
* Controllers (request orchestration)
* Services (business logic)
* Models (data schema and persistence)
* Validation rules (input safety)

This structure minimizes coupling, improves testability, and enables independent feature evolution.

---

## Authentication (Day 2)

Authentication is implemented using **stateless JWT-based access control**.

### Token Model

**Access Token**

* Short-lived
* Sent via `Authorization: Bearer <token>`
* Required for all protected endpoints

**Refresh Token**

* Long-lived
* Stored in **HttpOnly cookies**
* Used exclusively for token rotation
* Never used for authorization decisions

Passwords are hashed using **bcrypt** and are never stored, logged, or returned in plain text.

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)** at the API boundary.

### Roles

* `USER` — read-only access
* `EDITOR` — content creation
* `ADMIN` — full administrative control

Authentication and authorization responsibilities are intentionally separated to preserve clarity, security, and auditability.

---

## Core Domain: Articles (Day 4)

The **Article** module represents the system’s first concrete business domain.

### Responsibilities

* Content lifecycle management
* SEO-friendly slug generation
* Draft → publish workflow
* Ownership and auditability
* Soft deletion for operational safety

### Guarantees

* Default state is `DRAFT`
* Only `PUBLISHED` content is publicly visible
* Deletion is logical via `isDeleted`
* Slugs are unique and indexed

---

## Validation & Abuse Prevention (Day 5)

* Schema-based validation for all write operations
* Validation executes before controller logic
* Controllers explicitly whitelist allowed fields
* Global rate limiting protects against abuse and traffic spikes

---

## Logging & Observability (Day 6)

The system provides **structured, production-grade observability**.

* Centralized logging using **Winston**
* Direct `console.log` usage is prohibited
* Every request receives a unique request ID
* Full HTTP request/response timing is logged
* Centralized error handling with no stack trace leakage to clients
* Fail-fast startup behavior when critical dependencies are unavailable

---

## Query Safety, Pagination & Filtering (Day 7)

All list endpoints are **safe by default**.

* Page-based pagination with hard limits
* Explicitly whitelisted filters and sort options
* Controlled regex-based search on specific fields only
* Centralized query parsing
* Raw `req.query` is never passed directly to database queries

---

## Indexing & Performance Engineering (Day 8)

Performance optimizations are **driven by observed query behavior**, not speculation.

### Index Strategy

* Compound index:

  ```
  { status, isDeleted, createdAt }
  ```

* Supports filtered listing, sorting, and pagination

* Unique index enforced on `slug`

### Validation

* Index usage verified via execution plans (`IXSCAN`)
* Collection scans are treated as performance defects

All trade-offs are explicit and documented.

---

## HTTP Caching & Response Optimization (Day 9)

Public, read-heavy endpoints implement **HTTP-level caching** to reduce database load and improve latency.

### Caching Strategy

* **ETag-based conditional requests**
* ETags generated from the complete response payload
* Ensures cache correctness across pagination, filters, and sorting

### Cache Control

Public endpoints return:

```
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

This enables browser and CDN caching while preserving correctness.

### Safety Guarantees

* Only public, unauthenticated endpoints are cached
* Authenticated or user-specific responses are never cached
* Cache invalidation occurs automatically through ETag changes

This provides measurable performance gains without compromising security or correctness.

---

## Request Execution Flow

```
Client
 → Express App
 → Rate Limiter
 → Request ID Middleware
 → HTTP Logger
 → Authentication
 → Authorization
 → Router
 → Controller
 → Service
 → Database
 → Response
 → Central Error Handler (on failure)
```

---

## Infrastructure Guarantees

* MongoDB is the sole persistence layer
* Server does not start without a successful database connection
* Environment configuration is validated at startup

This prevents partial or unsafe runtime states.

---

## Design Principles

* Strict separation of concerns
* Thin routing layer
* Explicit middleware ownership
* Single source of truth for configuration
* Soft deletes over destructive operations
* Secure defaults over convenience
* Observability as a first-class concern
* Correctness before optimization
* Evolution driven by real constraints

---

## Architectural Intent

This backend is designed to:

* Scale feature complexity incrementally
* Support real-world business workflows
* Serve as a reusable foundation across domains
* Minimize long-term refactoring cost

The architecture prioritizes **clarity, safety, performance, and maintainability** over short-term velocity.

---