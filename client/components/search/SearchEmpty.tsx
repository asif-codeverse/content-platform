import EmptyState from "@/components/ui/EmptyState";

type Props = {
  query: string;
};

export default function SearchEmpty({
  query,
}: Props) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description={`No articles matched "${query}". Try different keywords or check your spelling.`}
    />
  );
}