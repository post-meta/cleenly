export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          phone: string | null;
          name: string | null;
          service_type: string;
          bedrooms: number;
          bathrooms: number;
          sqft: number | null;
          address: string | null;
          city: string;
          zip: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          estimated_min: number;
          estimated_max: number;
          status: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          phone?: string | null;
          name?: string | null;
          service_type: string;
          bedrooms: number;
          bathrooms: number;
          sqft?: number | null;
          address?: string | null;
          city?: string;
          zip?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          estimated_min: number;
          estimated_max: number;
          status?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          phone?: string | null;
          name?: string | null;
          service_type?: string;
          bedrooms?: number;
          bathrooms?: number;
          sqft?: number | null;
          address?: string | null;
          city?: string;
          zip?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          estimated_min?: number;
          estimated_max?: number;
          status?: string;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
