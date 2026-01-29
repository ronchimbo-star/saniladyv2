import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string;
          user_id: string;
          property_type: string;
          property_size: string;
          cleaning_frequency: string;
          bedrooms: number;
          bathrooms: number;
          additional_services: string[];
          special_requirements: string;
          estimated_cost: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_type: string;
          property_size: string;
          cleaning_frequency: string;
          bedrooms?: number;
          bathrooms?: number;
          additional_services?: string[];
          special_requirements?: string;
          estimated_cost?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_type?: string;
          property_size?: string;
          cleaning_frequency?: string;
          bedrooms?: number;
          bathrooms?: number;
          additional_services?: string[];
          special_requirements?: string;
          estimated_cost?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
