export interface Department {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  departmentId: string;
  department?: string;
  description: string;
  isEmergencyService: boolean;
  createdAt: string;
}
