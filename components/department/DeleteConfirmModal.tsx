"use client";
import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<Props> = ({ onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiTrash2 /> Confirm Delete
          </h2>
          <p>Are you sure you want to delete this department? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">Cancel</button>
            <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
