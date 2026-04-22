import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

interface FunnelOptions {
  orderBump?: boolean;
  tripwirePrice?: number;
  totalPrice?: number;
  isUpsell?: boolean;
  upsellPrice?: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: FunnelOptions) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFunnelTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1, options = {}) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity, ...options }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, ...options }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getFunnelTotal: () => {
        return get().items.reduce(
          (total, item) => {
            let itemTotal = 0;
            
            // Use funnel-specific pricing
            if (item.tripwirePrice) {
              itemTotal += item.tripwirePrice * item.quantity;
            } else {
              itemTotal += item.product.price * item.quantity;
            }
            
            // Add order bump if selected
            if (item.orderBump && item.product.orderBump) {
              itemTotal += item.product.orderBump.price;
            }
            
            // Use upsell pricing if applicable
            if (item.isUpsell && item.upsellPrice) {
              itemTotal = item.upsellPrice;
            }
            
            return total + itemTotal;
          },
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
