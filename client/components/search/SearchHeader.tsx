type Props = {
  query: string;
  total: number;
};

export default function SearchHeader({
  query,
  total,
}: Props) {
  return (
    <section className="mb-10">
      <h1
        className="
          text-4xl
          font-bold
          tracking-tight
        "
      >
        Search Results
      </h1>

      <p
        className="
          mt-3
          text-lg
          text-[var(--muted)]
        "
      >
        Showing results for{" "}
        <span className="font-semibold text-[var(--foreground)]">
          &ldquo;{query}&rdquo;
        </span>
      </p>

      <p
        className="
          mt-5
          inline-flex
          rounded-full
          bg-[var(--surface-secondary)]
          px-4
          py-2
          text-sm
          font-medium
          text-[var(--muted)]
        "
      >
        {total} Result{total !== 1 && "s"}
      </p>
    </section>
  );
}