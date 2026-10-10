import { createClient } from "@supabase/supabase-js";

// Read Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== "YOUR_SUPABASE_URL" &&
      supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
  );
};

// Create Supabase client instance (or dummy instance if unconfigured)
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://placeholder-project.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
