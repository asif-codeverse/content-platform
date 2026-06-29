"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const result = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      await refreshUser();

      router.push("/");
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

      <Link href="/forgot-password">
        Forgot Password?
      </Link>

      {
        error && (
          <p className="text-red-500">
            {error}
          </p>
        )
      }

      <button type="submit"
        disabled={loading}>
        {
          loading
            ? "Logging in..."
            : "Login"
        }
      </button>
    </form>
  );
}