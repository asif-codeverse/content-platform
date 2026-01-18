# Architecture Overview

This project is a **monorepo** consisting of a `client` and a `server`, designed with **production-first backend architecture** and clear separation of concerns.

---

## Server Architecture

The backend is an **Express-based REST API** structured for scalability and maintainability.

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
  * Consistent error response format

* **Health endpoint**

  * `/health` endpoint for service monitoring and uptime checks

---

## Module Structure

The backend follows a **feature-based modular architecture**.

```
src/
├── config/        # Environment & infrastructure config
├── middlewares/   # Auth, RBAC, error handling
├── modules/       # Feature modules (auth, future domains)
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

---

## Authentication (Day 2)

The system uses **stateless JWT-based authentication**.

### Token Strategy

* **Access Token**

  * Short-lived
  * Sent via `Authorization: Bearer <token>` header
* **Refresh Token**

  * Long-lived
  * Stored in **HttpOnly cookies**
  * Used only for token rotation (not for authorization)

### Password Security

* Passwords are **hashed using bcrypt**
* Plain-text passwords are never stored or logged

---

## Authorization & RBAC (Day 3)

Authorization is enforced using **Role-Based Access Control (RBAC)**.

### Roles

* `USER`
* `EDITOR`
* `ADMIN`

### Middleware Layers

1. **Authentication middleware**

   * Verifies JWT access token
   * Attaches trusted user identity to `req.user`

2. **Authorization middleware**

   * Checks user role against allowed roles per route
   * Prevents unauthorized access to protected resources

Authentication and authorization are **strictly separated**.

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
 → Response
```

Errors at any stage are forwarded to the centralized error handler.

---

## Database & Infrastructure

* **MongoDB** is used for persistence
* The server **does not start** unless the database connection succeeds
* Environment variables are loaded and validated at startup

This prevents partial or unsafe application states.

---

## Design Principles

* **Separation of concerns** across layers
* **Thin routes**, no business logic in routers
* **Explicit middleware responsibilities**
* **Single source of truth** for configuration
* **Production-first error handling**
* **Incremental architecture evolution**

---

## Architectural Intent

The system is designed to:

* Scale feature complexity gradually
* Support real business use cases (admin, staff, customers)
* Serve as a foundation for future domains (e.g., ordering, bookings)

This architecture prioritizes **clarity, safety, and long-term maintainability** over short-term convenience.

---
