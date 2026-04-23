import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/sections/Hero';
import { ProductCatalog } from '@/sections/ProductCatalog';
import { ProductLanding } from '@/sections/ProductLanding';
import { ProductLandingFunnel } from '@/sections/ProductLandingFunnel';
import { Cart } from '@/sections/Cart';
import { Checkout } from '@/sections/Checkout';
import { CheckoutColombia } from '@/sections/CheckoutColombia';
import { Footer } from '@/sections/Footer';
import { TrustSection } from '@/sections/TrustSection';
import { AIChatbot } from '@/components/AIChatbot';
import { Newsletter } from '@/components/Newsletter';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CRMDashboard } from '@/crm/CRMDashboard';
import { CRMAccessGate } from '@/crm/CRMAccessGate';
import { useNavigationStore } from '@/store/navigationStore';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { useBrandStore } from '@/store/brandStore';
import { useCartStore } from '@/store/cartStore';
import { getProductById } from '@/data/products';
import { Toaster } from '@/components/ui/sonner';
import type { View } from '@/types';

function App() {
  const { currentView, selectedProductId, goToCRM } = useNavigationStore();
  const { isAuthenticated, isAuthLoading, initializeAuth } = useCRMAuthStore();
  const { items } = useCartStore();
  
  // Lógica de Marca dinámica desde Supabase
  const { 
    config: brandData, 
    isLoading, 
    loadBrandConfig: fetchBrandConfig 
  } = useBrandStore();

  // Sincronización inicial de datos y auth
  useEffect(() => {
    fetchBrandConfig();
    initializeAuth();
  }, [fetchBrandConfig, initializeAuth]);

  // Actualización dinámica de identidad (Title, Favicon, Estilos)
  useEffect(() => {
    if (brandData) {
      // Metadatos
      document.title = `${brandData.name} - ${brandData.slogan}`;
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (favicon && brandData.favicon_url) {
        favicon.href = brandData.favicon_url;
      }

      // Inyección de variables CSS para branding dinámico
      document.documentElement.style.setProperty('--primary-color', brandData.primary_color);
    }
  }, [brandData]);

  useEffect(() => {
    const handleAdminShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        goToCRM('dashboard');
      }
    };

    window.addEventListener('keydown', handleAdminShortcut);
    return () => {
      window.removeEventListener('keydown', handleAdminShortcut);
    };
  }, [goToCRM]);

  // Pantalla de carga mientras se recupera el "Cerebro" de Supabase
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-stone-100 border-t-amber-600 rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-medium animate-pulse">
          Personalizando tu experiencia...
        </p>
      </div>
    );
  }

  const renderContent = () => {
    // CRM Views
    if (currentView.startsWith('crm')) {
      if (isAuthLoading) {
        return (
          <div className="min-h-[70vh] flex items-center justify-center">
            <p className="text-stone-600">Verificando acceso...</p>
          </div>
        );
      }
      if (!isAuthenticated) {
        return <CRMAccessGate />;
      }
      return <CRMDashboard />;
    }

    switch (currentView as View) {
      case 'product':
        if (selectedProductId) {
          const product = getProductById(selectedProductId);
          if (product) {
            // Use funnel landing page for products with tripwire pricing
            if (product.tripwirePrice) {
              return <ProductLandingFunnel product={product} />;
            }
            return <ProductLanding product={product} />;
          }
        }
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-stone-600">Producto no encontrado</p>
          </div>
        );

      case 'cart':
        return <Cart />;

      case 'checkout':
        // Use Colombia checkout for funnel products
        const hasFunnelProducts = items.some(item => 
          item.product.tripwirePrice || item.isUpsell || item.orderBump
        );
        return hasFunnelProducts ? <CheckoutColombia /> : <Checkout />;

      case 'home':
      default:
        return (
          <>
            <Hero />
            <TrustSection />
            <ProductCatalog />
            <Newsletter />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{renderContent()}</main>
      {currentView === 'home' && <Footer />}
      <WhatsAppButton />
      <AIChatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
