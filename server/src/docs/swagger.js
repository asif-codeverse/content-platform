const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Content Platform API",
        version: "1.0.0",
        description: "Backend API Documentation",
    },
    servers: [
        {
            url: "/",
        },
    ],
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health Check",
                description: "Returns server health information",
                responses: {
                    200: {
                        description: "Server is healthy",
                    },
                },
            },
        },

        "/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "Register User",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                    },
                                    email: {
                                        type: "string",
                                    },
                                    password: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    201: {
                        description: "User Registered",
                    },
                },
            },
        },

        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "Login User",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                    },
                                    password: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "Logged In Successfully",
                    },
                },
            },
        },

        "/auth/refresh": {
            post: {
                tags: ["Authentication"],
                summary: "Refresh Access Token",

                responses: {
                    200: {
                        description: "New Access Token Generated",
                    },
                },
            },
        },

        "/auth/me": {
            get: {
                tags: ["Authentication"],
                summary: "Current User",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                responses: {
                    200: {
                        description: "Authenticated User",
                    },
                },
            },
        },

        "/articles": {
            get: {
                tags: ["Articles"],
                summary: "List Published Articles",

                responses: {
                    200: {
                        description: "Published articles list",
                    },
                },
            },

            post: {
                tags: ["Articles"],
                summary: "Create Article",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                    },
                                    content: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    201: {
                        description: "Article Created",
                    },
                },
            },
        },

        "/articles/all": {
            get: {
                tags: ["Articles"],
                summary: "List All Articles",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                responses: {
                    200: {
                        description: "All Articles",
                    },
                },
            },
        },

        "/articles/{slug}": {
            get: {
                tags: ["Articles"],
                summary: "Get Article By Slug",

                parameters: [
                    {
                        name: "slug",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Article Found",
                    },
                    404: {
                        description: "Article Not Found",
                    },
                },
            },
        },

        "/articles/{id}": {
            patch: {
                tags: ["Articles"],
                summary: "Update Article",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                    },
                                    content: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "Article Updated",
                    },
                },
            },

            delete: {
                tags: ["Articles"],
                summary: "Delete Article",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Article Deleted",
                    },
                },
            },
        },

        "/articles/{id}/publish": {
            patch: {
                tags: ["Articles"],
                summary: "Publish Article",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Article Published",
                    },
                },
            },
        },
    },

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};

export default swaggerDocument;