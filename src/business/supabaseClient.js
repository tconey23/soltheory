import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,     // <---------------- THIS IS REQUIRED
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

window.supabase = supabase;
