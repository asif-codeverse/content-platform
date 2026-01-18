import { registerUser, loginUser } from "./auth.service.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/token.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({
      message:"Logged in",
      accessToken:accessToken,
    })
  } catch (err) {
    next(err);
  }
};
