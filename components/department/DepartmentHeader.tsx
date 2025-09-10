"use client";
import React, { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

interface Props {
  onAdd: () => void;
  onSearch: (query: string) => void;
}

export const DepartmentsHeader: React.FC<Props> = ({ onAdd, onSearch }) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-3 w-full md:w-1/2">
        <FiSearch className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button onClick={onAdd} className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
        <FiPlus /> Add Department
      </button>
    </div>
  );
};
