"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";

import {
  getArticles,
} from "@/services/article.service";

import Navbar
  from "@/components/Navbar";

export default function ArticlesPage() {

  const [articles, setArticles] =
    useState([]);

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

          // console.log(
          //   "LOADING PAGE:",
          //   page
          // );

          const data =
            await getArticles(page);

          setArticles(data.data);

          setTotalPages(
            data.meta.totalPages
          );

        } catch (err) {

          // console.error(err);

        } finally {

          setLoading(false);

        }
      };

    loadArticles();

  }, [page]);

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />

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
          {articles.map(
            (article: any) => (

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

                <p
                  className="mt-2"
                >
                  {
                    article.content
                      .slice(0, 150)
                  }
                  ...
                </p>
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