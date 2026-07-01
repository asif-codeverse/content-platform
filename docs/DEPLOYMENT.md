# Comprehensive Deployment Guide

## Overview

Deploying the Content Platform requires orchestrating a decoupled, distributed system. The architecture separates the highly interactive Next.js presentation layer from the secure, state-managing Express.js backend. 

Because the backend relies heavily on ephemeral storage (Redis) for caching and background queueing, and persistent storage (MongoDB Atlas) for canonical state, the deployment strategy must account for secure network boundaries, correct environment injection, and highly available service providers.

This document serves as the definitive manual for deploying the Content Platform to production seamlessly.

---

## Production Infrastructure

The platform uses managed PaaS (Platform as a Service) providers to maximize developer velocity and minimize infrastructure maintenance overhead.

| Component | Responsibility | Recommended Service |
|-----------|----------------|---------------------|
| **Frontend** | Static asset delivery, Edge caching, Server-Side Rendering (SSR). | Vercel |
| **Backend API** | Node.js Express server execution, RESTful endpoints, worker jobs. | Render |
| **Database** | Persistent storage of users, articles, and job execution states. | MongoDB Atlas |
| **Cache Layer** | In-memory key-value store for API response caching. | Redis Cloud |
| **Image Storage** | Global CDN distribution and dynamic image transformation. | Cloudinary |
| **Email Delivery** | Transactional email dispatch for OTPs and notifications. | Brevo |
| **CI/CD** | Automated linting, integration testing, and Docker image validation. | GitHub Actions |

---

## Deployment Architecture

The following diagram illustrates the topological traffic flow and service integrations in production.

```mermaid
flowchart TD
    Browser[Client Browser / Mobile]
    
    subgraph Vercel
        Frontend[Next.js SSR Frontend]
    end

    subgraph Render
        Backend[Express REST API Container]
    end

    subgraph External Infrastructure
        Mongo[(MongoDB Atlas Cluster)]
        Redis[(Redis Cloud)]
        Cloudinary[Cloudinary Media CDN]
        Brevo[Brevo Transactional API]
    end

    Browser -->|HTTPS Request| Frontend
    Frontend -->|Server-Side API Fetch| Backend
    Browser -.->|Client-Side Hydration API Fetch| Backend
    
    Backend <-->|Mongoose ODM (TCP)| Mongo
    Backend <-->|Cache Hit/Miss (TCP)| Redis
    Backend -->|Upload Image Buffers| Cloudinary
    Backend -->|Dispatch OTP Payloads| Brevo
```

---

## Prerequisites

Before beginning the deployment sequence, ensure you possess the following:

### Required Accounts
- Vercel (connected to your GitHub repository)
- Render (for backend hosting)
- MongoDB Atlas (Shared or Dedicated cluster)
- Redis Cloud (or alternative hosted Redis provider)
- Cloudinary (for media assets)
- Brevo (for transactional SMTP/API)

### Local CLI Tools
- `node` (v18.x or v20.x)
- `git`
- `docker` and `docker-compose` (if deploying via containers)

---

## Environment Variables

The system relies strictly on environment variables to maintain environment parity. **Never commit `.env` files to version control.**

### Server Environment (`server/.env`)

These variables must be injected directly into your Render dashboard or Docker container runtime.

| Variable | Description | Example |
|---|---|---|
| `PORT` | The internal port the Express server binds to. | `5001` |
| `NODE_ENV` | Must be explicitly set to disable development logging. | `production` |
| `MONGODB_URI` | The connection string for MongoDB Atlas. | `mongodb+srv://user:pass@cluster.mongodb.net/platform` |
| `REDIS_URL` | The connection string for the Redis cache. | `redis://default:pass@redis-cloud-url:6379` |
| `CLIENT_URL` | Used to configure strict CORS boundaries. | `https://content-platform-v1.vercel.app` |
| `JWT_ACCESS_SECRET` | Cryptographic signing secret for short-lived tokens. | `a_highly_secure_random_string` |
| `JWT_REFRESH_SECRET` | Cryptographic signing secret for HTTP-Only refresh cookies. | `another_highly_secure_string` |
| `ACCESS_TOKEN_EXPIRES_IN` | Validity duration of the access token. | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN`| Validity duration of the refresh token. | `7d` |
| `BREVO_API_KEY` | Transactional email API key. | `xkeysib-abc123def456...` |
| `EMAIL_FROM` | Verified sender email address in Brevo. | `noreply@yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account identifier. | `my_cloud_name` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. | `abcdefghijklmnopqrstuvwxyz` |

### Client Environment (`client/.env.local`)

