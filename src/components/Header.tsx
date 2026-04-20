import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useNavigationStore } from '@/store/navigationStore';
import { useBrandStore } from '../store/brandStore';
import { SearchBar } from './SearchBar';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.getWishlistCount());
  const { currentView, goToHome, goToCart } = useNavigationStore();
  const { config } = useBrandStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={goToHome} className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${config.primary_color}, ${config.color_palette.monochromatic[2]})` }}>
              {config.name}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={goToHome}
              className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                currentView === 'home' ? 'text-amber-700' : 'text-stone-600'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => {
                goToHome();
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-700"
            >
              Catálogo
            </button>
            <button
              onClick={() => {
                goToHome();
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-700"
            >
              Ofertas
            </button>
            <button
              onClick={goToHome}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-700"
            >
              Contacto
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-stone-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-stone-600 hover:text-amber-700 hover:bg-amber-50 hidden sm:flex"
              onClick={() => toast.info('Wishlist próximamente disponible')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-stone-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={goToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-amber-600 text-white text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-stone-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white">
            <nav className="flex flex-col p-4 gap-2">
              <button
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-amber-50 text-stone-700"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-amber-50 text-stone-700"
              >
                Catálogo
              </button>
              <button
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-amber-50 text-stone-700"
              >
                Ofertas
              </button>
              <button
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-amber-50 text-stone-700"
              >
                Contacto
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

// Import toast for the wishlist button
import { toast } from 'sonner';
