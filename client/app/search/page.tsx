"use client";

import { useState } from "react";
import Link from "next/link";
import {
  searchArticles
} from "@/services/article.service";
import Navbar
  from "@/components/Navbar";

export default function SearchPage() {

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const data = await searchArticles(query);

      setResults(data.data || []);
      setError("");
    } catch (err) {
      console.error("Search failed:", err);

      setResults([]);
      setError("Failed to search articles");
    }
  };

  return (
    <div className="p-8">
      <Navbar />

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />


        <button
          onClick={handleSearch}
          className="border px-4"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-2">
          {error}
        </p>
      )}

      <div className="mt-6">

        {results.map(
          (article) => (
            <div
              key={article._id}
              className="border p-4 mb-4"
            >
              <Link
                href={`/articles/${article.slug}`}
              >
                <h2 className="font-bold text-xl">
                  {article.title}
                </h2>
              </Link>
              <p className="mt-2">
                {article.content.slice(0, 100)}...
              </p>
            </div>
          )
        )}
        {
          !error &&
          results.length === 0 &&
          query &&
          (
            <p>
              No articles found
            </p>
          )
        }

      </div>

    </div>
  );
}