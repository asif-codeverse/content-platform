import { registerUser, loginUser } from "./auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

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
