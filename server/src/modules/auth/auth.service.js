import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import { env } from "../../config/env.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { statusCode: 409, message: "User already exists" };
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  return user;
};

export const refreshTokens = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);

  const user = await User.findById(payload.userId);

  if (!user) {
    throw { statusCode: 401, message: "User not found" };
  }

  // check token version
  if (user.refreshTokenVersion !== payload.tokenVersion) {
    throw { statusCode: 401, message: "Refresh token revoked" };
  }

  // ROTATE TOKEN
  user.refreshTokenVersion += 1;
  await user.save();

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
