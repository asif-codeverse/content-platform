import StatsCard from "@/components/StatsCard";

type Props = {
  stats: {
    total: number;
    draft: number;
    pending: number;
    published: number;
    rejected: number;
    totalViews: number;
  };
};

export default function StatsGrid({
  stats,
}: Props) {
  const cards = [
    {
      title: "Total Articles",
      value: stats.total,
    },
    {
      title: "Draft Articles",
      value: stats.draft,
    },
    {
      title: "Pending Articles",
      value: stats.pending,
    },
    {
      title: "Published Articles",
      value: stats.published,
    },
    {
      title: "Rejected Articles",
      value: stats.rejected,
    },
    {
      title: "Total Views",
      value: stats.totalViews,
    },
  ];

  return (
    <section
      className="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
        />
      ))}
    </section>
  );
}