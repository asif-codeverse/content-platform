# 🧠 Backend / MERN Engineering Questions

**(Foundational → Advanced | Days 1–9 | Production-Oriented)**

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals (Day 1)

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` defines the Express application (middleware, routes, error handling).
`server.js` is responsible for infrastructure concerns such as database connection and starting the HTTP server.
This separation improves testability, reuse, and control over application lifecycle.

---

### 2. Why is all application code placed inside `src/`?

**Answer:**
It isolates runtime application logic from tooling, configuration, and build artifacts, enabling cleaner builds, safer deployments, and future flexibility (e.g., transpilation or bundling).

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents architectural intent and trade-offs.
Code explains *how* the system works; architecture explains *why* it was designed that way—critical for onboarding, maintenance, and interviews.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes route definitions, prevents `app.js` from becoming bloated, enables feature isolation, and supports scalable routing strategies such as versioning.

---

### 5. Why must error-handling middleware be registered last?

**Answer:**
Express executes middleware sequentially.
The error handler must be last so it can catch errors propagated from any earlier middleware or route.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why should business logic not live in routes?

**Answer:**
Routes are HTTP-specific. Business logic belongs in services so it can be reused, tested independently, and decoupled from transport concerns.

---

### 7. When should controllers be introduced?

**Answer:**
Controllers should be introduced once request-handling logic becomes non-trivial.
Premature abstraction adds complexity without real benefit.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer has a single responsibility—routing, orchestration, business logic, persistence—reducing coupling and improving scalability and maintainability.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, detect misconfiguration early, and enforce a single source of truth for runtime behavior.

---

### 10. Why is a flat folder structure dangerous in production?

**Answer:**
It does not scale, blurs ownership, and leads to large, tightly coupled files.
Feature-based modular structures scale better as complexity grows.

---

## 🔹 LEVEL 3 — Node.js & Module System

### 11. Why is `"type": "module"` required?

**Answer:**
It instructs Node.js to treat `.js` files as ES modules, enabling `import/export`.
Without it, Node defaults to CommonJS.

---

### 12. Why must file extensions be explicit in ES modules?

**Answer:**
ESM follows browser-style resolution rules; Node does not auto-resolve extensions.

---

### 13. Why is mixing CommonJS and ES Modules risky?

**Answer:**
It introduces subtle import/export bugs, tooling incompatibilities, and runtime failures that are difficult to debug in production.

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
Invalid data should never reach business logic. Early validation reduces attack surface and prevents undefined behavior deeper in the system.

---

## 🔹 LEVEL 5 — Authentication & Authorization (Days 2–3)

### 18. Why use JWT instead of sessions?

**Answer:**
JWTs enable stateless authentication, horizontal scalability, and remove the need for shared server memory.

---

### 19. Why separate access tokens and refresh tokens?

**Answer:**
Access tokens are short-lived and used for authorization.
Refresh tokens are long-lived and used only to obtain new access tokens.

---

### 20. Why store refresh tokens in HttpOnly cookies?

**Answer:**
To prevent JavaScript access and reduce XSS attack vectors.

---

### 21. What is RBAC and why enforce it at routes?

**Answer:**
Role-Based Access Control restricts actions based on user roles.
Enforcing it at the API boundary guarantees security regardless of client behavior.

---

### 22. Why attach `req.user` in auth middleware?

**Answer:**
It provides a trusted identity context for downstream logic without repeatedly verifying the token.

---

## 🔹 LEVEL 6 — Data Modeling & Business Safety (Day 4)

### 23. Why use soft deletes?

**Answer:**
They preserve data for audits, recovery, and analytics—essential in real business systems.

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
When clients can set unintended fields.
Prevented by explicitly whitelisting allowed fields in controllers.

---

### 27. Why use schema-based validation?

**Answer:**
Schemas provide declarative, reusable, and consistent validation that fails early and safely.

---

### 28. What problem does rate limiting solve?

**Answer:**
It protects against brute-force attacks, abuse, and accidental traffic spikes.

---

### 29. Why apply rate limiting globally?

**Answer:**
To ensure no route is accidentally left unprotected.

---

### 30. Why prefer structured logging over `console.log`?

**Answer:**
Structured logs are searchable, machine-readable, and suitable for aggregation, alerting, and production monitoring.

---

### 31. Why add request IDs?

**Answer:**
They enable tracing a single request across logs and error reports—critical for production debugging.

---

## 🔹 LEVEL 8 — Query Safety & Pagination (Day 7)

### 32. Why never pass raw `req.query` to the database?

**Answer:**
It enables query injection, unbounded scans, and unpredictable performance.

---

### 33. Why cap pagination limits?

**Answer:**
To prevent clients from requesting massive datasets that degrade performance or cause denial-of-service scenarios.

---

### 34. Why centralize query parsing?

**Answer:**
It ensures consistency, safety, easier testing, and avoids duplicated logic across controllers.

---

### 35. Why is regex search slow?

**Answer:**
Regex queries often bypass indexes and trigger collection scans.

---

## 🔹 LEVEL 9 — Indexing & Performance Engineering (Day 8)

### 36. Why design indexes based on query patterns?

**Answer:**
Indexes only improve performance when they match how queries are executed.

---

### 37. Why are unused indexes harmful?

**Answer:**
They increase write latency, memory usage, and operational maintenance cost.

---

### 38. Why does index field order matter?

**Answer:**
MongoDB indexes are ordered; incorrect ordering can render an index ineffective.

---

### 39. Why verify indexes using execution plans?

**Answer:**
To ensure queries use `IXSCAN` instead of costly collection scans.

---

## 🔹 LEVEL 10 — HTTP Caching & Performance (Day 9)

### 40. Why is caching risky?

**Answer:**
Incorrect or stale caches can violate business rules and serve invalid data.

---

### 41. Why prefer HTTP caching before Redis?

**Answer:**
HTTP caching offloads work to clients and CDNs and scales without additional infrastructure cost.

---

### 42. Why must cache invalidation be designed first?

**Answer:**
Invalidation is harder than caching; poor invalidation causes subtle correctness bugs.

---

### 43. Why cache only public, read-heavy endpoints?

**Answer:**
Caching private or user-specific data risks data leakage and correctness issues.

---

## 🔹 LEVEL 11 — System Bootstrap & Failure Handling

### 44. Why should the server fail fast if the database is unavailable?

**Answer:**
Running without a database leads to partial availability and silent failures.

---

### 45. Why is startup logging critical?

**Answer:**
It confirms configuration correctness, environment context, and dependency readiness.

---

### 46. Why keep `app.listen()` out of `app.js`?

**Answer:**
It keeps the app reusable for tests, background workers, and alternative runtimes.

---

## 🔹 LEVEL 12 — Module Boundaries & Ownership

### 47. Why should modules not import each other’s internals?

**Answer:**
It creates hidden coupling and breaks encapsulation.

---

### 48. Why is feature-based architecture superior long-term?

**Answer:**
It improves ownership, parallel development, and long-term scalability.

---

### 49. Why is sharing models across domains dangerous?

**Answer:**
It couples unrelated business rules and increases blast radius during changes.

---

## 🔹 LEVEL 13 — Trust Boundaries

### 50. Why is `req.user` trusted but `req.body` not?

**Answer:**
`req.user` is derived from verified tokens; `req.body` is user-controlled input.

---

### 51. Why should authentication never live in controllers?

**Answer:**
Authentication is a cross-cutting concern and must be enforced consistently.

---

### 52. Why never accept roles from request input?

**Answer:**
Clients can escalate privileges by manipulating request data.

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

### 55. What typically breaks first under traffic?

**Answer:**
Database throughput and latency.

---

### 56. Why document trade-offs?

**Answer:**
Every system has limits; documentation enables informed future decisions.

---

### 57. Why is simplicity a senior engineering skill?

**Answer:**
Simple systems fail predictably, scale better, and are easier to maintain.

---

## 🔹 LEVEL 15 — Expert-Level Perspective

### 58. When does RBAC become insufficient?

**Answer:**
When permissions depend on ownership or attributes—leading to ABAC models.

---

### 59. Why evolve architecture incrementally?

**Answer:**
Requirements change; incremental evolution preserves flexibility and reduces risk.

---

### 60. What signals a poorly designed backend?

**Answer:**
Tight coupling, missing validation, no rate limiting, weak observability, and unclear ownership.

---