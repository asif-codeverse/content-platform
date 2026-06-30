import type { Article } from "@/types/article";

import PublicArticleCard from "@/components/articles/PublicArticleCard";

type Props = {
  articles: Article[];
};

export default function SearchResults({
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