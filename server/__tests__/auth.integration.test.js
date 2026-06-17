import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";

const API = "/api/v1";

describe("Auth API", () => {
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

    it("should register a new user", async () => {
        const res = await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        expect(res.statusCode).toBe(201);

        expect(res.body.user.email)
            .toBe("test@example.com");


    });

    it("should NOT allow duplicate registration", async () => {
        await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        const res = await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });

        expect(res.statusCode).toBe(409);


    });

    it("should login successfully", async () => {
        await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        const res = await request(app)
            .post(`${API}/auth/login`)
            .send({
                email: "test@example.com",
                password: "Password123",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken)
            .toBeDefined();


    });

    it("should reject invalid credentials", async () => {
        const res = await request(app)
            .post(`${API}/auth/login`)
            .send({
                email: "wrong@example.com",
                password: "wrongpassword",
            });


        expect(res.statusCode).toBe(401);


    });

    it("should return current user from /me", async () => {
        await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        const loginRes = await request(app)
            .post(`${API}/auth/login`)
            .send({
                email: "test@example.com",
                password: "Password123",
            });

        const token =
            loginRes.body.accessToken;

        const meRes = await request(app)
            .get(`${API}/auth/me`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(meRes.statusCode)
            .toBe(200);

        expect(meRes.body.data.email)
            .toBe("test@example.com");


    });

    it("should refresh access token", async () => {
        await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        const loginRes = await request(app)
            .post(`${API}/auth/login`)
            .send({
                email: "test@example.com",
                password: "Password123",
            });

        const cookies =
            loginRes.headers["set-cookie"];

        const refreshRes =
            await request(app)
                .post(`${API}/auth/refresh`)
                .set("Cookie", cookies);

        expect(refreshRes.statusCode)
            .toBe(200);

        expect(
            refreshRes.body.accessToken
        ).toBeDefined();


    });

    it("should logout successfully", async () => {
        await request(app)
            .post(`${API}/auth/register`)
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
            });


        const loginRes = await request(app)
            .post(`${API}/auth/login`)
            .send({
                email: "test@example.com",
                password: "Password123",
            });

        const cookies =
            loginRes.headers["set-cookie"];

        const logoutRes =
            await request(app)
                .post(`${API}/auth/logout`)
                .set("Cookie", cookies);

        expect(logoutRes.statusCode)
            .toBe(200);


    });
});
