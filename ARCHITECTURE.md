# Architecture Overview

This project is a monorepo containing a client and server.

## Server
- Express-based REST API
- app.js handles middleware and routes
- server.js handles server startup
- Centralized error handling
- Health endpoint for monitoring

## Request Flow
Client → Express Router → Controller (future) → Service (future) → Response  
Errors bubble to centralized error middleware.

## Design Principles
- Separation of concerns
- No business logic in routes
- Environment config centralized
- Production-first structure
