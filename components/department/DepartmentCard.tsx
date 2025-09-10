"use client";
import React from "react";
import { FiEdit3, FiTrash2, FiMapPin, FiPhone, FiFileText, FiClock, FiExternalLink, FiMap } from "react-icons/fi";
import { RiBuildingLine } from "react-icons/ri";
import { Department } from "@/types/department";

interface Props {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export const DepartmentCard: React.FC<Props> = ({ department, onEdit, onDelete }) => {
  const hasLocation = department.mapCoords?.lat && department.mapCoords?.lng;

  const generateGoogleMapsUrl = (lat: number, lng: number) =>
    `https://maps.google.com/?q=${lat},${lng}`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="group bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-blue-200/50">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <RiBuildingLine className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{department.name}</h3>
            <p className="text-sm font-medium text-gray-500">Location: {department.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => onEdit(department)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110" title="Edit Department">
            <FiEdit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(department._id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110" title="Delete Department">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100/50">
          <div className="flex items-start gap-3">
            <FiFileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{department.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
            <FiPhone className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</p>
            <p className="text-sm font-semibold text-gray-900">{department.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
            <FiMapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">{department.location || "Location not specified"}</p>
              {hasLocation && (
                <a href={generateGoogleMapsUrl(department.mapCoords!.lat, department.mapCoords!.lng)} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110" title="View on Google Maps">
                  <FiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiClock className="w-3 h-3" />
            <span>Created {formatDate(department.createdAt)}</span>
          </div>
          {hasLocation && (
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <FiMap className="w-3 h-3" />
              <span>GPS Enabled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
