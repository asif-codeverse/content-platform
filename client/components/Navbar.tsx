"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth.service";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  const isLoggedIn = !!user;


  const handleLogout = async () => {

    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("accessToken");
      logout();
      router.push("/");
    }

  };

  return (
    <nav className="flex items-center gap-6 p-4 border-b">

      <SearchBar />

      <Link href="/">
        Home
      </Link>

      <Link href="/articles">
        Articles
      </Link>

      {!isLoggedIn && (
        <>
          <Link href="/login">
            Login
          </Link>

          <Link href="/register">
            Register
          </Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link href="/dashboard">
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}

    </nav>
  );
}