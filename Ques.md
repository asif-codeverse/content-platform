# 🧠 Backend / MERN Engineering Questions (Foundational → Advanced)

---

## 🔹 LEVEL 1 — Core Node & Express Fundamentals

### 1. Why do we separate `app.js` and `server.js`?

**Answer:**
`app.js` configures the Express application (middlewares, routes), while `server.js` is responsible for starting the HTTP server. This separation allows easier testing, reuse of the app instance, and better control over server lifecycle (graceful shutdown, clustering).

---

### 2. Why is everything placed inside `src/`?

**Answer:**
`src/` isolates application source code from environment, tooling, and generated files. This enables clean builds, safer deployments, and easy introduction of transpilation or bundling in the future.

---

### 3. What is the purpose of `ARCHITECTURE.md`?

**Answer:**
It documents how the system is designed and why certain architectural decisions were made. It helps onboarding, long-term maintenance, and interview explanations. Code explains *what* happens; architecture explains *why*.

---

### 4. What problem does Express Router solve?

**Answer:**
It modularizes route definitions, prevents route sprawl in `app.js`, enables feature isolation, and supports clean versioning (`/api/v1`, `/api/v2`).

---

### 5. Why is `error.middleware.js` registered last?

**Answer:**
Express processes middleware in order. The error handler must be last to catch errors thrown or passed via `next(err)` from previous middleware and routes.

---

## 🔹 LEVEL 2 — Clean Architecture & Design Thinking

### 6. Why not put business logic directly in routes?

**Answer:**
Routes should only map URLs to handlers. Business logic belongs in services so it can be reused, tested independently, and decoupled from HTTP concerns.

---

### 7. When should you introduce controllers?

**Answer:**
Controllers should be introduced when route logic becomes non-trivial. Abstractions exist to manage complexity, not to look clean. On Day 1, controllers add no value.

---

### 8. What is separation of concerns in backend systems?

**Answer:**
Each layer has a single responsibility: routing, request handling, business logic, data access. This reduces coupling, improves testability, and supports scaling teams.

---

### 9. Why centralize environment configuration?

**Answer:**
To avoid scattered `process.env` usage, prevent silent runtime bugs, and enforce validation and defaults in one place.

---

### 10. Why is flat folder structure a red flag in production systems?

**Answer:**
It does not scale, makes ownership unclear, and leads to bloated files. Feature-based structures scale better with team size and complexity.

---

## 🔹 LEVEL 3 — Node.js & Module System (Critical)

### 11. Why add `"type": "module"` in `package.json`?

**Answer:**
It tells Node.js to treat `.js` files as ES modules, enabling `import/export`. Without it, Node assumes CommonJS and throws syntax errors.

---

### 12. Why must file extensions be included in ES module imports?

**Answer:**
ESM follows browser-like resolution rules. Node does not auto-resolve extensions in ESM mode, so `.js` must be explicit.

---

### 13. CommonJS vs ES Modules — when does mixing cause problems?

**Answer:**
Mixing causes issues in imports, default exports, tooling compatibility, and future migration. Production teams standardize on one system to avoid subtle runtime bugs.

---

## 🔹 LEVEL 4 — HTTP & Request Lifecycle

### 14. Describe the full request lifecycle in your app.

**Answer:**
Client → Express app → global middleware → router → controller (future) → service → response → error middleware (if any).

---

### 15. What is a health check endpoint and why is it important?

**Answer:**
It allows load balancers, monitoring tools, and orchestration systems to verify that the service is alive and responsive.

---

### 16. Why should error responses be consistent?

**Answer:**
Consistency simplifies frontend handling, debugging, monitoring, and prevents accidental data leaks.

---

## 🔹 LEVEL 5 — Production Readiness Mindset

### 17. Why avoid premature abstraction?

**Answer:**
Abstractions add cognitive load and rigidity. They should be introduced only when complexity justifies them, otherwise they slow development and increase bugs.

---

### 18. What is technical debt and how does this plan address it?

**Answer:**
Technical debt is the cost of suboptimal decisions. This plan forces incremental evolution, refactoring, and documentation to manage debt consciously.

---

### 19. How does this project differ from a tutorial project?

**Answer:**
It evolves over time, accumulates constraints, forces refactoring, and simulates real production decision-making instead of greenfield demos.

---

### 20. What signals tell an interviewer you are production-minded?

**Answer:**
Clear folder structure, separation of concerns, documentation, error handling, thoughtful trade-offs, and ability to explain decisions calmly.

---

## 🔹 LEVEL 6 — Advanced System Thinking (Preview)

### 21. What breaks first under high traffic?

**Answer:**
Database read throughput and response latency. This is why caching and indexing are introduced early.

---

### 22. Why is feature-based modularization important for scaling teams?

**Answer:**
It enables parallel work, clear ownership, and easier extraction into services if needed.

---

### 23. Why document trade-offs instead of pretending perfection?

**Answer:**
Every system has limitations. Acknowledging them shows maturity and helps future engineers make informed decisions.

---

### 24. How would you explain your backend architecture to a non-developer?

**Answer:**
Use simple flow-based explanations focusing on responsibilities, not code details.

---

### 25. What makes someone an “expert engineer” over time?

**Answer:**
Ability to reason about systems, anticipate failures, document decisions, and evolve architecture responsibly—not just write code.

---
