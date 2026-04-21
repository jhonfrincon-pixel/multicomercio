import { supabase, isSupabaseConfigured } from './supabase';

// Función para probar la conexión con Supabase
export async function testSupabaseConnection() {
  console.log('=== Prueba de conexión Supabase ===');
  console.log('Variables configuradas:', isSupabaseConfigured);
  
  if (!isSupabaseConfigured) {
    console.error('Supabase no está configurado. Revisa las variables de entorno.');
    return false;
  }

  if (!supabase) {
    console.error('Cliente Supabase es null');
    return false;
  }

  try {
    // Probar conexión básica
    const { error } = await supabase.from('_supabase_test_connection').select('count').limit(1);
    
    if (error) {
      console.error('Error en conexión:', error.message);
      return false;
    }
    
    console.log('Conexión exitosa con Supabase');
    return true;
  } catch (err) {
    console.error('Error al conectar con Supabase:', err);
    return false;
  }
}

// Exportar función para uso en componentes
export { testSupabaseConnection as default };
