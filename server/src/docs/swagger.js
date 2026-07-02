import { articlePaths } from "./path/article.paths.js";
import { authPaths } from "./path/auth.paths.js";
import { healthPaths } from "./path/health.paths.js";
import { searchPaths } from "./path/search.paths.js";
import { uploadPaths } from "./path/upload.paths.js";
import { userPaths } from "./path/user.paths.js";

import { components } from "./components.js";
import { tags } from "./tags.js";
import { servers } from "./servers.js";

export const swaggerSpec = {
  openapi: "3.0.3",

  info: {
    title: "Content Platform API",
    version: "1.0.0",

    description: `
Production-ready Content Management Platform API.

## Features

- JWT Authentication
- Refresh Token Rotation
- Role-Based Access Control (RBAC)
- Article Publishing Workflow
- Editorial Review System
- Redis Caching
- Full-Text Search
- Image Uploads
- Email Verification (OTP)
- Password Reset (OTP)
- Request Validation
- Rate Limiting
- Security Headers
- Structured Logging

### Authentication

Authenticate using the **Authorize** button.

Paste **only** the JWT access token.

Example:

\`\`\`
eyJhbGciOiJIUzI1NiIs...
\`\`\`

Do **not** include:

\`\`\`
Bearer eyJ...
\`\`\`
`,
    contact: {
      name: "Asif",
      url: "https://github.com/asif-codeverse",
    },

    license: {
      name: "MIT",
    },
  },

  servers,

  tags,

  components,

  security: [
    {
      bearerAuth: [],
    },
  ],

  paths: {
    ...healthPaths,
    ...authPaths,
    ...articlePaths,
    ...searchPaths,
    ...uploadPaths,
    ...userPaths,
  },
};