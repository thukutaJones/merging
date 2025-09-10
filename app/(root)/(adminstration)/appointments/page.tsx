/*eslint-disable */
"use client";

import Appointments from "@/components/Apointnments";
import EmptyState from "@/components/appointments/EmptyState";
import Header from "@/components/appointments/Header";
import ScheduleAppointment from "@/components/appointments/ScheduleAppoinment";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/hooks/useAuth";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentsPage() {
  const { user } = useAuth(["patient", "doctor"]);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("role");

  const [formData, setFormData] = useState({
    service: "",
    staffId: "",
    time: "",
    date: "",
    notes: "",
  });

  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");

  // Fetch data from backend
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/appointments/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            "Cache-Control": "no-cache"
          },
        });
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    const fetchStaff = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            "Cache-Control": "no-cache"
          },
        });
        const staffOnly = res.data.data?.filter((u: any) => u.role === "staff") || [];
        setStaffList(staffOnly);
        setFilteredStaff(staffOnly);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/services/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            "Cache-Control": "no-cache"
          },
        });
        setServices(res.data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchAppointments();
    fetchStaff();
    fetchServices();
    setRole(user.role);
  }, [user]);

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientDetails?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.staffIdDetails?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Filter staff based on search term
  useEffect(() => {
    if (!staffSearchTerm) {
      setFilteredStaff(staffList);
      return;
    }

    setFilteredStaff(
      staffList.filter((staff) => {
        const nameMatch = staff.full_name.toLowerCase().includes(staffSearchTerm.toLowerCase());
        const roleMatch = staff.staffDetails?.roleWithin?.toLowerCase()?.includes(staffSearchTerm.toLowerCase());
        return nameMatch || roleMatch;
      })
    );
  }, [staffSearchTerm, staffList]);

  const handleStaffSelect = (staff: any) => {
    setSelectedStaff(staff);
    setFormData((prev) => ({ ...prev, staffId: staff._id }));
    setStaffSearchTerm("");
  };


  const openModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({ service: "", staffId: "", time: "", date: "", notes: "" });
    setSelectedStaff(null);
  };

  const openEditModal = (appointment: any) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingId(appointment.id);
    setFormData({
      service: appointment.service._id,
      staffId: appointment.staffIdDetails.id,
      time: appointment.time,
      date: appointment.date,
      notes: appointment.notes,
    });
    setSelectedStaff(appointment.staffIdDetails);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setSelectedStaff(null);
    setStaffSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !formData.service || !formData.date || !formData.time) return;

    try {
      if (isEditing && editingId) {
        // Update notes only
        setAppointments(prev =>
          prev.map(a => a.id === editingId ? { ...a, notes: formData.notes } : a)
        );
      } else {
        const res = await axios.post(
          "http://localhost:3001/api/appointments/create",
          {
            serviceId: formData.service,
            staffId: selectedStaff._id,
            time: formData.time,
            date: formData.date,
            notes: formData.notes,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("access_token") || ""}` } }
        );
        setAppointments(prev => [...prev, res.data]);
      }
      closeModal();
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Failed to save appointment.");
    }
  };


  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      // Optionally: send DELETE request to backend
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/cancel/${id}`, {
        method: "PUT", // or PATCH depending on your backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
        },
      });

      if (!res.ok) throw new Error("Failed to cancel appointment");

      const data = await res.json();
      console.log("Cancelled:", data);

      // Optional: update local state to reflect the cancellation
      setAppointments((prev: any) =>
        prev.map((appt: any) =>
          appt._id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.log(`Error cancelling status: ${error}`);
    }
  };


  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
        },
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      console.log("Updated status:", data);

      // Update local state
      setAppointments((prev: any) =>
        prev.map((appt: any) =>
          appt._id === id ? { ...appt, status } : appt
        )
      );
    } catch (error) {
      console.log(`Error updating status: ${error}`);
    }
  };


  if (!user) return <LoadingAnimation />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        <Header
          role={role}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          openModal={openModal}
        />
        <Appointments
          filteredAppointments={filteredAppointments}
          // handleCancel={handleCancel}
          handleUpdateStatus={handleUpdateStatus}
          role={role}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />

        {filteredAppointments.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            role={role}
            openModal={openModal}
          />
        )}
      </div>

      {isModalOpen && (
        <ScheduleAppointment
          isEditing={isEditing}
          closeModal={closeModal}
          formData={formData}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          staffSearchTerm={staffSearchTerm}
          setStaffSearchTerm={setStaffSearchTerm}
          filteredStaff={filteredStaff}
          handleStaffSelect={handleStaffSelect}
          services={services}
        />
      )}
    </div>
  );
}
