"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardTopBar from "@/components/dashboard/DasboardTopar";
import LoadingAnimation from "@/components/LoadingAnimation";

import { adminMenuItems } from "@/constants/sideBarContents";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isAuthorized } = useAuth([
    "admin",
    "manager",
    "department_head",
    "doctor",
    "nurse",
    "patient",
    "staff",
  ]);

  if (isAuthenticated === undefined || isAuthorized === undefined) {
    return <LoadingAnimation />;
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.replace("/sign-in");
    return <p>Redirecting...</p>;
  }

  if (!isAuthorized) {
    if (typeof window !== "undefined") router.replace("/unauthorized");
    return <p>Redirecting...</p>;
  }

  return (
    <div className="flex w-full h-[100vh] overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar
        menuItems={adminMenuItems}
        userRole={user?.role}
        userEmail={user?.email}
        userName={user?.full_name}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopBar userName={user?.full_name} userEmail={user?.email} />
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
