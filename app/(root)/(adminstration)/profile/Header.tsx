"use client";

import { User } from "@/types/user";
import { FiEdit3 } from "react-icons/fi";

type HeaderProps = {
  users: User[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onEdit: () => void;
  isEditing: boolean;
};

export const Header = ({ users, currentIndex, setCurrentIndex, onEdit, isEditing }: HeaderProps) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8">
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">View and manage user information based on role</p>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium"
        >
          {users.map((user, index) => (
            <option key={user.id} value={index}>
              {user.full_name} ({user.role})
            </option>
          ))}
        </select>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-md"
          >
            <FiEdit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </div>
);
