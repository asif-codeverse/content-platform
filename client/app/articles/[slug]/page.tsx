"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getArticleBySlug,
} from "@/services/article.service";
import Navbar from "@/components/Navbar";

export default function ArticlePage() {

  const params = useParams();

  const slug =
    params.slug as string;

  const [article, setArticle] =
    useState<any>(null);
  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadArticle =
      async () => {

        try {

          const data =
            await getArticleBySlug(
              slug
            );

          console.log(data);

          setArticle(data.data);

        } catch (err) {
          setError(
            "Article not found"
          );

          console.error(err);

        }
      };

    if (slug) {
      loadArticle();
    }

  }, [slug]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!article) {
    return <p>Loading article...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="p-8">


        <h1 className="text-4xl font-bold">
          {article.title}
        </h1>

        <p className="mt-6">
          {article.content}
        </p>

      </div>
    </>
  );
}