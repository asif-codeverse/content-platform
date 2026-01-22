# 🧠 Backend / MERN Engineering Questions

**(Foundational → Advanced | Based on Days 1–7)**

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` configures the Express application (middlewares, routes, error handling), while `server.js` handles infrastructure concerns such as database connection and starting the HTTP server. This separation improves testability, bootstrapping clarity, and control over the server lifecycle.

---

### 2. Why is all application code placed inside `src/`?

**Answer:**
`src/` isolates application logic from tooling, configuration, and runtime artifacts. This keeps builds clean, deployments predictable, and allows future transitions (e.g., transpilation or bundling) without restructuring the project.

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents architectural intent and trade-offs. Code explains *how* the system works; architecture explains *why* it was designed that way. This is critical for onboarding, long-term maintenance, and interviews.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes route definitions, prevents `app.js` from becoming bloated, enables feature-based isolation, and supports scalable patterns like API versioning.

---

### 5. Why must error-handling middleware be registered last?

**Answer:**
Express executes middleware sequentially. The error handler must be last so it can catch errors thrown or forwarded via `next(err)` from all previous middleware and routes.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why should business logic not live in routes?

**Answer:**
Routes are HTTP-specific. Business logic belongs in services so it can be reused, tested independently, and kept decoupled from transport concerns.

---

### 7. When should controllers be introduced?

**Answer:**
Controllers should be introduced when request-handling logic becomes non-trivial. Abstractions exist to manage complexity—not to be added prematurely.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer has a single responsibility: routing, request orchestration, business logic, and persistence. This reduces coupling and makes systems easier to scale and debug.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, detect misconfiguration early, and enforce a single source of truth for runtime behavior.

---

### 10. Why is a flat folder structure dangerous in production?

**Answer:**
It does not scale, blurs ownership, and leads to tightly coupled, oversized files. Feature-based modular structures scale better with complexity and team size.

---

## 🔹 LEVEL 3 — Node.js & Module System (Critical)

### 11. Why is `"type": "module"` required in `package.json`?

**Answer:**
It instructs Node.js to treat `.js` files as ES modules, enabling `import/export`. Without it, Node defaults to CommonJS and throws syntax errors.

---

### 12. Why must file extensions be explicit in ES module imports?

**Answer:**
ESM follows browser-style resolution. Node does not auto-resolve extensions, so `.js` must be explicitly specified.

---

### 13. Why is mixing CommonJS and ES Modules risky?

**Answer:**
It introduces subtle import/export issues, tooling incompatibilities, and runtime bugs. Production systems standardize on one module system.

---

## 🔹 LEVEL 4 — HTTP, Middleware & Request Lifecycle

### 14. Describe the full request lifecycle in your backend.

**Answer:**
Client → Express app → rate limiter → request ID middleware → HTTP logger → authentication → authorization → router → controller → service → database → response → centralized error handler (on failure).

---

### 15. What is a health check endpoint and why is it important?

**Answer:**
It allows monitoring systems, load balancers, and orchestration tools to verify service availability without executing business logic.

---

### 16. Why must error responses follow a consistent structure?

**Answer:**
Consistency simplifies frontend handling, improves observability, and prevents accidental information leaks.

---

### 17. Why should validation happen before controller logic?

**Answer:**
Invalid data should never reach business logic. Early validation reduces attack surface and prevents undefined behavior deeper in the system.

---

## 🔹 LEVEL 5 — Authentication, Authorization & Security

### 18. Why use JWT access tokens instead of sessions?

**Answer:**
JWTs enable stateless authentication, horizontal scalability, and remove the need for shared server memory.

---

### 19. Why separate access tokens and refresh tokens?

**Answer:**
Access tokens are short-lived and used for authorization. Refresh tokens are long-lived and used only to obtain new access tokens. Mixing them is a security flaw.

---

### 20. Why store refresh tokens in HttpOnly cookies?

**Answer:**
HttpOnly cookies prevent JavaScript access, reducing XSS attack vectors.

---

### 21. What is RBAC and why is it enforced at the route level?

**Answer:**
Role-Based Access Control restricts actions based on user roles. Enforcing it at the API boundary ensures business rules cannot be bypassed.

---

### 22. Why attach `req.user` in authentication middleware?

**Answer:**
It provides a trusted identity context for downstream logic without repeatedly verifying the token.

---

## 🔹 LEVEL 6 — Data Modeling & Business Safety

### 23. Why use soft deletes instead of hard deletes?

**Answer:**
Soft deletes preserve data for audits, recovery, and analytics—critical in real business systems.

---

### 24. Why are slugs preferred over IDs in public URLs?

**Answer:**
Slugs improve SEO, readability, and user trust while keeping internal identifiers hidden.

---

### 25. Why default entities to DRAFT instead of PUBLISHED?

**Answer:**
It prevents accidental public exposure and enforces explicit publishing workflows.

---

## 🔹 LEVEL 7 — Validation, Abuse Prevention & Observability

### 26. What is mass assignment and how do you prevent it?

**Answer:**
Mass assignment occurs when clients can set unintended fields. It is prevented by explicitly whitelisting allowed fields in controllers.

---

### 27. Why use schema-based validation?

**Answer:**
Schemas provide declarative, reusable, and consistent validation rules that fail early and safely.

---

### 28. What problem does rate limiting solve?

**Answer:**
It protects against brute force attacks, accidental traffic spikes, and abusive clients.

---

### 29. Why apply rate limiting at the app level?

**Answer:**
It provides global protection and ensures no route is accidentally left unprotected.

---

### 30. Why is structured logging preferred over `console.log`?

**Answer:**
Structured logs are machine-readable, searchable, and suitable for aggregation, alerting, and production monitoring.

---

### 31. Why add request IDs to every request?

**Answer:**
Request IDs allow tracing a single request across logs, services, and error reports—essential for debugging production issues.

---

## 🔹 LEVEL 8 — Query Safety, Pagination & Data Access (Day 7)

### 32. Why should raw `req.query` never be passed directly to the database?

**Answer:**
It enables query injection, unbounded scans, and unexpected performance issues. Queries must be parsed and whitelisted.

---

### 33. Why cap pagination limits on the server?

**Answer:**
To prevent clients from requesting massive datasets that could degrade performance or cause denial-of-service scenarios.

---

### 34. Why centralize query parsing logic?

**Answer:**
Centralization ensures consistency, safety, easier testing, and prevents duplicated or insecure query handling.

---

### 35. Why is regex search potentially slow?

**Answer:**
Regex queries often bypass indexes and cause collection scans. They must be used carefully and optimized later with indexes or search strategies.

---

## 🔹 LEVEL 9 — Production Mindset & System Thinking

### 36. Why avoid premature optimization?

**Answer:**
Optimizing before correctness adds complexity and risk. Systems should be correct and safe first, then optimized based on evidence.

---

### 37. How does this project differ from tutorial projects?

**Answer:**
It evolves incrementally, accumulates constraints, enforces refactoring, documents decisions, and mirrors real production trade-offs.

---

### 38. What usually breaks first under traffic?

**Answer:**
Database throughput and latency—hence the early focus on validation, rate limiting, query safety, and observability.

---

### 39. What signals tell an interviewer you are production-minded?

**Answer:**
Clear structure, security layers, validation, logging, documentation, safe defaults, and the ability to explain trade-offs clearly.

---

### 40. What defines an expert backend engineer over time?

**Answer:**
The ability to reason about systems, anticipate failure modes, document decisions, and evolve architecture responsibly—not just write code.

---
