"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "@/components/dashboard/HeroSection";
import Stats from "@/components/dashboard/Stats";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const { user, isAuthenticated, isAuthorized } = useAuth([
    "admin",
    "manager",
    "department_head",
    "doctor",
    "nurse",
    "patient",
    "staff",
  ]);

  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) return;
      setIsLoading(true);
      try {
        if (user.role === "admin") {
          const res = await axios.get("http://localhost:3001/dashboard/admin", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && isAuthorized) {
      fetchStats();
    }
  }, [isAuthenticated, isAuthorized, user?.token, user?.role]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <>
      <HeroSection name={stats?.userData?.full_name} />
      {user?.role === "admin" && stats && (
        <Stats
          stats={{
            patients: stats.users?.patients,
            staff: stats.users?.staff,
            hods: stats.users?.hods,
            departments: stats.departments,
          }}
        />
      )}
    </>
  );
};

export default DashboardPage;
