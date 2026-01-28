# 🧠 Backend / MERN Engineering Questions

**(Foundational → Advanced | Days 1–11 | Production-Oriented)**

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals (Day 1)

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` defines the Express application (middleware, routes, error handling).
`server.js` handles infrastructure concerns such as database connection and starting the HTTP server.
This separation improves testability, reuse, and lifecycle control.

---

### 2. Why is all application code placed inside `src/`?

**Answer:**
It isolates runtime logic from tooling and deployment artifacts, enabling cleaner builds, safer deployments, and future flexibility.

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents architectural intent and trade-offs.
Code explains *how* the system works; architecture explains *why* decisions were made.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes routes, prevents `app.js` from growing uncontrollably, enables feature isolation, and supports scalable routing patterns.

---

### 5. Why must error-handling middleware be registered last?

**Answer:**
Express executes middleware sequentially.
The error handler must be last to catch errors propagated from earlier middleware or routes.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why should business logic not live in routes?

**Answer:**
Routes are HTTP-specific. Business logic belongs in services so it can be reused, tested independently, and decoupled from transport concerns.

---

### 7. When should controllers be introduced?

**Answer:**
When request-handling logic becomes non-trivial.
Premature abstraction adds complexity without value.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer owns a single responsibility—routing, orchestration, business logic, persistence—reducing coupling and improving maintainability.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, detect misconfiguration early, and enforce a single source of truth.

---

### 10. Why is a flat folder structure dangerous in production?

**Answer:**
It doesn’t scale, blurs ownership, and leads to tightly coupled, oversized files.

---

## 🔹 LEVEL 3 — Node.js & Module System

### 11. Why is `"type": "module"` required?

**Answer:**
It enables ES module syntax (`import/export`). Without it, Node defaults to CommonJS.

---

### 12. Why must file extensions be explicit in ES modules?

**Answer:**
ESM follows browser-style resolution; Node does not auto-resolve extensions.

---

### 13. Why is mixing CommonJS and ES Modules risky?

**Answer:**
It causes subtle runtime bugs, tooling incompatibilities, and difficult-to-debug failures.

---

## 🔹 LEVEL 4 — HTTP, Middleware & Request Lifecycle

### 14. Describe the full request lifecycle.

**Answer:**
Client → Express app → rate limiter → request ID → HTTP logger → authentication → authorization → router → controller → service → database → response → error handler.

---

### 15. What is a health check endpoint?

**Answer:**
A lightweight endpoint for monitoring systems to verify service availability without touching business logic.

---

### 16. Why must error responses be consistent?

**Answer:**
Consistency improves frontend handling, observability, and prevents information leakage.

---

### 17. Why should validation happen before controller logic?

**Answer:**
Invalid data must never reach business logic. Early validation reduces attack surface.

---

## 🔹 LEVEL 5 — Authentication & Authorization (Days 2–3)

### 18. Why use JWT instead of sessions?

**Answer:**
JWTs enable stateless authentication and horizontal scalability.

---

### 19. Why separate access tokens and refresh tokens?

**Answer:**
Access tokens are short-lived for authorization; refresh tokens are long-lived and only used for renewal.

---

### 20. Why store refresh tokens in HttpOnly cookies?

**Answer:**
To prevent JavaScript access and reduce XSS risk.

---

### 21. Why enforce RBAC at the route level?

**Answer:**
It guarantees security regardless of client behavior.

---

### 22. Why attach `req.user` in auth middleware?

**Answer:**
It provides a trusted identity context for downstream logic.

---

## 🔹 LEVEL 6 — Data Modeling & Business Safety (Day 4)

### 23. Why use soft deletes?

**Answer:**
They preserve data for audits, recovery, and analytics.

---

### 24. Why prefer slugs over IDs in URLs?

**Answer:**
Slugs improve SEO and user trust while hiding internal identifiers.

---

### 25. Why default entities to DRAFT?

**Answer:**
It prevents accidental public exposure.

---

## 🔹 LEVEL 7 — Validation, Abuse Prevention & Observability (Days 5–6)

### 26. What is mass assignment?

**Answer:**
Allowing clients to set unintended fields. Prevented via explicit whitelisting.

---

### 27. Why use schema-based validation?

**Answer:**
It provides declarative, reusable, and early-failing validation.

---

### 28. What problem does rate limiting solve?

**Answer:**
Protection against brute force, abuse, and accidental overload.

---

### 29. Why apply rate limiting globally?

**Answer:**
To ensure no endpoint is left unprotected.

---

### 30. Why prefer structured logging over `console.log`?

**Answer:**
Structured logs are searchable, machine-readable, and production-ready.

---

### 31. Why add request IDs?

**Answer:**
They allow tracing a single request across logs and errors.

---

## 🔹 LEVEL 8 — Query Safety & Pagination (Day 7)

### 32. Why never pass raw `req.query` to the database?

**Answer:**
It enables query injection and unbounded scans.

---

### 33. Why cap pagination limits?

**Answer:**
To prevent denial-of-service via massive data requests.

---

### 34. Why centralize query parsing?

**Answer:**
Consistency, safety, and maintainability.

---

### 35. Why is regex search slow?

**Answer:**
Regex often bypasses indexes and causes collection scans.

---

## 🔹 LEVEL 9 — Indexing & Performance Engineering (Day 8)

### 36. Why design indexes based on query patterns?

**Answer:**
Indexes only help when they match real query behavior.

---

### 37. Why are unused indexes harmful?

**Answer:**
They increase write latency and memory usage.

---

### 38. Why does index field order matter?

**Answer:**
MongoDB indexes are ordered; wrong order can invalidate them.

---

### 39. Why verify indexes using execution plans?

**Answer:**
To ensure `IXSCAN` is used instead of collection scans.

---

## 🔹 LEVEL 10 — HTTP Caching & Performance (Day 9)

### 40. Why is caching risky?

**Answer:**
Incorrect caching can serve stale or invalid data.

---

### 41. Why prefer HTTP caching before Redis?

**Answer:**
It scales via clients/CDNs with zero infrastructure cost.

---

### 42. Why must cache invalidation be designed first?

**Answer:**
Invalidation is harder than caching and error-prone.

---

### 43. Why cache only public, read-heavy endpoints?

**Answer:**
Caching private data risks leaks and correctness bugs.

---

## 🔹 LEVEL 11 — Background Jobs & Async Processing (Days 10–11)

### 44. Why move side effects to background jobs?

**Answer:**
To keep APIs fast, reliable, and focused on user-facing work.

---

### 45. What are examples of side effects?

**Answer:**
Emails, cache invalidation, analytics, notifications.

---

### 46. Why should jobs be idempotent?

**Answer:**
Retries must not cause duplicate side effects.

---

### 47. Why track job execution status?

**Answer:**
To prevent duplicate processing and enable retries safely.

---

### 48. Why separate job producers and workers?

**Answer:**
It decouples request handling from execution and improves scalability.

---

### 49. Why add retry logic with backoff?

**Answer:**
To handle transient failures without overwhelming dependencies.

---

### 50. Why should jobs not run inside controllers?

**Answer:**
Controllers must remain synchronous and user-facing.

---

## 🔹 LEVEL 12 — System Bootstrap & Failure Handling

### 51. Why should the server fail fast if DB is unavailable?

**Answer:**
Partial availability causes silent data corruption and undefined behavior.

---

### 52. Why is startup logging critical?

**Answer:**
It confirms environment, configuration, and dependency readiness.

---

### 53. Why keep `app.listen()` out of `app.js`?

**Answer:**
It keeps the app reusable for tests, workers, and alternate runtimes.

---

## 🔹 LEVEL 13 — Module Boundaries & Trust

### 54. Why should modules not import each other’s internals?

**Answer:**
It breaks encapsulation and creates hidden coupling.

---

### 55. Why is `req.user` trusted but `req.body` not?

**Answer:**
`req.user` comes from verified tokens; `req.body` is user input.

---

### 56. Why never accept roles from request input?

**Answer:**
Clients could escalate privileges.

---

## 🔹 LEVEL 14 — Senior Engineering Mindset

### 57. Why is “working code” not production-ready?

**Answer:**
Production requires safety, observability, failure handling, and scalability.

---

### 58. Why avoid premature optimization?

**Answer:**
It adds complexity before correctness and evidence.

---

### 59. What breaks first under traffic?

**Answer:**
Database throughput and latency.

---

### 60. Why document trade-offs?

**Answer:**
Every system has limits; documentation enables informed evolution.

---

## 🔹 LEVEL 15 — Expert-Level Perspective

### 61. When does RBAC become insufficient?

**Answer:**
When permissions depend on ownership or attributes (ABAC).

---

### 62. Why evolve architecture incrementally?

**Answer:**
To preserve flexibility and reduce long-term risk.

---

### 63. What signals a poorly designed backend?

**Answer:**
Tight coupling, missing validation, weak observability, unsafe defaults.

---