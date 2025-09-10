"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiMapPin, FiExternalLink, FiNavigation } from "react-icons/fi";
import { Department } from "@/types/department";

interface Props {
  department?: Department | null;
  onClose: () => void;
  onSubmit: (data: Partial<Department>) => void;
  isSubmitting?: boolean;
}

export const DepartmentFormModal: React.FC<Props> = ({ department, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    description: "",
    location: "",
    contactPhone: "",
    mapCoords: undefined,
  });

  useEffect(() => {
    if (department) setFormData(department);
  }, [department]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFormData({ ...formData, mapCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
        () => alert("Unable to get your location.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  const openGoogleMaps = () => {
    if (formData.mapCoords?.lat && formData.mapCoords?.lng) {
      window.open(`https://maps.google.com/?q=${formData.mapCoords.lat},${formData.mapCoords.lng}`, "_blank");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{department ? "Edit Department" : "Create New Department"}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {department ? "Update department information" : "Add a new department"}
            </p>
          </div>
          <button onClick={onClose} className="p-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Department Name</label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Location</label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone || ""}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GPS */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">GPS Location (Optional)</h3>
              <FiMapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex gap-3 mb-4">
              <button type="button" onClick={getCurrentLocation} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
                <FiNavigation /> Use My Location
              </button>
              {formData.mapCoords && (
                <button type="button" onClick={openGoogleMaps} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                  <FiExternalLink /> View on Maps
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.mapCoords?.lat ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      mapCoords: {
                        lat: parseFloat(e.target.value),
                        lng: formData.mapCoords?.lng ?? 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <label className="block text-sm font-semibold mb-1 mt-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.mapCoords?.lng ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      mapCoords: {
                        lat: formData.mapCoords?.lat ?? 0,
                        lng: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
              <FiSave /> {department ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
