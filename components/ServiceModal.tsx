"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import { Service, Department } from "../types/service_dept";

interface Props {
  show: boolean;
  onClose: () => void;
  formData: Partial<Service>;
  setFormData: (data: Partial<Service>) => void;
  onSave: () => void;
  departments: Department[];
  editingService: Service | null;
}

const ServiceModal: React.FC<Props> = ({
  show,
  onClose,
  formData,
  setFormData,
  onSave,
  departments,
  editingService,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{editingService ? "Edit Service" : "Add New Service"}</h2>
              <p className="text-blue-100 text-sm">
                {editingService ? "Update service information and details" : "Create a new hospital service"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6 max-h-[calc(90vh-140px)] overflow-auto">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Service Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-800 font-medium"
              placeholder="Enter service name"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Department</label>
            <select
              value={formData.departmentId || ""}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-800 font-medium"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-800 font-medium resize-none"
              rows={4}
              placeholder="Enter service description"
            />
          </div>

          {/* Emergency */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isEmergencyService || false}
                onChange={(e) => setFormData({ ...formData, isEmergencyService: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-800">Emergency Service</span>
            </label>
            <p className="text-sm text-gray-600 mt-1 ml-8">Check if this is an emergency or urgent care service</p>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingService ? "Update Service" : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
