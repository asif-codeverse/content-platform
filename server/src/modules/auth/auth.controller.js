import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { registerUser, loginUser, refreshTokens } from "./auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { logger } from "../../utils/logger.js";
import { User } from "./auth.model.js";

export const register = async (req, res, next) => {
  try {

    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User Registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);
    logger.info(
      "USER_LOGIN",
      {
        userId: user._id,
        email: user.email,
      }
    );

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req,
  res,
  next
) => {

  try {

    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {

      return res
        .status(401)
        .json({
          message:
            "Refresh token missing",
        });

    }

    const tokens =
      await refreshTokens(
        refreshToken
      );

    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      {
        httpOnly: true,
        secure:
          env.NODE_ENV ===
          "production",

        sameSite: "strict",

        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    return res.json({
      accessToken:
        tokens.accessToken,
    });

  } catch (err) {

    next(err);

  }

};

export const me = async (
  req,
  res,
  next
) => {

  try {

    const user =
      await User.findById(
        req.user.id
      )
        .select(
          "name email role"
        )
        .lean();

    return res.json({
      success: true,
      data: user,
    });

  } catch (err) {

    next(err);

  }

};

export const logout =
  async (
    req,
    res,
    next
  ) => {

    try {

      const refreshToken =
        req.cookies.refreshToken;

      if (refreshToken) {

        try {

          const payload =
            jwt.verify(
              refreshToken,
              env.JWT_REFRESH_SECRET
            );

          const user =
            await User.findById(
              payload.userId
            );

          if (user) {

            user.refreshTokenVersion += 1;

            await user.save();
            logger.info("USER_LOGOUT", {
              userId: user._id,
              email: user.email,
            });

          }

        } catch { }

      }

      res.clearCookie(
        "refreshToken"
      );

      return res.json({
        message:
          "Logged out",
      });

    } catch (err) {

      next(err);

    }

  };