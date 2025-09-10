"use client";
import { User } from "@/types/user";
import { FiActivity, FiFileText, FiClock, FiHeart } from "react-icons/fi";

type StaffInfoCardProps = { user: User };

export const StaffInfoCard = ({ user }: StaffInfoCardProps) => {
  if (!user.staffDetails) return null;

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <FiActivity className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          {user.role === "hod" ? "Head of Department Information" : "Staff Information"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InfoField icon={<FiActivity className="w-5 h-5 text-green-600" />} label="Staff Role" value={user.staffDetails.roleWithin.replace("_", " ")} />
          <InfoField icon={<FiFileText className="w-5 h-5 text-green-600" />} label="Department" value={`${user.departmentDetails?.name} - Department`} />
          <InfoField icon={<FiClock className="w-5 h-5 text-green-600" />} label="Working Hours" value={user.staffDetails.workingHours} />
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <FiHeart className="w-5 h-5 text-green-600" />
              <label className="text-sm font-semibold text-green-800">Specialties</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.staffDetails.specialties.map((spec, idx) => (
                <span key={idx} className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium">{spec}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type InfoFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoField = ({ icon, label, value }: InfoFieldProps) => (
  <div className="bg-green-50 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <label className="text-sm font-semibold text-green-800">{label}</label>
    </div>
    <p className="text-gray-900 font-medium">{value}</p>
  </div>
);
