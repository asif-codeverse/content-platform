import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      tokenVersion: user.refreshTokenVersion,
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
  );