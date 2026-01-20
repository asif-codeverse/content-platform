# 🧠 Backend / MERN Engineering Questions

**(Foundational → Advanced | Based on Days 1–5)**

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` is responsible for configuring the Express application (middlewares, routes), while `server.js` is responsible for infrastructure concerns such as database connection and starting the HTTP server. This separation enables easier testing, cleaner bootstrapping, and better control over server lifecycle.

---

### 2. Why is all application code placed inside `src/`?

**Answer:**
`src/` isolates application logic from configuration, tooling, and runtime artifacts. This makes builds cleaner, deployments safer, and allows future transitions like transpilation or bundling without restructuring the project.

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents architectural decisions and system intent. Code explains *how* things work; architecture explains *why* they were designed that way. This helps onboarding, maintenance, and interview discussions.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes routes, prevents `app.js` from becoming bloated, enables feature isolation, and supports scalable routing strategies like versioning.

---

### 5. Why must error-handling middleware be registered last?

**Answer:**
Express executes middleware in order. The error handler must be last so it can catch errors thrown or forwarded from all previous middleware and routes.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why should business logic not live in routes?

**Answer:**
Routes are HTTP-specific. Business logic belongs in services so it can be reused, tested independently, and kept decoupled from transport concerns.

---

### 7. When should controllers be introduced?

**Answer:**
Controllers should be introduced when route logic becomes non-trivial. Abstractions exist to manage complexity, not to look clean prematurely.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer has a single responsibility: routing, request handling, business logic, and persistence. This reduces coupling and makes systems easier to scale and debug.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, catch misconfiguration early, and enforce a single source of truth for runtime behavior.

---

### 10. Why is a flat folder structure dangerous in production?

**Answer:**
It doesn’t scale, blurs ownership, and leads to large, tightly coupled files. Feature-based modular structures scale better with complexity and team size.

---

## 🔹 LEVEL 3 — Node.js & Module System (Critical)

### 11. Why is `"type": "module"` required in `package.json`?

**Answer:**
It tells Node.js to treat `.js` files as ES modules, enabling `import/export`. Without it, Node defaults to CommonJS and throws syntax errors.

---

### 12. Why must file extensions be explicit in ES module imports?

**Answer:**
ESM follows browser-style resolution. Node does not auto-resolve extensions in ESM, so `.js` must be explicitly specified.

---

### 13. Why is mixing CommonJS and ES Modules risky?

**Answer:**
It causes subtle import/export issues, tooling incompatibilities, and runtime bugs. Production systems standardize on one module system.

---

## 🔹 LEVEL 4 — HTTP, Middleware & Request Lifecycle

### 14. Describe the full request lifecycle in your backend.

**Answer:**
Client → Express app → global middleware → authentication → authorization → router → controller → service → database → response → error middleware (if needed).

---

### 15. What is a health check endpoint and why is it important?

**Answer:**
It allows monitoring systems, load balancers, and orchestration tools to verify service availability without hitting business logic.

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
JWTs enable stateless authentication, scale horizontally without shared memory, and are well-suited for APIs.

---

### 19. Why separate access tokens and refresh tokens?

**Answer:**
Access tokens are short-lived and used for authorization. Refresh tokens are long-lived, stored securely, and used only to obtain new access tokens. Mixing them is a security flaw.

---

### 20. Why store refresh tokens in HttpOnly cookies?

**Answer:**
HttpOnly cookies prevent JavaScript access, reducing XSS attack vectors.

---

### 21. What is RBAC and why is it enforced at the route level?

**Answer:**
Role-Based Access Control restricts actions based on user roles. Enforcing it at the API boundary guarantees business rules cannot be bypassed.

---

### 22. Why attach `req.user` in authentication middleware?

**Answer:**
It provides a trusted identity context for downstream logic without re-verifying the token.

---

## 🔹 LEVEL 6 — Data Modeling & Business Safety

### 23. Why use soft deletes instead of hard deletes?

**Answer:**
Soft deletes preserve data for audits, recovery, and analytics, which is critical in real business systems.

---

### 24. Why are slugs preferred over IDs in public URLs?

**Answer:**
Slugs improve SEO, readability, and user trust while keeping internal IDs hidden.

---

### 25. Why default entities to DRAFT instead of PUBLISHED?

**Answer:**
It prevents accidental public exposure and enforces explicit publishing workflows.

---

## 🔹 LEVEL 7 — Validation, Abuse Prevention & Production Safety

### 26. What is mass assignment and how do you prevent it?

**Answer:**
Mass assignment occurs when clients can set unintended fields. It is prevented by whitelisting fields explicitly in controllers.

---

### 27. Why use schema-based validation (Zod)?

**Answer:**
Schemas provide declarative, reusable, and consistent validation rules across the application.

---

### 28. What problem does rate limiting solve?

**Answer:**
It protects against brute force attacks, accidental traffic spikes, and abuse by limiting requests per IP.

---

### 29. Why apply rate limiting at the app level?

**Answer:**
It provides global protection and ensures no route is accidentally left unprotected.

---

### 30. How do you verify rate limiting is working?

**Answer:**
By observing decrementing rate-limit headers and receiving `429 Too Many Requests` after exceeding the limit.

---

## 🔹 LEVEL 8 — Production Mindset & System Thinking

### 31. Why avoid premature abstraction?

**Answer:**
Unnecessary abstractions increase cognitive load and reduce flexibility. Architecture should evolve with real complexity.

---

### 32. How does this project differ from tutorial projects?

**Answer:**
It accumulates constraints, enforces refactoring, documents decisions, and simulates real production trade-offs.

---

### 33. What signals tell an interviewer you are production-minded?

**Answer:**
Clear structure, validation, security layers, documentation, safe defaults, and the ability to explain trade-offs calmly.

---

### 34. What usually breaks first under traffic?

**Answer:**
Database throughput and latency, which is why validation, rate limiting, and indexing are introduced early.

---

### 35. What defines an expert backend engineer over time?

**Answer:**
The ability to reason about systems, anticipate failure modes, document decisions, and evolve architecture responsibly—not just write code.

---
