"use client";
import { User } from "@/types/user";
import { FiUser, FiX, FiSave } from "react-icons/fi";

type BasicInfoCardProps = {
  user: User;
  editData: Partial<User>;
  setEditData: (data: Partial<User>) => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export const BasicInfoCard = ({
  user,
  editData,
  setEditData,
  isEditing,
  onSave,
  onCancel,
}: BasicInfoCardProps) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <button
              onClick={onSave}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FiSave className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Field
            label="Full Name"
            value={user.full_name}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            field="full_name"
          />
          <Field
            label="Email Address"
            value={user.email}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            field="email"
          />
          <Field
            label="Phone Number"
            value={user.phone}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            field="phone"
          />
        </div>

        <div className="space-y-6">
          <Field
            label="Gender"
            value={user.gender}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            field="gender"
            type="select"
          />
          <Field
            label="Date of Birth"
            value={formatDate(user.dob)}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            field="dob"
            type="date"
          />
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Login
            </label>
            <p className="text-gray-900 font-medium">
              {new Date(user.lastLogin).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type FieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  editData: Partial<User>;
  setEditData: (data: Partial<User>) => void;
  field: keyof User;
  type?: "text" | "email" | "tel" | "select" | "date";
};

const Field = ({
  label,
  value,
  isEditing,
  editData,
  setEditData,
  field,
  type = "text",
}: FieldProps) => {
  if (!isEditing)
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    );

  if (type === "select") {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <select
          value={editData[field] ? String(editData[field]) : ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              [field]: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={editData[field] !== undefined ? String(editData[field]) : ""}
        onChange={(e) =>
          setEditData({
            ...editData,
            [field]: e.target.value,
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};
