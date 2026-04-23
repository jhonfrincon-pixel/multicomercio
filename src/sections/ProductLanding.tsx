import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { useNavigationStore } from '@/store/navigationStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Check,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ZoomIn,
  X,
} from 'lucide-react';
import { SocialProofIndicators } from '@/components/SocialProofIndicators';
import { RelatedProducts, FrequentlyBoughtTogether } from '@/components/RelatedProducts';

interface ProductLandingProps {
  product: Product;
}

export function ProductLanding({ product }: ProductLandingProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { goToHome, goToCart } = useNavigationStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  // Scroll to top when product loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} agregado al carrito`, {
      description: `Cantidad: ${quantity}`,
    });
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success('Agregado a tu lista de deseos', {
        icon: '❤️',
      });
    } else {
      toast.info('Eliminado de tu lista de deseos');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const benefitIcons: Record<string, React.ElementType> = {
    sofa: ShoppingCart,
    heart: Heart,
    shield: Shield,
    sparkles: Check,
    palette: Check,
    lightbulb: Check,
    gem: Check,
    wrench: Check,
    leaf: Check,
    hammer: Check,
    utensils: Check,
    droplets: Check,
    maximize: Check,
    crown: Check,
    eye: Check,
    screwdriver: Check,
    clock: Check,
    map: Check,
    smartphone: Check,
    paw: Check,
    fingerprint: Check,
    users: Check,
    flower: Check,
    hourglass: Check,
  };

  // Generate pseudo-stock for urgency
  const stockLevel = 3 + (parseInt(product.id) * 7) % 15;

  return (
    <div className="min-h-screen bg-white">
      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="max-w-[90%] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImage === idx ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={goToHome}
            className="flex items-center gap-2 text-stone-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al catálogo</span>
          </button>
        </div>
      </div>

      {/* Hero Section - Product Overview */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Zoom Button */}
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badge */}
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-0 text-sm px-3 py-1">
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-600 ring-2 ring-blue-600/20'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-blue-400 text-blue-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-stone-600">
                    {product.rating} ({product.reviewCount} reseñas)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue-700">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-stone-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      Ahorra ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-lg text-stone-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Social Proof Indicators */}
              <SocialProofIndicators 
                productId={product.id} 
                stock={stockLevel}
                isOnSale={!!product.originalPrice}
              />

              {/* Features List */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                {product.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-stone-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </Button>

                {/* Wishlist */}
                <Button
                  size="lg"
                  variant="outline"
                  className={`w-14 h-14 rounded-xl transition-all ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100' 
                      : 'hover:bg-stone-50'
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>

                {/* Share */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-14 h-14 rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Enlace copiado al portapapeles');
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-stone-600">Envío Gratis +$500</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-stone-600">Garantía Incluida</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-stone-600">30 Días Devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether currentProduct={product} />

      {/* Benefits Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              ¿Por qué elegir {product.name}?
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Descubre los beneficios que hacen de este producto la elección perfecta para tu hogar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.benefits.map((benefit, index) => {
              const Icon = benefitIcons[benefit.icon] || Check;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Info Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="description" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div className="prose prose-stone max-w-none">
                <p className="text-lg text-stone-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-6">
              <div className="bg-stone-50 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                      >
                        <td className="px-6 py-4 font-medium text-stone-700 w-1/3">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-stone-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Lo que dicen nuestros clientes
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(product.rating)
                          ? 'fill-blue-400 text-blue-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-stone-800">
                  {product.rating}
                </span>
                <span className="text-stone-600">
                  Basado en {product.reviewCount} reseñas
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-stone-800">
                          {review.author}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-blue-400 text-blue-400'
                                    : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-stone-500">
                            {new Date(review.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <h5 className="font-semibold text-stone-800 mb-2">
                    {review.title}
                  </h5>
                  <p className="text-stone-600 leading-relaxed">
                    {review.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts currentProduct={product} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu hogar?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Agrega {product.name} a tu carrito y disfruta de envío gratis en compras mayores a $500.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Agregar al Carrito - ${product.price.toFixed(2)}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
              onClick={goToCart}
            >
              Ver Carrito
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
