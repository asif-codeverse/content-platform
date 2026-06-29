"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyState from "@/components/ui/EmptyState";

import { searchArticles } from "@/services/article.service";
import type { Article } from "@/types/article";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const query =
    searchParams.get("q") || "";

  const [results, setResults] =
    useState<Article[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!query) return;

    const runSearch =
      async () => {
        try {
          setLoading(true);

          const data =
            await searchArticles(query);

          setResults(data.data);
        } finally {
          setLoading(false);
        }
      };

    runSearch();
  }, [query]);

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Search Results
      </h1>

      <p className="mb-6">
        Query: {query}
      </p>

      {loading && (
        <p>Searching...</p>
      )}

      {!loading &&
        results.length === 0 && (

          <EmptyState
            icon="🔍"
            title="No Results Found"
            description="Try searching with different keywords."
          />

        )}

      <div className="flex flex-col gap-4">

        {results.map((article) => (

          <div
            key={article._id}
            className="border p-4 rounded"
          >
            <Link
              href={`/articles/${article.slug}`}
            >
              <h2 className="font-bold">
                {article.title}
              </h2>
            </Link>

            <p>
              {article.excerpt}
            </p>
          </div>

        ))}

      </div>

    </main>
  );
}