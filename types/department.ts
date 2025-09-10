export interface Department {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  contactPhone?: string;
  head?: string;
  mapCoords?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}
