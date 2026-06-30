import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <main
      className="
        flex
        min-h-[70vh]
        items-center
        justify-center
        px-6
      "
    >
      <LoadingSpinner text="Loading..." />
    </main>
  );
}