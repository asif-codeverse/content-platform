"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {

  const router = useRouter();

  const [query, setQuery] =
    useState("");

  const handleSubmit =
    (e: React.FormEvent) => {

      e.preventDefault();

      if (!query.trim()) {
        return;
      }

      router.push(
        `/search?q=${encodeURIComponent(query)}`
      );
    };

  return (

    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >

      <input
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        placeholder="Search articles..."
        className="border p-2"
      />

      <button
        type="submit"
        className="border px-4"
      >
        Search
      </button>

    </form>
  );
}