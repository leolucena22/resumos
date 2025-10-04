import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing for the server client.');
  throw new Error('Supabase URL and Service Role Key are required for the server client.');
}

console.log('Supabase Server Client Initializing with URL:', supabaseUrl, 'and Key (first 5 chars):', supabaseServiceRoleKey?.substring(0, 5));

// This client is for SERVER-SIDE use ONLY.
export const supabaseServerClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
