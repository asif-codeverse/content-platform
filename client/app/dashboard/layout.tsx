import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <section
        className="
          container-page
          py-10
          space-y-8
        "
      >
        {children}
      </section>
    </ProtectedRoute>
  );
}