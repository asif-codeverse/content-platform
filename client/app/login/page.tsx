"use client";

import { useState } from "react";
import { loginUser } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const result = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      alert("Login Success");
    } catch (err) {
      console.error(err);

      alert("Login Failed");
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

      <button type="submit">
        Login
      </button>
    </form>
  );
}