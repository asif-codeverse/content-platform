"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (
      !loading &&
      user &&
      user.role !== "ADMIN" &&
      user.role !== "EDITOR"
    ) {
      router.push("/");
    }
  }, [
    user,
    loading,
    router,
  ]);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-8">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome, {user.name}
      </p>

      <div className="mt-8 flex gap-4">

        {user.role === "ADMIN" && (
          <Link
            href="/dashboard/create"
            className="border p-3 rounded"
          >
            Create Article
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link
            href="/dashboard/manage"
            className="border p-3 rounded"
          >
            Manage Articles
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link
            href="/dashboard/users"
            className="border p-3 rounded"
          >
            Manage Users
          </Link>
        )}

      </div>

    </main>
  );
}