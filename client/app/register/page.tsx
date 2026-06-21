"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const result =
        await registerUser(
          name,
          email,
          password
        );

      // console.log(result);

      alert(
        "Verification OTP sent to your email"
      );
      router.push(
        `/verify-email?email=${email}`
      );
    } catch (err) {
      // console.error(err);
      alert("Registration Failed");
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

      <button type="submit">
        Register
      </button>
    </form>
  );
}