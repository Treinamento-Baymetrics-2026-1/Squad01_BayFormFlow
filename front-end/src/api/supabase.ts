import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_API_URL
const supabaseAnonKey = import.meta.env.VITE_API_KEY

//gerencia o estado da sessão, injeta tokens no invoke
export const supabase = createClient(supabaseUrl, supabaseAnonKey)