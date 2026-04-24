import { useEffect } from 'react';

/**
 * Hook personalizado para capturar y persistir códigos de referido
 * Usa sessionStorage para mantener el código entre navegaciones
 */
export function useReferralCapture() {
  useEffect(() => {
    // 🎯 Capturar parámetro 'ref' de la URL usando URLSearchParams nativo
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && /^[A-Z0-9]{8}$/i.test(refCode)) {
      // Validar formato del código (8 caracteres alfanuméricos)
      const normalizedCode = refCode.toUpperCase();
      
      // 🔄 Guardar en sessionStorage para persistencia
      sessionStorage.setItem('livo_referral_code', normalizedCode);
      
      console.log('🎯 Código de referido capturado y guardado:', normalizedCode);
      
      // Opcional: Limpiar la URL para no mostrar el parámetro
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, []); // Ejecutar solo una vez al montar

  /**
   * Obtener el código de referido del sessionStorage
   */
  const getStoredReferralCode = (): string | null => {
    const stored = sessionStorage.getItem('livo_referral_code');
    return stored && /^[A-Z0-9]{8}$/i.test(stored) ? stored : null;
  };

  /**
   * Verificar si hay un código de referido válido
   */
  const hasValidReferralCode = (): boolean => {
    return getStoredReferralCode() !== null;
  };

  /**
   * Limpiar el código de referido del sessionStorage
   */
  const clearReferralCode = (): void => {
    sessionStorage.removeItem('livo_referral_code');
  };

  return {
    getStoredReferralCode,
    hasValidReferralCode,
    clearReferralCode
  };
}
