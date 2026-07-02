export const healthPaths = {
  // ─── GET /health 
  "/health": {
    get: {
      tags: ["Health"],

      operationId: "getHealth",

      summary: "Liveness check",

      description:
        "Returns the current process status, version, and uptime. " +
        "This endpoint does **not** check downstream service connectivity; " +
        "it confirms only that the Node.js process is running. " +
        "Use `GET /readiness` for a full dependency check.\n\n" +
        "Suitable for use as a **liveness probe** in Kubernetes, " +
        "Render, or any other orchestration platform.",

      responses: {
        200: {
          description: "The application process is alive and running.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthResponse",
              },
              example: {
                status: "ok",
                version: "1.0.0",
                uptime: 86403.71,
                environment: "production",
                timestamp: "2026-07-02T10:30:00.000Z",
              },
            },
          },
        },
      },
    },
  },

  // ─── GET /readiness 
  "/readiness": {
    get: {
      tags: ["Health"],

      operationId: "getReadiness",

      summary: "Readiness check",

      description:
        "Verifies that the application is ready to serve traffic by checking " +
        "the connectivity of all critical downstream services:\n\n" +
        "- **MongoDB** — checks `mongoose.connection.readyState === 1`\n" +
        "- **Redis** — checks `redisClient.isReady`\n\n" +
        "Returns `200 OK` when all services are connected and `503 Service Unavailable` " +
        "when any service is not yet ready. " +
        "Use this as a **readiness probe** to prevent traffic from being routed to " +
        "an instance that is still establishing database connections.",

      responses: {
        200: {
          description:
            "All downstream services are connected. Application is ready to serve traffic.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ReadinessResponse",
              },
              example: {
                status: "ready",
                services: {
                  mongodb: true,
                  redis: true,
                },
                uptime: 86403.71,
                timestamp: 1751452200000,
              },
            },
          },
        },

        503: {
          description:
            "One or more downstream services are not yet connected. " +
            "The response body identifies which services are unavailable.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ReadinessResponse",
              },
              example: {
                status: "not_ready",
                services: {
                  mongodb: false,
                  redis: true,
                },
              },
            },
          },
        },
      },
    },
  },
};