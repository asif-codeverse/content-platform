"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email") || "";

  const [otp, setOtp] =
    useState("");

  const [resending, setResending] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleVerify =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await axios.post(

            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,

            {
              email,
              otp,
            }

          );

        setMessage(
          "Email verified successfully"
        );

        setTimeout(() => {

          router.push("/login");

        }, 1500);

      } catch (error: any) {

        setMessage(
          error.response?.data?.message ||
          "Verification failed"
        );

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

        alert(
          "OTP sent successfully"
        );

      } catch (error: any) {

        alert(
          error.response?.data?.message ||
          "Failed to resend OTP"
        );

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
          disabled={loading}
          className="border p-3 w-full"
        >
          {loading
            ? "Verifying..."
            : "Verify Email"}
        </button>

      </form>

      <button
        onClick={handleResend}
        className="mt-4 border p-3 w-full"
      >
        Resend OTP
      </button>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}

    </main>

  );

}