These variables are required by Vercel during the build process to bake the backend URL into the client bundles.

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | The fully qualified public URL to your deployed Render backend API. | `https://content-platform-api-8ars.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | The primary domain of your Vercel frontend for canonical links. | `https://content-platform-v1.vercel.app` |

---

## Backend Deployment (Render)

The backend is a standard Node.js Express application. Render provides seamless integration with GitHub for automated deployments.

### Configuration
1. Create a new **Web Service** in Render.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm ci --omit=dev`
   - **Start Command**: `npm start`
4. Expand the **Environment Variables** section and meticulously copy all variables from the Server Environment table above.

### Verification
Once Render marks the service as `Live`, navigate to your deployment URL:
```bash
curl https://your-render-url.onrender.com/api/v1/health
```
You should receive a `200 OK` response with `status: "ok"`.

---

## Frontend Deployment (Vercel)

Vercel provides native, zero-configuration support for Next.js applications, automatically optimizing image delivery and Edge caching.

### Configuration
1. Import your GitHub repository into Vercel.
2. Open the **Framework Preset** dropdown and ensure `Next.js` is selected.
3. Set the **Root Directory** to `client`.
4. The Build command (`next build`) and Output Directory (`.next`) are handled automatically.
5. In the **Environment Variables** section, add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`.

### Verification
Once Vercel completes the build, navigate to your public URL. The frontend should load without hydration errors, and you should be able to navigate to the `/login` route.

---

## Alternative: Docker Deployment

For teams utilizing custom VPS infrastructure (e.g., AWS EC2, DigitalOcean Droplets), the repository provides highly optimized, multi-stage Dockerfiles and a `docker-compose.prod.yml` orchestrator.

### The Build Process
The client Dockerfile uses a multi-stage `deps` -> `builder` -> `runner` architecture. It leverages Next.js standalone output to minimize the final image size dramatically.

### Deployment Steps
1. Transfer the repository to your production server.
2. Create `server/.env` and `client/.env.local` files explicitly.
3. Build the specific images:
   ```bash
   docker build -t content-platform-api:latest ./server
   
   # Note: The client build requires the API URL injected at build-time.
   docker build \
     --build-arg NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1 \
     -t content-platform-client:latest ./client
   ```
4. Start the stack in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## Database Integration (MongoDB Atlas)

### Connection
Ensure your `MONGODB_URI` string includes the database name: `mongodb+srv://user:pass@cluster.mongodb.net/content-platform?retryWrites=true&w=majority`.

### Network Security
By default, Atlas rejects incoming connections. 
1. Navigate to **Network Access** in the Atlas dashboard.
2. If deploying to Render, you must whitelist Render's static outbound IP addresses. If your PaaS does not offer static IPs, you must allow `0.0.0.0/0` (Anywhere) and rely strictly on your highly secure, randomly generated MongoDB password.

### Verification
The `/api/v1/health` endpoint explicitly checks the `mongoose.connection.readyState`. If it returns `"mongodb": "connected"`, your network boundary is secure.

---

## Redis Integration

Redis handles aggressive caching for read-heavy operations like paginated article lists.

### Configuration
When using Redis Cloud, ensure you copy the **Public Endpoint** and the **Default User Password**. Format it as:
`redis://default:YOUR_PASSWORD@redis-endpoint:PORT`

### Operational Note
Ensure your Redis instance is configured with an `allkeys-lru` eviction policy. If the cache fills up during a traffic spike, Redis will automatically evict the oldest cached articles to make room for new ones, preventing an Out of Memory (OOM) crash.

---

## Cloudinary Integration

Cloudinary handles the resizing and delivery of rich text editor images.

### Configuration
The Cloudinary integration requires three keys. Do not mistake the `API Environment variable` string provided by Cloudinary for the individual keys. You must separate the Cloud Name, API Key, and API Secret into their respective variables.

### Verification
To verify Cloudinary in production, log in to the Content Platform as an `EDITOR`, draft an article, and attempt to upload a PNG file into the TipTap editor. If successful, inspect the image URL; it should point to `res.cloudinary.com`.

---

## Email Integration (Brevo)

Transactional emails are required for onboarding (OTP verification) and account recovery.

### Configuration
The backend utilizes the native `api.brevo.com/v3/smtp/email` REST endpoint via Axios. 
1. Generate an API Key in the Brevo dashboard under **SMTP & API**.
2. **Sender Identity**: The email address you provide in the `EMAIL_FROM` environment variable **must** be verified in Brevo. If you attempt to send an email from an unverified domain, Brevo will silently drop the request.

### Deliverability
Ensure you have configured the SPF, DKIM, and DMARC DNS records provided by Brevo. Without these, your OTP emails will land strictly in users' spam folders.

---

## CI/CD Pipeline

The repository utilizes GitHub Actions to automate quality assurance before deployment.

