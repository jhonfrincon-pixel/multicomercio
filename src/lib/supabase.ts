import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypusjagimdtjszzvlef.supabase.co';
const supabaseAnonKey = 'sb_publishable_WTBYxezBcuKaew6nTN0J4w_rGOxisCP';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
