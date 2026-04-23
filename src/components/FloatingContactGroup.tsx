import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, X, MessageSquare } from 'lucide-react';

/**
 * Props para el componente FloatingContactGroup.
 * @param isVisible Controla la visibilidad del grupo de botones.
 * @param whatsappNumber Número de teléfono en formato internacional.
 * @param initialMessage Mensaje predeterminado para WhatsApp.
 */
interface FloatingContactGroupProps {
  isVisible?: boolean;
  whatsappNumber?: string;
  initialMessage?: string;
}

/**
 * Componente que agrupa los botones de contacto (WhatsApp y Agente IA) 
 * en un único menú flotante para evitar solapamientos en la UI.
 */
export function FloatingContactGroup({ 
  isVisible = true, 
  whatsappNumber = "573001234567",
  initialMessage = "Hola Livo, me gustaría obtener más información."
}: FloatingContactGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const encodedMessage = encodeURIComponent(initialMessage);

  const contactOptions = [
    {
      id: 'whatsapp',
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'WhatsApp',
      color: 'bg-[#25D366]', // Color oficial de WhatsApp
      href: `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
    },
    {
      id: 'ai-agent',
      icon: <Bot className="w-6 h-6" />,
      label: 'Agente IA',
      color: 'bg-[#1e3a8a]',
      action: () => {
        // Disparamos el evento personalizado que escucha AIChatbot
        window.dispatchEvent(new CustomEvent('open-livo-chat'));
      },
    },
  ];

  // Si el componente no es visible, asegúrate de que el menú esté cerrado
  if (!isVisible && isOpen) {
    setIsOpen(false);
  }

  // No renderizar el componente si no es visible
  if (!isVisible) return null;

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
                    className={`flex items-center gap-3 p-3 rounded-full shadow-lg text-white ${option.color} hover:brightness-110 transition-all group relative`}
                    title={option.label}
                  >
                    {option.id === 'whatsapp' && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#25D366] -z-10"
                        animate={{
                          scale: [1, 1.6],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
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
        animate={isOpen ? { y: 0 } : { y: [0, -10, 0] }}
        transition={isOpen ? { duration: 0.2 } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white transition-all duration-300 ${ // Main button
          isOpen ? 'bg-gray-800' : 'bg-[#1e3a8a]'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}