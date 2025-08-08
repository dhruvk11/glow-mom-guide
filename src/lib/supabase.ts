import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  due_date: string;
  current_week: number;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  mood_reminders: boolean;
  sleep_reminders: boolean;
  task_alerts: boolean;
  weekly_summary: boolean;
  created_at: string;
  updated_at: string;
}

export interface WellnessStats {
  id: string;
  user_id: string;
  mood_entries: number;
  sleep_logs: number;
  task_completion_rate: number;
  current_streak: number;
  updated_at: string;
}