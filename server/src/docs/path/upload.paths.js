export const uploadPaths = {
    // ─── POST /upload 
    "/upload": {
        post: {
            tags: ["Upload"],

            operationId: "uploadImage",

            summary: "Upload an image to Cloudinary",

            description:
                "Accepts a single image file as `multipart/form-data` and streams it " +
                "directly to Cloudinary (stored under the `content-platform/` folder). " +
                "Returns the public CDN URL and the Cloudinary public ID.\n\n" +
                "**Constraints (enforced by Multer middleware):**\n" +
                "- Field name: `image` (required)\n" +
                "- Accepted MIME types: any `image/*` type (e.g. `image/jpeg`, `image/png`, `image/webp`)\n" +
                "- Maximum file size: **5 MB** (5 × 1024 × 1024 bytes)\n\n" +
                "**Usage:** Upload an image before or after creating an article, then embed " +
                "the returned `url` in the article `content` or use it as a cover image.\n\n" +
                "**Requires authentication** (any role: `USER`, `EDITOR`, `ADMIN`).",

            security: [{ bearerAuth: [] }],

            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            required: ["image"],
                            properties: {
                                image: {
                                    type: "string",
                                    format: "binary",
                                    description:
                                        "Image file to upload. Must be an `image/*` MIME type. " +
                                        "Maximum size: 5 MB.",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description:
                        "Image uploaded successfully. The `url` is a Cloudinary CDN URL " +
                        "that can be embedded in articles. The `publicId` can be used to " +
                        "manage or delete the asset from Cloudinary.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UploadResponse",
                            },
                            example: {
                                success: true,
                                data: {
                                    url: "https://res.cloudinary.com/content-platform/image/upload/v1719902000/content-platform/article-cover-xk9f3a.webp",
                                    publicId: "content-platform/article-cover-xk9f3a",
                                },
                            },
                        },
                    },
                },

                400: {
                    description:
                        "No image file was provided in the request, or the file failed " +
                        "Multer validation (unsupported MIME type or file exceeds 5 MB).",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            examples: {
                                noFile: {
                                    summary: "No file provided",
                                    value: {
                                        success: false,
                                        message: "Image is required",
                                        requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                        timestamp: 1751452200000,
                                    },
                                },
                                unsupportedType: {
                                    summary: "Non-image MIME type",
                                    value: {
                                        success: false,
                                        message: "Only image files are allowed",
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
                            example: {
                                success: false,
                                message: "Access token missing",
                                requestId: "req_01HXYZ3KQWM7VABCDE890FGH",
                                timestamp: 1751452200000,
                            },
                        },
                    },
                },

                500: {
                    description:
                        "Internal server error, typically a Cloudinary upload failure.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Internal Server Error",
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