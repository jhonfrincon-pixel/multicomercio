import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE = `¡Hola! 👋 Soy tu asistente de ventas de **Livo**.

Estoy aquí para ayudarte a encontrar los mejores productos para tu hogar. Puedo:

🔍 **Buscar productos** por categoría o nombre
💰 **Informarte sobre precios** y ofertas
📦 **Consultar disponibilidad** de stock
🏠 **Recomendarte productos** según tus necesidades
🛒 **Ayudarte con tu compra**

¿En qué puedo ayudarte hoy?`;

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Escuchar evento personalizado para abrir el chat desde componentes externos
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-livo-chat', handleOpenChat);
    return () => window.removeEventListener('open-livo-chat', handleOpenChat);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Saludos
    if (lowerMsg.match(/hola|buenos días|buenas tardes|buenas noches|hey|hi/)) {
      return '¡Hola! 😊 ¿En qué puedo ayudarte hoy? ¿Buscas algún producto específico para tu hogar?';
    }

    // Buscar productos por categoría
    const categories = ['muebles', 'iluminación', 'cocina', 'decoración', 'electrodomésticos'];
    for (const category of categories) {
      if (lowerMsg.includes(category)) {
        const categoryProducts = products.filter(p => 
          p.category.toLowerCase() === category || 
          p.tags.some(tag => tag.includes(category))
        );
        if (categoryProducts.length > 0) {
          const productList = categoryProducts.slice(0, 3).map(p => 
            `• **${p.name}** - $${p.price.toFixed(2)}${p.badge ? ` (${p.badge})` : ''}`
          ).join('\n');
          return `¡Perfecto! En **${category}** tenemos estas opciones:\n\n${productList}\n\n¿Te gustaría ver más detalles de alguno? Solo dime el nombre del producto.`;
        }
      }
    }

    // Buscar productos específicos
    for (const product of products) {
      if (lowerMsg.includes(product.name.toLowerCase()) || 
          product.tags.some(tag => lowerMsg.includes(tag.toLowerCase()))) {
        return `¡Excelente elección! **${product.name}** es uno de nuestros productos estrella.\n\n💰 **Precio:** $${product.price.toFixed(2)}${product.originalPrice ? ` (antes $${product.originalPrice.toFixed(2)})` : ''}\n⭐ **Rating:** ${product.rating}/5 (${product.reviewCount} reseñas)\n📦 **Stock:** ${product.inStock ? '✅ Disponible' : '❌ Agotado'}\n\n${product.shortDescription}\n\n¿Te gustaría ver más detalles o agregarlo al carrito?`;
      }
    }

    // Precios y ofertas
    if (lowerMsg.match(/precio|oferta|descuento|barato|económico/)) {
      const onSale = products.filter(p => p.originalPrice);
      return `¡Tenemos grandes ofertas! 🎉\n\n**Productos con descuento:**\n${onSale.map(p => `• **${p.name}** - $${p.price.toFixed(2)} (ahorra $${(p.originalPrice! - p.price).toFixed(2)})`).join('\n')}\n\n💡 **Tip:** Envío GRATIS en compras mayores a $500`;
    }

    // Envío
    if (lowerMsg.match(/envío|entrega|shipping|cuánto tarda/)) {
      return `📦 **Información de envío:**\n\n✅ **Envío GRATIS** en compras mayores a $500\n🚚 **Envío estándar:** $49.99 (3-5 días hábiles)\n⚡ **Envío express:** $99.99 (1-2 días hábiles)\n\n📍 Realizamos envíos a todo México\n🔒 Todos los envíos incluyen seguro y número de rastreo`;
    }

    // Stock/disponibilidad
    if (lowerMsg.match(/stock|disponible|hay|queda/)) {
      return `✅ **Disponibilidad actual:**\n\n${products.filter(p => p.inStock).map(p => `• **${p.name}** - ✅ En stock`).join('\n')}\n\nTodos nuestros productos están disponibles para envío inmediato. 📦`;
    }

    // Métodos de pago
    if (lowerMsg.match(/pago|tarjeta|efectivo|transferencia/)) {
      return `💳 **Métodos de pago aceptados:**\n\n• Tarjetas de crédito/débito (Visa, Mastercard, Amex)\n• PayPal\n• Transferencia bancaria\n• Oxxo Pay\n• Meses sin intereses (3, 6, 9, 12 MSI)\n\n🔒 **Pago 100% seguro** con encriptación SSL`;
    }

    // Garantía/devoluciones
    if (lowerMsg.match(/garantía|devolución|regresar|cambiar/)) {
      return `🛡️ **Política de garantía y devoluciones:**\n\n✅ **Garantía** de 1-5 años según el producto\n🔄 **30 días** para devoluciones sin preguntas\n💰 **Reembolso total** si no estás satisfecho\n📞 **Soporte** al cliente 24/7\n\nTu satisfacción es nuestra prioridad. 😊`;
    }

    // Recomendaciones
    if (lowerMsg.match(/recomienda|sugiere|mejor|cuál|qué me dices/)) {
      const bestSellers = products.filter(p => p.badge?.includes('Más Vendido') || p.reviewCount > 100);
      return `⭐ **Nuestros productos más populares:**\n\n${bestSellers.slice(0, 3).map((p, i) => `${i + 1}. **${p.name}** - $${p.price.toFixed(2)}\n   ⭐ ${p.rating}/5 (${p.reviewCount} reseñas)`).join('\n\n')}\n\n¿Hay alguno que te interese? Puedo darte más detalles. 😊`;
    }

    // Ayuda con la compra
    if (lowerMsg.match(/comprar|carrito|orden|pedido/)) {
      return `🛒 **¿Listo para comprar?**\n\nSigue estos pasos:\n\n1️⃣ Agrega los productos al carrito\n2️⃣ Revisa tu carrito y cantidades\n3️⃣ Procede al checkout\n4️⃣ Ingresa tu dirección de envío\n5️⃣ Selecciona método de pago\n6️⃣ ¡Confirma tu pedido!\n\n¿Necesitas ayuda con algún paso?`;
    }

    // Despedida
    if (lowerMsg.match(/adiós|bye|gracias|hasta luego/)) {
      return `¡Gracias por contactarnos! 😊\n\nSi necesitas más ayuda, no dudes en escribirme. ¡Que tengas un excelente día!\n\n✨ **Livo** - Hazlo simple, hazlo Livo`;
    }

    // Respuesta por defecto
    return `Entiendo. 🤔\n\nPuedo ayudarte con:\n🔍 Buscar productos por categoría\n💰 Información de precios y ofertas\n📦 Consultar envíos y disponibilidad\n🛒 Asistirte con tu compra\n\n¿Qué te gustaría saber? También puedes escribir el nombre de un producto que te interese.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Asistente IA</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-100">En línea</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-[#1e3a8a]'
                          : 'bg-stone-100'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-[#1e3a8a] text-white rounded-br-md'
                          : 'bg-stone-100 text-stone-700 rounded-bl-md'
                      }`}
                    >
                      {formatMessage(message.content)}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="bg-stone-100 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 rounded-full border-stone-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 p-0 rounded-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-stone-400 text-center mt-2">
                Powered by Livo AI 🤖
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
