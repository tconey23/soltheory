import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey,  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    }
  });

supabase.auth.onAuthStateChange(async (event, session) => { 
 
  if (event === 'SIGNED_IN') {
    const { user } = session

    const { data, error } = await supabase
      .from('userlist')
      .upsert(
        [{ primary_id: user.id, email: user.email }],
        { onConflict: 'primary_id' } // this ensures upsert is based on the primary_id column
      )
      .select()

    console.log(data)
    if (error) console.error('Error syncing user to Users table:', error)
  }
})

window.supabase = supabase
