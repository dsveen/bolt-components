export interface Property {
  id: number;
  address: string;
  location: string;
  units: number;
  occupancy: string;
  acquisitionPrice: number;
  marketValue: number;
  loanBalance: number;
  equity: number;
  type: "house" | "apartment";
  lastRoofingAssessment: string;
  insuranceExpiresIn: number;
  image: string;
  documents: Document[];
  events: PropertyEvent[];
  history: PropertyHistoryEntry[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  startDate: string;
  endDate: string;
  category: "insurance" | "lease" | "inspection" | "permit" | "other";
  notes?: string;
}

export interface PropertyEvent {
  id: string;
  type: "weather" | "maintenance" | "inspection";
  severity: "low" | "medium" | "high";
  date: string;
  description: string;
}

export interface PropertyHistoryEntry {
  id: string;
  date: string;
  type: "purchase" | "renovation" | "tenant" | "maintenance" | "appraisal" | "refinance";
  description: string;
  amount?: number;
  status: "completed" | "pending" | "cancelled";
}