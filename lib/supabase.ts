import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Shared Supabase client instance.
 * Note: For Next.js App Router (Server Components), you should use 
 * the '@supabase/ssr' package to correctly handle auth cookies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Example Connection/Usage:
// 
// import { supabase } from '@/lib/supabase'
// 
// async function getManga() {
//   const { data, error } = await supabase
//     .from('manga')
//     .select('*')
//   return { data, error }
// }
