# Architecture Overview

This repository is a **monorepo** containing a `client` and a `server`, designed with a **production-first backend architecture** and strict separation of concerns.

The backend is intentionally engineered to reflect **real-world production systems**, prioritizing correctness, security, observability, and long-term maintainability over tutorial simplicity.

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

This separation ensures that application configuration and infrastructure concerns remain isolated.

---

## Source Layout (`src/`)

All application code resides under `src/` to clearly separate runtime logic from tooling, configuration, and deployment artifacts.

```
src/
├── config/          # Environment and infrastructure configuration
│   ├── env.js
│   └── db.js
│
├── middlewares/     # Cross-cutting concerns
│   ├── auth.middleware.js
│   ├── rbac.middleware.js
│   ├── validate.middleware.js
│   ├── rateLimit.middleware.js
│   ├── error.middleware.js
│   ├── httpLogger.middleware.js
│   └── requestId.middleware.js
│
├── modules/         # Feature-based domains
│   ├── auth/
│   └── articles/
│
├── utils/           # Shared utilities
│   ├── logger.js
│   ├── queryParser.js
│   └── helpers.js
│
├── app.js
└── server.js
```

---

## Feature-Based Modular Design

The system follows a **feature-based modular architecture**, where each domain is fully self-contained.

### Module Responsibilities

Each module owns:

* Routes (HTTP mapping only)
* Controllers (request orchestration)
* Services (business logic)
* Models (data schema and persistence)
* Validation rules (input safety)

This approach minimizes cross-module coupling and enables independent feature evolution.

---

## Authentication (Day 2)

Authentication is implemented using **stateless JWT-based access control**.

### Token Model

#### Access Token

* Short-lived
* Sent via `Authorization: Bearer <token>` header
* Required for all protected endpoints

#### Refresh Token

* Long-lived
* Stored in **HttpOnly cookies**
* Used exclusively for token rotation
* Never used for authorization decisions

### Password Handling

* Passwords are hashed using **bcrypt**
* Plain-text passwords are never stored, logged, or returned

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)** at the API boundary.

### Roles

* `USER` — read-only access
* `EDITOR` — content creation and modification
* `ADMIN` — full administrative control

### Enforcement Model

1. **Authentication Middleware**

   * Verifies access token validity
   * Attaches trusted identity to `req.user`

2. **Authorization Middleware**

   * Validates role permissions per route
   * Prevents unauthorized access at the boundary

Authentication and authorization are deliberately separated to preserve clarity and security.

---

## Core Domain: Articles (Day 4)

The **Article** module represents the system’s first concrete business domain.

It is intentionally **domain-agnostic**, allowing it to later map cleanly to concepts such as:

* Menu items
* Dishes
* Events
* Listings

### Responsibilities

* Content lifecycle management
* SEO-friendly slug generation
* Draft and publish workflow
* Ownership and auditability
* Soft deletion for operational safety

### Data Guarantees

* Articles default to `DRAFT`
* Only `PUBLISHED` articles are publicly visible
* Deletion is logical (`isDeleted = true`)
* Slugs are unique and indexed
* Author attribution is mandatory

---

## RBAC Applied to Domain Logic

Authorization rules are enforced **at the route level**, ensuring business rules cannot be bypassed.

### Access Rules

* Public users:

  * Read published articles

* `EDITOR`, `ADMIN`:

  * Create articles

* `ADMIN` only:

  * Publish articles
  * Soft delete articles

---

## Validation & Abuse Prevention (Day 5)

### Input Validation

* All write operations use schema-based validation
* Validation executes before controller logic
* Invalid input never reaches business logic

### Controller Safety

* Controllers explicitly whitelist permitted fields
* Prevents mass-assignment vulnerabilities

### Rate Limiting

* Applied globally at the application level
* Protects against:

  * Brute-force attacks
  * Abuse
  * Accidental traffic spikes
* Enforced using standard HTTP `429` responses

---

## Logging & Observability (Day 6)

The system provides **structured, production-grade observability**.

### Logging

* Centralized logging using **Winston**
* Logs include:

  * Timestamp
  * Severity level
  * Structured metadata
* Direct `console.log` usage is prohibited

### Request Correlation

* Every request is assigned a unique request ID
* The request ID:

  * Is attached to `req.requestId`
  * Is returned via `X-Request-Id` header
  * Appears in all request and error logs

### HTTP Logging

* Requests are logged after response completion
* Includes method, path, status, duration, and request ID

### Error Handling

* Centralized error middleware
* Server-side stack traces only
* No internal error details exposed to clients

### Startup Guarantees

* Database connection success/failure is logged
* Application fails fast if critical dependencies are unavailable

---

## Query Safety, Pagination & Filtering (Day 7)

List endpoints are designed to be **safe by default**.

### Pagination

* Page-based pagination with capped limits
* Server-controlled offset calculation
* Prevents unbounded data scans

### Filtering & Sorting

* Filters and sort options are explicitly whitelisted
* Prevents client-controlled query injection

### Search

* Controlled regex-based search on specific fields
* Case-insensitive
* Designed to evolve into indexed or external search

### Query Parsing

* All query parsing is centralized
* Raw `req.query` is never passed directly to the database

---

## Indexing & Performance Engineering (Day 8)

Performance optimization is **evidence-driven**, not speculative.

### Index Strategy

Indexes are created strictly based on **observed query patterns**.

* Compound index on:

  ```
  { status, isDeleted, createdAt }
  ```
* Supports filtered listing, sorting, and pagination
* Slug field is uniquely indexed

### Validation

* Index usage is verified using execution plans
* Queries must use `IXSCAN`
* Collection scans are treated as performance defects

### Trade-offs

* Regex search is intentionally not indexed
* Pagination uses offset-based strategy initially
* Advanced optimizations are deferred intentionally

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