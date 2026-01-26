# 🧠 Backend / MERN Engineering Questions

**(Foundational → Advanced | Days 1–9 | Production-Oriented)**

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals (Day 1)

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` defines the Express application (middlewares, routes, error handling).
`server.js` handles infrastructure concerns such as database connection and starting the HTTP server.
This separation improves testability, reuse, and lifecycle control.

---

### 2. Why is all application code placed inside `src/`?

**Answer:**
It isolates application logic from tooling, configuration, and runtime artifacts, enabling cleaner builds, safer deployments, and future flexibility (e.g., transpilation).

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents architectural intent and trade-offs. Code explains *how* the system works; architecture explains *why* it was designed that way.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes routes, prevents `app.js` from becoming bloated, enables feature isolation, and supports scalable routing patterns.

---

### 5. Why must error-handling middleware be registered last?

**Answer:**
Express executes middleware in order. The error handler must be last to catch errors propagated from any earlier middleware or route.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why should business logic not live in routes?

**Answer:**
Routes are HTTP-specific. Business logic belongs in services so it can be reused, tested independently, and decoupled from transport concerns.

---

### 7. When should controllers be introduced?

**Answer:**
Controllers should be introduced when request-handling logic becomes non-trivial. Premature abstraction increases complexity without benefit.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer has a single responsibility (routing, orchestration, business logic, persistence), reducing coupling and improving scalability and maintainability.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, catch misconfiguration early, and enforce a single source of truth for runtime behavior.

---

### 10. Why is a flat folder structure dangerous in production?

**Answer:**
It doesn’t scale, blurs ownership, and leads to large, tightly coupled files. Feature-based modular structures scale better.

---

## 🔹 LEVEL 3 — Node.js & Module System

### 11. Why is `"type": "module"` required?

**Answer:**
It tells Node.js to treat `.js` files as ES modules, enabling `import/export`. Without it, Node defaults to CommonJS.

---

### 12. Why must file extensions be explicit in ES modules?

**Answer:**
ESM follows browser-style resolution; Node does not auto-resolve extensions.

---

### 13. Why is mixing CommonJS and ES Modules risky?

**Answer:**
It causes subtle import/export bugs, tooling incompatibilities, and runtime failures.

---

## 🔹 LEVEL 4 — HTTP, Middleware & Request Lifecycle

### 14. Describe the full request lifecycle.

**Answer:**
Client → Express app → rate limiter → request ID → HTTP logger → authentication → authorization → router → controller → service → database → response → error handler (if needed).

---

### 15. What is a health check endpoint?

**Answer:**
A lightweight endpoint used by monitoring systems to verify service availability without executing business logic.

---

### 16. Why must error responses be consistent?

**Answer:**
Consistency simplifies frontend handling, improves observability, and prevents accidental information leakage.

---

### 17. Why should validation happen before controller logic?

**Answer:**
Invalid data should never reach business logic. Early validation reduces attack surface and undefined behavior.

---

## 🔹 LEVEL 5 — Authentication & Authorization (Days 2–3)

### 18. Why use JWT instead of sessions?

**Answer:**
JWTs enable stateless authentication, horizontal scalability, and eliminate shared server memory.

---

### 19. Why separate access tokens and refresh tokens?

**Answer:**
Access tokens are short-lived and used for authorization. Refresh tokens are long-lived and used only to obtain new access tokens.

---

### 20. Why store refresh tokens in HttpOnly cookies?

**Answer:**
To prevent JavaScript access and reduce XSS attack vectors.

---

### 21. What is RBAC and why enforce it at routes?

**Answer:**
RBAC restricts actions based on roles. Enforcing it at the API boundary ensures security regardless of client behavior.

---

### 22. Why attach `req.user` in auth middleware?

**Answer:**
It provides a trusted identity context for downstream logic without re-verifying the token.

---

## 🔹 LEVEL 6 — Data Modeling & Business Safety (Day 4)

### 23. Why use soft deletes?

**Answer:**
They preserve data for audits, recovery, and analytics—critical in real business systems.

---

### 24. Why prefer slugs over IDs in URLs?

**Answer:**
Slugs improve SEO, readability, and user trust while hiding internal identifiers.

---

### 25. Why default entities to DRAFT?

**Answer:**
It prevents accidental public exposure and enforces explicit publishing workflows.

---

## 🔹 LEVEL 7 — Validation, Abuse Prevention & Observability (Days 5–6)

### 26. What is mass assignment?

**Answer:**
When clients can set unintended fields. Prevented by explicitly whitelisting allowed fields.

---

### 27. Why use schema-based validation?

**Answer:**
Schemas provide declarative, reusable, and consistent validation that fails early.

---

### 28. What problem does rate limiting solve?

**Answer:**
It protects against brute force attacks, abuse, and accidental traffic spikes.

---

### 29. Why apply rate limiting globally?

**Answer:**
To ensure no route is accidentally left unprotected.

---

### 30. Why prefer structured logging over `console.log`?

**Answer:**
Structured logs are searchable, machine-readable, and suitable for aggregation and alerting.

---

### 31. Why add request IDs?

**Answer:**
They enable tracing a single request across logs and errors—critical for production debugging.

---

## 🔹 LEVEL 8 — Query Safety & Pagination (Day 7)

### 32. Why never pass raw `req.query` to DB?

**Answer:**
It enables query injection, unbounded scans, and unpredictable performance.

---

### 33. Why cap pagination limits?

**Answer:**
To prevent clients from requesting massive datasets that degrade performance.

---

### 34. Why centralize query parsing?

**Answer:**
It ensures consistency, safety, easier testing, and avoids duplicated logic.

---

### 35. Why is regex search slow?

**Answer:**
Regex often bypasses indexes and causes collection scans.

---

## 🔹 LEVEL 9 — Indexing & Performance (Day 8)

### 36. Why index based on query patterns?

**Answer:**
Indexes only help if they match how queries are executed.

---

### 37. Why are unused indexes harmful?

**Answer:**
They increase write latency, memory usage, and maintenance cost.

---

### 38. Why does index field order matter?

**Answer:**
MongoDB indexes are ordered; incorrect order can make an index unusable.

---

### 39. Why verify indexes with execution plans?

**Answer:**
To ensure queries use `IXSCAN` instead of costly collection scans.

---

## 🔹 LEVEL 10 — Caching & HTTP Performance (Day 9)

### 40. Why is caching risky?

**Answer:**
Stale or incorrect cached data can break business rules.

---

### 41. Why is HTTP caching preferred before Redis?

**Answer:**
It offloads work to clients/CDNs and scales without infrastructure cost.

---

### 42. Why must cache invalidation be planned first?

**Answer:**
Invalidation is harder than caching. Poor invalidation causes stale data bugs.

---

### 43. Why cache only public, read-heavy endpoints?

**Answer:**
Private or user-specific data risks leaks and correctness issues.

---

## 🔹 LEVEL 11 — System Bootstrap & Failure Handling

### 44. Why should the server fail fast if DB fails?

**Answer:**
Running without DB causes partial availability and silent failures.

---

### 45. Why is startup logging critical?

**Answer:**
It confirms configuration, environment, and dependency readiness.

---

### 46. Why keep `app.listen()` out of `app.js`?

**Answer:**
To keep the app reusable for tests, workers, and serverless contexts.

---

## 🔹 LEVEL 12 — Module Boundaries & Ownership

### 47. Why should modules not import each other’s internals?

**Answer:**
It creates hidden coupling and breaks encapsulation.

---

### 48. Why is feature-based architecture superior long-term?

**Answer:**
It improves ownership, parallel development, and scalability.

---

### 49. Why is sharing models across domains dangerous?

**Answer:**
It couples unrelated business rules and increases blast radius.

---

## 🔹 LEVEL 13 — Trust Boundaries

### 50. Why is `req.user` trusted but `req.body` not?

**Answer:**
`req.user` comes from verified tokens; `req.body` is user-controlled input.

---

### 51. Why should auth never live in controllers?

**Answer:**
Authentication is a cross-cutting concern and must be enforced consistently.

---

### 52. Why never accept role from request body?

**Answer:**
Clients can escalate privileges by modifying input.

---

## 🔹 LEVEL 14 — Senior Engineering Mindset

### 53. Why is “working code” not production-ready?

**Answer:**
Production readiness includes safety, observability, scalability, and failure handling.

---

### 54. Why avoid premature optimization?

**Answer:**
It adds complexity before correctness and real bottlenecks are known.

---

### 55. What breaks first under traffic?

**Answer:**
Database throughput and latency.

---

### 56. Why document trade-offs?

**Answer:**
Every system has limits; documentation enables informed future decisions.

---

### 57. Why is simplicity a senior skill?

**Answer:**
Simple systems fail predictably, scale better, and are easier to maintain.

---

## 🔹 LEVEL 15 — Expert-Level Perspective

### 58. When does RBAC become insufficient?

**Answer:**
When permissions depend on ownership or attributes—leading to ABAC.

---

### 59. Why evolve architecture incrementally?

**Answer:**
Requirements change; incremental evolution preserves flexibility.

---

### 60. What signals a poorly designed backend?

**Answer:**
Tight coupling, missing logs, no validation, no rate limits, unclear ownership.

---