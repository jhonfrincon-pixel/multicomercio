import { useMemo } from 'react';
import { products } from '@/data/products';
import type { Product } from '@/types';
import { useNavigationStore } from '@/store/navigationStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  currentProduct: Product;
  maxItems?: number;
  title?: string;
}

export function RelatedProducts({ 
  currentProduct, 
  maxItems = 4,
  title = 'También te puede interesar'
}: RelatedProductsProps) {
  const { goToProduct } = useNavigationStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  const relatedProducts = useMemo(() => {
    // Score products based on similarity
    const scored = products
      .filter((p) => p.id !== currentProduct.id)
      .map((p) => {
        let score = 0;
        
        // Same category: +10 points
        if (p.category === currentProduct.category) score += 10;
        
        // Shared tags: +3 points each
        const sharedTags = p.tags.filter((tag) => currentProduct.tags.includes(tag));
        score += sharedTags.length * 3;
        
        // Similar price range (within 30%): +2 points
        const priceDiff = Math.abs(p.price - currentProduct.price) / currentProduct.price;
        if (priceDiff < 0.3) score += 2;
        
        // Has badge (popular): +1 point
        if (p.badge) score += 1;
        
        // High rating: +1 point
        if (p.rating >= 4.5) score += 1;
        
        return { product: p, score };
      });

    // Sort by score and take top items
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map((item) => item.product);
  }, [currentProduct, maxItems]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    const isAdded = !wishlistItems.some(i => i.id === product.id);
    toast.success(isAdded ? 'Agregado a favoritos' : 'Eliminado de favoritos');
  };

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
            {title}
          </h2>
          <p className="text-stone-600">
            Productos que complementan tu elección
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 cursor-pointer"
              onClick={() => goToProduct(product.id)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={product.images[0] || '/placeholder-image.png'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-amber-600 text-white border-0 text-xs">
                    {product.badge}
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 rounded-full shadow-sm z-10 transition-colors ${
                    wishlistItems.some(i => i.id === product.id) 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-white/80 text-stone-600 hover:bg-white'
                  }`}
                  onClick={(e) => handleToggleWishlist(product, e)}
                >
                  <Heart className={`w-4 h-4 ${wishlistItems.some(i => i.id === product.id) ? 'fill-current' : ''}`} />
                </Button>

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-stone-800 hover:bg-amber-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToProduct(product.id);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-stone-600">
                    {product.rating}
                  </span>
                </div>

                <h3 className="font-semibold text-stone-800 mb-1 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-1 mb-3">
                  {product.shortDescription}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm" // Botón "Comprar Ahora"
                    className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-8 w-8 p-0"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Frequently Bought Together variant
export function FrequentlyBoughtTogether({ 
  currentProduct 
}: { 
  currentProduct: Product 
}) {
  const { goToProduct } = useNavigationStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // Get 2-3 complementary products from different categories
  const complementary = useMemo(() => {
    const otherCategories = products.filter(
      (p) => p.id !== currentProduct.id && p.category !== currentProduct.category
    );
    return otherCategories.slice(0, 2);
  }, [currentProduct]);

  if (complementary.length === 0) return null;

  const totalPrice = currentProduct.price + complementary.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = totalPrice * 0.1; // 10% bundle discount
  const finalPrice = totalPrice - bundleDiscount;

  const handleAddBundle = () => {
    addToCart(currentProduct);
    complementary.forEach((p) => addToCart(p));
    toast.success('¡Bundle agregado al carrito!', {
      description: `Ahorraste $${bundleDiscount.toFixed(2)}`,
    });
  };

  return (
    <section className="py-12 bg-white border-t border-stone-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-stone-800 mb-6">
          Frecuentemente comprados juntos
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Current Product */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <img
              src={currentProduct.images[0] || '/placeholder-image.png'}
              alt={currentProduct.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-stone-800 text-sm max-w-[150px] line-clamp-1">
                {currentProduct.name}
              </p>
              <p className="text-amber-600 font-semibold">
                ${currentProduct.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Plus Sign */}
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
            +
          </div>

          {/* Complementary Products */}
          {complementary.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <div 
                className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors"
                onClick={() => goToProduct(product.id)}
              >
                <img
                  src={product.images[0] || '/placeholder-image.png'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-stone-800 text-sm max-w-[150px] line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-amber-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {index < complementary.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
                  +
                </div>
              )}
            </div>
          ))}

          {/* Equals Sign */}
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
            =
          </div>

          {/* Bundle Price */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-sm text-stone-600 mb-1">Precio del bundle</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-700">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-stone-400 line-through">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              ¡Ahorras ${bundleDiscount.toFixed(2)} (10%)!
            </p>
            <Button
              size="sm"
              className="w-full mt-3 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white"
              onClick={handleAddBundle}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar bundle
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
