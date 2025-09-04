import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { FiMapPin, FiUser } from "react-icons/fi";

const RecentEmergencies = ({ emergencies = [] }: { emergencies: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-transparent text-left uppercase text-xs text-gray-500 tracking-wider">
          <tr>
            {[
              "User",
              "Location",
              "Status",
              "Service",
              "Department",
              "Date",
            ].map((header) => (
              <th key={header} className="py-3 px-5 text-left select-none">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {emergencies.map((emergency: any, index: number) => (
            <tr
              key={emergency?.id}
              className={`${
                index !== emergencies?.length - 1 && "border-b border-gray-200"
              } hover:bg-gray-50 transition duration-200`}
            >
              <td className="p-4 flex items-center gap-3">
                <Image
                  src={"/profile.png"}
                  width={100}
                  height={100}
                  alt={"profile"}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{emergency?.user?.fullName}</span>
              </td>
              <td className="py-4 px-5">
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${emergency.userLocationLatitude},${emergency.userLocationLongitude}`}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <FiMapPin size={16} />
                  <span>View Map</span>
                </Link>
              </td>
              <td className="p-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    emergency?.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {emergency?.status}
                </span>
              </td>
              <td className="p-4">{emergency?.service?.name}</td>
              <td className="p-4">{emergency?.departmentId?.name}</td>
              <td className="p-4">{new Date(emergency?.createdAt)?.toLocaleDateString()}</td>

            </tr>
          ))}
          {emergencies.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No Emrgencies available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentEmergencies;