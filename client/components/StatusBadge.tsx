type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {

  const colors = {

    DRAFT:
      "bg-gray-200 text-gray-800",

    PENDING:
      "bg-yellow-200 text-yellow-800",

    PUBLISHED:
      "bg-green-200 text-green-800",

    REJECTED:
      "bg-red-200 text-red-800",

  };

  return (

    <span
      className={`px-3 py-1 rounded text-sm ${
        colors[
          status as keyof typeof colors
        ]
      }`}
    >
      {status}
    </span>

  );

}