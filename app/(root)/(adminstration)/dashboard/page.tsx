/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/dashboard/HeroSection";
import Stats from "@/components/dashboard/Stats";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";


const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAuthorized } = useAuth([
    "admin",
    "manager",
    "department_head",
    "doctor",
    "nurse",
    "patient",
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        if (user.role === "admin") {
          const res = await axios.get(`http://localhost:3001/dashboard/admin`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          });
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isAuthenticated && isAuthorized) {
      fetchStats();
    }
  }, [user, isAuthenticated, isAuthorized]);

  if (isAuthenticated === undefined || isAuthorized === undefined || isLoading) {
    return <LoadingAnimation />;
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/sign-in");
    return <p>Redirecting...</p>;
  }

  if (!isAuthorized) {
    if (typeof window !== "undefined") router.push("/unauthorized");
    return <p>Redirecting...</p>;
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] overflow-auto scroll-container p-8">
      <HeroSection name={user?.full_name} />

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
    </div>
  );
};

export default Page;
