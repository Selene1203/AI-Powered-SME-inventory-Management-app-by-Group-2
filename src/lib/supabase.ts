import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          code: string;
          name: string;
          email: string;
          business_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          email: string;
          business_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          email?: string;
          business_name?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_code: string;
          name: string;
          sku: string;
          price: number;
          current_stock: number;
          category: string;
          image: string | null;
          reorder_level: number;
          last_sold: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_code: string;
          name: string;
          sku: string;
          price: number;
          current_stock: number;
          category: string;
          image?: string | null;
          reorder_level: number;
          last_sold?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_code?: string;
          name?: string;
          sku?: string;
          price?: number;
          current_stock?: number;
          category?: string;
          image?: string | null;
          reorder_level?: number;
          last_sold?: string | null;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          user_code: string;
          product_id: string;
          quantity: number;
          total_amount: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_code: string;
          product_id: string;
          quantity: number;
          total_amount: number;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_code?: string;
          product_id?: string;
          quantity?: number;
          total_amount?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}