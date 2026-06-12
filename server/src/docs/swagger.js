const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Content Platform API",
        version: "1.0.0",
        description: "Backend API Documentation",
    },
    tags: [
        {
            name: "Authentication",
            description: "Authentication APIs",
        },
        {
            name: "Articles",
            description: "Article management APIs",
        },
        {
            name: "Search",
            description: "Search APIs",
        },
        {
            name: "Health",
            description: "Health monitoring APIs",
        },
    ],
    servers: [
        {
            url: "http://localhost:5001",
            description: "Local Development",
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
        "/readiness": {
            get: {
                tags: ["Health"],
                summary: "Readiness Check",

                responses: {
                    200: {
                        description: "Application Ready",
                    },
                },
            },
        },

        "/api/v1/auth/register": {
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

        "/api/v1/auth/login": {
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

        "/api/v1/auth/refresh": {
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

        "/api/v1/auth/me": {
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

        "/api/v1/articles": {
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

        "/api/v1/articles/all": {
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

        "/api/v1/articles/{slug}": {
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

        "/api/v1/articles/{id}": {
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

        "/api/v1/articles/{id}/publish": {
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
        "/api/v1/search": {
            get: {
                tags: ["Search"],
                summary: "Search Articles",

                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Search Results",
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
                description:
                    "Enter JWT token without Bearer prefix",
            },
        },
    },
};

export default swaggerDocument;