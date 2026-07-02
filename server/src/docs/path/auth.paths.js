
export const authPaths = {
  // ─── POST /auth/register 
  "/auth/register": {
    post: {
      tags: ["Authentication"],

      operationId: "registerUser",

      summary: "Register a new user account",

      description:
        "Creates a new user account and sends a **6-digit email verification OTP** " +
        "to the provided address via Brevo (Sendinblue).\n\n" +
        "**Behaviour for duplicate registrations:**\n" +
        "- If the email belongs to an already-verified account → `409 Conflict`.\n" +
        "- If the email exists but is **not yet verified** and the last OTP was sent " +
        "  less than 60 seconds ago → `429 Too Many Requests`.\n" +
        "- If the email exists but is unverified and the cooldown has passed → " +
        "  a new OTP is generated and the existing account is updated.\n\n" +
        "OTPs expire after **10 minutes**. Use `POST /auth/verify-email` to activate " +
        "the account, or `POST /auth/resend-verification` to request a new OTP.",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
            examples: {
              newUser: {
                summary: "Typical new user registration",
                value: {
                  name: "Amara Okafor",
                  email: "amara.okafor@example.com",
                  password: "SecurePass@2026",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description:
            "Account created successfully. A verification OTP has been sent to the email address.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "Verification OTP sent to your email",
                email: "amara.okafor@example.com",
              },
            },
          },
        },

        409: {
          description: "The email address is already associated with a verified account.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "User already exists",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        429: {
          description:
            "OTP was requested too recently. Wait at least 60 seconds before requesting another.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Please wait before requesting another OTP",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        500: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/verify-email 
  "/auth/verify-email": {
    post: {
      tags: ["Authentication"],

      operationId: "verifyEmail",

      summary: "Verify email address with OTP",

      description:
        "Verifies a user's email address using the 6-digit OTP that was sent " +
        "during registration or via `POST /auth/resend-verification`.\n\n" +
        "Upon successful verification, `emailVerified` is set to `true` and the " +
        "OTP fields are cleared. The user can then log in via `POST /auth/login`.\n\n" +
        "**Error cases:**\n" +
        "- OTP already expired (older than 10 minutes) → `400 Bad Request`\n" +
        "- OTP does not match the stored hash → `400 Bad Request`\n" +
        "- Email is already verified → `400 Bad Request`\n" +
        "- User not found → `404 Not Found`",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/VerifyOtpRequest",
            },
            examples: {
              verifyEmail: {
                summary: "Submit the OTP received by email",
                value: {
                  email: "amara.okafor@example.com",
                  otp: "483927",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Email verified successfully. The account is now active.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "Email verified successfully",
              },
            },
          },
        },

        400: {
          description: "OTP is invalid, expired, or the email is already verified.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                expired: {
                  summary: "OTP has expired",
                  value: {
                    success: false,
                    message: "OTP expired",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
                invalid: {
                  summary: "OTP does not match",
                  value: {
                    success: false,
                    message: "Invalid OTP",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
                alreadyVerified: {
                  summary: "Email already verified",
                  value: {
                    success: false,
                    message: "Email already verified",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
              },
            },
          },
        },

        404: {
          description: "No user found with the provided email address.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "User not found",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/resend-verification 
  "/auth/resend-verification": {
    post: {
      tags: ["Authentication"],

      operationId: "resendVerificationOtp",

      summary: "Resend email verification OTP",

      description:
        "Generates and sends a new email verification OTP to an unverified account.\n\n" +
        "**Cooldown:** A minimum of **60 seconds** must elapse between OTP requests. " +
        "Requests within the cooldown window return `429 Too Many Requests`.\n\n" +
        "**Error cases:**\n" +
        "- User not found → `404 Not Found`\n" +
        "- Email already verified → `400 Bad Request`\n" +
        "- Within cooldown window → `429 Too Many Requests`",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EmailRequest",
            },
            example: {
              email: "amara.okafor@example.com",
            },
          },
        },
      },

      responses: {
        200: {
          description: "A new OTP has been sent to the email address.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "OTP sent successfully",
              },
            },
          },
        },

        400: {
          description: "The email address has already been verified.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Email already verified",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        404: {
          description: "No account found with the provided email address.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "User not found",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        429: {
          description: "OTP requested too soon. Wait 60 seconds before trying again.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Please wait before requesting another OTP",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/login 
  "/auth/login": {
    post: {
      tags: ["Authentication"],

      operationId: "loginUser",

      summary: "Authenticate and obtain tokens",

      description:
        "Authenticates a user with email and password. Returns a short-lived " +
        "**access token** in the JSON response body and sets a long-lived **refresh token** " +
        "as an `httpOnly`, `SameSite=None`, `Secure` cookie (valid for 7 days).\n\n" +
        "**Access token lifetime** is controlled by the `ACCESS_TOKEN_EXPIRES_IN` " +
        "environment variable (e.g. `15m`).\n\n" +
        "**Error cases:**\n" +
        "- Invalid email or password → `401 Unauthorized` *(intentionally generic to prevent user enumeration)*\n" +
        "- Email not yet verified → `403 Forbidden` with `verificationRequired: true`",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
            example: {
              email: "amara.okafor@example.com",
              password: "SecurePass@2026",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Login successful. Access token returned in body; refresh token set as an httpOnly cookie.",
          headers: {
            "Set-Cookie": {
              description:
                "`refreshToken=<jwt>; HttpOnly; Secure; SameSite=None; Max-Age=604800`",
              schema: {
                type: "string",
              },
            },
          },
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginResponse",
              },
              example: {
                message: "Logged in",
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1YzFmOGQzNGY5ZjFlOWU5YjEyMzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxOTkwMjAwMCwiZXhwIjoxNzE5OTAyOTAwfQ.EXAMPLE_SIGNATURE",
              },
            },
          },
        },

        401: {
          description:
            "Authentication failed. Email or password is incorrect. " +
            "The error message is intentionally non-specific to prevent user enumeration.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Invalid credentials",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        403: {
          description:
            "Account exists and password is correct, but the email has not been verified. " +
            "Prompt the user to check their inbox or use `POST /auth/resend-verification`.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Please verify your email first",
                verificationRequired: true,
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/refresh 
  "/auth/refresh": {
    post: {
      tags: ["Authentication"],

      operationId: "refreshAccessToken",

      summary: "Refresh access token using refresh token cookie",

      description:
        "Issues a new access token using the `refreshToken` cookie. " +
        "**Token rotation** is applied — the existing refresh token version is " +
        "incremented and a new refresh token cookie is issued.\n\n" +
        "The refresh token is read automatically from the `refreshToken` cookie " +
        "set during login. If the cookie is absent, `401` is returned immediately " +
        "without verifying any JWT.\n\n" +
        "**Error cases:**\n" +
        "- Cookie missing → `401 Unauthorized`\n" +
        "- Token signature invalid / expired → `401 Unauthorized` (JWT error)\n" +
        "- Token version mismatch (revoked) → `401 Unauthorized`\n" +
        "- User no longer exists → `401 Unauthorized`",

      responses: {
        200: {
          description:
            "New access token issued. A new refresh token cookie is also set (token rotation).",
          headers: {
            "Set-Cookie": {
              description:
                "Rotated `refreshToken=<new_jwt>; HttpOnly; Secure; SameSite=None; Max-Age=604800`",
              schema: {
                type: "string",
              },
            },
          },
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshResponse",
              },
              example: {
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1YzFmOGQzNGY5ZjFlOWU5YjEyMzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxOTkwMjYwMCwiZXhwIjoxNzE5OTAzNTAwfQ.NEW_SIGNATURE",
              },
            },
          },
        },

        401: {
          description:
            "Refresh token is missing, invalid, expired, or has been revoked " +
            "(e.g. the user logged out, changed password, or the token was already used in a previous rotation).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                missing: {
                  summary: "Cookie not present",
                  value: {
                    message: "Refresh token missing",
                  },
                },
                revoked: {
                  summary: "Token version mismatch (revoked)",
                  value: {
                    success: false,
                    message: "Refresh token revoked",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/logout 
  "/auth/logout": {
    post: {
      tags: ["Authentication"],

      operationId: "logoutUser",

      summary: "Logout and invalidate refresh token",

      description:
        "Logs out the current user by:\n\n" +
        "1. Verifying the `refreshToken` cookie (if present).\n" +
        "2. Incrementing the user's `refreshTokenVersion` in the database — " +
        "   this immediately invalidates all existing refresh tokens for the user.\n" +
        "3. Clearing the `refreshToken` cookie.\n\n" +
        "This endpoint always returns `200 OK` regardless of whether a valid " +
        "cookie was present. Callers should discard the access token on the client side.",

      responses: {
        200: {
          description:
            "Logout successful. The refreshToken cookie has been cleared and " +
            "the token version has been incremented.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                message: "Logged out",
              },
            },
          },
        },
      },
    },
  },

  // ─── GET /auth/me 
  "/auth/me": {
    get: {
      tags: ["Authentication"],

      operationId: "getCurrentUser",

      summary: "Get current authenticated user profile",

      description:
        "Returns the profile of the currently authenticated user. " +
        "Only `name`, `email`, and `role` are selected from the database " +
        "(password and other sensitive fields are excluded).\n\n" +
        "Requires a valid Bearer access token. Accessible to roles: " +
        "`USER`, `EDITOR`, `ADMIN`.",

      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Authenticated user's profile returned successfully.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MeResponse",
              },
              example: {
                success: true,
                data: {
                  _id: "6865c1f8d34f9f1e9e9b1234",
                  name: "Amara Okafor",
                  email: "amara.okafor@example.com",
                  role: "EDITOR",
                },
              },
            },
          },
        },

        401: {
          description:
            "Access token is missing or invalid.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                missing: {
                  summary: "Authorization header absent",
                  value: {
                    success: false,
                    message: "Access token missing",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
                invalid: {
                  summary: "Token expired or tampered",
                  value: {
                    success: false,
                    message: "Invalid or expired access token",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
              },
            },
          },
        },

        403: {
          description: "Authenticated but role is not permitted.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Forbidden: insufficient rights",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/forgot-password 
  "/auth/forgot-password": {
    post: {
      tags: ["Authentication"],

      operationId: "forgotPassword",

      summary: "Request a password reset OTP",

      description:
        "Sends a 6-digit password reset OTP to the provided email address.\n\n" +
        "**Security behaviour:** If the email does not exist in the database, " +
        "the response is still `200 OK` — this prevents user enumeration attacks. " +
        "The response message is always " +
        "`\"If an account exists, a reset OTP has been sent\"`.\n\n" +
        "**Error cases:**\n" +
        "- The account exists but the email is not yet verified → `400 Bad Request` " +
        "  (`\"Email is not verified\"`) — the user must verify their email before " +
        "  resetting the password.",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EmailRequest",
            },
            example: {
              email: "amara.okafor@example.com",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Request processed. If an account exists for the provided email, " +
            "a reset OTP has been sent.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "If an account exists, a reset OTP has been sent",
              },
            },
          },
        },

        400: {
          description:
            "The account's email address has not yet been verified. " +
            "Verify the email first before requesting a password reset.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Email is not verified",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/verify-reset-otp 
  "/auth/verify-reset-otp": {
    post: {
      tags: ["Authentication"],

      operationId: "verifyPasswordResetOtp",

      summary: "Verify the password reset OTP",

      description:
        "Validates the 6-digit OTP that was sent via `POST /auth/forgot-password`. " +
        "This step must be completed before calling `POST /auth/reset-password`.\n\n" +
        "Note: This endpoint **only verifies** the OTP — it does not reset the password. " +
        "The OTP must be presented again in the `POST /auth/reset-password` request.\n\n" +
        "**Error cases:**\n" +
        "- No reset OTP was requested → `400 Bad Request` (`\"Reset OTP not found\"`)\n" +
        "- OTP has expired → `400 Bad Request` (`\"OTP expired\"`)\n" +
        "- OTP does not match → `400 Bad Request` (`\"Invalid OTP\"`)\n" +
        "- User not found → `404 Not Found`",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/VerifyOtpRequest",
            },
            example: {
              email: "amara.okafor@example.com",
              otp: "712483",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "OTP is valid. Proceed to `POST /auth/reset-password` with the same email and OTP.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "OTP verified",
              },
            },
          },
        },

        400: {
          description: "OTP is invalid, expired, or no reset was requested.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                notFound: {
                  summary: "No reset OTP on record",
                  value: {
                    success: false,
                    message: "Reset OTP not found",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
                expired: {
                  summary: "OTP has expired",
                  value: {
                    success: false,
                    message: "OTP expired",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
                invalid: {
                  summary: "OTP does not match",
                  value: {
                    success: false,
                    message: "Invalid OTP",
                    requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                    timestamp: 1751452200000,
                  },
                },
              },
            },
          },
        },

        404: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "User not found",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },

  // ─── POST /auth/reset-password 
  "/auth/reset-password": {
    post: {
      tags: ["Authentication"],

      operationId: "resetPassword",

      summary: "Reset password with verified OTP",

      description:
        "Resets the user's password. Internally calls `verifyResetOtp` again " +
        "to ensure the OTP is still valid at the time of submission.\n\n" +
        "**Side effects on success:**\n" +
        "- The password is updated with a new bcrypt hash (cost factor 12).\n" +
        "- `passwordResetOtp` and `passwordResetOtpExpiresAt` are set to `null`.\n" +
        "- `refreshTokenVersion` is incremented — this immediately invalidates " +
        "  all existing refresh tokens (force re-login on all devices).\n\n" +
        "**Error cases:** Same as `POST /auth/verify-reset-otp` — the OTP is " +
        "re-validated during this call.",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest",
            },
            example: {
              email: "amara.okafor@example.com",
              otp: "712483",
              password: "NewSecurePass@2026",
            },
          },
        },
      },

      responses: {
        200: {
          description:
            "Password reset successfully. All active sessions have been invalidated. " +
            "The user must log in again.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
              },
              example: {
                success: true,
                message: "Password reset successful",
              },
            },
          },
        },

        400: {
          description: "OTP is invalid, expired, or the request is malformed.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "OTP expired",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },

        404: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "User not found",
                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                timestamp: 1751452200000,
              },
            },
          },
        },
      },
    },
  },
};