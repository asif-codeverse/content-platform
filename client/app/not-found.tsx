import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-8">

      <h1 className="text-4xl font-bold">
        404
      </h1>

      <p className="mt-4">
        Page not found.
      </p>

      <Link
        href="/"
        className="underline"
      >
        Return Home
      </Link>

    </main>
  );
}