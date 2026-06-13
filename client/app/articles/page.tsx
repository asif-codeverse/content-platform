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

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  useEffect(() => {

    const loadArticles =
  async () => {

    try {

      console.log(
        "LOADING PAGE:",
        page
      );

      const data =
        await getArticles(page);

      setArticles(
        data.data
      );

    } catch (err) {

      console.error(err);

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
            Page {page}
          </span>

          <button
            onClick={() =>
              setPage(
                (prev) =>
                  prev + 1
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