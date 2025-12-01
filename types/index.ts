export type ServiceType = "regular" | "deep" | "move_out";

export type TimeSlot = "morning" | "afternoon" | "evening";

export type BedroomCount = "studio" | "1" | "2" | "3" | "4" | "5+";

export type BathroomCount = "1" | "1.5" | "2" | "2.5" | "3" | "3.5+";

export type SqftRange =
  | "under_800"
  | "800_1200"
  | "1200_1800"
  | "1800_2500"
  | "2500_3500"
  | "over_3500"
  | "not_sure";

export type HomeCondition = "clean" | "average" | "needs_work";

export type Addon = "fridge" | "oven" | "cabinets" | "laundry" | "windows";

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
  bedrooms: BedroomCount;
  bathrooms: BathroomCount;
  sqft_range: SqftRange | null;
  condition: HomeCondition;
  special_requests: string | null;
  addons: Addon[];

  // Address
  address: string | null;
  city: string;
  zip: string | null;
  access_instructions: string | null;

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
  // Step 1
  service_type?: ServiceType;
  // Step 2
  bedrooms?: BedroomCount;
  bathrooms?: BathroomCount;
  sqft_range?: SqftRange;
  condition?: HomeCondition;
  special_requests?: string;
  // Step 3
  addons?: Addon[];
  // Step 4
  preferred_date?: string;
  preferred_time?: TimeSlot;
  // Step 5
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  access_instructions?: string;
}

export interface PriceEstimate {
  min: number;
  max: number;
  base: number;
  addonsTotal: number;
}
