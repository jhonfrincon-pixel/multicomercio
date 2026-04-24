import { supabase } from './supabase';

interface SignUpOptions {
  email: string;
  password: string;
  fullName?: string;
  referralCode?: string;
}

interface SignUpResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Servicio de autenticación para Livo
 * Maneja registro, login y captura de códigos de referido
 */
export class AuthService {
  /**
   * Obtiene el código de referido del sessionStorage (persistencia entre páginas)
   * @returns string | null - Código de referido o null si no existe
   */
  static getReferralCodeFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    
    const stored = sessionStorage.getItem('livo_referral_code');
    return stored && /^[A-Z0-9]{8}$/i.test(stored) ? stored : null;
  }

  /**
   * Registra un nuevo usuario capturando el código de referido de la URL
   * @param options - Opciones de registro
   * @returns Promise<SignUpResult> - Resultado del registro
   */
  static async signUp(options: SignUpOptions): Promise<SignUpResult> {
    try {
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase no está configurado'
        };
      }

      // Capturar código de referido del sessionStorage si no se proporcionó explícitamente
      const referralCode = options.referralCode || this.getReferralCodeFromStorage();

      // Preparar metadata para Supabase incluyendo el código de referido del sessionStorage
      const storedReferralCode = sessionStorage.getItem('livo_referral_code');
      const userData = {
        email: options.email,
        password: options.password,
        options: {
          data: {
            full_name: options.fullName || options.email.split('@')[0],
            referral_code: storedReferralCode, // 🎯 Extraído de sessionStorage para raw_user_meta_data
            registered_at: new Date().toISOString()
          }
        }
      };

      console.log('Registrando usuario con código de referido:', referralCode);

      // Ejecutar signUp en Supabase
      const { data, error } = await supabase.auth.signUp(userData);

      if (error) {
        console.error('Error en signUp:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        console.log('Usuario registrado exitosamente:', data.user.id);
        
        // El trigger de la base de datos se encargará de:
        // 1. Crear el perfil en public.profiles
        // 2. Generar código de referido único
        // 3. Asignar upline_id si hay referral_code
        
        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        error: 'No se pudo crear el usuario'
      };

    } catch (error) {
      console.error('Error inesperado en signUp:', error);
      return {
        success: false,
        error: 'Error inesperado al registrar usuario'
      };
    }
  }

  /**
   * Inicia sesión de usuario
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise<SignUpResult> - Resultado del login
   */
  static async signIn(email: string, password: string): Promise<SignUpResult> {
    try {
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase no está configurado'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Error en signIn:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        error: 'No se pudo iniciar sesión'
      };

    } catch (error) {
      console.error('Error inesperado en signIn:', error);
      return {
        success: false,
        error: 'Error inesperado al iniciar sesión'
      };
    }
  }

  /**
   * Cierra sesión del usuario
   */
  static async signOut(): Promise<void> {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser() {
    try {
      if (!supabase) return null;

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error obteniendo usuario actual:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error inesperado obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * Envía un correo de recuperación de contraseña
   * @param email - Email del usuario
   * @returns Promise<{ success: boolean; error?: string }>
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase no está configurado' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/crm#type=recovery`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error en resetPassword:', error);
      return { success: false, error: 'Error inesperado al enviar el correo de recuperación' };
    }
  }

  /**
   * Verifica si hay un código de referido válido en el sessionStorage
   * @returns boolean - True si hay un código válido
   */
  static hasValidReferralCode(): boolean {
    const refCode = this.getReferralCodeFromStorage();
    return refCode !== null;
  }

  /**
   * Almacena el código de referido en localStorage para persistencia
   * @param refCode - Código de referido
   */
  static storeReferralCode(refCode: string): void {
    if (typeof window !== 'undefined' && refCode) {
      localStorage.setItem('livo_referral_code', refCode.toUpperCase());
    }
  }

  /**
   * Recupera el código de referido almacenado
   * @returns string | null - Código almacenado o null
   */
  static getStoredReferralCode(): string | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('livo_referral_code');
    return stored && /^[A-Z0-9]{8}$/i.test(stored) ? stored : null;
  }

  /**
   * Limpia el código de referido almacenado
   */
  static clearStoredReferralCode(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('livo_referral_code');
    }
  }
}

// Hook personalizado para React (opcional)
export const useAuthService = () => {
  return {
    signUp: AuthService.signUp,
    signIn: AuthService.signIn,
    signOut: AuthService.signOut,
    resetPassword: AuthService.resetPassword,
    getCurrentUser: AuthService.getCurrentUser,
    getReferralCodeFromStorage: AuthService.getReferralCodeFromStorage,
    hasValidReferralCode: AuthService.hasValidReferralCode,
    storeReferralCode: AuthService.storeReferralCode,
    getStoredReferralCode: AuthService.getStoredReferralCode,
    clearStoredReferralCode: AuthService.clearStoredReferralCode
  };
};
