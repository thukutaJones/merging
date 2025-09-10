"use client";
import { User, Role } from "@/types/user";

type AccountSummaryCardProps = { user: User };

export const AccountSummaryCard = ({ user }: AccountSummaryCardProps) => {
  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin": return "from-purple-500 to-purple-600";
      case "staff": return "from-emerald-500 to-green-600";
      case "patient": return "from-blue-500 to-indigo-600";
      case "hod": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Account Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center"><span className="text-gray-600">User ID</span><span className="font-medium text-gray-900">#{user._id.slice(0,6)}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-600">Account Created</span><span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Role</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getRoleColor(user.role)}`}>{user.role.toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>{user.status === "active" ? "Active" : "Deactivated"}</span>
        </div>
      </div>
    </div>
  );
};
