import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        if (!get().items.some((item) => item.id === product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      toggleWishlist: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },
      isInWishlist: (productId) => get().items.some((item) => item.id === productId),
      getWishlistCount: () => get().items.length,
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'livo-wishlist-storage', // Nombre de la clave en localStorage
    }
  )
);