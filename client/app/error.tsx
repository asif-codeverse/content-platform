"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  return (

    <main className="p-8">

      <h1 className="text-3xl font-bold">
        Something went wrong
      </h1>

      <p className="mt-4">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="border p-2 mt-4"
      >
        Try Again
      </button>

    </main>
  );
}