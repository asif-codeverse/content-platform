"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Article } from "@/types/article";
import {
  getArticles,
} from "@/services/article.service";

export default function ArticlesPage() {

  const [articles, setArticles] =
    useState<Article[]>([]);
  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  useEffect(() => {

    const loadArticles =
      async () => {

        try {

          const data =
            await getArticles(page);

          setArticles(data.data);

          setTotalPages(
            data.meta.totalPages
          );

        } finally {

          setLoading(false);

        }
      };

    loadArticles();

  }, [page]);

  if (loading) {
    return (
      <LoadingSpinner
        text="Loading articles..."
      />
    );
  }

  return (
    <>

      <main className="p-8">

        <h1
          className="
          text-3xl
          font-bold
          mb-6
        "
        >
          Articles
        </h1>

        <div
          className="
          flex
          flex-col
          gap-6
        "
        >
          {articles.map((article) => (

            <div
              key={article._id}
              className="
              border
              p-4
              rounded
            "
            >
              <Link
                href={`/articles/${article.slug}`}
              >
                <h2 className="text-2xl font-bold">
                  {article.title}
                </h2>
              </Link>

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(
                (prev) =>
                  Math.max(
                    prev - 1,
                    1
                  )
              )
            }
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage(
                prev => prev + 1
              )
            }
          >
            Next
          </button>

        </div>

      </main>
    </>
  );
}