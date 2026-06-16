import { MetadataRoute } from "next";

export default function sitemap():
    MetadataRoute.Sitemap {

    return [

        {
            url:
                "http://localhost:3000",

            lastModified:
                new Date(),

            changeFrequency:
                "daily",

            priority: 1,
        },

        {
            url:
                "http://localhost:3000/articles",

            lastModified:
                new Date(),

            changeFrequency:
                "daily",

            priority: 0.8,
        },

        {
            url:
                "http://localhost:3000/articles/redis-caching",

            lastModified:
                new Date(),

            changeFrequency:
                "weekly",

            priority: 0.7,
        },

    ];
}