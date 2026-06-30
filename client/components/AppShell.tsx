"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/verify-email");

  return (
    <div
      className="
        min-h-screen
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {!hideNavbar && <Navbar />}

      <main
        className={
          hideNavbar
            ? "min-h-screen"
            : "pt-24 pb-12"
        }
      >
        {children}
      </main>
    </div>
  );
}