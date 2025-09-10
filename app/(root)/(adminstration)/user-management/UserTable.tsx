/* eslint-disable */
// File: src/components/userManagement/UsersTable.tsx
"use client";

import React from "react";
import {
  FiUser,
  FiMail,
  FiChevronUp,
  FiChevronDown,
  FiMapPin,
  FiFileText,
  FiPhone,
  FiHeart,
  FiActivity,
  FiClock,
} from "react-icons/fi";
import { User } from "@/types/user";

type UsersTableProps = {
  filteredUsers?: User[] | null;
  expandedRows?: Set<string> | null;
  toggleRowExpansion?: (userId: string) => void;
};

const UsersTable = ({
  filteredUsers = [],
  expandedRows = new Set<string>(),
  toggleRowExpansion = () => {},
}: UsersTableProps) => {
  const rows = Array.isArray(filteredUsers) ? filteredUsers : [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-black bg-gray-100">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500 font-medium">
                  No users found
                </td>
              </tr>
            ) : (
              rows.map((userRaw) => {
                const user = userRaw as any;
                const uid = user.id ?? user._id ?? String(user.email ?? "");
                const role = user.role ?? "patient";
                const status = user.status ?? "active";
                const full_name = user.full_name ?? user.full_name ?? user.name ?? "Unknown";
                const email = user.email ?? "no-email@example.com";
                const lastLogin = user.lastLogin ?? user.last_login ?? user.updatedAt ?? null;
                const lastLoginDisplay = lastLogin ? new Date(lastLogin).toDateString() : "—";

                const patientDetails = user.patientDetails ?? null;
                const staffDetails = user.staffDetails ?? null;

                return (
                  <React.Fragment key={uid}>
                    <tr className="hover:bg-blue-50/50 transition-all duration-200 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <FiUser className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-base font-bold text-gray-900">
                              {full_name}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <FiMail className="w-4 h-4" />
                              {email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${role === "admin"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                            : role === "staff"
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                              : role === "patient"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            }`}
                        >
                          {String(role).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${status === "active"
                            ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                            : "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            }`}
                        >
                          {status === "active" ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                        {lastLoginDisplay}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {(patientDetails || staffDetails) && (
                            <button
                              onClick={() => toggleRowExpansion(uid)}
                              className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                              title="View Details"
                            >
                              {expandedRows && expandedRows.has(uid) ? (
                                <FiChevronUp className="w-5 h-5" />
                              ) : (
                                <FiChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Row */}
                    {expandedRows && expandedRows.has(uid) && (patientDetails || staffDetails) && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50"
                        >
                          <div className="space-y-6">
                            <h4 className="font-bold text-xl text-gray-900 mb-4 border-b border-gray-200 pb-2">
                              Additional Details
                            </h4>

                            {patientDetails && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiMapPin className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Address
                                        </span>
                                        <span className="text-gray-600">
                                          {String(patientDetails.address ?? "—")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiFileText className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Nation ID
                                        </span>
                                        <span className="text-gray-600">
                                          {String(patientDetails.nationId ?? "—")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FiPhone className="w-4 h-4 text-red-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Emergency Contact
                                        </span>
                                        <span className="text-gray-600">
                                          {String(patientDetails.emergencyContact ?? "—")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-3 text-sm">
                                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiHeart className="w-4 h-4 text-orange-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-semibold text-gray-700 block mb-2">
                                          Medical Conditions
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {Array.isArray(patientDetails.conditions) && patientDetails.conditions.length > 0 ? (
                                            patientDetails.conditions.map((condition: any, index: number) => (
                                              <span
                                                key={index}
                                                className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-medium shadow-sm"
                                              >
                                                {condition}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-sm text-gray-500">No known conditions</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {staffDetails && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiActivity className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Role
                                        </span>
                                        <span className="text-gray-600 capitalize">
                                          {String(staffDetails.roleWithin ?? "—").replace("_", " ")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiFileText className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Department
                                        </span>
                                        <span className="text-gray-600">
                                          {String(staffDetails.department?.name ?? staffDetails.department ?? "—")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-4 h-4 text-purple-600" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 block">
                                          Working Hours
                                        </span>
                                        <span className="text-gray-600">
                                          {String(staffDetails.workingHours ?? "—")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-3 text-sm">
                                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiHeart className="w-4 h-4 text-indigo-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-semibold text-gray-700 block mb-2">
                                          Specialties
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {Array.isArray(staffDetails.specialties) && staffDetails.specialties.length > 0 ? (
                                            staffDetails.specialties.map((specialty: any, index: number) => (
                                              <span
                                                key={index}
                                                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-medium shadow-sm"
                                              >
                                                {specialty}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-sm text-gray-500">No specialties</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;