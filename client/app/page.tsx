import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="p-8">
        <h1 className="text-4xl font-bold">
          Content Platform
        </h1>

        <p className="mt-4">
          Production Ready CMS Platform
        </p>
      </main>
    </>
  );
}