import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente de orden superior para proteger rutas privadas.
 * Verifica la sesión de Supabase y redirige al inicio si no hay un usuario activo.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Si el cliente de Supabase no está inicializado (por ejemplo, debido a variables de entorno faltantes),
    // no podemos verificar la autenticación. Se considera como no autenticado.
    if (!supabase) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return; // Salir temprano
    }

    // Creamos una referencia local constante para ayudar al tipado de TS
    const client = supabase;

    // Verificar sesión inicial
    const checkAuth = async () => {
      const { data: { session } } = await client.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Suscribirse a los cambios de estado de la sesión
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está autenticado, lo enviamos al home (o donde tengas el formulario de login)
    // Guardamos la ubicación actual en el estado para redirigir tras el login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}