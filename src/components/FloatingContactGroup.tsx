import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, X, MessageSquare } from 'lucide-react';

/**
 * Componente que agrupa los botones de contacto (WhatsApp y Agente IA) 
 * en un único menú flotante para evitar solapamientos en la UI.
 */
export function FloatingContactGroup() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      id: 'whatsapp',
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'WhatsApp',
      color: 'bg-[#25D366]', // Color oficial de WhatsApp
      href: 'https://wa.me/573001234567', // Reemplazar con el número real de Livo
    },
    {
      id: 'ai-agent',
      icon: <Bot className="w-6 h-6" />,
      label: 'Agente IA',
      color: 'bg-blue-600',
      action: () => {
        // Lógica personalizada para activar el Agente IA
        console.log('Abriendo Agente IA...');
        // Si el agente IA es un widget externo, aquí se llamaría a su API
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {option.href ? (
                  <a
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-full shadow-lg text-white ${option.color} hover:brightness-110 transition-all group`}
                    title={option.label}
                  >
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-medium">
                      {option.label}
                    </span>
                    {option.icon}
                  </a>
                ) : (
                  <button
                    onClick={option.action}
                    className={`flex items-center gap-3 p-3 rounded-full shadow-lg text-white ${option.color} hover:brightness-110 transition-all group`}
                    title={option.label}
                  >
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-medium">
                      {option.label}
                    </span>
                    {option.icon}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white transition-all duration-300 ${
          isOpen ? 'bg-gray-800' : 'bg-blue-600'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}