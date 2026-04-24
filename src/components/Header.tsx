import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useBrandStore } from '../store/brandStore';
import { SearchBar } from './SearchBar';
import { toast } from 'sonner';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useBrandStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt={`${config.name} Logo`} 
              className="h-8 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-[#1e3a8a] font-heading">
              {config.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-[#1e3a8a] font-sans ${
                location.pathname === '/' ? 'text-[#1e3a8a]' : 'text-gray-600'
              }`}
            >
              Inicio
            </Link>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#1e3a8a] font-sans"
            >
              Catálogo
            </button>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  // En el futuro, esto podría filtrar por productos con descuento
                  document.getElementById('offers-section')?.scrollIntoView({ behavior: 'smooth' }) || 
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-[#1e3a8a]"
            >
              Ofertas
            </button>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-[#1e3a8a]"
            >
              Contacto
            </button>
            <Link
              to="/mi-cuenta"
              className={`text-sm font-medium transition-colors hover:text-[#1e3a8a] font-sans ${
                location.pathname === '/mi-cuenta' ? 'text-[#1e3a8a]' : 'text-gray-600'
              }`}
            >
              Mi Cuenta
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-stone-600 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/5"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-stone-600 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/5 hidden sm:flex"
              onClick={() => {
                if (wishlistCount > 0) {
                  // TODO: Implementar goToWishlist() en navigationStore
                  toast.info(`Tienes ${wishlistCount} productos en tu lista de deseos.`);
                } else {
                  toast.info('Tu lista de deseos está vacía.');
                }
              }}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#ff6b6b] text-white text-xs border-white">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <Link to="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-stone-600 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/5"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#ff6b6b] text-white text-xs border-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

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
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2 px-4 rounded-lg hover:bg-[#1e3a8a]/5 text-gray-700"
              >
                Inicio
              </Link>
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-[#1e3a8a]/5 text-gray-700"
              >
                Catálogo
              </button>
              <Link
                to="/mi-cuenta"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2 px-4 rounded-lg hover:bg-[#1e3a8a]/5 text-gray-700"
              >
                Mi Cuenta
              </Link>
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-left py-2 px-4 rounded-lg hover:bg-[#1e3a8a]/5 text-gray-700"
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
