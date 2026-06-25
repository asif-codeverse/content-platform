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

    if (!loading && !user) {
      router.push("/login");
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
        Redirecting...
      </div>
    );
  }

  return (

    <main className="p-8">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome back, {user.name}
      </p>

      <p className="text-sm text-gray-500">
        Role: {user.role}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Link
          href="/dashboard/create"
          className="border rounded p-6 hover:bg-gray-50 transition cursor-pointer"
        >

          <h2 className="text-xl font-semibold">
            Create Article
          </h2>

          <p className="text-gray-600 mt-2">
            Write a new article.
          </p>

        </Link>

        <Link
          href="/dashboard/my"
          className="border rounded p-6 hover:bg-gray-50 transition cursor-pointer"
        >

          <h2 className="text-xl font-semibold">
            My Articles
          </h2>

          <p className="text-gray-600 mt-2">
            View and manage your articles.
          </p>

        </Link>

        {(
          user.role === "EDITOR" ||
          user.role === "ADMIN"
        ) && (

            <Link
              href="/dashboard/manage"
              className="border rounded p-6 hover:bg-gray-50 transition cursor-pointer"
            >

              <h2 className="text-xl font-semibold">
                Manage Articles
              </h2>

              <p className="text-gray-600 mt-2">
                Edit existing articles.
              </p>

            </Link>

          )}

        {user.role === "ADMIN" && (

          <Link
            href="/dashboard/pending"
            className="border rounded p-6 hover:bg-gray-50 transition cursor-pointer"
          >

            <h2 className="text-xl font-semibold">
              Pending Reviews
            </h2>

            <p className="text-gray-600 mt-2">
              Review submitted articles.
            </p>

          </Link>

        )}

        {user.role === "ADMIN" && (

          <Link
            href="/dashboard/users"
            className="border rounded p-6 hover:bg-gray-50 transition cursor-pointer"
          >

            <h2 className="text-xl font-semibold">
              Manage Users
            </h2>

            <p className="text-gray-600 mt-2">
              Update user roles.
            </p>

          </Link>

        )}

      </div>

    </main>
  );
}