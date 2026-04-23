import { ArrowRight, Sparkles, Truck, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gray-50">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Livo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium font-heading">
                Envíos a toda Colombia • Pago contra entrega
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-heading"
          >
            Productos que{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              mejoran tu vida
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-sans"
          >
            Los productos que necesitas, entregados directamente en la puerta de tu casa. 
            Calidad garantizada y la confianza que mereces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl font-sans font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Comprar Ahora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl font-sans font-semibold backdrop-blur-sm"
            >
              Pagar al Recibir
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6 mt-12"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Truck className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-sans">Envíos 3-7 días hábiles</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-sans">Pago Contra Entrega</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <RotateCcw className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-sans">Garantía 30 Días</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
