import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, env.jwtAccessSecret, {
    expiresIn: "15m",
  });

export const generateRefreshToken = (user) =>
  jwt.sign(
    { userId: user._id, tokenVersion: user.refreshTokenVersion },
    env.jwtRefreshSecret,
    { expiresIn: "7d" }
  );
