import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from './checkoutStore';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByCustomer: (email: string) => Order[];
  getRecentOrders: (limit?: number) => Order[];
  getTotalRevenue: () => number;
  getOrdersByStatus: (status: Order['status']) => Order[];
  getMetrics: () => {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrdersByCustomer: (email) => {
        return get().orders.filter((o) => o.shippingInfo.email === email);
      },

      getRecentOrders: (limit = 10) => {
        return get().orders.slice(0, limit);
      },

      getTotalRevenue: () => {
        return get().orders.reduce((sum, o) => sum + o.total, 0);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
      },

      getMetrics: () => {
        const orders = get().orders;
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        return {
          totalOrders: orders.length,
          totalRevenue,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
        };
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);
