import { createClient } from '@supabase/supabase-js';

// Tạm thời vô hiệu hóa việc đọc từ file .env và gán cứng (hardcode) trực tiếp
const supabaseUrl = 'https://uogltdqdkpjrnsibntao.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZ2x0ZHFka3Bqcm5zbGJudGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDk2NTcsImV4cCI6MjA5MjE4NTY1N30.tKglUbjoR41-HGaUcH6_9GTZacIU1jl-m8voIc_8hLg'; 

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZ2x0ZHFka3Bqcm5zbGJudGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDk2NTcsImV4cCI6MjA5MjE4NTY1N30.tKglUbjoR41-HGaUcH6_9GTZacIU1jl-m8voIc_8hLg') {
  console.error('❌ Missing or invalid Supabase environment variables! Please check supabase.ts');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'buyer' | 'seller';
  avatar_url: string | null;
  member_since: string;
  tier: 'Standard' | 'Premium';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  category: string;
  material: string | null;
  designer: string | null;
  images: string[];
  specs: Record<string, string>;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  // joined
  seller?: Profile;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  // joined
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_address: ShippingAddress | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  size: string | null;
  color: string | null;
  created_at: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  reviewer?: Profile;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}