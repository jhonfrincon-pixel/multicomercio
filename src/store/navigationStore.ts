import { create } from 'zustand';
import type { View } from '@/types';

interface NavigationState {
  currentView: View;
  selectedProductId: string | null;
  setView: (view: View) => void;
  setSelectedProduct: (productId: string | null) => void;
  goToHome: () => void;
  goToSobreNosotros: () => void;
  goToProduct: (productId: string) => void;
  goToCart: () => void;
  goToCheckout: () => void;
  goToCRM: (section?: string) => void;
  goToMiCuenta: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: 'home',
  selectedProductId: null,

  setView: (view) => set({ currentView: view }),

  setSelectedProduct: (productId) => set({ selectedProductId: productId }),

  goToHome: () => set({ currentView: 'home', selectedProductId: null }),

  goToSobreNosotros: () =>
    set({ currentView: 'sobre-nosotros' as View, selectedProductId: null }),

  goToProduct: (productId) =>
    set({ currentView: 'product', selectedProductId: productId }),

  goToCart: () => set({ currentView: 'cart', selectedProductId: null }),

  goToCheckout: () => set({ currentView: 'checkout', selectedProductId: null }),

  goToCRM: (section = 'dashboard') => {
    const crmViews: Record<string, View> = {
      dashboard: 'crm' as View,
      customers: 'crm-customers' as View,
      orders: 'crm-orders' as View,
      automations: 'crm-automations' as View,
      campaigns: 'crm-campaigns' as View,
      analytics: 'crm-analytics' as View,
      settings: 'crm-settings' as View,
      footer: 'crm-footer' as View,
    };
    set({ currentView: crmViews[section] || 'crm', selectedProductId: null });
  },

  goToMiCuenta: () => set({ currentView: 'mi-cuenta' as View, selectedProductId: null }),
}));
