"use client";

import Link from "next/link";

export default function DashboardPage() {

  return (
    <main className="p-8">

      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="mt-8 flex gap-4">

        <Link
          href="/dashboard/create"
          className="border p-3 rounded"
        >
          Create Article
        </Link>

        <Link
          href="/dashboard/manage"
          className="border p-3 rounded"
        >
          Manage Articles
        </Link>

      </div>

    </main>
  );
}