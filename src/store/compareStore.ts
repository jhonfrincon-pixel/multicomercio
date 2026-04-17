import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface CompareState {
  products: Product[];
  maxProducts: number;
  addToCompare: (product: Product) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  getCompareCount: () => number;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      maxProducts: 4,

      addToCompare: (product) => {
        const { products, maxProducts } = get();
        
        if (products.some((p) => p.id === product.id)) {
          return { success: false, message: 'Este producto ya está en la comparación' };
        }
        
        if (products.length >= maxProducts) {
          return { success: false, message: `Solo puedes comparar hasta ${maxProducts} productos` };
        }

        set({ products: [...products, product] });
        return { success: true, message: 'Producto agregado a comparación' };
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      isInCompare: (productId) => {
        return get().products.some((p) => p.id === productId);
      },

      clearCompare: () => {
        set({ products: [] });
      },

      getCompareCount: () => {
        return get().products.length;
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);
