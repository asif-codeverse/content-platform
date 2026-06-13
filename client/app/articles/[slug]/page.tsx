"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getArticleBySlug,
} from "@/services/article.service";

export default function ArticlePage() {

  const params = useParams();

  const slug =
    params.slug as string;

  const [article, setArticle] =
    useState<any>(null);

  useEffect(() => {

    const loadArticle =
      async () => {

        try {

          const data =
            await getArticleBySlug(
              slug
            );

          console.log(data);

          setArticle(data);

        } catch (err) {

          console.error(err);

        }
      };

    if (slug) {
      loadArticle();
    }

  }, [slug]);

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold">
        {article.title}
      </h1>

      <p className="mt-6">
        {article.content}
      </p>

    </div>
  );
}