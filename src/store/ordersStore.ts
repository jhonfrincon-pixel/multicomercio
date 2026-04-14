import { create } from 'zustand';
import type { Order } from './checkoutStore';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
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

type OrderRow = {
  id: string;
  items: Order['items'];
  shipping_info: Order['shippingInfo'];
  payment_method: Order['paymentMethod'];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: Order['status'];
  created_at: string;
  tracking_number: string | null;
};

const rowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  items: row.items,
  shippingInfo: row.shipping_info,
  paymentMethod: row.payment_method,
  subtotal: Number(row.subtotal),
  shipping: Number(row.shipping),
  tax: Number(row.tax),
  discount: Number(row.discount),
  total: Number(row.total),
  status: row.status,
  createdAt: new Date(row.created_at),
  trackingNumber: row.tracking_number ?? undefined,
});

const orderToInsert = (order: Order) => ({
  id: order.id,
  items: order.items,
  customer_email: order.shippingInfo.email,
  shipping_info: order.shippingInfo,
  payment_method: order.paymentMethod,
  subtotal: order.subtotal,
  shipping: order.shipping,
  tax: order.tax,
  discount: order.discount,
  total: order.total,
  status: order.status,
  created_at: order.createdAt.toISOString(),
  tracking_number: order.trackingNumber ?? null,
});

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('crm_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    set({
      orders: (data as OrderRow[]).map(rowToOrder),
      isLoading: false,
      error: null,
    });
  },

  addOrder: async (order) => {
    set((state) => ({ orders: [order, ...state.orders] }));

    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ error: 'Debes iniciar sesión para guardar pedidos en CRM.' });
      return;
    }

    const { error } = await supabase.from('crm_orders').insert({
      ...orderToInsert(order),
      user_id: user.id,
    });
    if (error) {
      set({ error: error.message });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));

    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const { error } = await supabase
      .from('crm_orders')
      .update({ status })
      .eq('id', orderId);
    if (error) {
      set({ error: error.message });
    }
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
}));
