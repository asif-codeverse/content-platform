# Architecture Overview

This project is a **monorepo** consisting of a `client` and a `server`, designed with a **production-first backend architecture** and strict separation of concerns.

The backend is intentionally built to resemble **real-world systems**, not tutorial demos.

---

## High-Level Goals

* Clear separation of responsibilities
* Secure, stateless authentication
* Enforced authorization at API boundaries
* Safe domain modeling
* Abuse prevention
* Full observability and traceability
* Incremental, intentional architectural evolution

---

## Monorepo Structure

```
/
├── client/          # Frontend (separate concern)
└── server/          # Backend API
```

The frontend and backend evolve independently but share a single repository for coordinated development.

---

## Server Architecture

The backend is an **Express-based REST API** structured for scalability, security, and long-term maintainability.

### Core Responsibilities

#### `app.js`

* Express application setup
* Global middleware registration
* Route mounting
* Error middleware registration

#### `server.js`

* Infrastructure bootstrapping
* Database connection initialization
* HTTP server startup
* Startup logging

---

## Source Layout (`src/`)

All application code lives inside `src/` to isolate it from tooling and runtime artifacts.

```
src/
├── config/          # Environment & infrastructure configuration
│   ├── env.js
│   └── db.js
│
├── middlewares/     # Cross-cutting middleware
│   ├── authenticate.middleware.js
│   ├── authorize.middleware.js
│   ├── error.middleware.js
│   ├── httpLogger.middleware.js
│   └── requestId.middleware.js
│
├── modules/         # Feature-based modules
│   ├── auth/
│   └── articles/
│
├── utils/           # Shared utilities
│   ├── logger.js
│   ├── jwt.js
│   └── helpers.js
│
├── app.js
└── server.js
```

---

## Feature-Based Modular Architecture

Each feature module is **self-contained** and owns its domain logic.

### Module Structure

Each module encapsulates:

* Routes
* Controllers
* Services
* Models
* Validation logic

This prevents cross-module coupling and allows features to evolve independently.

---

## Authentication (Day 2)

The system uses **stateless JWT-based authentication**.

### Token Strategy

#### Access Token

* Short-lived
* Sent via `Authorization: Bearer <token>` header
* Used for accessing protected APIs

#### Refresh Token

* Long-lived
* Stored in **HttpOnly cookies**
* Used only for token rotation
* Never used for authorization

---

### Password Security

* Passwords are hashed using **bcrypt**
* Plain-text passwords are never:

  * Stored
  * Logged
  * Returned in responses

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)**.

### Roles

* `USER` — read-only access
* `EDITOR` — content creation
* `ADMIN` — full administrative control

### Middleware Layers

1. **Authentication Middleware**

   * Verifies JWT access token
   * Attaches trusted identity to `req.user`

2. **Authorization Middleware**

   * Validates user role against allowed roles per route
   * Enforces permissions at the API boundary

Authentication and authorization responsibilities are **strictly separated**.

---

## Core Domain Entity: Articles (Day 4)

The **Article** module represents the system’s first real business entity.

It is intentionally **domain-agnostic**, so it can later map to:

* Menu items
* Dishes
* Events
* Listings

### Article Responsibilities

* Title and content management
* SEO-friendly slug generation
* Draft vs published lifecycle
* Ownership tracking (author)
* Soft deletion for business safety

### Data Characteristics

* Articles default to **DRAFT**
* Only **PUBLISHED** articles are publicly visible
* Deletion is **soft delete** (`isDeleted = true`)
* Slugs are unique and indexed
* Author is stored for auditability

---

## RBAC Applied to Domain Logic

RBAC is enforced at the **route level** for article operations:

### Access Rules

* Public users:

  * View published articles

* `EDITOR` and `ADMIN`:

  * Create articles

* `ADMIN` only:

  * Publish articles
  * Soft delete articles

This guarantees business rules cannot be bypassed from the client.

---

## Validation & Abuse Protection (Day 5)

### Validation

* All write APIs use **schema-based validation**
* Validation executes **before controller logic**
* Invalid data never reaches business logic

### Controller Safety

* Controllers **explicitly whitelist allowed fields**
* Prevents mass assignment vulnerabilities

### Rate Limiting

* Global rate limiting is applied at the app level
* Protects against:

  * Brute force attacks
  * Abuse
  * Accidental traffic spikes
* Enforced using standard HTTP `429` responses

---

## Logging & Observability (Day 6)

The system implements **production-grade structured logging and request tracing**.

### Logging Strategy

* **Winston** is used as the centralized logger
* Logs include:

  * Timestamp
  * Log level (`info`, `warn`, `error`)
  * Structured metadata
* `console.log` and `console.error` are **not used anywhere**

---

### Request Correlation

* Every incoming request is assigned a **unique request ID**
* The request ID:

  * Is attached to `req.requestId`
  * Is returned via `X-Request-Id` response header
  * Appears in all request and error logs

This enables tracing a single request across the system.

---

### HTTP Request Logging

* All HTTP requests are logged **after the response is sent**
* Logged metadata:

  * Method
  * Path
  * Status code
  * Duration
  * Request ID

---

### Error Logging

* All errors flow to a centralized error middleware
* Error logs include:

  * Error message
  * Stack trace (server-side only)
  * Status code
  * Request ID
  * Request path
* Stack traces are **never exposed to clients**

---

### Startup & Infrastructure Logs

* Database connection success/failure is logged
* Server startup logs include:

  * Port
  * Runtime environment
* The application **fails fast** if critical dependencies are unavailable

---

## Request Lifecycle (Actual Execution Order)

```
Client
 → Express App
 → Request ID Middleware
 → HTTP Logger Middleware
 → Authentication Middleware (JWT)
 → Authorization Middleware (RBAC)
 → Router
 → Controller
 → Service
 → Database
 → Response
 → Central Error Logger (on failure)
```

---

## Database & Infrastructure

* **MongoDB** is used for persistence
* The server does **not start** unless the database connection succeeds
* Environment variables are loaded and validated at startup

This prevents unsafe partial runtime states.

---

## Design Principles

* Separation of concerns across all layers
* Thin routes, no business logic in routers
* Explicit middleware responsibilities
* Single source of truth for configuration
* Soft deletes over hard deletes
* Secure defaults over convenience
* Observability as a first-class concern
* Incremental, intentional architecture evolution

---

## Architectural Intent

This system is designed to:

* Scale feature complexity gradually
* Support real business workflows (admin, staff, customers)
* Act as a reusable backend foundation for multiple domains
* Minimize refactoring as requirements grow

The architecture prioritizes **clarity, correctness, security, and maintainability** over short-term speed.

---

## Current Maturity (End of Day 6)

At this stage, the backend is:

* Secure
* Observable
* Abuse-resistant
* Production-oriented
* Interview-ready

---
