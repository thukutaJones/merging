/* eslint-disable */
import { getStatusColor, getStatusIcon } from "@/utils/statusIndicators";
import React from "react";
import {
  RiCalendarLine,
  RiEditLine,
  RiDeleteBinLine,
  RiTimeLine,
  RiUserLine,
  RiStethoscopeLine,
  RiHospitalLine,
  RiEyeLine,
} from "react-icons/ri";

const Appointnments = ({
  filteredAppointments,
  role,
  openEditModal,
  handleDelete,
  handleUpdateStatus,
}: {
  filteredAppointments: any;
  role: string;
  openEditModal: any;
  handleDelete: any;
  handleUpdateStatus: any;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredAppointments?.map((appointment: any, index: number) => (
        <div
          key={index?.toString()}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusIcon(appointment.status)}
                <span className="capitalize">{appointment.status}</span>
              </div>

              {role === "patient" && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openEditModal(appointment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="Edit Notes"
                  >
                    <RiEditLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Delete Appointment"
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                  </button>
                </div>
              )}

              {(role === "nurse" ||
                role === "doctor" ||
                role === "ambulance_driver") && (
                <button
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  title="View Details"
                >
                  <RiEyeLine className="w-4 h-4" />
                </button>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {appointment.serviceId?.name || "No Service"}
            </h3>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <RiCalendarLine className="w-4 h-4" />
                <span>
                  {appointment.time
                    ? new Date(appointment.time).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <RiTimeLine className="w-4 h-4" />
                <span>
                  {appointment.time
                    ? new Date(appointment.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "No Time"}
                </span>
              </div>
            </div>

          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            {role === "patient" && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <RiStethoscopeLine className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      {appointment.staffIdDetails?.full_name || "No Staff Name"}
                    </p>
                    <p className="text-sm text-blue-700 capitalize">
                      {appointment.staffIdDetails?.roleWithin || "No Role Provided"}
                    </p>
                    {appointment.staffIdDetails?.specialties?.length > 0 && (
                      <p className="text-xs text-blue-600">
                        {appointment.staffIdDetails.specialties.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(role === "nurse" ||
              role === "doctor" ||
              role === "ambulance_driver") && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <RiUserLine className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">
                      {appointment.patientDetails?.full_name || "No Patient Name"}
                    </p>
                    <p className="text-sm text-green-700">
                      {appointment.patientDetails?.phone || "No Phone"}
                    </p>
                    <p className="text-xs text-green-600">
                      Days remaining for appointment:{" "}
                      {appointment.time
                        ? Math.ceil(
                          (new Date(appointment.time).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                        )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons for Staff */}
                <div className="flex space-x-2 mt-2">
                  {appointment.status === "approved" ? (
                    <span className="text-green-700 font-semibold">Already Approved</span>
                  ) : appointment.status === "cancelled" ? (
                    <span className="text-red-700 font-semibold">Cancelled</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, "approved")}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

              </div>
            )}


            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-gray-100 rounded-xl">
                <RiHospitalLine className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {appointment.staffIdDetails?.departmentId?.name || "No Department"}
                </p>
              </div>
            </div>

            {appointment.notes && (
              <div className="p-3 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Appointnments;
