"use client";

import { useState } from "react";

import {
  searchArticles
} from "@/services/article.service";

export default function SearchPage() {

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<any[]>([]);

  const handleSearch =
    async () => {

      const data =
        await searchArticles(
          query
        );

      setResults(
        data.data || []
      );
    };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Search Articles
      </h1>

      <div className="flex gap-2">

        <input
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          className="border p-2"
          placeholder="Search..."
        />

        <button
          onClick={handleSearch}
          className="border px-4"
        >
          Search
        </button>

      </div>

      <div className="mt-6">

        {results.map(
          (article) => (
            <div
              key={article._id}
              className="border p-4 mb-4"
            >
              <h2>
                {article.title}
              </h2>
            </div>
          )
        )}

      </div>

    </div>
  );
}