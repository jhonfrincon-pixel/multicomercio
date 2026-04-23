import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift, Sparkles, CheckCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success('¡Bienvenido a Livo!', {
      description: 'Tu código de descuento ha sido enviado a tu email',
    });
  };

  const benefits = [
    { icon: Gift, text: '15% de descuento en tu primera compra' },
    { icon: Tag, text: 'Acceso exclusivo a ofertas flash' },
    { icon: Sparkles, text: 'Novedades y tendencias de decoración' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1e3a8a]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e3a8a]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/20 rounded-full px-4 py-2 mb-6">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200 text-sm font-medium">
                    Únete a nuestra comunidad
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Recibe las mejores{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    ofertas
                  </span>{' '}
                  en tu inbox
                </h2>

                <p className="text-stone-300 mb-8 leading-relaxed">
                  Suscríbete a nuestro newsletter y sé el primero en conocer nuestras 
                  ofertas exclusivas, nuevos productos y tips de decoración.
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-[#1e3a8a]/20 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-stone-200">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                {!isSubscribed ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        ¡Obtén 15% de descuento!
                      </h3>
                      <p className="text-stone-400 text-sm">
                        En tu primera compra al suscribirte
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-stone-500 h-14 rounded-xl focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/80 hover:from-[#1e3a8a]/90 hover:to-[#1e3a8a] text-white text-lg font-semibold rounded-xl disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Suscribiendo...</span>
                          </div>
                        ) : (
                          'Suscribirme Ahora'
                        )}
                      </Button>
                    </form>

                    <p className="text-xs text-stone-500 text-center mt-4">
                      Al suscribirte, aceptas nuestra política de privacidad. 
                      Puedes darte de baja en cualquier momento.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      ¡Bienvenido!
                    </h3>
                    <p className="text-stone-300 mb-4">
                      Tu código de descuento <strong className="text-blue-400">BIENVENIDO15</strong> 
                      ha sido enviado a <strong className="text-white">{email}</strong>
                    </p>
                    <div className="p-4 bg-[#1e3a8a]/20 rounded-xl border border-[#1e3a8a]/30">
                      <p className="text-blue-200 text-sm">
                        Usa el código al finalizar tu compra
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Simple inline variant for product pages
export function InlineNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }
    setIsSubscribed(true);
    toast.success('¡Gracias por suscribirte!');
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">¡Gracias por suscribirte!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-10"
      />
      <Button type="submit" size="sm" className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white">
        <Mail className="w-4 h-4 mr-2" />
        Suscribirme
      </Button>
    </form>
  );
}
