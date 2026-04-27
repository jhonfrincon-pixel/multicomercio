import { useState, useRef, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useFooterSettingsStore } from '@/store/footerSettingsStore';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '@/components/Modal';
import type { View } from '@/types';

interface FooterProps {
  onVisibilityChange?: (isVisible: boolean) => void; // Nueva prop para comunicar la visibilidad
}

export function Footer({ onVisibilityChange }: FooterProps) {
  const { settings, loadSettings } = useFooterSettingsStore();
  const [selectedPolicy, setSelectedPolicy] = useState<{ title: string; content: string } | null>(null);
  const footerRef = useRef<HTMLDivElement>(null); // Cambiado a HTMLDivElement para coincidir con el <div> contenedor
  const navigate = useNavigate();

  // Observador para detectar cuando el footer entra o sale del viewport
  useEffect(() => {
    if (!footerRef.current || !onVisibilityChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si el footer está intersectando (visible), el grupo flotante debe ocultarse (isVisible = false)
          onVisibilityChange(!entry.isIntersecting);
        });
      },
      {
        root: null, // El viewport
        threshold: 0.1, // Dispara cuando el 10% del footer es visible
      }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect(); // Limpia el observador al desmontar
  }, [onVisibilityChange]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handlePolicyClick = (policyType: string, title: string) => {
    const content = settings?.quick_links?.[policyType as keyof typeof settings.quick_links];
    if (content && typeof content === 'string' && content.trim() !== '') {
      setSelectedPolicy({
        title,
        content
      });
    }
  };

  // 🎯 Manejar clic en "Mi Cuenta" con verificación de autenticación
  const handleMiCuentaClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir salto de página
    navigate('/mi-cuenta'); // ProtectedRoute will handle authentication
  };

  // 🎯 Manejar clic en "Sobre Nosotros"
  const handleSobreNosotrosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/sobre-nosotros');
  };

  const handleGoToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const getLink = (key: string) => {
    return settings?.quick_links?.[key as keyof typeof settings.quick_links] || '#';
  };

  const getContactInfo = () => {
    return settings?.contact_info || {
      direccion: 'Av. Principal 1234',
      telefono: '+52 (55) 1234-5678',
      email: 'hola@livo.com'
    };
  };

  const contactInfo = getContactInfo();

  return (
    <div ref={footerRef}> {/* Asigna la referencia al div contenedor del footer */}
      <footer className="bg-stone-900 text-stone-300"> 
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-white">
                Livo
              </span>
            </div>
            <p className="text-stone-400 mb-6 leading-relaxed">
              Transformamos hogares con productos de calidad, diseño y confort. 
              Tu satisfacción es nuestra prioridad.
            </p>
            <div className="flex gap-4">
              <button
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handleSobreNosotrosClick}
                  className="hover:text-amber-500 transition-colors text-left"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-amber-500 transition-colors">
                  Catálogo de Productos
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleGoToHome}
                  className="hover:text-amber-500 transition-colors text-left"
                >
                  Ofertas Especiales
                </button>
              </li>
              <li>
                <button 
                  onClick={handleGoToHome}
                  className="hover:text-amber-500 transition-colors text-left"
                >
                  Blog de Decoración
                </button>
              </li>
              <li>
                <button 
                  onClick={handleGoToHome}
                  className="hover:text-amber-500 transition-colors text-left"
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 font-heading">Atención al Cliente</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handleMiCuentaClick}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Mi Cuenta
                </button>
              </li>
              <li>
                <button 
                  onClick={handleGoToHome}
                  className="hover:text-blue-400 transition-colors font-sans text-left"
                >
                  Seguimiento de Pedidos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_devoluciones', 'Política de Devoluciones')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Política de Devoluciones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('terminos_condiciones', 'Términos y Condiciones')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_privacidad', 'Política de Privacidad')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_calidad', 'Política de Calidad')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Política de Calidad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_garantias', 'Política de Garantías')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Garantía de 30 Días
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('proteccion_datos', 'Protección de Datos')}
                  className="text-left hover:text-blue-400 transition-colors font-sans"
                >
                  Tratamiento de Datos Personales
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{contactInfo.direccion}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>{contactInfo.telefono}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-500">
              © 2024 Livo. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-8 opacity-50 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-8 opacity-50 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-8 opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
      
      <Modal
        isOpen={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
        title={selectedPolicy?.title || ''}
      >
        <div className="prose prose-stone max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {selectedPolicy?.content || ''}
          </p>
        </div>
      </Modal>
    </div>
  );
}
