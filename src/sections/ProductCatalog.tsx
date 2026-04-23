import { useState } from 'react';
import { categories } from '@/data/products';
import { useNavigationStore } from '@/store/navigationStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProductsStore } from '@/store/productsStore';
import { ShoppingCart, Eye, Star, Sofa, Lightbulb, Utensils, Palette, Zap, Grid, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialProofBadge } from '@/components/SocialProofIndicators';

const iconMap: Record<string, React.ElementType> = {
  sofa: Sofa,
  lightbulb: Lightbulb,
  utensils: Utensils,
  palette: Palette,
  zap: Zap,
  grid: Grid,
};

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { products } = useProductsStore();
  const { goToProduct } = useNavigationStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`, {
      description: `Cantidad: 1`,
    });
  };

  const handleWishlist = (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success('Agregado a favoritos', { icon: '❤️' });
    } else {
      toast.info('Eliminado de favoritos');
    }
  };

  return (
    <section id="products-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-sans">
            Explora nuestra colección de productos cuidadosamente seleccionados 
            para transformar cada espacio de tu hogar.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Grid;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all font-sans ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => goToProduct(product.id)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-0">
                      {product.badge}
                    </Badge>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlist(product, e)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-gray-800 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToProduct(product.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider font-sans">
                      {product.category}
                    </span>
                    <SocialProofBadge productId={product.id} />
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                    <span className="text-sm text-gray-600 font-sans">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1 font-heading">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-sans">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900 font-heading">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through font-sans">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-sans font-semibold"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Grid className="w-12 h-12 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-stone-500">
              Selecciona otra categoría o vuelve más tarde
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
