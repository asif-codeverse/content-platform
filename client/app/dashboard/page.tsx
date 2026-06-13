"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/services/auth.service";
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {

  useEffect(() => {

    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log(user);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();

  }, []);

  return (<>
    <LogoutButton />
    <h1>Dashboard</h1>
  </>);
}