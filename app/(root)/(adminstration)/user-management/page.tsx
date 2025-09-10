"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import EditAddUserModal from "@/components/userManagement/EditAddUserModal";
import Header from "./Header";
import UsersTable from "@/components/userManagement/UsersTable";
import { User } from "@/types/user";
import { Department } from "@/types/service_dept";
import React, { useEffect, useState } from "react";
import { Role } from "@/types/profileTypes";

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<
    Partial<User> & {
      password?: string;
      preferredLanguage?: string;
      departmentId?: string;
      roleWithin?: string;
      specialties?: string[];
      workingHours?: string[];
      address?: string;
      nationId?: string;
      emergencyContact?: string;
      conditions?: string[];
      medicalRecords?: File[];
    }
  >({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          "Cache-Control": "no-cache",
        },
      });
      const { data } = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/departments/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          "Cache-Control": "no-cache",
        },
      });
      const { data } = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUsers();
      fetchDepartments();
    }
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      role: undefined,
      status: "active",
      gender: "male",
      dob: "",
      patientDetails: {
        address: "",
        nationId: "",
        conditions: [],
        emergencyContact: "",
        medicalRecords: [],
      },
      staffDetails: {
        roleWithin: "doctor",
        specialties: [],
        department: "",
        workingHours: "",
      },
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setFormData(user);
    setEditingUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    resetForm();
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          openAddModal={openAddModal}
        />

        <UsersTable users={filteredUsers} openEditModal={openEditModal} />

        {showModal && (
          <EditAddUserModal
            editingUser={editingUser}
            closeModal={closeModal}
            formData={formData}
            department={departments} 
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
