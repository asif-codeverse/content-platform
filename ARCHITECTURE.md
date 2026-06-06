# Architecture Overview

This repository is a production-oriented monorepo containing a Next.js frontend and an Express backend.

The system is intentionally designed around software engineering principles rather than tutorial-driven development.

Core architectural priorities:

* Correctness before convenience
* Security before feature velocity
* Explicit trust boundaries
* Deterministic domain behavior
* Reliability under retries and failures
* Separation of concerns
* Horizontal scalability
* Evolvability without architectural rewrites

The objective is to build a system that remains predictable under load, concurrent access, partial failures, retries, and future feature expansion.

---

# Architectural Objectives

The platform guarantees:

* Clear layer separation
* Stateless authentication
* Refresh token rotation
* Route-level RBAC
* Service-level ABAC
* Explicit query validation
* Index-aligned database access
* Redis-backed caching
* HTTP-compliant cache validation
* Safe asynchronous processing
* Structured observability
* Deployment readiness
* SSR-aware frontend integration

---

# Repository Structure

```text
/
├── client/          # Next.js App Router
└── server/          # Express REST API
```

Frontend and backend evolve independently while remaining versioned together.

---

# High-Level System Architecture

```text
                    ┌─────────────────┐
                    │     Browser     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Next.js Client  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express API     │
                    └───────┬─────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌────────────┐   ┌────────────┐   ┌────────────┐
   │   Redis    │   │ MongoDB    │   │ Job System │
   │   Cache    │   │ Source     │   │ Background │
   └────────────┘   │ of Truth   │   │ Processing │
                    └────────────┘   └────────────┘
```

MongoDB remains the source of truth.

Redis serves as a performance layer.

Background jobs execute side effects outside the request lifecycle.

---

# Backend Architecture

The backend follows a layered architecture.

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Persistence
```

Responsibilities are strictly separated.

### Router

Responsible for:

* Route definitions
* Middleware composition
* Request entry points

### Controller

Responsible for:

* Request orchestration
* Input extraction
* Response formatting

Controllers contain no business rules.

### Service

Responsible for:

* Domain logic
* Authorization enforcement
* Validation of business rules
* State transitions

Services own business behavior.

### Persistence

Responsible for:

* Database access
* Query execution
* Data retrieval

Persistence never contains domain rules.

---

# Runtime Flow

```text
Client
 ↓
Rate Limiter
 ↓
Request ID
 ↓
HTTP Logger
 ↓
Authentication
 ↓
Authorization (RBAC)
 ↓
Controller
 ↓
Service (ABAC)
 ↓
Database
 ↓
Response
 ↓
Error Handler
```

Background jobs execute independently of this flow.

---

# Application Bootstrap

## app.js

Responsibilities:

* Express initialization
* Global middleware registration
* Route registration
* Error middleware registration

Does not start the HTTP server.

---

## server.js

Responsibilities:

* Environment validation
* MongoDB connection
* Redis connection
* Worker startup
* HTTP server startup

Startup is fail-fast.

The application does not start unless required dependencies are available.

---

# Authentication

The platform uses stateless JWT authentication.

## Access Token

Properties:

* Short-lived
* Sent via Authorization header
* Required for protected routes
* Stored in frontend memory

Example:

```http
Authorization: Bearer <token>
```

---

## Refresh Token

Properties:

* Long-lived
* Stored in HttpOnly cookie
* Used only for token rotation
* Never used for authorization decisions

Benefits:

* Horizontal scalability
* Reduced XSS exposure
* Stateless API layer

---

## Password Security

Passwords are:

* Hashed using bcrypt
* Never logged
* Never returned in responses

---

# Authorization Model

Authorization is enforced at two layers.

---

## RBAC (Role-Based Access Control)

Applied at route boundaries.

Roles:

```text
USER
EDITOR
ADMIN
```

RBAC prevents unauthorized requests from reaching domain services.

---

## ABAC (Attribute-Based Access Control)

Ownership rules are enforced inside services.

Editors:

* Can modify only their own articles

Admins:

* Can override ownership restrictions

Ownership is verified using database state.

Client-supplied ownership information is never trusted.

---

# Articles Domain

The Articles module represents the primary business domain.

Responsibilities:

* Draft management
* Publishing workflow
* Ownership tracking
* Soft deletion
* Slug generation
* Content retrieval

---

## Domain Guarantees

Default state:

```text
DRAFT
```

Public visibility:

```text
PUBLISHED
```

Deletion strategy:

```text
Soft Delete
```

Slug requirements:

* Unique
* Indexed
* Stable lookup identifier

Timestamps:

* createdAt
* updatedAt

---

# Public vs Administrative Access

## Public Endpoints

```http
GET /articles
GET /articles/:slug
```

Guarantees:

* Published only
* Not deleted
* Cacheable

---

## Administrative Endpoints

```http
GET /articles/all
POST /articles
PATCH /articles/:id
PATCH /articles/:id/publish
DELETE /articles/:id
```

Guarantees:

* Authenticated
* Authorized
* Never cached

---

# Search Module

The Search module enables content discovery.

Endpoint:

```http
GET /search?q=nodejs
```

Responsibilities:

* Full-text search
* Pagination
* Sorting
* Validation

Search operates only on published content.

---

# Query Safety Model

All query parameters are processed through a dedicated parser.

Guarantees:

* Page validation
* Limit caps
* Sort whitelisting
* Controlled filters
* Explicit query construction

Prevents:

* Query injection
* Unbounded queries
* Resource exhaustion
* Index bypass

Raw request query objects are never sent directly to MongoDB.

---

# Database Index Strategy

Indexes align with real query patterns.

---

## Compound Index

```text
status
isDeleted
createdAt
```

Supports:

* Filtering
* Pagination
* Sorting

---

## Slug Index

```text
slug
```

Properties:

* Unique
* Indexed

Supports:

* O(log n) article lookup

---

## Search Index

```text
title
content
```

MongoDB text index used for search functionality.

---

# Redis Caching Layer

Redis acts as a performance optimization layer.

MongoDB remains the source of truth.

---

## Cache Keys

Published article list:

```text
articles:published:page:{page}:limit:{limit}
```

Individual article:

```text
article:{slug}
```

Examples:

```text
article:redis-guide
article:mongodb-basics
```

---

## Cache Flow

```text
Request
 ↓
