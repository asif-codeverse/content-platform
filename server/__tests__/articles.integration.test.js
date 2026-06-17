import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { Article } from "../src/modules/articles/article.model.js";
import { User } from "../src/modules/auth/auth.model.js";
import bcrypt from "bcryptjs";

const API = "/api/v1";

describe("Articles Public API", () => {
  beforeAll(async () => {
    await connectDB();

    if (!env.MONGODB_URI.includes("test")) {
      throw new Error("Refusing to run tests on non-test database");
    }
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ---------------------------------------
  // PUBLIC LIST TEST
  // ---------------------------------------

  it("should return 200 for public list endpoint", async () => {
    const res = await request(app).get(`${API}/articles`)

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ---------------------------------------
  // DRAFT VISIBILITY TEST
  // ---------------------------------------

  it("should NOT return draft articles in public list", async () => {
    await Article.create({
      title: "Draft Test",
      content: "This is draft content",
      status: "DRAFT",
      author: new mongoose.Types.ObjectId(),
      slug: "draft-test",
    });

    const res = await request(app).get(`${API}/articles`)

    const titles = res.body.data.map((a) => a.title);

    expect(titles).not.toContain("Draft Test");
  });

  // ---------------------------------------
  // AUTH REQUIRED FOR PUBLISH
  // ---------------------------------------

  it("should NOT allow publishing without authentication", async () => {
    const article = await Article.create({
      title: "Publish Test",
      content: "Test",
      status: "DRAFT",
      author: new mongoose.Types.ObjectId(),
      slug: "publish-test",
    });

    const publishRes = await request(app).patch(`${API}/articles/${article._id}/publish`)

    expect(publishRes.statusCode).toBe(401);
  });

  // ---------------------------------------
  // ADMIN CAN PUBLISH
  // ---------------------------------------

  it("should allow ADMIN to publish and make article public", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
      refreshTokenVersion: 0,
    });

    const loginRes = await request(app).post(`${API}/auth/login`).send({
      email: "admin@test.com",
      password: "Password123",
    });

    const token = loginRes.body.accessToken;
    expect(token).toBeDefined();

    const article = await Article.create({
      title: "Publish Flow Test",
      content: "Will become public",
      status: "DRAFT",
      author: admin._id,
      slug: "publish-flow-test",
    });

    const publishRes = await request(app)
      .patch(`${API}/articles/${article._id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(publishRes.statusCode).toBe(200);

    const publicRes = await request(app).get(`${API}/articles`)

    const titles = publicRes.body.data.map((a) => a.title);

    expect(titles).toContain("Publish Flow Test");
  });

  // ---------------------------------------
  // EDITOR CANNOT PUBLISH
  // ---------------------------------------

  it("should NOT allow EDITOR to publish article", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const editor = await User.create({
      name: "Editor User",
      email: "editor@test.com",
      password: hashedPassword,
      role: "EDITOR",
      refreshTokenVersion: 0,
    });

    const loginRes = await request(app).post(`${API}/auth/login`).send({
      email: "editor@test.com",
      password: "Password123",
    });

    const token = loginRes.body.accessToken;

    const article = await Article.create({
      title: "Editor Draft",
      content: "Editor content",
      status: "DRAFT",
      author: editor._id,
      slug: "editor-draft",
    });

    const res = await request(app)
      .patch(`${API}/articles/${article._id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  // ---------------------------------------
  // EDITOR CANNOT EDIT OTHERS' ARTICLE
  // ---------------------------------------

  it("should NOT allow EDITOR to edit another user's article", async () => {
    const hashedAdminPassword = await bcrypt.hash("Password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      refreshTokenVersion: 0,
    });

    const article = await Article.create({
      title: "Admin Article",
      content: "Admin content",
      status: "DRAFT",
      author: admin._id,
      slug: "admin-article",
    });

    const hashedEditorPassword = await bcrypt.hash("Password123", 10);

    const editor = await User.create({
      name: "Editor User",
      email: "editor2@test.com",
      password: hashedEditorPassword,
      role: "EDITOR",
      refreshTokenVersion: 0,
    });

    const editorLogin = await request(app).post(`${API}/auth/login`).send({
      email: "editor2@test.com",
      password: "Password123",
    });

    const editorToken = editorLogin.body.accessToken;

    const res = await request(app)
      .patch(`${API}/articles/${article._id}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .send({ title: "Hacked Title" });

    expect(res.statusCode).toBe(403);
  });

  it("should NOT allow updating title to an existing slug", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin3@test.com",
      password: hashedPassword,
      role: "ADMIN",
      refreshTokenVersion: 0,
    });

    const loginRes = await request(app).post(`${API}/auth/login`).send({
      email: "admin3@test.com",
      password: "Password123",
    });

    const token = loginRes.body.accessToken;

    const article1 = await Article.create({
      title: "First Title",
      content: "Content",
      status: "DRAFT",
      author: admin._id,
      slug: "first-title",
    });

    await Article.create({
      title: "Second Title",
      content: "Content",
      status: "DRAFT",
      author: admin._id,
      slug: "second-title",
    });

    const res = await request(app)
      .patch(`${API}/articles/${article1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Second Title" });

    expect(res.statusCode).toBe(409);
  });

  it("should NOT allow EDITOR to modify published article", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin4@test.com",
      password: hashedPassword,
      role: "ADMIN",
      refreshTokenVersion: 0,
    });

    const editor = await User.create({
      name: "Editor User",
      email: "editor@test.com",
      password: hashedPassword,
      role: "EDITOR",
      refreshTokenVersion: 0,
    });

    const article = await Article.create({
      title: "Published Article",
      content: "Content",
      status: "PUBLISHED",
      author: editor._id,
      slug: "published-article",
    });

    const loginRes = await request(app).post(`${API}/auth/login`).send({
      email: "editor@test.com",
      password: "Password123",
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .patch(`${API}/articles/${article._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Changed Title" });

    expect(res.statusCode).toBe(403);
  });

  it("should return article by slug", async () => {

    const article = await Article.create({
      title: "Redis Guide",
      content: "Redis Content",
      slug: "redis-guide",
      status: "PUBLISHED",
      author: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .get(`${API}/articles/redis-guide`);

    expect(res.statusCode).toBe(200);

    expect(
      res.body.data.title
    ).toBe("Redis Guide");
  });

  it("ADMIN should create article", async () => {

    const hashedPassword =
      await bcrypt.hash(
        "password123",
        10
      );

    await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
      refreshTokenVersion: 0,
    });

    const loginRes =
      await request(app)
        .post(`${API}/auth/login`)
        .send({
          email: "admin@test.com",
          password: "password123",
        });

    const token =
      loginRes.body.accessToken;

    const res =
      await request(app)
        .post(`${API}/articles`)
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "Test Article",
          content:
            "This is a test article content with more than twenty characters.",
        });
    // console.log(res.body);

    expect(res.statusCode).toBe(201);
  });

  it("ADMIN should delete article", async () => {

    const hashedPassword =
      await bcrypt.hash(
        "password123",
        10
      );

    const admin =
      await User.create({
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN",
        refreshTokenVersion: 0,
      });

    const loginRes =
      await request(app)
        .post(`${API}/auth/login`)
        .send({
          email: "admin@test.com",
          password: "password123",
        });

    const token =
      loginRes.body.accessToken;

    const article =
      await Article.create({
        title: "Delete Me",
        content: "Delete Content",
        slug: "delete-me",
        status: "DRAFT",
        author: admin._id,
      });

    const deleteRes =
      await request(app)
        .delete(
          `${API}/articles/${article._id}`
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      deleteRes.statusCode
    ).toBe(200);

    const deletedArticle =
      await Article.findById(
        article._id
      );

    expect(
      deletedArticle.isDeleted
    ).toBe(true);

  });
});