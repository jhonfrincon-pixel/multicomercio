import { createClient } from '@supabase/supabase-js';

// Obtener variables de entorno con validación
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Logging para debugging
if (!supabaseUrl) {
  console.warn('VITE_SUPABASE_URL no está configurada');
}
if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY no está configurada');
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Crear cliente solo si ambas variables están configuradas
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;