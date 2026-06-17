import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { Article } from "../src/modules/articles/article.model.js";

const API = "/api/v1";

describe("Search API", () => {
    beforeEach(async () => {
        await Article.collection.createIndex({
            title: "text",
            content: "text",
        });
    });
    
    beforeAll(async () => {
        await connectDB();

        if (!env.MONGODB_URI.includes("test")) {
            throw new Error(
                "Refusing to run tests on non-test database"
            );
        }
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should return matching published articles", async () => {
        await Article.create({
            title: "Node.js Basics",
            content: "Learn Node.js fundamentals",
            slug: "nodejs-basics",
            status: "PUBLISHED",
            author: new mongoose.Types.ObjectId(),
        });

        const res = await request(app)
            .get(`${API}/search?q=node`);

        expect(res.statusCode).toBe(200);
    });

    it("should not return draft articles", async () => {
        await Article.create({
            title: "Secret Draft",
            content: "Draft content",
            slug: "secret-draft",
            status: "DRAFT",
            author: new mongoose.Types.ObjectId(),
        });

        const res = await request(app)
            .get(`${API}/search?q=secret`);

        expect(res.statusCode).toBe(200);

        const titles =
            (res.body.data || []).map(
                (article) => article.title
            );

        expect(titles).not.toContain(
            "Secret Draft"
        );
    });
});