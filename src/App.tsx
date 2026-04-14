import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/sections/Hero';
import { ProductCatalog } from '@/sections/ProductCatalog';
import { ProductLanding } from '@/sections/ProductLanding';
import { Cart } from '@/sections/Cart';
import { Checkout } from '@/sections/Checkout';
import { Footer } from '@/sections/Footer';
import { AIChatbot } from '@/components/AIChatbot';
import { Newsletter } from '@/components/Newsletter';
import { CRMDashboard } from '@/crm/CRMDashboard';
import { CRMAccessGate } from '@/crm/CRMAccessGate';
import { useNavigationStore } from '@/store/navigationStore';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { getProductById } from '@/data/products';
import { Toaster } from '@/components/ui/sonner';
import type { View } from '@/types';

function App() {
  const { currentView, selectedProductId, goToCRM } = useNavigationStore();
  const { isAuthenticated } = useCRMAuthStore();

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

  const renderContent = () => {
    // CRM Views
    if (currentView.startsWith('crm')) {
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
        return <Checkout />;

      case 'home':
      default:
        return (
          <>
            <Hero />
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
      <AIChatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
