// editUser.tsx
"use client";

import React, { FormEvent, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { User } from "@/types/user";

interface Department {
  _id: string;
  name: string;
}

interface UserModalProps {
  showModal: boolean;
  closeModal: () => void;
  editingUser: User | null;
  formData: Partial<User> & {
    password?: string;
    preferredLanguage?: string;
    departmentId?: string;
  };
  setFormData: Dispatch<
    SetStateAction<
      Partial<User> & { password?: string; preferredLanguage?: string; departmentId?: string }
    >
  >;
  departments?: Department[];
  token: string; // Pass the auth token
}

const UserModal: React.FC<UserModalProps> = ({
  showModal,
  closeModal,
  editingUser,
  formData,
  setFormData,
  departments = [],
  token,
}) => {
  if (!showModal) return null;

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (formData.role === "patient") {
        await axios.post("http://localhost:3001/api/users/createPatient", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (formData.role === "staff" || formData.role === "hod" || formData.role === "admin") {
        await axios.post("http://localhost:3001/api/users/createStaff", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingUser ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={formData.full_name || ""}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            >
               {/* janet zimba */}
              <option value="">Select role</option>
              <option value="patient">Patient</option>
              <option value="staff">Staff</option>
              <option value="hod">Head of Department</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Department (for staff & hod) */}
          {(formData.role === "staff" || formData.role === "hod") && (
            <div>
              <label className="block text-sm font-medium">Department</label>
              <select
                value={formData.departmentId || ""}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
                required
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password (only for new users) */}
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
                required
              />
            </div>
          )}

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium">Preferred Language</label>
            <input
              type="text"
              value={formData.preferredLanguage || ""}
              onChange={(e) =>
                setFormData({ ...formData, preferredLanguage: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {editingUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
