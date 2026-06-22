"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  const hideNavbar =
    pathname.startsWith("/verify-email") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideNavbar && (
        <Navbar />
      )}

      {children}
    </>
  );
}