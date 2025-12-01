export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "background_check"
  | "approved"
  | "rejected";

export interface CleanerApplication {
  id: string;
  created_at: string;

  // Basic info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  referral_source?: string;

  // Experience
  has_experience: boolean;
  years_experience?: string;
  previous_platforms?: string;
  has_supplies?: boolean;
  has_transportation: boolean;

  // Availability
  hours_per_week: string;
  available_days: string[];
  preferred_times?: string[];
  service_areas: string[];

  // Legal
  work_authorized: boolean;
  is_adult: boolean;
  background_consent: boolean;

  // About
  bio?: string;
  motivation?: string;

  // Status
  status: ApplicationStatus;
  notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CleanerApplicationFormData {
  // Step 1: Basic Info
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  referral_source?: string;

  // Step 2: Experience
  has_experience?: boolean;
  years_experience?: string;
  previous_platforms?: string;
  has_supplies?: boolean;
  has_transportation?: boolean;

  // Step 3: Availability
  hours_per_week?: string;
  available_days?: string[];
  preferred_times?: string[];
  service_areas?: string[];

  // Step 4: Legal
  work_authorized?: boolean;
  is_adult?: boolean;
  background_consent?: boolean;

  // Step 5: About
  bio?: string;
  motivation?: string;
}
