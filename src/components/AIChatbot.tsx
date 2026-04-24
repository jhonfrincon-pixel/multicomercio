import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Configuración de Gemini (Asegúrate de tener la API KEY en tu .env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

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

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!API_KEY) {
      toast.error("Configuración faltante: No se encontró la VITE_GEMINI_API_KEY en el archivo .env.");
      return;
    }

    // 1. Preparar el catálogo formateado para mejor razonamiento numérico de la IA
    const productCatalog = products.map(p => 
      `- ${p.name}: $${p.price.toLocaleString('es-CO')} COP. [Categoría: ${p.category}]. ${p.shortDescription} (Stock: ${p.inStock ? 'Disponible' : 'Agotado'})`
    ).join('\n');

    const systemInstruction = `Eres el asistente experto de Livo, tienda premium de hogar en Colombia.
    Tu catálogo actual:
    ${productCatalog}

    LÓGICA DE PRESUPUESTO:
    - Si el usuario menciona un presupuesto (ej: "tengo 200 mil", "busco algo de menos de 1 millón"), filtra el catálogo y sugiere los 2 o 3 productos que mejor se ajusten.
    - Si un producto excede el presupuesto por muy poco, menciónalo como una "opción premium" que vale la pena el esfuerzo.
    - Si el presupuesto es muy bajo, sugiere artículos de decoración o accesorios (como el Jarrón o el Corrector de Postura).

    REGLAS DE ORO:
    1. Formato: Usa Markdown (**negrita** para nombres y precios). Precios siempre con puntos (ej: $89.900).
    2. Envíos: Menciona que el envío es GRATIS si la compra supera los $500.000 COP.
    3. Trato: Sé amable, usa español de Colombia (sin exagerar) y enfócate en ayudar a decorar el hogar.
    4. Si el usuario pregunta por algo fuera de presupuesto, ofrece alternativas económicas de tu catálogo.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction 
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setIsTyping(true);

    try {
      // 2. Preparar el historial (Gemini requiere que el historial comience con un mensaje del 'user')
      // Filtramos el mensaje de bienvenida inicial ya que tiene rol 'model' y causaría un error de validación
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({
        history,
      });
      
      const result = await chat.sendMessage(userMessage.content);
      const response = await result.response;
      const text = response.text();

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast.error("Hubo un error al conectar con el asistente.");
    } finally {
      setIsTyping(false);
    }
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
