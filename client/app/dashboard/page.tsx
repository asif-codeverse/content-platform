"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardStats, getMyDashboardStats, } from "@/services/dashboard.service";
import { useAuth } from "@/context/AuthContext";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();

  const { user, loading, } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    published: 0,
    rejected: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!user) return;

    if (user.role === "ADMIN") getDashboardStats()
      .then(setStats)
      .catch(() => {
        // TODO: Show toast when dashboard stats fail to load
      });

    else getMyDashboardStats()
      .then(setStats)
      .catch(() => {
        // TODO: Show toast when dashboard stats fail to load
      });

  }, [
    user,
    loading,
    router,
  ]);


  if (loading) return (
    <div className="p-8">
      <LoadingSpinner
        text="Loading your articles..."
      />
    </div>
  );


  if (!user) return (
    <div className="p-8">
      Redirecting...
    </div>
  );


  return (
    <main className="mx-auto max-w-7xl p-8">

      <h1 className="text-3xl font-bold tracking-tight">
        Dashboard
      </h1>

      <div className="mt-2">
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold">{user.name}</span>
        </p>

        <p className="text-sm text-gray-500">
          {user.role}
        </p>
      </div>

      <div
        className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
            mt-8
        "
      >

        {[
          {
            title: "Total Articles",
            value: stats.total,
          },
          {
            title: "Draft Articles",
            value: stats.draft,
          },
          {
            title: "Pending Articles",
            value: stats.pending,
          },
          {
            title: "Published Articles",
            value: stats.published,
          },
          {
            title: "Rejected Articles",
            value: stats.rejected,
          },
          {
            title: "Total Views",
            value: stats.totalViews,
          },
        ].map((stat) => (

          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />

        ))}

      </div>


      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Link
          href="/dashboard/create"
          className="
rounded-xl
border
p-6
shadow-sm
transition
hover:-translate-y-1
hover:shadow-md
"
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
          className="
rounded-xl
border
p-6
shadow-sm
transition
hover:-translate-y-1
hover:shadow-md
"
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
              className="
rounded-xl
border
p-6
shadow-sm
transition
hover:-translate-y-1
hover:shadow-md
"
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
            className="
rounded-xl
border
p-6
shadow-sm
transition
hover:-translate-y-1
hover:shadow-md
"
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
            className="
rounded-xl
border
p-6
shadow-sm
transition
hover:-translate-y-1
hover:shadow-md
"
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