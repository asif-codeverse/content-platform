import { api } from "@/lib/api";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response =
    await api.get("/auth/me");

  return response.data;
};

export const logoutUser = async () => {

  const response =
    await api.post(
      "/auth/logout"
    );

  return response.data;
};

export const forgotPassword = async (
  email: string
) => {

  const response =
    await api.post(
      "/auth/forgot-password",
      { email }
    );

  return response.data;
};

export const verifyResetOtp = async (
  email: string,
  otp: string
) => {

  const response =
    await api.post(
      "/auth/verify-reset-otp",
      {
        email,
        otp,
      }
    );

  return response.data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  password: string
) => {

  const response =
    await api.post(
      "/auth/reset-password",
      {
        email,
        otp,
        password,
      }
    );

  return response.data;
};