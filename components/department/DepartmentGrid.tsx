"use client";
import React from "react";
import { Department } from "@/types/department";
import { DepartmentCard } from "./DepartmentCard";

interface Props {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export const DepartmentsGrid: React.FC<Props> = ({ departments, onEdit, onDelete }) => {
  if (departments.length === 0) return <p className="text-center text-gray-500 mt-10">No departments found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <DepartmentCard key={dept._id} department={dept} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
