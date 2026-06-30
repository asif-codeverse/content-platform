import type { Article } from "@/types/article";

import PublicArticleCard from "./PublicArticleCard";

type Props = {
  articles: Article[];
};

export default function ArticlesGrid({
  articles,
}: Props) {
  return (
    <section
      className="
        grid
        gap-8
      "
    >
      {articles.map((article) => (
        <PublicArticleCard
          key={article._id}
          article={article}
        />
      ))}
    </section>
  );
}