"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/motion/PageTransition";
import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";

import { useAuth } from "@/context/AuthContext";
import {
  getDashboardStats,
  getMyDashboardStats,
} from "@/services/dashboard.service";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    published: 0,
    rejected: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!user) return;

    const fetchStats =
      user.role === "ADMIN"
        ? getDashboardStats
        : getMyDashboardStats;

    fetchStats()
      .then(setStats)
      .catch(() => {
        // TODO: Show toast when dashboard stats fail to load
      });
  }, [loading, router, user]);

  if (loading) {
    return (
      <LoadingSpinner text="Loading your dashboard..." />
    );
  }

  if (!user) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  return (
    <PageTransition>
      <div className="space-y-10">
        <DashboardHero
          name={user.name}
          role={user.role}
        />

        <StatsGrid
          stats={stats}
        />

        <QuickActions
          role={user.role}
        />
      </div>
    </PageTransition>
  );
}