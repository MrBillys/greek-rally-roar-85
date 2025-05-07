
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use direct URLs instead of environment variables
const supabaseUrl = "https://dtxsmokvmqiwcszqzunh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHNtb2t2bXFpd2NzenF6dW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDI5MzIsImV4cCI6MjA2MjIxODkzMn0.mmI-4OaCHPxungV0hDg04qhoqkarC4qB-PYspcJx5G8";

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