- `frontend-ci.yml`: Executes `npm run build` inside the `client` directory to catch React compilation and TypeScript errors.
- `backend-ci.yml`: Executes the Jest integration test suite (`npm run test`) to validate the Express routing, Zod validation, and Mongoose business logic.
- `docker-ci.yml`: Validates that both the client and server Dockerfiles can successfully compile images without failing on layer instructions.

Render and Vercel are configured to trigger deployments automatically *only* if the `main` branch is updated and these CI pipelines pass.

---

## Post-Deployment Verification

Execute this checklist immediately after the deployment pipeline resolves successfully.

### Infrastructure Checks
- [ ] Render API is marked as `Live`.
- [ ] Vercel deployment completes without Next.js build errors.
- [ ] The `https://your-api.com/api/v1/health` endpoint returns a 200 OK.

### Application Workflows
- [ ] **Authentication**: Register a new user and receive the Brevo OTP email.
- [ ] **Authentication**: Successfully log in and verify the `refreshToken` HttpOnly cookie is set in the browser's Application tab.
- [ ] **Dashboard**: Verify the dashboard loads without 401/403 errors.
- [ ] **Image Upload**: Upload an image inside the Rich Text Editor.
- [ ] **Articles**: Submit an article for review.
- [ ] **Articles**: Log in as an `ADMIN` and successfully publish the article.
- [ ] **Search**: Search for the newly published article and ensure it returns in the results.
- [ ] **Caching**: Refresh the public feed multiple times and verify latency drops significantly (Redis cache hit).

---

## Rollback Strategy

Deployments occasionally fail or introduce regressions. 

### Automated Rollback via PaaS
Both Vercel and Render support instantaneous immutable rollbacks.
1. **Vercel**: Navigate to the **Deployments** tab, locate the previous stable build, click the vertical ellipses, and select **Promote to Production**. This instantly points the CDN to the previous artifact.
2. **Render**: Navigate to the **Events** tab, find the previous successful deploy, and click **Rollback to this deploy**.

### Manual Database Rollback
If a deployment involved a destructive database migration (which should be exceedingly rare), automated rollbacks will not fix corrupted data. You must log into MongoDB Atlas and utilize the **Point-in-Time Recovery** feature to restore the cluster state to precisely before the deployment window.

---

## Monitoring and Observability

### Logging
The backend utilizes Winston for structured JSON logging. Render captures `stdout` natively. Navigate to the **Logs** tab in Render to view real-time request lifecycles. Ensure you are searching for specific `requestId` hashes to trace errors sequentially.

### Application Monitoring
Routinely monitor the `/api/v1/health` endpoint using a tool like UptimeRobot or Datadog to ensure the application layer can successfully communicate with MongoDB and Redis.

---

## Troubleshooting Guide

### 1. CORS Errors on the Frontend
**Symptom**: The browser console shows `Cross-Origin Request Blocked`.
**Resolution**: Ensure the `CLIENT_URL` environment variable on Render exactly matches the Vercel domain (including `https://` and absolutely no trailing slash).

### 2. Users Are Logged Out Immediately
**Symptom**: Logging in succeeds, but navigating to `/dashboard` immediately redirects to login.
**Resolution**: The `NEXT_PUBLIC_API_URL` in Vercel is likely pointing to the wrong domain. Furthermore, ensure Render is running over HTTPS, as the `Secure` flag on the HTTP-Only refresh cookie will prevent it from being set on an insecure connection.

### 3. Emails Are Not Arriving
**Symptom**: The user requests an OTP, the server responds 200 OK, but no email arrives.
**Resolution**: Check the Brevo **Transactional Logs** dashboard. If it says "Blocked" or "Soft Bounce", verify that your `EMAIL_FROM` variable matches a domain you have authenticated within Brevo's sender identities.

### 4. Search Returns No Results
**Symptom**: The database has articles, but the search endpoint returns an empty array.
**Resolution**: The MongoDB text index may not have built properly. Manually connect to the database and verify the `{ title: "text", content: "text" }` index exists on the `articles` collection.

---

## Production Best Practices

To maintain a secure and reliable platform over time, adhere to the following operational standards:

1. **Strict Environment Separation**: Never reuse the production MongoDB cluster or Redis cache for local development. Always use `mongodb-memory-server` for testing and local instances for development.
2. **Secret Management**: Periodically rotate the `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Note that doing so will instantly invalidate all active user sessions globally, requiring all users to log back in.
3. **Database Backups**: Rely on MongoDB Atlas automated backups. Ensure your backup retention policy aligns with your organizational compliance requirements.
4. **Deployment Verification**: Never skip the Post-Deployment Verification checklist. Automated tests cannot catch infrastructural edge cases (like an expired Brevo API key).
