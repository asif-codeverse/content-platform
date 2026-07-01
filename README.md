# Content Platform

A production-ready full-stack publishing platform where editors can create rich articles, administrators review and publish content, readers discover articles through search, and the platform handles authentication, caching, background jobs, and email verification.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![License](https://img.shields.io/badge/License-MIT-blue)

A production-oriented content publishing platform built with Next.js, Express.js, MongoDB, and Redis.

The platform provides secure authentication, role-based access control, article publishing workflows, Redis-powered caching, full-text search, background job processing, SEO optimization, and production-ready architecture.

---

✨ Highlights

• Rich Text Editor (TipTap)
• Email Verification
• Password Reset via Email
• Image Uploads (Cloudinary)
• Role-Based Dashboard
• Article Review Workflow
• Redis Caching
• Full-Text Search
• Background Jobs
• SEO Optimized
• Dark Mode
• Responsive UI

---


[Live Demo](https://your-domain.com)

Frontend:
https://your-frontend-domain.com

Backend API:
https://your-backend-domain.com

Swagger Docs:
https://your-backend-domain.com/docs

Repository:
https://github.com/asif-codeverse/content-platform

---

## Screenshots

Home Page
[placeholder]

Public Articles
[placeholder]

Article Details
[placeholder]

Search
[placeholder]

Login
[placeholder]

Register
[placeholder]

Email Verification
[placeholder]

Editor Dashboard
[placeholder]

Rich Text Editor
[placeholder]

Pending Reviews
[placeholder]

Admin Dashboard
[placeholder]

Swagger Docs
[placeholder]
---




## Features

### Authentication & Authorization

* JWT Access Tokens
* Refresh Token Rotation
* HttpOnly Refresh Cookies
* Role-Based Access Control (RBAC)
* Attribute-Based Access Control (ABAC)
* Secure Password Hashing with bcrypt
✔ Registration
✔ Email Verification
✔ Password Reset
✔ Refresh Token Rotation
✔ JWT Authentication

### Content Management

* Create Articles
* Edit Articles
* Publish Articles
* Soft Delete Articles
* Slug-Based Routing
* Draft & Published States
* ✔ Rich Text Editor
✔ Image Upload
✔ Draft Workflow
✔ Pending Review
✔ Publish / Reject
✔ Slug URLs
✔ View Counter

### Search

* MongoDB Full-Text Search
* Search Pagination
* Redis Search Caching
* ✔ MongoDB Full Text Search
✔ Pagination
✔ Cached Search

### Performance

* Redis Cache Layer
* Article List Caching
* Individual Article Caching
* Search Result Caching
* HTTP Cache Validation
* 304 Not Modified Support

### Background Processing

* Job Queue System
* Worker Processing
* Retry Support
* Article Publication Jobs

### Security

* JWT Authentication
* Refresh Token Rotation
* RBAC + ABAC Authorization
* Helmet Security Headers
* Rate Limiting
* Input Validation
* Secure Cookie Handling

### SEO

* Dynamic Metadata Generation
* Sitemap Generation
* robots.txt Generation
* SEO-Friendly URLs
* Dynamic Article Metadata

### Observability

* Structured Logging
* Request Correlation IDs
* Audit Logs
* Error Tracking

### Testing

* Integration Testing
* Authentication Testing
* RBAC Testing
* Publishing Workflow Testing
* Ownership Validation Testing

---

# Tech Stack

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* App Router
* Next.js 16
React 19
TypeScript
Tailwind CSS v4
TipTap
Framer Motion
Axios
React Hook Form

## Backend

* Express.js
* Node.js
* MongoDB
* Mongoose
* Redis
* Express
MongoDB
Redis
JWT
Zod
Cloudinary
Resend
Winston

## Infrastructure

* MongoDB Atlas
* Redis
* GitHub Actions
* ✔ Redis
✔ Cloudinary
✔ Render Deployment
✔ Vercel Deployment
✔ GitHub Actions

## Testing

* Jest
* Supertest

---

# Architecture

```text
Browser
      │
      ▼
Next.js Frontend
      │
      ▼
Express REST API
      │
 ┌────┴──────────┐
 ▼               ▼
MongoDB       Redis
Atlas         Cache
 │
 ▼
Cloudinary

 │
 ▼
Email Provider

 │
 ▼
Background Worker
```

---

# Repository Structure

```text
content-platform/
.
├── client/
│   ├── app/
│   │   ├── articles/
│   │   ├── dashboard/
│   │   │   ├── create/
│   │   │   ├── edit/
│   │   │   ├── manage/
│   │   │   ├── my/
│   │   │   ├── pending/
│   │   │   └── users/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   ├── search/
│   │   └── verify-email/
│   ├── components/
│   │   ├── articles/
│   │   ├── dashboard/
│   │   ├── editor/
│   │   ├── motion/
│   │   ├── search/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── services/
│   └── types/
├── docs/
└── server/
    ├── __tests__
    ├── scripts
    ├── src
    │   ├── config
    │   ├── docs
    │   ├── jobs
    │   │   └── handlers
    │   ├── middlewares
    │   ├── modules
    │   │   ├── articles
    │   │   ├── auth
    │   │   ├── search
    │   │   ├── upload
    │   │   └── users
    │   ├── routes
    │   ├── services
    │   └── utils
    └── test-utils
```

---

# Authentication Flow

```text
Register

↓

Email Verification

↓

Login

↓

Access Token

↓

Protected APIs

↓

Refresh Token Rotation

↓

Logout
```
# Article Workflow
Editor

↓

Create Draft

↓

Submit

↓

Pending Review

↓

Admin Review

↓

Publish

↓

Readers

# Deployment

Frontend
Vercel

Backend
Render

Database
MongoDB Atlas

Cache
Redis Cloud

Media
Cloudinary

Email
Resend

CI
GitHub Actions


---

# Authorization Model

## Roles

### USER

* Read published articles

### EDITOR

* Create articles
* Edit own articles

### ADMIN

* Full platform access
* Publish articles
* Delete articles
* Manage content

---

# API Documentation

Swagger UI:

```text
http://localhost:5001/docs
```

Major API Groups:

| Module   | Description                                         |
| -------- | --------------------------------------------------- |
| Auth     | Register, Login, Email Verification, Password Reset |
| Articles | CRUD, Publish, Delete                               |
| Upload   | Cloudinary uploads                                  |
| Search   | Full Text Search                                    |
| Users    | Admin User Management                               |
| Health   | Health endpoints                                    |

```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd content-platform
```

## Install Dependencies

Root:

```bash
npm install
```

Client:

```bash
cd client
npm install
```

Server:

```bash
cd server
npm install
```

---

# Environment Variables

## Server

Create:

```env
PORT

NODE_ENV

MONGODB_URI

REDIS_URL

JWT_ACCESS_SECRET

JWT_REFRESH_SECRET

ACCESS_TOKEN_EXPIRES_IN

REFRESH_TOKEN_EXPIRES_IN

EMAIL_FROM

BREVO_API_KEY

CLIENT_URL

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET
```

## Client

Create:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

---

# Running Locally

## Development

```bash
npm run dev
```

Starts:

```text
Client : localhost:3000
Server : localhost:5001
```

## Production Build

Frontend

```bash
cd client

npm run build
npm run start
```

Backend

```bash
cd server

npm start
```

---

# Search

Example:

```http
GET /api/v1/search?q=redis
```

Supports:

* Full-text search
* Pagination
* Redis caching

---

# Caching Strategy

## Article List

```text
articles:published:page:{page}:limit:{limit}
```

## Single Article

```text
article:{slug}
```

## Search

```text
search:{query}:page:{page}:limit:{limit}
```

Cache invalidation occurs automatically when content changes.

---

# Testing

Run:

```bash
npm test
```

Coverage includes:

* Authentication
* Authorization
* Publishing Workflow
* Search
* Ownership Rules
* Authentication

Registration

RBAC

Publishing

Search

Ownership Rules

Protected Routes

---

# Health Check

```http
GET /api/v1/health
```

Returns:

```json
{
  "status": "ok",
  "mongodb": "connected",
  "redis": "connected"
}
```

---

# CI/CD

GitHub Actions automatically verifies:
Backend CI

Frontend Build

Docker Validation


---

# Future Roadmap

Google OAuth

Bookmarks

Comments

Notifications

Article Analytics

Reading History

Multi-language

AI Recommendations

---
# Performance

Redis caching

HTTP 304

ETags

Background jobs

Lazy loading

Optimized images

Server-side rendering

Pagination

# Security Section
Helmet

Rate Limiting

JWT

Refresh Token Rotation

Password Hashing

Input Validation

Secure Cookies

RBAC

ABAC

# Production Principles

The project is designed around:

* Security First
* Explicit Trust Boundaries
* Stateless Authentication
* Cache-Aware Design
* Reliability Under Failure
* Clear Separation of Concerns
* Scalable Architecture
* Production-Oriented Engineering

---

# License

MIT License

# Built by

Asif

GitHub:
https://github.com/asif-codeverse

LinkedIn:
<placeholder>

# badges
GitHub Actions

Vercel

Render

MIT

Node

Next

MongoDB

Redis

Express

React

TypeScript



Frontend production URL (Vercel). : https://content-platform-v1.vercel.app/
Backend production URL (Render). : https://content-platform-api-8ars.onrender.com/
Redis provider (Redis Cloud or Upstash?). redis cloud
Email provider: brevo api thing
Your LinkedIn URL : https://www.linkedin.com/in/mohd-asif-011805tz/
Around 10–12 screenshots (keep paths like i have folder screenshot just need to add all screenshots there , assume file is exact what you need like dashboard.jpeg home.jpeg admindshboard.jpeg userdashboard.jpeg).

