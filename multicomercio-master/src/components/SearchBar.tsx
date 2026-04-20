import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { products } from '@/data/products';
import { useNavigationStore } from '@/store/navigationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = ['sillón', 'lámpara', 'cocina'];
const TRENDING_SEARCHES = ['aspiradora', 'decoración', 'ofertas'];

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { goToProduct } = useNavigationStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleProductClick = (productId: string) => {
    goToProduct(productId);
    setQuery('');
    onClose();
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSuggestions(filtered.slice(0, 5));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-stone-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar productos, categorías, marcas..."
                  className="pl-12 pr-12 py-6 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto">
              {query.length > 1 ? (
                // Search Results
                suggestions.length > 0 ? (
                  <div className="p-2">
                    <p className="px-4 py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Productos encontrados ({suggestions.length})
                    </p>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-colors text-left"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-stone-800">{product.name}</p>
                          <p className="text-sm text-stone-500">{product.category}</p>
                          <p className="text-sm font-medium text-amber-600">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-stone-400" />
                    </div>
                    <p className="text-stone-600">No encontramos productos para "{query}"</p>
                    <p className="text-sm text-stone-400 mt-1">
                      Intenta con otras palabras o categorías
                    </p>
                  </div>
                )
              ) : (
                // Default Suggestions
                <div className="p-4">
                  {/* Recent Searches */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Búsquedas recientes
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RECENT_SEARCHES.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm hover:bg-stone-200 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Tendencias
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm hover:bg-amber-100 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                      Categorías populares
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Muebles', 'Iluminación', 'Cocina', 'Decoración'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleSearch(cat.toLowerCase())}
                          className="p-3 text-left rounded-xl hover:bg-stone-50 transition-colors border border-stone-100"
                        >
                          <p className="font-medium text-stone-800">{cat}</p>
                          <p className="text-xs text-stone-500">
                            {products.filter((p) => p.category === cat).length} productos
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
