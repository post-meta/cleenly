export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "cleaner";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
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
          customer_id: string | null;
          cleaner_id: string | null;
          actual_price: number | null;
          completed_at: string | null;
          payment_status: string;
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
          customer_id?: string | null;
          cleaner_id?: string | null;
          actual_price?: number | null;
          completed_at?: string | null;
          payment_status?: string;
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
          customer_id?: string | null;
          cleaner_id?: string | null;
          actual_price?: number | null;
          completed_at?: string | null;
          payment_status?: string;
        };
      };
      cleaners: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          hourly_rate: number;
          service_types: string[];
          service_areas: string[];
          years_experience: number;
          availability: Json;
          photos: string[];
          is_active: boolean;
          is_verified: boolean;
          background_check_passed: boolean;
          rating: number;
          total_reviews: number;
          total_jobs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          hourly_rate?: number;
          service_types?: string[];
          service_areas?: string[];
          years_experience?: number;
          availability?: Json;
          photos?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          background_check_passed?: boolean;
          rating?: number;
          total_reviews?: number;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          hourly_rate?: number;
          service_types?: string[];
          service_areas?: string[];
          years_experience?: number;
          availability?: Json;
          photos?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          background_check_passed?: boolean;
          rating?: number;
          total_reviews?: number;
          total_jobs?: number;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          cleaner_id: string;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          booking_id: string;
          cleaner_id: string;
          customer_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          booking_id?: string;
          cleaner_id?: string;
          customer_id?: string;
          rating?: number;
          comment?: string | null;
          is_public?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Cleaner = Database["public"]["Tables"]["cleaners"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
