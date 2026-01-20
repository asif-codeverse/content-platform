# Architecture Overview

This project is a **monorepo** consisting of a `client` and a `server`, designed with a **production-first backend architecture** and clear separation of concerns.

---

## Server Architecture

The backend is an **Express-based REST API** structured for scalability, security, and long-term maintainability.

### Core Responsibilities

* **`app.js`**

  * Application wiring
  * Global middleware registration
  * Route mounting

* **`server.js`**

  * Infrastructure bootstrapping
  * Database connection initialization
  * HTTP server startup

* **Centralized error handling**

  * All errors propagate to a single error middleware
  * Consistent error response format across the system

* **Health endpoint**

  * `/health` endpoint for service monitoring and uptime checks

---

## Module Structure

The backend follows a **feature-based modular architecture**, where each domain is isolated and self-contained.

```
src/
├── config/        # Environment & infrastructure config
├── middlewares/   # Auth, RBAC, error handling
├── modules/       # Feature modules (auth, articles, future domains)
├── utils/         # Shared utilities (JWT, helpers)
├── app.js
└── server.js
```

Each module encapsulates:

* Routes
* Controllers
* Services
* Models
* Validation logic

This structure allows features to evolve independently without cross-module coupling.

---

## Authentication (Day 2)

The system uses **stateless JWT-based authentication**.

### Token Strategy

* **Access Token**

  * Short-lived
  * Sent via `Authorization: Bearer <token>` header
  * Used for accessing protected APIs

* **Refresh Token**

  * Long-lived
  * Stored in **HttpOnly cookies**
  * Used only for token rotation
  * Never used for authorization

### Password Security

* Passwords are **hashed using bcrypt**
* Plain-text passwords are never stored, logged, or returned

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)**.

### Roles

* `USER` – read-only access
* `EDITOR` – content creation access
* `ADMIN` – full administrative control

### Middleware Layers

1. **Authentication middleware**

   * Verifies JWT access token
   * Attaches trusted user identity to `req.user`

2. **Authorization middleware**

   * Validates user role against allowed roles per route
   * Enforces business permissions at the API boundary

Authentication and authorization responsibilities are **strictly separated**.

---

## Core Domain Entity: Articles (Day 4)

The **Article** module represents the system’s first real business entity.
It is intentionally designed to be **domain-agnostic**, so it can later map to:

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

* Public users can:

  * View published articles

* `EDITOR` and `ADMIN` can:

  * Create articles

* `ADMIN` only can:

  * Publish articles
  * Soft delete articles

This ensures **business rules are enforced consistently** and not duplicated in controllers or services.

---

## Request Lifecycle

```
Client
 → Express App
 → Authentication Middleware (JWT verification)
 → Authorization Middleware (RBAC)
 → Router
 → Controller
 → Service
 → Database
 → Response
```

Errors at any stage are forwarded to the centralized error handler.

---

## Database & Infrastructure

* **MongoDB** is used for persistence
* The server **does not start** unless the database connection succeeds
* Environment variables are loaded and validated at startup

This prevents partial, unsafe, or inconsistent runtime states.

---

## Design Principles

* **Separation of concerns** across all layers
* **Thin routes**, no business logic in routers
* **Explicit middleware responsibilities**
* **Single source of truth** for configuration
* **Soft deletes over hard deletes**
* **Production-first error handling**
* **Incremental, intentional architecture evolution**

---

## Architectural Intent

The system is designed to:

* Scale feature complexity gradually
* Support real business workflows (admin, staff, customers)
* Act as a reusable backend foundation for multiple domains
* Minimize refactoring as requirements grow

This architecture prioritizes **clarity, correctness, and maintainability** over short-term speed.

---
## Validation & Security

- All write APIs use schema-based validation
- Validation occurs before controller execution
- Rate limiting protects against abuse
- Controllers whitelist allowed fields