Redis
 ↓
Hit?
 ├─ Yes → Return Cache
 └─ No
       ↓
    MongoDB
       ↓
    Store Cache
       ↓
    Return Response
```

---

## Cache Invalidation

Triggered when:

* Article updated
* Article published
* Article deleted

Affected cache entries are removed automatically.

This prevents stale content.

---

# HTTP Cache Validation

Public endpoints support conditional requests.

Mechanisms:

```http
Last-Modified
If-Modified-Since
```

Possible response:

```http
304 Not Modified
```

Headers:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

Benefits:

* Reduced bandwidth
* Faster client responses
* Browser cache support

---

# Background Job System

Side effects execute asynchronously.

Domain mutations remain synchronous.

---

## Design Principles

* Side-effect isolation
* Retry safety
* Idempotent execution
* Failure visibility

---

## Structure

```text
jobs/
├── queue.js
├── worker.js
├── jobExecution.model.js
└── handlers/
```

---

## Execution Flow

```text
Controller
 ↓
Enqueue Job
 ↓
Worker
 ↓
Handler
 ↓
Persist Execution State
 ↓
Retry If Needed
```

---

## Guarantees

* Retry support
* Exponential backoff
* Duplicate execution protection
* Failure persistence

---

# Observability

The platform includes structured observability.

---

## Request IDs

Every request receives a unique identifier.

Used for:

* Tracing
* Debugging
* Correlation

---

## Logging

Categories:

### HTTP Logs

```text
Method
Path
Status
Duration
Request ID
```

### Error Logs

```text
Message
Stack
Status
Request ID
```

### Audit Logs

```text
User Login
Article Publish
Article Delete
Article Update
```

---

# Production Hardening

The platform includes production-focused safeguards.

---

## Environment Validation

Environment variables are validated at startup.

Benefits:

* Fail-fast startup
* Misconfiguration detection
* Deployment safety

---

## Graceful Shutdown

Handles:

```text
SIGINT
SIGTERM
```

Ensures:

* Redis disconnection
* MongoDB disconnection
* Clean process termination

---

## Health Checks

Endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "mongodb": "connected",
  "redis": "connected"
}
```

Used by:

* Monitoring
* Deployment checks
* Infrastructure validation

---

# Security Model

The platform follows a defense-in-depth strategy.

Components:

* JWT Authentication
* Refresh Token Rotation
* RBAC
* ABAC
* Input Validation
* Rate Limiting
* Helmet
* CORS
* HttpOnly Cookies
* Password Hashing

---

# Frontend Architecture

Frontend uses Next.js App Router.

---

## Public Pages

```text
Home
Articles
Search
Article Detail
```

---

## Administrative Pages

```text
Dashboard
Create Article
Edit Article
Delete Article
Publish Article
```

---

## Rendering Strategy

Uses:

* Server Components
* Dynamic Routes
* ISR
* SSR

Example:

```text
/articles/[slug]
```

---

## SEO

Features:

* Dynamic metadata
* OpenGraph tags
* Sitemap generation
* Canonical URLs

Metadata generated per article.

---

# CI/CD

GitHub Actions automate quality checks.

Pipeline:

```text
Install Dependencies
Lint
Test
```

Triggers:

```text
Push
Pull Request
```

Benefits:

* Faster feedback
* Reduced regressions
* Deployment confidence

---

# Deployment Architecture

Frontend:

```text
Vercel
```

Backend:

```text
AWS EC2
```

Database:

```text
MongoDB Atlas
```

Cache:

```text
Redis
```

Architecture:

```text
Vercel
   │
   ▼
AWS Backend
   │
 ┌─┴─────────┐
 ▼           ▼
MongoDB     Redis
Atlas
```

---

# Failure Model Awareness

The system explicitly accounts for:

* Database outages
* Redis outages
* Token expiration
* Duplicate job execution
* Retry exhaustion
* Unauthorized access
* Invalid query parameters
* Invalid slugs
* Invalid headers

Failures are:

* Logged
* Sanitized
* Surfaced safely

---

# Trust Boundaries

Trusted:

```text
req.user
```

Only after JWT verification.

---

Untrusted:

```text
req.body
req.query
req.params
client headers
client role claims
```

All untrusted data is validated before use.

---

# System Characteristics

The platform is:

* Stateless
* Ownership-aware
* Role-aware
* Cache-aware
* Retry-safe
* Index-aligned
* SEO-aware
* Horizontally scalable
* Side-effect isolated
* Production-oriented

---

# Architectural Intent

This architecture is designed to:

* Demonstrate production reasoning
* Remain interview-defensible
* Scale safely
* Support future growth
* Prevent cross-layer leakage
* Minimize accidental exposure
* Avoid costly architectural rewrites

It favors:

* Clarity
* Correctness
* Security
* Reliability
* Explicitness
* Maintainability

over implementation speed.
