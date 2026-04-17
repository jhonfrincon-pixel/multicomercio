import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '@/data/products';
import type { Product } from '@/types';

interface ProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  hydrateProducts: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: initialProducts,

      hydrateProducts: () => {
        if (get().products.length === 0) {
          set({ products: initialProducts });
        }
      },

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => 
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProduct: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: 'inventory-storage',
    }
  )
);