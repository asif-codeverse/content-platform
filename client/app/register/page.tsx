"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);
        await registerUser(
          name,
          email,
          password
        );

      // console.log(result);

      setError("");
      setMessage(
        "Verification OTP sent to your email"
      );
      router.push(
        `/verify-email?email=${email}`
      );
    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Registration Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 flex flex-col gap-4"
    >
      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      {
        error && (
          <p className="text-red-500">
            {error}
          </p>
        )
      }

      {
        message && (
          <p className="text-green-600">
            {message}
          </p>
        )
      }
      <button
        disabled={loading}
      >
        {
          loading
            ? "Registering..."
            : "Register"
        }
      </button>
    </form>
  );
}