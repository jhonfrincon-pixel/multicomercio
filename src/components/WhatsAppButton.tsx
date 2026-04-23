import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = '573001234567'; // Número de WhatsApp para Colombia
  const message = encodeURIComponent('Hola! Vi sus productos en Livo y me gustaría más información.');

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Abrir WhatsApp en nueva pestaña
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Botón flotante de WhatsApp */}
      <button
        onClick={handleClick}
        className={`
          fixed bottom-6 right-6 z-50 
          bg-green-500 hover:bg-green-600 
          text-white rounded-full 
          p-4 shadow-lg 
          transform transition-all duration-300 
          hover:scale-110 
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        `}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Badge de notificación animado */}
      <div className={`
        fixed bottom-8 right-8 z-40 
        bg-red-500 text-white 
        text-xs px-2 py-1 rounded-full 
        animate-pulse
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}>
        Online
      </div>

      {/* Tooltip */}
      <div className={`
        fixed bottom-20 right-6 z-40 
        bg-gray-800 text-white 
        text-sm px-3 py-2 rounded-lg 
        whitespace-nowrap 
        transform transition-all duration-300 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        ¿Necesitas ayuda? Chatea ahora
        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
      </div>
    </>
  );
}
