"use client";

import {
  logoutUser,
} from "@/services/auth.service";

export default function LogoutButton() {

  const handleLogout =
    async () => {

      await logoutUser();

      localStorage.removeItem(
        "accessToken"
      );

      window.location.href =
        "/login";
    };

  return (
    <button
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}