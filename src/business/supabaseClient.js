
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzzljniuogvssdbhxsql.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6emxqbml1b2d2c3NkYmh4c3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDE2MjcsImV4cCI6MjA1Njg3NzYyN30.VrOhEh2aaj_aZJRc2Di6M3jpikm9nipBbIN9d7fq_CQ'

export const supabase = createClient(supabaseUrl, supabaseKey)