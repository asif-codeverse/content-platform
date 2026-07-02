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
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        md:gap-8
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