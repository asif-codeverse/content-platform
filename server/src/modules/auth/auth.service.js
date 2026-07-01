import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import { env } from "../../config/env.js";
import { generateAccessToken, generateRefreshToken, } from "../../utils/token.js";
import {
  sendVerificationOtp,
  sendPasswordResetOtp,
} from "../../services/email.service.js";
import { logger } from "../../utils/logger.js";


const generateOtp = () =>
  Math.floor(
    100000 +
    Math.random() * 900000
  ).toString();

const otpExpiry = () =>
  new Date(
    Date.now() +
    10 * 60 * 1000
  );

export const registerUser = async ({
  name,
  email,
  password,
}) => {

  const existingUser =
    await User.findOne({ email });

  // User already exists
  if (existingUser) {

    // Already verified
    if (existingUser.emailVerified) {
      throw {
        statusCode: 409,
        message: "User already exists",
      };
    }

    if (
      existingUser.lastOtpSentAt &&
      Date.now() -
      existingUser.lastOtpSentAt.getTime() <
      60 * 1000
    ) {

      throw {
        statusCode: 429,
        message:
          "Please wait before requesting another OTP",
      };

    }

    // Unverified user → generate new OTP
    const otp = generateOtp();

    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    existingUser.emailOtp = hashedOtp;
    existingUser.lastOtpSentAt =
      new Date();

    existingUser.emailOtpExpiresAt = otpExpiry();

    await existingUser.save();

    try {

      await sendVerificationOtp(
        existingUser.email,
        otp
      );

    } catch (error) {

      logger.error(error);

      logger.info(
        "EMAIL_VERIFICATION_OTP",
        {
          email: existingUser.email,
          otp,
        }
      );

    }

    return existingUser;
  }

  // New user
  const hashedPassword =
    await bcrypt.hash(
      password,
      12
    );

  const otp = generateOtp();
  const hashedOtp =
    await bcrypt.hash(
      otp,
      10
    );

  const user =
    await User.create({
      name,
      email,
      password:
        hashedPassword,

      emailVerified: false,

      emailOtp:
        hashedOtp,

      emailOtpExpiresAt: otpExpiry(),
      lastOtpSentAt:
        new Date(),
    });

  try {

    await sendVerificationOtp(
      user.email,
      otp
    );

  } catch (error) {

    logger.error(error);

    logger.info(
      "EMAIL_VERIFICATION_OTP",
      {
        email: user.email,
        otp,
      }
    );

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

export const forgotPassword =
  async (email) => {

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return true;
    }

    if (!user.emailVerified) {
      throw {
        statusCode: 400,
        message:
          "Email is not verified",
      };
    }

    const otp =
      generateOtp();

    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    user.passwordResetOtp =
      hashedOtp;

    user.passwordResetOtpExpiresAt =
      otpExpiry();

    await user.save();

    try {

      await sendPasswordResetOtp(
        email,
        otp
      );

    } catch (error) {

      logger.error(error);

      logger.info(
        "PASSWORD_RESET_OTP",
        {
          email,
          otp,
        }
      );

    }

    return true;

  };

export const verifyResetOtp =
  async (
    email,
    otp
  ) => {

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      throw {
        statusCode: 404,
        message: "User not found",
      };
    }

    if (
      !user.passwordResetOtp ||
      !user.passwordResetOtpExpiresAt
    ) {

      throw {
        statusCode: 400,
        message:
          "Reset OTP not found",
      };

    }

    if (
      user.passwordResetOtpExpiresAt <
      new Date()
    ) {

      throw {
        statusCode: 400,
        message:
          "OTP expired",
      };

    }

    const validOtp =
      await bcrypt.compare(
        otp,
        user.passwordResetOtp
      );

    if (!validOtp) {

      throw {
        statusCode: 400,
        message:
          "Invalid OTP",
      };

    }

    return true;

  };

export const resetPassword =
  async (
    email,
    otp,
    password
  ) => {

    await verifyResetOtp(
      email,
      otp
    );

    const user =
      await User.findOne({
        email,
      });

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    user.password =
      hashedPassword;

    user.passwordResetOtp =
      null;

    user.passwordResetOtpExpiresAt =
      null;

    user.refreshTokenVersion += 1;

    await user.save();

    return true;

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
    !user.emailOtpExpiresAt ||
    user.emailOtpExpiresAt <
    new Date()
  ) {
    throw {
      statusCode: 400,
      message: "OTP expired",
    };
  }
  if (!user.emailOtp) {
    throw {
      statusCode: 400,
      message: "OTP not found",
    };
  }

  const validOtp =
    await bcrypt.compare(
      otp,
      user.emailOtp
    );

  if (!validOtp) {

    throw {
      statusCode: 400,
      message: "Invalid OTP",
    };

  }

  user.emailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpiresAt = null;
  user.lastOtpSentAt = null;

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

    if (
      user.lastOtpSentAt &&
      Date.now() -
      user.lastOtpSentAt.getTime() <
      60 * 1000
    ) {

      throw {
        statusCode: 429,
        message:
          "Please wait before requesting another OTP",
      };

    }

    const otp = generateOtp();
    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    user.emailOtp =
      hashedOtp;

    user.emailOtpExpiresAt = otpExpiry();

    user.lastOtpSentAt =
      new Date();

    await user.save();

    try {

      await sendVerificationOtp(
        email,
        otp
      );

    } catch (error) {

      logger.error(error);

      logger.info(
        "EMAIL_VERIFICATION_OTP",
        {
          email,
          otp,
        }
      );

    }

    return true;
  };

