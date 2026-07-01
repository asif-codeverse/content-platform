import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../src/app.js";
import { User } from "../src/modules/auth/auth.model.js";

const API = "/api/v1";

/**
 * Creates and verifies a user, then logs in.
 */
export async function createAuthenticatedUser({
  name = "Test User",
  email = "test@example.com",
  password = "Password123",
  role = "USER",
} = {}) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,

    emailVerified: true,

    emailOtp: null,
    emailOtpExpiresAt: null,
    lastOtpSentAt: null,

    refreshTokenVersion: 0,
  });

  const loginRes = await request(app)
    .post(`${API}/auth/login`)
    .send({
      email,
      password,
    });

  return {
    user,
    accessToken: loginRes.body.accessToken,
    cookies: loginRes.headers["set-cookie"],
    loginResponse: loginRes,
  };
}