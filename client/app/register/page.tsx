"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import axios from "axios";
import Toast from "@/components/ui/Toast";

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

      setError("");
      setMessage(
        "Verification OTP sent to your email"
      );
      router.push(
        `/verify-email?email=${email}`
      );
    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

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

      {message && (
        <Toast
          message={message}
          type="success"
        />
      )}
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