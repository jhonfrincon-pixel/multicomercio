import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useSearchParams } from 'react-router-dom';

// Componentes de Interfaz
import { Header } from '@/components/Header'; // Usamos tu Header de sections
import { Footer } from '@/sections/Footer';
import { SEO } from '@/components/SEO';
import { Toaster } from '@/components/ui/sonner';
import { MarketingTags } from '@/components/MarketingTags';
import { FloatingContactGroup } from '@/components/FloatingContactGroup';
import { AIChatbot } from '@/components/AIChatbot';

// Secciones de la Tienda - Lazy Loading para optimización
import { Hero } from '@/sections/Hero';
import { TrustSection } from '@/sections/TrustSection';
import { SocialProof } from '@/sections/SocialProof';
import { Newsletter } from '@/components/Newsletter';

// Lazy loading para componentes pesados
const ProductCatalog = lazy(() => import('@/sections/ProductCatalog').then(module => ({ default: module.ProductCatalog })));
const ProductLanding = lazy(() => import('@/sections/ProductLanding').then(module => ({ default: module.ProductLanding })));
const ProductLandingFunnel = lazy(() => import('@/sections/ProductLandingFunnel').then(module => ({ default: module.ProductLandingFunnel })));
const Cart = lazy(() => import('@/sections/Cart').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('@/sections/Checkout').then(module => ({ default: module.Checkout })));
const CheckoutColombia = lazy(() => import('@/sections/CheckoutColombia').then(module => ({ default: module.CheckoutColombia })));
const MiCuenta = lazy(() => import('@/sections/MiCuenta').then(module => ({ default: module.MiCuenta })));
const SobreNosotros = lazy(() => import('@/pages/SobreNosotros').then(module => ({ default: module.SobreNosotros })));

// CRM y Seguridad
import { CRMDashboard } from '@/crm/CRMDashboard';
import { CRMAccessGate } from '@/crm/CRMAccessGate';
import { ProtectedRoute } from './components/ProtectedRoute';

// Hooks y Stores
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { useBrandStore } from '@/store/brandStore';
import { useCartStore } from '@/store/cartStore';
import { useReferralCapture } from '@/hooks/useReferralCapture';
import { getProductById } from '@/data/products';

/**
 * 🛍️ Maneja si mostrar landing estándar o de Funnel (Tripwire)
 */
function ProductPageRoute() {
  const { productId } = useParams();
  const product = productId ? getProductById(productId) : null;

  if (!product) return <Navigate to="/" replace />;

  return product.tripwirePrice 
    ? <ProductLandingFunnel product={product} />
    : <ProductLanding product={product} />;
}

/**
 * 💳 Elige el Checkout correcto (Estándar o Colombia)
 */
function CheckoutPageRoute() {
  const { items } = useCartStore();
  const isColombiaFunnel = items.some(item => 
    item.product.tripwirePrice || item.isUpsell || item.orderBump
  );
  return isColombiaFunnel ? <CheckoutColombia /> : <Checkout />;
}

/**
 * 🧠 EL CEREBRO DE LA APP: Maneja Auth, Branding y Atajos
 */
function AppWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeAuth, isAuthenticated, isAuthLoading } = useCRMAuthStore();
  const { config: brandData, isLoading, loadBrandConfig: fetchBrandConfig } = useBrandStore();

  // Captura referidos automáticamente
  useReferralCapture();

  useEffect(() => {
    fetchBrandConfig();
    initializeAuth();
  }, [fetchBrandConfig, initializeAuth]);

  // Atajo de teclado: Ctrl + Shift + A para ir al CRM
  useEffect(() => {
    const handleAdminShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/crm');
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, [navigate]);

  // Branding Dinámico (Favicon y Colores)
  useEffect(() => {
    if (brandData) {
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (favicon) favicon.href = brandData.favicon_url || '/favicon.ico';
      
      // Set CSS variables with fallbacks
      document.documentElement.style.setProperty('--primary-color', brandData.primary_color || '#2563EB');
      
      // Generate color variations
      const primaryColor = brandData.primary_color || '#2563EB';
      // Simple color manipulation for dark/light variants
      const darkerColor = primaryColor + 'cc'; // Add transparency for darker
      const lighterColor = primaryColor + '20'; // Add transparency for lighter
      
      document.documentElement.style.setProperty('--primary-color-dark', darkerColor);
      document.documentElement.style.setProperty('--primary-color-light', lighterColor);
    }
  }, [brandData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#1e3a8a] rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Cargando Livo...</p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 🏠 Página de Inicio
 */
function HomePage() {
  const { config: brandData } = useBrandStore();
  return (
    <>
      <SEO title="Inicio" description={brandData?.slogan} />
      <Hero />
      <TrustSection />
      <Suspense fallback={
        <div className="py-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-[#1e3a8a] rounded-full animate-spin"></div>
        </div>
      }>
        <ProductCatalog />
      </Suspense>
      <SocialProof />
      <Newsletter />
    </>
  );
}

/**
 * 🚀 COMPONENTE PRINCIPAL
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <div className="min-h-screen bg-white">
          <MarketingTags />
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<ProductCatalog />} />
              <Route path="/producto/:productId" element={<ProductPageRoute />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPageRoute />} />
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
              
              {/* Ruta protegida para Mi Cuenta */}
              <Route path="/mi-cuenta" element={
                <ProtectedRoute>
                  <MiCuenta />
                </ProtectedRoute>
              } />

              {/* Rutas del CRM */}
              <Route path="/crm/*" element={
                <CRMAccessGate /> // CRMAccessGate internamente decide si mostrar login o dashboard
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingContactGroup />
          <AIChatbot />
          <Toaster position="bottom-right" richColors />
        </div>
      </AppWrapper>
    </BrowserRouter>
  );
}