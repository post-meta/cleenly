export type ServiceType = "regular" | "deep" | "move_out";

export type TimeSlot = "morning" | "afternoon" | "evening";

export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  created_at: string;

  // Contact
  email: string;
  phone: string | null;
  name: string | null;

  // Service parameters
  service_type: ServiceType;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;

  // Address
  address: string | null;
  city: string;
  zip: string | null;

  // Timing
  preferred_date: string | null;
  preferred_time: TimeSlot | null;

  // Price
  estimated_min: number;
  estimated_max: number;

  // Status
  status: BookingStatus;
  notes: string | null;
}

export interface BookingFormData {
  email: string;
  phone?: string;
  name?: string;
  service_type: ServiceType;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address?: string;
  city?: string;
  zip?: string;
  preferred_date?: string;
  preferred_time?: TimeSlot;
}

export interface PriceEstimate {
  min: number;
  max: number;
  base: number;
}
