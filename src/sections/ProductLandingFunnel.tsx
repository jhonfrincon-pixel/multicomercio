import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { useNavigationStore } from '@/store/navigationStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  Timer,
  Users,
  TrendingUp,
  Zap,
  Crown,
  X,
} from 'lucide-react';

interface ProductLandingFunnelProps {
  product: Product;
}

export function ProductLandingFunnel({ product }: ProductLandingFunnelProps) {
  const [quantity] = useState(1);
  const [orderBump, setOrderBump] = useState(true);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellTimer, setUpsellTimer] = useState(300); // 5 minutes
  const [unitsSold, setUnitsSold] = useState(247);
  const { goToHome } = useNavigationStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // Scroll to top when product loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Animate units sold counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUnitsSold(prev => {
        const increment = Math.random() * 3 + 1;
        const newTotal = prev + increment;
        return newTotal > 500 ? 247 : newTotal; // Reset after reaching 500
      });
    }, Math.random() * 2000 + 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Upsell timer countdown
  useEffect(() => {
    if (showUpsell && upsellTimer > 0) {
      const timer = setTimeout(() => {
        setUpsellTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (upsellTimer === 0) {
      setShowUpsell(false);
    }
  }, [showUpsell, upsellTimer]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleOrderNow = () => {
    const basePrice = product.tripwirePrice || product.price;
    const bumpPrice = orderBump && product.orderBump ? product.orderBump.price : 0;
    const totalPrice = basePrice + bumpPrice;
    
    addToCart(product, quantity, {
      orderBump: orderBump,
      tripwirePrice: basePrice,
      totalPrice
    });
    
    toast.success('¡Pedido agregado con éxito!', {
      description: `Total: ${formatPrice(totalPrice)}`,
    });

    // Show upsell after 1 second (50% chance)
    setTimeout(() => {
      if (Math.random() > 0.5 && product.upsell) {
        setShowUpsell(true);
      }
    }, 1000);
  };

  const handleAcceptUpsell = () => {
    if (product.upsell) {
      addToCart(product, 3, {
        isUpsell: true,
        upsellPrice: product.upsell.price
      });
      
      toast.success('¡Oferta especial agregada!', {
        description: `Pack Familiar: ${formatPrice(product.upsell.price)}`,
      });
    }
    setShowUpsell(false);
  };

  const handleDeclineUpsell = () => {
    toast.error('Has perdido la oferta especial para siempre');
    setShowUpsell(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Only show funnel features for products with tripwire pricing
  if (!product.tripwirePrice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Scarcity Bar */}
      <div className="bg-red-600 text-white py-3 text-center font-semibold relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <div className="relative">
          <Timer className="inline-block w-4 h-4 mr-2" />
          ¡QUEDAN SÓLO 23 UNIDADES A ESTE PRECIO! 
          <span className="ml-2 text-yellow-300 font-bold">{unitsSold} vendidas hoy</span>
        </div>
      </div>

      {/* Hero Section - Tripwire Hook */}
      <section className="relative bg-gradient-to-br from-blue-900 to-purple-900 py-16 lg:py-24 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-black border-0 text-sm font-bold">
                  TRIPWIRE
                </Badge>
                <span className="text-yellow-300 text-sm">Oferta por tiempo limitado</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                El Secreto Tecnológico para una
                <span className="text-yellow-400 block">Espalda Recta</span>
                <span className="text-2xl lg:text-3xl font-normal block mt-2 text-blue-200">
                  Sin fajas incómodas
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Descubre cómo un pequeño sensor con vibración inteligente está reemplazando 
                las fajas tradicionales que debilitan tus músculos
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <span>Pago Contraentrega en toda Colombia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <span>Envío Gratis Hoy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <span>Garantía Livo 30 días</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6 rounded-xl w-full lg:w-auto transform hover:scale-105 transition-all relative overflow-hidden group"
                onClick={handleOrderNow}
              >
                <span className="relative z-10 flex items-center">
                  <Zap className="w-6 h-6 mr-3" />
                  ¡QUIERO MI OFERTA AHORA!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur border-2 border-white/20">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-lg transform rotate-12">
                AHORRA 52%
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                {unitsSold}+ vendidos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Clientes Reales en Colombia
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {product.rating}
              </span>
              <span className="text-gray-600">
                ({product.reviewCount} reseñas verificadas)
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {product.reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-green-50 border border-green-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.author}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        WhatsApp Verificado ✓
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "{review.content}"
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Epiphany Bridge */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
              El Puente de la Epifanía
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Problem Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-3">
                  <X className="w-8 h-8" />
                  El Problema: Fajas que Debilitan
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Las fajas tradicionales te dan una <strong>postura falsa</strong>. 
                    Te aprietan, te obligan a estar recto, pero...
                  </p>
                  <p className="font-bold text-red-600">
                    <strong>DEBILITAN TUS MÚSCULOS.</strong>
                  </p>
                  <p>
                    Tu cuerpo se vuelve <strong>dependiente</strong> del soporte externo 
                    y cuando te quitas la faja, vuelves a encorvarte <strong>peor</strong> que antes.
                  </p>
                  <p className="italic">
                    Es como usar muletas para caminar cuando no las necesitas. 
                    Con el tiempo, tus piernas pierden fuerza.
                  </p>
                </div>
              </motion.div>

              {/* Solution Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-3">
                  <Check className="w-8 h-8" />
                  La Solución: El Entrenador Inteligente
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Nuestro sensor inteligente <strong>no te sostiene</strong>. 
                    <strong>TE ENTRENA.</strong>
                  </p>
                  <p>
                    Monitoriza tu postura a tiempo real. Cuando te encorvas más de 25°, 
                    el dispositivo <strong>vibra suavemente</strong> para recordarte que debes corregirte.
                  </p>
                  <p className="font-bold text-green-600">
                    <strong>Así tu cerebro crea memoria muscular.</strong>
                  </p>
                  <p>
                    Tu cuerpo aprende la postura correcta <strong>NATURALMENTE</strong>, 
                    sin dependencias.
                  </p>
                  <p className="bg-green-100 p-4 rounded-lg font-semibold">
                    <strong>El resultado:</strong> Espalda recta incluso cuando no llevas el dispositivo.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section - Tripwire + Order Bump */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              🎯 OFERTA TRIPWIRE - Rompe la Barrera de Compra
            </h2>
            <p className="text-xl text-blue-200">
              Precio tan bajo que no puedes decir que no
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Main Offer */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 mb-6 relative">
              <div className="absolute -top-4 right-8 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold transform rotate-12">
                AHORRA $72.900
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">Corrector Inteligente Pro</h3>
                <div className="text-gray-400 line-through text-xl mb-2">
                  Valor: {formatPrice(140000)}
                </div>
                <div className="text-5xl font-bold text-yellow-600 mb-2">
                  {formatPrice(product.tripwirePrice || 67900)}
                  <span className="text-2xl align-super">99</span>
                </div>
                <div className="text-green-600 font-semibold">
                  ¡Ahorro del 52%!
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Corrector Inteligente Pro</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Cable de Carga USB</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Guía Digital: 5 Ejercicios</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Envío Gratis Nacional</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Garantía Total de 30 días</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-6 rounded-xl transform hover:scale-105 transition-all"
                onClick={handleOrderNow}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                ¡AGREGAR AL CARRITO!
              </Button>
            </div>

            {/* Order Bump */}
            {product.orderBump && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 border-4 border-dashed border-blue-900 rounded-2xl p-6 relative">
                <div className="absolute -top-3 right-6 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold transform rotate-12">
                  ¡OFERTA ESPECIAL!
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="orderBump"
                      checked={orderBump}
                      onChange={(e) => setOrderBump(e.target.checked)}
                      className="w-6 h-6 rounded"
                    />
                    <div>
                      <label htmlFor="orderBump" className="font-semibold text-gray-800 cursor-pointer">
                        Añade el Protector de Pantalla + Funda Antipolvo
                      </label>
                      <div className="text-sm text-gray-600">
                        ¡Ahorra $15! Normalmente {formatPrice(product.orderBump.originalPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600 line-through">
                      {formatPrice(product.orderBump.originalPrice)}
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatPrice(product.orderBump.price)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Envío Gratis</h4>
              <p className="text-gray-600">A todo Colombia</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Garantía Livo</h4>
              <p className="text-gray-600">30 días satisfacción</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">+2,847 Clientes</h4>
              <p className="text-gray-600">Felices en Colombia</p>
            </div>
            <div className="text-center">
              <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Calidad Premium</h4>
              <p className="text-gray-600">Tecnología certificada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showUpsell && product.upsell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-red-600 text-white p-4 text-center rounded-t-2xl">
                <div className="flex items-center justify-center gap-3">
                  <Timer className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    OFERTA POR TIEMPO LIMITADO: {formatTimer(upsellTimer)}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  ¡ESPERA! Antes de irte...
                </h2>
                <p className="text-xl text-gray-600 mb-6 text-center">
                  ¿Quieres <strong>TRIPLICAR</strong> tus resultados?
                </p>

                <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                    🎯 OFERTA EXCLUSIVA ONE TIME
                  </h3>
                  <p className="text-center text-gray-700 mb-4">
                    Consigue <strong>3 Correctores Inteligentes Pro</strong> por el precio de 2
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Perfecto para toda la familia o para tener repuestos
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-lg">
                    Valor normal: {formatPrice(product.upsell.originalPrice)}
                  </div>
                  <div className="text-5xl font-bold text-yellow-600 mb-2">
                    {formatPrice(product.upsell.price)}
                  </div>
                  <div className="text-green-600 font-semibold text-lg">
                    ¡Ahorra {formatPrice(product.upsell.originalPrice - product.upsell.price)}! ({product.upsell.discount}% de descuento)
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 text-center">
                    ✓ Incluye: 3 Correctores + 3 Cables + Guía Digital + Envío Express
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl transform hover:scale-105 transition-all"
                    onClick={handleAcceptUpsell}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    ¡SÍ, QUIERO EL TRATO!
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-600 py-6 rounded-xl hover:bg-gray-50"
                    onClick={handleDeclineUpsell}
                  >
                    No, gracias
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Esta oferta nunca volverá a aparecer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Home */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-4"
          onClick={goToHome}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Button>
      </div>
    </div>
  );
}
