import { User } from "@/types/user";

export const sampleUsers: User[] = [
  {
    id: "1",
    _id: "2",
    full_name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+1234567890",
    role: "staff",
    status: "active",
    gender: "female",
    dob: "1985-03-15",
    createdAt: "2024-01-15",
    lastLogin: "2024-08-27T10:30:00Z",
    staffDetails: {
      roleWithin: "doctor",
      specialties: ["Cardiology", "Internal Medicine"],
      department: "Cardiology",
      workingHours: "8:00 AM - 6:00 PM",
    },
  },
  {
    id: "2",
    _id: "3",
    full_name: "John Smith",
    email: "john.smith@gmail.com",
    phone: "+0987654321",
    role: "patient",
    status: "active",
    gender: "male",
    dob: "1990-07-22",
    createdAt: "2024-02-10",
    lastLogin: "2024-08-26T14:20:00Z",
    patientDetails: {
      address: "123 Main St, City, State 12345",
      nationId: "ID123456789",
      conditions: ["Hypertension", "Diabetes Type 2"],
      emergencyContact: "+1122334455",
      medicalRecords: [],
    },
  },
];
