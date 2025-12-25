export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    role: 'admin' | 'customer' | null
                    avatar_url: string | null
                    notes: string | null
                    stripe_customer_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'admin' | 'customer' | null
                    avatar_url?: string | null
                    notes?: string | null
                    stripe_customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'admin' | 'customer' | null
                    avatar_url?: string | null
                    notes?: string | null
                    stripe_customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            cleaner_profiles: {
                Row: {
                    id: string
                    full_name: string
                    phone: string
                    email: string | null
                    photo_url: string | null
                    notes: string | null
                    is_active: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    phone: string
                    email?: string | null
                    photo_url?: string | null
                    notes?: string | null
                    is_active?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    phone?: string
                    email?: string | null
                    photo_url?: string | null
                    notes?: string | null
                    is_active?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    customer_id: string
                    cleaner_id: string | null
                    service_type: string
                    bedrooms: number | null
                    bathrooms: number | null
                    square_feet: number | null
                    address_line1: string
                    address_line2: string | null
                    city: string
                    state: string | null
                    zip: string
                    scheduled_date: string
                    scheduled_start: string | null
                    scheduled_end: string | null
                    estimated_duration: number | null
                    status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | null
                    price_estimated: number | null
                    price_final: number
                    customer_notes: string | null
                    admin_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    cleaner_id?: string | null
                    service_type: string
                    bedrooms?: number | null
                    bathrooms?: number | null
                    square_feet?: number | null
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    state?: string | null
                    zip: string
                    scheduled_date: string
                    scheduled_start?: string | null
                    scheduled_end?: string | null
                    estimated_duration?: number | null
                    status?: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | null
                    price_estimated?: number | null
                    price_final: number
                    customer_notes?: string | null
                    admin_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    cleaner_id?: string | null
                    service_type?: string
                    bedrooms?: number | null
                    bathrooms?: number | null
                    square_feet?: number | null
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    state?: string | null
                    zip?: string
                    scheduled_date?: string
                    scheduled_start?: string | null
                    scheduled_end?: string | null
                    estimated_duration?: number | null
                    status?: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | null
                    price_estimated?: number | null
                    price_final?: number
                    customer_notes?: string | null
                    admin_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    booking_id: string
                    amount_paid: number
                    method: 'stripe' | 'venmo' | 'zelle' | 'cash' | 'check' | 'invoice'
                    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial' | null
                    stripe_payment_intent_id: string | null
                    stripe_charge_id: string | null
                    check_number: string | null
                    transaction_id: string | null
                    processed_by: string | null
                    processed_at: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    amount_paid: number
                    method: 'stripe' | 'venmo' | 'zelle' | 'cash' | 'check' | 'invoice'
                    status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial' | null
                    stripe_payment_intent_id?: string | null
                    stripe_charge_id?: string | null
                    check_number?: string | null
                    transaction_id?: string | null
                    processed_by?: string | null
                    processed_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    amount_paid?: number
                    method?: 'stripe' | 'venmo' | 'zelle' | 'cash' | 'check' | 'invoice'
                    status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial' | null
                    stripe_payment_intent_id?: string | null
                    stripe_charge_id?: string | null
                    check_number?: string | null
                    transaction_id?: string | null
                    processed_by?: string | null
                    processed_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            cleaner_payouts: {
                Row: {
                    id: string
                    cleaner_id: string
                    booking_id: string
                    amount_to_pay: number
                    amount_paid: number | null
                    method: string | null
                    transaction_id: string | null
                    paid_at: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    cleaner_id: string
                    booking_id: string
                    amount_to_pay: number
                    amount_paid?: number | null
                    method?: string | null
                    transaction_id?: string | null
                    paid_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    cleaner_id?: string
                    booking_id?: string
                    amount_to_pay?: number
                    amount_paid?: number | null
                    method?: string | null
                    transaction_id?: string | null
                    paid_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            customer_notes: {
                Row: {
                    id: string
                    customer_id: string
                    author_id: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    author_id: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    author_id?: string
                    content?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_booking_total_paid: {
                Args: {
                    booking_uuid: string
                }
                Returns: number
            }
            get_cleaner_unpaid_balance: {
                Args: {
                    cleaner_uuid: string
                }
                Returns: number
            }
        }
        Enums: {
            user_role: 'admin' | 'customer'
            booking_status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled'
            payment_method: 'stripe' | 'venmo' | 'zelle' | 'cash' | 'check' | 'invoice'
            payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial'
        }
    }
}