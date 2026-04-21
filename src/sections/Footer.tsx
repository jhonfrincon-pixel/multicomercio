import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFooterSettingsStore } from '@/store/footerSettingsStore';
import { PolicyModal } from '@/components/PolicyModal';

export function Footer() {
  const { settings, loadSettings } = useFooterSettingsStore();
  const [selectedPolicy, setSelectedPolicy] = useState<{ title: string; content: string } | null>(null);

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
    <>
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
              <a
                href="#"
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href={getLink('sobre_nosotros')} className="hover:text-amber-500 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href={getLink('catalogo_productos')} className="hover:text-amber-500 transition-colors">
                  Catálogo de Productos
                </a>
              </li>
              <li>
                <a href={getLink('ofertas_especiales')} className="hover:text-amber-500 transition-colors">
                  Ofertas Especiales
                </a>
              </li>
              <li>
                <a href={getLink('blog_decoracion')} className="hover:text-amber-500 transition-colors">
                  Blog de Decoración
                </a>
              </li>
              <li>
                <a href={getLink('preguntas_frecuentes')} className="hover:text-amber-500 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Atención al Cliente</h3>
            <ul className="space-y-3">
              <li>
                <a href={getLink('mi_cuenta')} className="hover:text-amber-500 transition-colors">
                  Mi Cuenta
                </a>
              </li>
              <li>
                <a href={getLink('seguimiento_pedidos')} className="hover:text-amber-500 transition-colors">
                  Seguimiento de Pedidos
                </a>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_devoluciones', 'Política de Devoluciones')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Política de Devoluciones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('terminos_condiciones', 'Términos y Condiciones')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('politica_privacidad', 'Política de Privacidad')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Política de Privacidad
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
      
      <PolicyModal
        isOpen={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
        title={selectedPolicy?.title || ''}
        content={selectedPolicy?.content || ''}
      />
    </>
  );
}
