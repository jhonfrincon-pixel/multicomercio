import { create } from 'zustand';
import type { Product } from '@/types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'offer';
  image?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  isEnabled: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  enableNotifications: () => void;
  disableNotifications: () => void;
  getUnreadCount: () => number;
  // Automated notifications
  notifyPriceDrop: (product: Product, oldPrice: number) => void;
  notifyBackInStock: (product: Product) => void;
  notifyNewArrival: (product: Product) => void;
  notifyAbandonedCart: (items: { product: Product; quantity: number }[]) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isEnabled: false,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `NOT-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
    }));

    // Show browser notification if enabled
    if (get().isEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.image || '/favicon.ico',
      });
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  enableNotifications: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      set({ isEnabled: permission === 'granted' });
    }
  },

  disableNotifications: () => {
    set({ isEnabled: false });
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },

  notifyPriceDrop: (product, oldPrice) => {
    const discount = ((oldPrice - product.price) / oldPrice * 100).toFixed(0);
    get().addNotification({
      title: '¡Precio reducido! 🔥',
      message: `${product.name} ahora cuesta $${product.price.toFixed(2)} (-${discount}%)`,
      type: 'offer',
      image: product.images[0],
    });
  },

  notifyBackInStock: (product) => {
    get().addNotification({
      title: '¡De vuelta en stock! 📦',
      message: `${product.name} está disponible nuevamente`,
      type: 'success',
      image: product.images[0],
    });
  },

  notifyNewArrival: (product) => {
    get().addNotification({
      title: '¡Nuevo producto! ✨',
      message: `Descubre ${product.name} en nuestra colección`,
      type: 'info',
      image: product.images[0],
    });
  },

  notifyAbandonedCart: (items) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    get().addNotification({
      title: '¿Olvidaste algo? 🛒',
      message: `Tienes ${items.length} productos en tu carrito por $${total.toFixed(2)}`,
      type: 'warning',
    });
  },
}));
