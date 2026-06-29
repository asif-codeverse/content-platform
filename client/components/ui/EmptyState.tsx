type Props = {
  title: string;
  description: string;
  icon?: string;
};

export default function EmptyState({
  title,
  description,
  icon = "📄",
}: Props) {
  return (
    <div className="py-16 text-center">

      <div className="text-5xl">
        {icon}
      </div>

      <h2 className="mt-4 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-gray-500">
        {description}
      </p>

    </div>
  );
}