"use client";

import React from "react";
import { FiSearch, FiFilter, FiAlertCircle, FiPlus } from "react-icons/fi";

type Dept = {
  id?: string;
  _id?: string;
  name: string;
};

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterDepartment: string;
  setFilterDepartment: (value: string) => void;
  filterEmergency: string;
  setFilterEmergency: (value: string) => void;
  departments?: Dept[] | null;
  onAddClick: () => void;
}

const SearchAndFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterEmergency,
  setFilterEmergency,
  departments,
  onAddClick,
}) => {
  // Ensure we always have an array to map over to prevent "cannot read properties of undefined (reading 'map')"
  const depts: Dept[] = Array.isArray(departments) ? departments : [];

  return (
    <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
      {/* Search */}
      <div className="flex items-center w-full sm:flex-1 lg:w-80 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2">
        <FiSearch className="text-gray-500 w-5 h-5 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* Department Filter */}
      <div className="flex items-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 min-w-[150px]">
        <FiFilter className="text-gray-400 w-5 h-5 mr-2 shrink-0" />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        >
          <option value="all">All Departments</option>
          {depts.map((dept) => {
            const key = dept.id ?? dept._id ?? dept.name;
            const value = dept.id ?? dept._id ?? dept.name;
            return (
              <option key={key} value={value}>
                {dept.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Emergency Filter */}
      <div className="flex items-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 min-w-[130px]">
        <FiAlertCircle className="text-gray-400 w-5 h-5 mr-2 shrink-0" />
        <select
          value={filterEmergency}
          onChange={(e) => setFilterEmergency(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        >
          <option value="all">All Services</option>
          <option value="emergency">Emergency</option>
          <option value="regular">Regular</option>
        </select>
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <FiPlus className="w-5 h-5" />
        Add Service
      </button>
    </div>
  );
};

export default SearchAndFilters;
