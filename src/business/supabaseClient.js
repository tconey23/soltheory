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

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const { user } = session;
    const { data, error } = await supabase
      .from('users')
      .upsert([{ primary_id: user.id, email: user.email }], { onConflict: 'primary_id' })
      .select();
    if (error) console.error('Error syncing user to Users table:', error);
  }
});

window.supabase = supabase;
