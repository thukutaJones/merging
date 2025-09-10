/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import { User, Role } from "@/types/user";
import { BasicInfoCard } from "./BasicInfoCard";
import { AccountSummaryCard } from "./AccountSummaryCard";
import { PatientInfoCard } from "./PatientInfoCard";
import { StaffInfoCard } from "./StaffInfoCard";
import { EmptyRoleCard } from "./EmptyRoleCard";
import { FiEdit3 } from "react-icons/fi";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<User | {}>({});

  // Fetch profile from backend
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/profile/details", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();
        if (data.status !== 200) throw new Error("Failed to fetch profile");
        setCurrentUser(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getProfile();
  }, []);

  const handleEdit = () => {
    if (currentUser) {
      setEditData({
        full_name: currentUser.full_name,
        email: currentUser.email,
        phone: currentUser.phone,
        gender: currentUser.gender,
        dob: currentUser.dob?.split("T")[0], // convert ISO to yyyy-mm-dd
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      const res = await fetch("http://localhost:3001/api/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (data.status !== 200) throw new Error("Failed to update profile");
      console.log(data.data)
      setCurrentUser(data.data);

      setIsEditing(false);
      setEditData({});
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin":
        return "from-purple-500 to-purple-600";
      case "staff":
        return "from-emerald-500 to-green-600";
      case "patient":
        return "from-blue-500 to-indigo-600";
      case "hod":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
            <p className="text-gray-600">View and manage user information based on role</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700"
            >
              <FiEdit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {currentUser && (
          <>
            {/* Profile Header */}
            <div className={`bg-gradient-to-r ${getRoleColor(currentUser.role)} p-8 rounded-xl mb-8`}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FiEdit3 className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{currentUser.full_name}</h2>
                  <div className="flex flex-wrap gap-4 text-white/90">
                    <span>{currentUser.email}</span>
                    <span>{currentUser.phone}</span>
                  </div>
                  <div className="mt-4">
                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold text-white">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BasicInfoCard
                  user={currentUser}
                  editData={editData}
                  setEditData={setEditData}
                  isEditing={isEditing}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
              <AccountSummaryCard user={currentUser} />
            </div>

            {/* Role-specific Cards */}
            {currentUser.patientDetails ? (
              <PatientInfoCard user={currentUser} />
            ) : currentUser.staffDetails ? (
              <StaffInfoCard user={currentUser} />
            ) : (
              <EmptyRoleCard user={currentUser} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
