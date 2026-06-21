import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import { env } from "../../config/env.js";
import { generateAccessToken, generateRefreshToken, } from "../../utils/token.js";
import { sendVerificationOtp } from "../../services/email.service.js";

export const registerUser = async ({
  name,
  email,
  password,
}) => {

  const existingUser =
    await User.findOne({ email });

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user =
    await User.create({
      name,
      email,
      password:
        hashedPassword,

      emailOtp: otp,

      emailOtpExpiresAt:
        new Date(
          Date.now() +
          10 * 60 * 1000
        ),
    });

  if (existingUser) {

    if (existingUser.emailVerified) {
      throw {
        statusCode: 409,
        message: "User already exists",
      };
    }

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    existingUser.emailOtp = otp;

    existingUser.emailOtpExpiresAt =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );

    await existingUser.save();

    await sendVerificationOtp(
      existingUser.email,
      otp
    );

    return existingUser;
  }

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
  if (!user.emailVerified) {
    throw {
      statusCode: 403,
      message:
        "Please verify your email first",
      verificationRequired: true,
    };
  }

  return user;
};

export const refreshTokens = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

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

export const verifyEmailOtp = async (
  email,
  otp
) => {

  const user =
    await User.findOne({ email });

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  if (user.emailVerified) {
    throw {
      statusCode: 400,
      message: "Email already verified",
    };
  }

  if (
    user.emailOtp !== otp
  ) {
    throw {
      statusCode: 400,
      message: "Invalid OTP",
    };
  }

  if (
    user.emailOtpExpiresAt <
    new Date()
  ) {
    throw {
      statusCode: 400,
      message: "OTP expired",
    };
  }

  user.emailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpiresAt = null;

  await user.save();

  return user;
};

export const resendVerificationOtp =
  async (email) => {

    const user =
      await User.findOne({ email });

    if (!user) {
      throw {
        statusCode: 404,
        message: "User not found",
      };
    }

    if (user.emailVerified) {
      throw {
        statusCode: 400,
        message:
          "Email already verified",
      };
    }

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    user.emailOtp = otp;

    user.emailOtpExpiresAt =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );

    await user.save();

    await sendVerificationOtp(
      email,
      otp
    );

    return true;
  };

