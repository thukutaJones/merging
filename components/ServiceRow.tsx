"use client";

import React from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiTrash2,
  FiFileText,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Service } from "../types/service_dept";

interface Props {
  service: Service;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const ServiceRow: React.FC<Props> = ({
  service,
  isExpanded,
  toggleExpand,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <React.Fragment>
      <tr className="hover:bg-blue-50/50 transition-all duration-200 group">
        <td className="px-6 py-5">
          <div className="flex items-center">
            <div>
              <div className="text-base font-bold text-gray-900">
                {service.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <span className="px-4 py-2 rounded-full text-sm font-bold shadow-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            {service.department}
          </span>
        </td>
        <td className="px-6 py-5">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
              service.isEmergencyService
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            }`}
          >
            {service.isEmergencyService ? "Emergency" : "Regular"}
          </span>
        </td>
        <td className="px-6 py-5 text-sm text-gray-600 font-medium">
          {formatDate(service.createdAt)}
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleExpand(service.id)}
              className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              title="View Details"
            >
              {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            </button>
            <button
              onClick={() => onEdit(service)}
              className="p-3 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              title="Edit Service"
            >
              <FiEdit3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              title="Delete Service"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expandable Row */}
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="space-y-6">
              <h4 className="font-bold text-xl text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Service Details
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiFileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-700 block mb-2">Description</span>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">Department</span>
                      <span className="text-gray-600">{service.department}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiClock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">Created Date</span>
                      <span className="text-gray-600">{formatDate(service.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      service.isEmergencyService ? "bg-red-100" : "bg-green-100"
                    }`}>
                      {service.isEmergencyService ? (
                        <FiAlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">Service Type</span>
                      <span className="text-gray-600">{service.isEmergencyService ? "Emergency Service" : "Regular Service"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default ServiceRow;
