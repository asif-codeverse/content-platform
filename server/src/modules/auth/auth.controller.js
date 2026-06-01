import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { registerUser, loginUser } from "./auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { User } from "./auth.model.js";

export const register = async (req, res, next) => {
  try {
    await registerUser(req.body);

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged in",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = jwt.verify(token, env.jwtRefreshSecret);

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid Refresh token" });
    }

    const accessToken = generateAccessToken(user);

    
    res.json({
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};
