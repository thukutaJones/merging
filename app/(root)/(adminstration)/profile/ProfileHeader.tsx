"use client";

import { User, Role } from "@/types/user";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

type ProfileHeaderProps = {
  user: User;
};

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin": return "from-purple-500 to-purple-600";
      case "staff": return "from-emerald-500 to-green-600";
      case "patient": return "from-blue-500 to-indigo-600";
      case "hod": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden mb-8">
      <div className={`bg-gradient-to-r ${getRoleColor(user.role)} p-8`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FiUser className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{user.full_name}</h2>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold text-white">
                {user.role.toUpperCase()}
              </span>
              <span className={`ml-3 px-4 py-2 rounded-full text-sm font-bold ${
                user.status === "active" ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
              }`}>
                {user.status === "active" ? "Active" : "Deactivated"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
