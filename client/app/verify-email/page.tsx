"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Toast from "@/components/ui/Toast";

export default function VerifyEmailPage() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email") || "";

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [cooldown, setCooldown] =
    useState(0);

  useEffect(() => {

    if (cooldown <= 0) return;

    const timer =
      setInterval(() => {

        setCooldown(
          (prev) => prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [cooldown]);

  const handleVerify =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,

          {
            email,
            otp,
          }

        );

        setError("");
        setMessage(
          "Email verified successfully"
        );

        setTimeout(() => {

          router.push("/login");

        }, 1500);

      } catch (err: unknown) {

        if (axios.isAxiosError(err)) {
          setMessage("");
          setError(
            err.response?.data?.message ??
            "Something went wrong."
          );

        } else {

          setError(
            "Something went wrong."
          );

        }

      } finally {

        setLoading(false);

      }

    };

  const handleResend =
    async () => {

      try {

        await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,

          {
            email,
          }

        );

        setCooldown(60);
        setError("");
        setMessage(
          "OTP sent successfully"
        );

      } catch (err: unknown) {

        if (axios.isAxiosError(err)) {
          setMessage("");

          setError(
            err.response?.data?.message ??
            "Something went wrong."
          );

        } else {

          setError(
            "Something went wrong."
          );

        }

      }

    };

  return (

    <main className="max-w-md mx-auto p-8">

      <h1 className="text-3xl font-bold mb-4">
        Verify Email
      </h1>

      <p className="mb-4 text-gray-600">
        Enter the OTP sent to
        <br />
        <strong>{email}</strong>
      </p>

      <form
        onSubmit={handleVerify}
        className="space-y-4"
      >

        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
            )
          }
          className="w-full border p-3"
        />

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="border p-3 w-full"
        >
          {loading
            ? "Verifying..."
            : "Verify Email"}
        </button>

      </form>

      <button
        disabled={cooldown > 0}
        onClick={handleResend}
      >
        {
          cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend OTP"
        }
      </button>

      {message && (
        <Toast
          message={message}
          type="success"
        />
      )}
      {
        error && (
          <p className="text-red-500 mt-4">
            {error}
          </p>
        )
      }

    </main>

  );

}