export const userPaths = {
    // ─── GET /users 
    "/users": {
        get: {
            tags: ["Users"],

            operationId: "getAllUsers",

            summary: "List all registered users",

            description:
                "Returns all registered users sorted by `createdAt` descending (newest first). " +
                "Sensitive fields — `password` and `refreshTokenVersion` — are excluded " +
                "from the response.\n\n" +
                "**Returned fields per user:** `_id`, `name`, `email`, `role`, " +
                "`emailVerified`, `emailOtpExpiresAt` (if applicable), `lastOtpSentAt`, " +
                "`createdAt`, `updatedAt`.\n\n" +
                "**No pagination** — all users are returned in a single response. " +
                "For large platforms, consider adding pagination in a future version.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            responses: {
                200: {
                    description: "All users retrieved successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UsersListResponse",
                            },
                            example: {
                                success: true,
                                data: [
                                    {
                                        _id: "6865d2a9d34f9f1e9e9b5678",
                                        name: "Kofi Mensah",
                                        email: "kofi.mensah@example.com",
                                        role: "USER",
                                        emailVerified: true,
                                        createdAt: "2026-05-20T07:45:00.000Z",
                                        updatedAt: "2026-06-15T10:30:00.000Z",
                                    },
                                    {
                                        _id: "6865c1f8d34f9f1e9e9b1234",
                                        name: "Amara Okafor",
                                        email: "amara.okafor@example.com",
                                        role: "EDITOR",
                                        emailVerified: true,
                                        createdAt: "2026-01-15T08:30:00.000Z",
                                        updatedAt: "2026-06-20T14:22:00.000Z",
                                    },
                                ],
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Access token missing",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
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

    // ─── PATCH /users/:id/role 
    "/users/{id}/role": {
        patch: {
            tags: ["Users"],

            operationId: "updateUserRole",

            summary: "Update a user's role",

            description:
                "Assigns a new role to the specified user. Only `USER` and `EDITOR` " +
                "roles can be assigned via the API — the `ADMIN` role cannot be set or " +
                "removed through this endpoint.\n\n" +
                "**Business rules:**\n" +
                "- Attempting to modify a user who already has the `ADMIN` role → `400 Bad Request`.\n" +
                "- Providing an invalid role (anything other than `USER` or `EDITOR`) → `400 Bad Request`.\n" +
                "- User not found → `400 Bad Request` *(note: the service checks `user.role` " +
                "  before the `!user` null check, so a non-existent user will throw a TypeError " +
                "  which is caught as a 500; ensure the userId is valid)*.\n\n" +
                "**Role required:** `ADMIN`.",

            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the user whose role will be updated.",
                    schema: { type: "string" },
                    example: "6865d2a9d34f9f1e9e9b5678",
                },
            ],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/RoleUpdateRequest",
                        },
                        examples: {
                            promoteToEditor: {
                                summary: "Promote a USER to EDITOR",
                                value: { role: "EDITOR" },
                            },
                            demoteToUser: {
                                summary: "Demote an EDITOR back to USER",
                                value: { role: "USER" },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description: "Role updated successfully.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: {
                                        type: "string",
                                        example: "Role updated successfully",
                                    },
                                    data: { $ref: "#/components/schemas/User" },
                                },
                            },
                            example: {
                                success: true,
                                message: "Role updated successfully",
                                data: {
                                    _id: "6865d2a9d34f9f1e9e9b5678",
                                    name: "Kofi Mensah",
                                    email: "kofi.mensah@example.com",
                                    role: "EDITOR",
                                    emailVerified: true,
                                    createdAt: "2026-05-20T07:45:00.000Z",
                                    updatedAt: "2026-07-02T10:30:00.000Z",
                                },
                            },
                        },
                    },
                },

                400: {
                    description:
                        "Invalid role value provided, or an attempt was made to modify " +
                        "a user with the ADMIN role.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            examples: {
                                invalidRole: {
                                    summary: "Role value is not USER or EDITOR",
                                    value: {
                                        success: false,
                                        message: "Invalid role",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                adminProtected: {
                                    summary: "Target user is an ADMIN",
                                    value: {
                                        success: false,
                                        message: "Admin role cannot be modified",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                            },
                        },
                    },
                },

                401: {
                    description: "Access token missing or invalid.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },

                403: {
                    description: "Role not permitted (must be ADMIN).",
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
};