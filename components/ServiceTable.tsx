"use client";

import React from "react";
import { Service } from "../types/service_dept";
import ServiceRow from "./ServiceRow";

interface Props {
  services: Service[];
  expandedRows: Set<string>;
  toggleRowExpansion: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const ServiceTable: React.FC<Props> = ({
  services,
  expandedRows,
  toggleRowExpansion,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-black bg-gray-300">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Service</th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Department</th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Type</th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Created</th>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                isExpanded={expandedRows.has(service.id)}
                toggleExpand={toggleRowExpansion}
                onEdit={onEdit}
                onDelete={onDelete}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-4xl">&#x1F4AA;</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
