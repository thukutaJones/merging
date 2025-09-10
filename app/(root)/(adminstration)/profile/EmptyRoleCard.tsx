"use client";
import { User } from "@/types/user";
import { FiUser } from "react-icons/fi";

type EmptyRoleCardProps = { user: User };

export const EmptyRoleCard = ({ user }: EmptyRoleCardProps) => (
  <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-8">
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiUser className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Account</h3>
      <p className="text-gray-600">This is a {user.role} account with standard privileges.</p>
    </div>
  </div>
);
