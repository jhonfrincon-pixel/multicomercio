import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: 'card' | 'paypal' | 'oxxo';
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  trackingNumber?: string;
}

interface CheckoutState {
  currentStep: number;
  shippingInfo: ShippingInfo | null;
  paymentMethod: 'card' | 'paypal' | 'oxxo' | null;
  paymentInfo: PaymentInfo | null;
  discountCode: string | null;
  discountAmount: number;
  
  setStep: (step: number) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentMethod: (method: 'card' | 'paypal' | 'oxxo') => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  resetCheckout: () => void;
  createOrder: (items: OrderItem[]) => Order;
}

const DISCOUNT_CODES: Record<string, number> = {
  'BIENVENIDO15': 0.15,
  'HOGAR10': 0.10,
  'VIP20': 0.20,
  'FREESHIP': 0,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      shippingInfo: null,
      paymentMethod: null,
      paymentInfo: null,
      discountCode: null,
      discountAmount: 0,

      setStep: (step) => set({ currentStep: step }),

      setShippingInfo: (info) => set({ shippingInfo: info }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setPaymentInfo: (info) => set({ paymentInfo: info }),

      applyDiscount: (code) => {
        const upperCode = code.toUpperCase();
        if (DISCOUNT_CODES[upperCode] !== undefined) {
          set({ discountCode: upperCode, discountAmount: DISCOUNT_CODES[upperCode] });
          return { 
            success: true, 
            message: upperCode === 'FREESHIP' 
              ? '¡Envío gratis aplicado!' 
              : `¡Descuento del ${DISCOUNT_CODES[upperCode] * 100}% aplicado!` 
          };
        }
        return { success: false, message: 'Código de descuento inválido' };
      },

      removeDiscount: () => set({ discountCode: null, discountAmount: 0 }),

      resetCheckout: () => set({
        currentStep: 1,
        shippingInfo: null,
        paymentMethod: null,
        paymentInfo: null,
        discountCode: null,
        discountAmount: 0,
      }),

      createOrder: (items) => {
        const { shippingInfo, paymentMethod, discountAmount } = get();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = discountAmount === 0 && get().discountCode === 'FREESHIP' ? 0 : (subtotal > 500 ? 0 : 49.99);
        const tax = subtotal * 0.16;
        const discount = subtotal * discountAmount;
        const total = subtotal + shipping + tax - discount;

        const order: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          items,
          shippingInfo: shippingInfo!,
          paymentMethod: paymentMethod!,
          subtotal,
          shipping,
          tax,
          discount,
          total,
          status: 'pending',
          createdAt: new Date(),
          trackingNumber: `TRK${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        };

        return order;
      },
    }),
    {
      name: 'checkout-storage',
    }
  )
);
