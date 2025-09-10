export type Role = "patient" | "staff" | "admin" | "hod";
export type Status = "active" | "deactivated";
export type Gender = "male" | "female" | "other";
export type StaffRole = "doctor" | "nurse" | "ambulance_driver" | "technician";

export interface BaseUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  gender: Gender;
  dob: string;
  createdAt: string;
  lastLogin: string;
}

export interface PatientDetails {
  address: string;
  nationId: string;
  conditions: string[];
  emergencyContact: string;
  medicalRecords: File[];
}

export interface StaffDetails {
  roleWithin: StaffRole;
  specialties: string[];
  department: string;
  workingHours: string;
}

export interface User extends BaseUser {
  patientDetails?: PatientDetails;
  staffDetails?: StaffDetails;
}
