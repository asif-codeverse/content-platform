import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { Article } from "../src/modules/articles/article.model.js";
import bcrypt from "bcryptjs";
import { User } from "../src/modules/auth/auth.model.js";

describe("Articles Public API", () => {

  beforeAll(async () => {
    await connectDB();
    if (!env.mongoUri.includes("test")) {
    throw new Error("Refusing to run tests on non-test database");

  }
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 200 for public list endpoint", async () => {
    const res = await request(app).get("/articles");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should NOT return draft articles in public list", async () => {

    await Article.create({
      title: "Draft Test",
      content: "This is draft content",
      status: "DRAFT",
      author: new mongoose.Types.ObjectId(),
      slug: "draft-test"
    });

    const res = await request(app).get("/articles");

    const titles = res.body.data.map(a => a.title);

    expect(titles).not.toContain("Draft Test");
  });

  
it("should NOT allow publishing without authentication", async () => {
  const article = await Article.create({
    title: "Publish Test",
    content: "Test",
    status: "DRAFT",
    author: new mongoose.Types.ObjectId(),
    slug: "publish-test"
  });

  const publishRes = await request(app)
    .patch(`/articles/${article._id}/publish`);

  expect(publishRes.statusCode).toBe(401);
});

it("should allow ADMIN to publish and make article public", async () => {

  // 1️⃣ Create admin directly in DB
  const hashedPassword = await bcrypt.hash("Password123", 10);

  const admin = await User.create({
    email: "admin@test.com",
    password: hashedPassword,
    role: "ADMIN",
    refreshTokenVersion: 0
  });

  // 2️⃣ Login
  const loginRes = await request(app)
    .post("/auth/login")
    .send({
      email: "admin@test.com",
      password: "Password123"
    });

  const token = loginRes.body.accessToken;
  expect(token).toBeDefined();

  // 3️⃣ Create draft article
  const article = await Article.create({
    title: "Publish Flow Test",
    content: "Will become public",
    status: "DRAFT",
    author: admin._id,
    slug: "publish-flow-test"
  });

  // 4️⃣ Publish as admin
  const publishRes = await request(app)
    .patch(`/articles/${article._id}/publish`)
    .set("Authorization", `Bearer ${token}`);

  expect(publishRes.statusCode).toBe(200);

  // 5️⃣ Verify public visibility
  const publicRes = await request(app).get("/articles");

  const titles = publicRes.body.data.map(a => a.title);

  expect(titles).toContain("Publish Flow Test");
});


});
