"use client";
import React, { useState, useEffect } from "react";
import { Department } from "@/types/department";
import { DepartmentsHeader } from "@/components/department/DepartmentHeader";
import { DepartmentsGrid } from "@/components/department/DepartmentGrid";
import { DepartmentFormModal } from "@/components/department/DepartmentFormModal";
import { DeleteConfirmModal } from "@/components/department/DeleteConfirmModal";

// Dummy API simulation
// const fetchDepartments = async (): Promise<Department[]> => {
//   return new Promise((res) =>
//     setTimeout(
//       () =>
//         res([
//           { _id: "1", name: "HR", description: "Handles human resources", location: "Building A", contactPhone: "12345", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
//           { _id: "2", name: "IT", description: "Handles IT", location: "Building B", contactPhone: "67890", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
//         ]),
//       500
//     )
//   );
// };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filtered, setFiltered] = useState<Department[]>([]);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);

  useEffect(() => {
    const get_all_departments = async () => {
      const res = await fetch("/api/departments/all" ,{
        method: 'GET',
        headers: {
          'Content-Type': 'application-json',
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        }
      })

      const data = await res.json()
      setDepartments(data.data || [])
      setFiltered(data.data || [])
    }

    get_all_departments()
  }, []);

  const handleSearch = (query: string) => {
    if (!query) return setFiltered(departments);
    setFiltered(departments.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())));
  };

  const handleAdd = () => {
    setEditingDept(null);
    setShowFormModal(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setShowFormModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingDeptId(id);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = (data: Partial<Department>) => {
    if (editingDept) {
      // update
      setDepartments((prev) => prev.map((d) => (d._id === editingDept._id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d)));
    } else {
      // create
      const newDept: Department = { ...data, _id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Department;
      setDepartments((prev) => [newDept, ...prev]);
    }
    setShowFormModal(false);
  };

  const confirmDelete = () => {
    setDepartments((prev) => prev.filter((d) => d._id !== deletingDeptId));
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6">
      <DepartmentsHeader onAdd={handleAdd} onSearch={handleSearch} />
      <DepartmentsGrid departments={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      {showFormModal && <DepartmentFormModal department={editingDept} onClose={() => setShowFormModal(false)} onSubmit={handleFormSubmit} />}
      {showDeleteModal && <DeleteConfirmModal onCancel={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />}
    </div>
  );
}
