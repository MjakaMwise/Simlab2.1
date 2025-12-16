import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StudentRegistration {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  registration_type: 'individual' | 'school';
  payment_status?: 'pending' | 'confirmed' | 'failed';
  amount_paid?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolPartnership {
  id?: string;
  school_name: string;
  contact_person: string;
  email: string;
  phone: string;
  student_count: number;
  package_type: 'bronze' | 'silver' | 'gold';
  message?: string;
  status?: 'inquiry' | 'negotiating' | 'confirmed' | 'declined';
  created_at?: string;
  updated_at?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'new' | 'read' | 'responded' | 'archived';
  created_at?: string;
}

export interface GalleryImage {
  id?: string;
  title: string;
  category: 'experiments' | 'workshops' | 'projects' | 'events';
  url: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
