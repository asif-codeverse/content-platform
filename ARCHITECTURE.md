# Architecture Overview

This repository is a **monorepo** containing a `client` and a `server`, designed with a **production-first backend architecture** and strict separation of concerns.

The backend is intentionally engineered to reflect **real-world production systems**, prioritizing correctness, security, observability, performance, and long-term maintainability over tutorial simplicity.

---

## Architectural Objectives

The system is designed to achieve the following:

* Clear separation of responsibilities across layers
* Stateless and secure authentication
* Explicit authorization at API boundaries
* Robust domain modeling with safe defaults
* Protection against abuse and misuse
* End-to-end observability and request traceability
* Controlled and safe data access patterns
* Measurable performance and scalability
* Incremental and intentional architectural evolution

---

## Repository Structure

```
/
├── client/          # Frontend application (independent concern)
└── server/          # Backend API
```

The frontend and backend evolve independently while sharing a single repository to support coordinated development and deployment workflows.

---

## Backend Architecture

The backend is an **Express-based REST API** designed for scalability, security, and operational stability.

### Core Entry Points

#### `app.js`

Responsible for:

* Express application configuration
* Global middleware registration
* Route mounting
* Centralized error handling registration

#### `server.js`

Responsible for:

* Infrastructure bootstrapping
* Database connection initialization
* HTTP server startup
* Startup and lifecycle logging

Application configuration and infrastructure concerns are deliberately isolated.

---

## Source Layout (`src/`)

All application code resides under `src/` to separate runtime logic from tooling and deployment artifacts.

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

This structure minimizes coupling and enables independent feature evolution.

---

## Authentication (Day 2)

Authentication uses **stateless JWT-based access control**.

### Token Model

**Access Token**

* Short-lived
* Sent via `Authorization: Bearer <token>`
* Required for protected endpoints

**Refresh Token**

* Long-lived
* Stored in **HttpOnly cookies**
* Used only for token rotation
* Never used for authorization

Passwords are hashed using **bcrypt** and never stored or logged in plain text.

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)** at the API boundary.

Roles:

* `USER` — read-only access
* `EDITOR` — content creation
* `ADMIN` — full administrative control

Authentication and authorization are intentionally separated to preserve clarity and security.

---

## Core Domain: Articles (Day 4)

The **Article** module represents the first concrete business domain.

Responsibilities:

* Content lifecycle management
* SEO-friendly slug generation
* Draft → publish workflow
* Ownership and auditability
* Soft deletion for operational safety

Guarantees:

* Default state: `DRAFT`
* Only `PUBLISHED` content is public
* Soft deletes via `isDeleted`
* Slugs are unique and indexed

---

## Validation & Abuse Prevention (Day 5)

* Schema-based validation for all write operations
* Validation occurs before controller execution
* Controllers whitelist allowed fields
* Global rate limiting prevents abuse and traffic spikes

---

## Logging & Observability (Day 6)

The system provides **structured, production-grade observability**.

* Centralized logging via **Winston**
* No `console.log` usage
* Request correlation via unique request IDs
* Full HTTP request/response timing
* Centralized error logging with no stack leaks to clients
* Fail-fast startup guarantees

---

## Query Safety, Pagination & Filtering (Day 7)

List endpoints are **safe by default**.

* Page-based pagination with capped limits
* Explicitly whitelisted filters and sort options
* Controlled regex-based search on specific fields
* Centralized query parsing
* Raw `req.query` is never passed directly to the database

---

## Indexing & Performance Engineering (Day 8)

Performance optimizations are **driven by observed query behavior**.

### Index Strategy

* Compound index:

  ```
  { status, isDeleted, createdAt }
  ```
* Supports filtered listing, sorting, and pagination
* Unique index on `slug`

### Validation

* Index usage verified via execution plans (`IXSCAN`)
* Collection scans treated as performance defects

Trade-offs are explicit and intentional.

---

## HTTP Caching & Response Optimization (Day 9)

Public read-heavy endpoints implement **HTTP-level caching** to reduce database load and improve latency.

### Caching Strategy

* **ETag-based conditional requests**
* ETags generated from the full response payload (data + pagination metadata)
* Ensures cache correctness across pagination, filters, and sorting

### Cache Control

* Public endpoints set:

  ```
  Cache-Control: public, max-age=60, stale-while-revalidate=30
  ```
* Enables browser and CDN caching
* Prevents unnecessary database reads

### Safety Guarantees

* Only public, unauthenticated endpoints are cached
* Authenticated or user-specific responses are never cached
* Cache invalidation is automatic via ETag changes

This provides **real performance gains without compromising correctness or security**.

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
* Server does not start without a successful DB connection
* Environment configuration is validated at startup

This prevents partial or unsafe runtime states.

---

## Design Principles

* Separation of concerns across all layers
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

* Scale feature complexity gradually
* Support real business workflows
* Serve as a reusable foundation across domains
* Minimize long-term refactoring cost

The architecture prioritizes **clarity, safety, performance, and maintainability** over short-term velocity.

---